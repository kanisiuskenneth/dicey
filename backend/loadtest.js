const prompts = require('prompts');
const _cliProgress = require('cli-progress');

// const truffleAssert = require('truffle-assertions');
var fs = require('fs');
var wsdl = fs.readFileSync('sample.wsdl', 'utf8');

const Contract = require('./build/contracts/ServiceRegistry.json');
const service  = [
    "Sample Service",
    "Sample",
    "This is a sample service description",
    100000000000000,
    "",
    "sample.wsdl",
    wsdl
]

const Web3js = require('web3');
const PrivateKeyProvider = require('truffle-privatekey-provider');
const SR = require('./build/contracts/ServiceRegistry.json')
const provider = new PrivateKeyProvider(process.env.ETH_PRIVATE_KEY, "http://167.205.34.77:8545");
const web3 = new Web3js(provider);
const bar = new _cliProgress.Bar({}, _cliProgress.Presets.shades_classic);

var util  = require('util')
let spawn = require('child_process').spawn


const run = async () => {
    console.log("[Preparing]")
    console.log(web3.version);
    const networkId = await web3.eth.net.getId()
    console.log("Network Id: "+ networkId)
    const acc= (await web3.eth.getAccounts())[0];
    web3.eth.defaultAccount = acc;
    let contract = new web3.eth.Contract(SR.abi,
        SR.networks[networkId].address);
    console.log("Account: ", web3.eth.defaultAccount)
    console.log("Balance: ", web3.utils.fromWei(await web3.eth.getBalance(acc), 'ether') + "ETH")
    // console.log(await contract.methods.getAllServices().call())
    var start = new Date().getTime();
    let n = 1;
    await prompts({type: "text", message: "1 entry, Continue?"})
    bar.start(n, 0);
    for(let i = 0; i < n; i++) {
        await contract.methods.addService(...service).send({from: acc});
        bar.update(i+1);
    }
    bar.stop();

    n = 9
    await prompts({type: "text", message: "10 entry, Continue?"})
    bar.start(n, 0);
    for(let i = 0; i < n; i++) {
        await contract.methods.addService(...service).send({from: acc});
        bar.update(i+1);
    }
    bar.stop()

    n = 90
    await prompts({type: "text", message: "100 entry, Continue?"})
    bar.start(n, 0);
    for(let i = 0; i < n; i++) {
        await contract.methods.addService(...service).send({from: acc});
        bar.update(i+1);
    }
    bar.stop()

    n = 900
    await prompts({type: "text", message: "1000 entry, Continue?"})
    bar.start(n, 0);
    for(let i = 0; i < n; i++) {
        await contract.methods.addService(...service).send({from: acc});
        bar.update(i+1);
    }
    bar.stop()
    var end = new Date().getTime();
    var time = end - start;
    console.log("time taken: ", end-start + " ms")
    // console.log(await contract.methods.getAllServices().call())
}

run().then((err) => {
    console.log("[Finish]");
    process.exit(1);
}).catch((err) => {
    console.log(err)
    console.log("[Error Finishing]")
    process.exit(2);
})
