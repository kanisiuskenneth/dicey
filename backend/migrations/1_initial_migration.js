const Migrations = artifacts.require("Migrations");
module.exports = function(deployer) {
  process.env.ETH_NETWORK = deployer.network; // Network Id, for instance "ganache"
  deployer.deploy(Migrations);
};
