const prompts = require('prompts');
const _cliProgress = require('cli-progress');

// const truffleAssert = require('truffle-assertions');
var fs = require('fs');
var wsdl = fs.readFileSync('./performance_test/sample.wsdl', 'utf8');

const Contract = require('./build/contracts/ServiceRegistry.json');
const service  = [
    "Sample Service",
    "Sample",
	//"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas nisi erat, fringilla at orci vitae, sagittis mollis augue. Nullam interdum molestie metus et maximus. Mauris nunc enim, venenatis vel tortor eu, venenatis ullamcorper leo. Nam ac lacinia augue. Praesent pulvinar nulla ac lacus auctor, sit amet suscipit orci condimentum. Nunc ipsum libero, semper ac dolor et, convallis facilisis est. Suspendisse commodo urna ac tristique blandit. Curabitur vehicula justo non congue pharetra. Cras vitae nisl mollis, interdum libero non, iaculis ipsum. Nunc viverra vestibulum nunc, et molestie elit aliquet sit amet.",
	"This is a sample service description",
    100000000000000,
    "",
    "sample.wsdl",
    wsdl
]
const OPTIONS = {
    defaultBlock: "latest",
    transactionConfirmationBlocks: 1,
    transactionBlockTimeout: 100,
};

const Web3js = require('web3');
const PrivateKeyProvider = require('truffle-privatekey-provider');
const SR = require('./build/contracts/ServiceRegistry.json')
const provider = new PrivateKeyProvider(process.env.ETH_PRIVATE_KEY, "http://167.205.34.77:8545");
const web3 = new Web3js(provider, null, OPTIONS);
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
    console.log("[Starting]")
	let n = process.argv[2];
	bar.start(n);
	console.log("Adding Data");
    let start = new Date().getTime();
	let promises = []
	let c = 0;
	for (let i =1;i <= n; i++ ) {
		service[0] = "Sample Service " + i;
		promises.push(contract.methods.addService(...service).send({from: acc}));
		bar.update(i);
		c++
		if(c == 100) {
			await Promise.all(promises);
			c = 0;
		}	
	}
	await Promise.all(promises);
	bar.stop();
	let end = new Date().getTime();
    let time = end - start;
	console.log("Adding :" + time + "ms");
	
	start = new Date().getTime();
	let res = await contract.methods.findServices("Sample").call()
	end = new Date().getTime();
	time = end - start;
	console.log("Search 1 :" + time + "ms" + ", founded: " + res[0]);
	
	start = new Date().getTime();
    res = await contract.methods.findServices("Sample Service 1").call()
    end = new Date().getTime();
    time = end - start;
	console.log("Search 2 :" + time + "ms" + ", founded: " + res[0]);

	start = new Date().getTime();
    res = await contract.methods.findServices("Sample Service a").call()
    end = new Date().getTime();
    time = end - start;
	console.log("Search 3 :" + time + "ms"+ ", founded: " + res[0]);

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
