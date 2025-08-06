// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract RealEstateChain {
    struct Property {
        address owner;
        string location;
        uint256 price; // Price in Wei
        bool isForSale;
        bool aiApproved;
        bool buyerApproved;
        bool sellerApproved;
        string metadataURI;
    }

    uint256 public propertyCount;
    mapping(uint256 => Property) public properties;
    
    address public immutable aiValidator;
    
    event PropertyRegistered(uint256 id, address owner, string location, string metadataURI, uint256 price);
    event PropertyListed(uint256 id, uint256 newPrice);
    event ApprovalGiven(uint256 id, address by, bool isAI);
    event PropertyTransferred(uint256 id, address from, address to, uint256 price);

    modifier onlyOwner(uint256 _propertyId) {
        require(properties[_propertyId].owner == msg.sender, "Not the owner");
        _;
    }

    modifier onlyAI() {
        require(msg.sender == aiValidator, "Only AI validator can call this");
        _;
    }

    constructor(address _aiValidator) {
        aiValidator = _aiValidator;
    }

    function registerProperty(
        string memory _location,
        string memory _metadataURI,
        uint256 _priceInWei // Now expects price in Wei directly
    ) external {
        require(_priceInWei >= 0.5 ether, "Minimum price is 0.5 ETH");
        
        propertyCount++;
        properties[propertyCount] = Property({
            owner: msg.sender,
            location: _location,
            price: _priceInWei,
            isForSale: false,
            aiApproved: false,
            buyerApproved: false,
            sellerApproved: false,
            metadataURI: _metadataURI
        });
        emit PropertyRegistered(propertyCount, msg.sender, _location, _metadataURI, _priceInWei);
    }

    function updateListing(uint256 _propertyId, uint256 _newPriceInWei, bool _listForSale) external onlyOwner(_propertyId) {
        require(_newPriceInWei >= 0.5 ether, "Minimum price is 0.5 ETH");
        
        properties[_propertyId].price = _newPriceInWei;
        properties[_propertyId].isForSale = _listForSale;
        if (_listForSale) {
            properties[_propertyId].aiApproved = false;
            properties[_propertyId].buyerApproved = false;
            properties[_propertyId].sellerApproved = false;
        }
        emit PropertyListed(_propertyId, _newPriceInWei);
    }

    function approvePurchase(uint256 _propertyId, bool _approval) external {
        require(properties[_propertyId].isForSale, "Property not for sale");
        
        if (msg.sender == properties[_propertyId].owner) {
            properties[_propertyId].sellerApproved = _approval;
        } else {
            properties[_propertyId].buyerApproved = _approval;
        }
        
        emit ApprovalGiven(_propertyId, msg.sender, false);
    }

    function aiApprove(uint256 _propertyId, bool _approval) external onlyAI {
        require(properties[_propertyId].isForSale, "Property not for sale");
        properties[_propertyId].aiApproved = _approval;
        emit ApprovalGiven(_propertyId, msg.sender, true);
    }

    function completePurchase(uint256 _propertyId) external payable {
        Property storage property = properties[_propertyId];
        
        require(property.isForSale, "Property not for sale");
        require(msg.value == property.price, "Incorrect payment amount");
        require(property.aiApproved, "AI validation pending");
        require(property.buyerApproved, "Buyer approval pending");
        require(property.sellerApproved, "Seller approval pending");
        
        address previousOwner = property.owner;
        
        // Transfer ownership
        property.owner = msg.sender;
        property.isForSale = false;
        property.aiApproved = false;
        property.buyerApproved = false;
        property.sellerApproved = false;
        
        // Transfer funds
        payable(previousOwner).transfer(msg.value);
        
        emit PropertyTransferred(_propertyId, previousOwner, msg.sender, property.price);
    }

    function getPropertyDetails(uint256 _propertyId) external view returns (
    address owner,
    string memory location,
    uint256 price,
    bool isForSale,
    bool aiApproved,
    bool buyerApproved,
    bool sellerApproved
) {
    Property memory property = properties[_propertyId];
    return (
        property.owner,
        property.location,
        property.price,
        property.isForSale,
        property.aiApproved,
        property.buyerApproved,
        property.sellerApproved
    );
  }
}