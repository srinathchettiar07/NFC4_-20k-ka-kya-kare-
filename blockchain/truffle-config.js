module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",  // Ganache default
      port: 7545,          // Ganache UI port
      network_id: "*"      // Match any network
    }
  },
  compilers: {
    solc: {
      version: "0.8.20",   // Matches your OpenZeppelin
      settings: {
        optimizer: {
          enabled: true,   // Reduces gas costs
          runs: 200        // Optimize for 200 runs
        },
        evmVersion: "istanbul"
      }
    }
  }
};