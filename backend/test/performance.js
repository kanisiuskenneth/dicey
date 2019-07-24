const ServiceRegistry = artifacts.require("ServiceRegistry");
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


contract("Service Registry Load Test", () => {
    let sr;

    before(async () => {
        sr = await ServiceRegistry.deployed()
    });

    describe("1 entry", () => {
        it('add', async() => {
            for(let i = 0; i < 100;i++) {
                service[0] = "Sample Service " + (i + 1);
                await sr.addService(...service);
            }
        })
        it('search 1', async() => {
            await sr.findServices("Sample")
        })
        it('search 2', async() => {
            await sr.findServices("Sample Service")
        })
        it('search 3', async() => {
            await sr.findServices("sample service 1")
        })
        it('search 4', async() => {
            await sr.findServices("Sample Servicx")
        })
    })

})

