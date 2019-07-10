const ServiceRegistry = artifacts.require("./ServiceRegistry.sol")
module.exports = function(deployer) {
  deployer.deploy(ServiceRegistry);
};
