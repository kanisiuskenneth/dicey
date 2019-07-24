const ServiceRegistry = artifacts.require("ServiceRegistry");
// const truffleAssert = require('truffle-assertions');
var fs = require('fs');

var wsdl = fs.readFileSync('sample.wsdl', 'utf8');

const service  = [
    "Sample Service",
    "Sample",
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam iaculis consequat semper. Proin dignissim eu libero id porta. Nulla scelerisque, erat ac sodales cursus, risus dolor facilisis enim, quis porttitor ante nisi ut odio. Pellentesque vitae tristique enim. Quisque finibus odio nec mollis finibus. Donec ac augue ac nunc aliquet pellentesque. Curabitur blandit mauris et tempus malesuada. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Maecenas efficitur faucibus velit ut consectetur. Mauris nec lacus sapien. Morbi sollicitudin, arcu vitae dapibus viverra, felis nunc volutpat turpis, non varius massa nulla ac justo. Aenean quis velit volutpat, laoreet nisl et, eleifend enim. Aliquam sagittis consequat magna, at vehicula dui aliquam euismod. Nunc a venenatis eros, ac consequat mi.",
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

    it('1 entry', async() => {
        sr.addService(...service);
    })
    it('10 entry', async() => {
        for(let i=0;i<10;i++) {
           await sr.addService(...service)
        }
    })
    it('100 entry', async() => {
        for(let i=0;i<100;i++) {
           await sr.addService(...service)
        }
    })
    it('1000 entry', async() => {
        for(let i=0;i<1000;i++) {
            await sr.addService(...service)
        }
    })
    // it('10000 entry', async() => {
    //     for(let i=0;i<10000;i++) {
    //         await sr.addService(...service)
    //     }
    // })
})

