const ServiceRegistry = artifacts.require("ServiceRegistry");
const prompts = require('prompts');

// const truffleAssert = require('truffle-assertions');
var fs = require('fs');
var wsdl = fs.readFileSync('sample.wsdl', 'utf8');

const service  = [
    "Sample Service",
    "Sample",
    "This is a sample service description",
    100000000000000,
    "",
    "sample.wsdl",
    wsdl
]

contract('Service Registry Load', () => {
    let sr;

    before(async () => {
        sr = await ServiceRegistry.deployed()
    });
    it(' 1 entry', async() => {
        await sr.addService(...service);
    })
    it('10 entry', async() => {
        await prompts({type: "text", message: "10 Entry.. Continue?"});
        for(let i=0;i<9;i++) {
            await sr.addService(...service);
        }
    })
    it('100 entry', async() => {
        await prompts({type: "text", message: "100 Entry.. Continue?"});
        for(let i=0;i<90;i++) {
            await sr.addService(...service);
        }
    })
    it('1000 entry', async() => {

    })

})
