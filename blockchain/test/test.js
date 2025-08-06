const RealEstateChain = artifacts.require("RealEstateChain");

contract("RealEstateChain", (accounts) => {
  let realEstate;
  const [owner, aiValidator, buyer, seller] = accounts;
  const propertyLocation = "Downtown Toronto";
  const metadataURI = "ipfs://QmXyZ123abc/property1.json";
  
  // Test prices in ETH
  const testPrices = {
    basic: 0.75,
    premium: 1.25,
    minimum: 0.5
  };

  before(async () => {
    realEstate = await RealEstateChain.new(aiValidator);
  });

  it("should register property with 0.75 ETH price", async () => {
    await realEstate.registerProperty(
      propertyLocation,
      metadataURI,
      web3.utils.toWei(testPrices.basic.toString(), 'ether'),
      { from: seller }
    );
    
    const property = await realEstate.properties(1);
    assert.equal(
      web3.utils.fromWei(property.price, 'ether'),
      testPrices.basic.toString()
    );
  });

  it("should update price to 1.25 ETH", async () => {
    await realEstate.updateListing(
      1,
      web3.utils.toWei(testPrices.premium.toString(), 'ether'),
      true,
      { from: seller }
    );
    
    const property = await realEstate.properties(1);
    assert.equal(
      web3.utils.fromWei(property.price, 'ether'),
      testPrices.premium.toString()
    );
  });

  it("should enforce minimum 0.5 ETH price", async () => {
    try {
      await realEstate.registerProperty(
        "Invalid Property",
        "ipfs://invalid",
        web3.utils.toWei("0.4", 'ether'), // Below minimum
        { from: seller }
      );
      assert.fail("Should have rejected price below 0.5 ETH");
    } catch (error) {
      assert.include(error.message, "Minimum price is 0.5 ETH");
    }
  });

  it("should complete purchase at 1.25 ETH", async () => {
    // Approvals
    await realEstate.approvePurchase(1, true, { from: buyer });
    await realEstate.approvePurchase(1, true, { from: seller });
    await realEstate.aiApprove(1, true, { from: aiValidator });
    
    // Purchase
    const tx = await realEstate.completePurchase(1, { 
      from: buyer, 
      value: web3.utils.toWei(testPrices.premium.toString(), 'ether')
    });
    
    // Verify event emitted correct price
    const event = tx.logs.find(log => log.event === "PropertyTransferred");
    assert.equal(
      web3.utils.fromWei(event.args.price, 'ether'),
      testPrices.premium.toString()
    );
  });
});