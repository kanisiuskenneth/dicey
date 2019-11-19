# DICEY: A *D*ecentralized Serv*ice* Registr*y*

## Core Subsystem (`backend/`)
Core subsystem contain the application logic of the system, it's a standalone program that can be executed in Ethereum platform.

### Development Tools
- [Solidity v0.5.0](https://solidity.readthedocs.io/en/v0.5.0/)
- [Truffle v5.0.12](https://www.trufflesuite.com/docs/truffle/overview)
- [Ganache v1.2.2](https://www.trufflesuite.com/docs/ganache/overview)
- [Geth v1.8.27](https://geth.ethereum.org/)

### How to compile
On the `backend/` folder run:

```truffle compile```

### How to test
#### Functional Testing
On the `backend/` folder run:
```truffle test```
#### Performance Testing
1. Prepare Development platform with Geth, (tutorial)[https://medium.com/coinmonks/how-to-create-your-own-private-ethereum-blockchain-137ab15989c6]
2. Add running geth address by typing `export ADV_HOST="https://<IP_ADDRESS>:<PORT>/"` on your terminal
3. Add your existing Ethereum account on running geth with private key, command: `export ETH_PRIVATE_KEY="<private_key>"`
4. Edit the runner script in `backend/performance_test/runner.sh` to fit your requirement
5. Run the test script by running `./performnce_test/runner.sh` from `backend/` folder

### How to deploy
- On local ganache:
```truffle migrate --reset --compile-all```
- On geth:
```truffle migrate --network advanced --reset --compile-all```

## Web Subsystem (`web/`)
Web subsystem is the default interface to access the Core, built the web after the Core subsystem running.

### Development Tools
- [Node.js v10.10.0 or newer](https://nodejs.org/en/)
- [Yarn v1.9.4 or newer](https://yarnpkg.com/en/)
- [Metamask v6.7.1](https://metamask.io/)

Contained in the pacakge.json:
- [Vue v2.6.10](https://vuejs.org/)
- [Vuex v3.1.1](https://vuex.vuejs.org)
- [Vuetify v1.5.16](https://vuetifyjs.com/en)
- [Web3 v1.0.0](https://web3js.readthedocs.io/en/v1.2.1/)

### Install dependencies
```yarn```

### How to start development server
```yarn start```

### How to build for production
```yarn build```

After the build finished, you can run the web on any static web server.
