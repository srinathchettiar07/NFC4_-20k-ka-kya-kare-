const RealEstateChain = artifacts.require("RealEstateChain");

module.exports = async function (deployer, network, accounts) {
  // Use accounts[2] as the default AI validator (Ganache GUI's third account)
  const aiValidator = accounts[2]; 
  
  // Deploy the contract with the AI validator address
  await deployer.deploy(RealEstateChain, aiValidator);

  // Optional: Log the deployed address and validator
  const instance = await RealEstateChain.deployed();
  console.log("Contract deployed to:", instance.address);
  console.log("AI Validator set to:", aiValidator);
};