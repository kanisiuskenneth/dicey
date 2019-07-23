const SR = artifacts.require("ServiceRegistry");
const truffleAssert = require('truffle-assertions');

const services = {};
services[0] = ["Free Service", "Calculator", "This is a sample free service", "0", "", "", ""];
services[1] = ["Sample Service", "Map", "Sample service 2", "50000000000000000", "", "", ""];
services[2] = ["Service with additional info", "Sample", "this is a service with additional info", "10000000000000000",
                 "[{'title':'web','value': 'https://example.org'}]", "sample.xml", "<samplewsdl></samplewsdl>"];

contract('ServiceRegistry', (accounts) => {
    describe('Supplemental', async() => {
        describe('toLower', () => {
            it('should return empty string when source is empty', async () => {
                const contract = await SR.deployed();
                const result = await contract.toLower("");
                assert.equal(result, "", "it doesn't return empty string")
            });
            it('should return the same string when input in lower case', async () => {
                const contract = await SR.deployed();
                const src = "this is a test string";
                const result = await contract.toLower(src);
                assert.equal(result, src);
            });
            it('should return lowercased string when input arbitrary string', async () => {
                const contract = await SR.deployed();
                const src = "This is a Test String";
                const result = await contract.toLower(src);
                assert.equal(result, "this is a test string");
            });
        });
        describe('contains', () => {
            it('should return true when pattern is empty text', async () => {
                const contract = await SR.deployed();
                const text = "Hello World!";
                const pattern = "";
                const res = await contract.contains(pattern, text);
                assert.ok(res);
            })
            it('should return false when pattern not exist in text', async () => {
                const contract = await SR.deployed();
                const text = "Hello World!";
                const pattern = "asdf";
                const res = await contract.contains(pattern, text);
                assert.equal(res, false);
            })
            it('should return true when pattern exist in text', async () => {
                const contract = await SR.deployed();
                const text = "Hello World!";
                let pattern = "Hell";
                assert.equal(await contract.contains(pattern, text), true);
                pattern2 = "World!"
                assert.equal(await contract.contains(pattern2, text), true)
            })
            it('should return true when pattern is equal text', async () => {
                const contract = await SR.deployed();
                const text = "Hello World!";
                assert.equal(await contract.contains(text, text), true);
            })
            it('should return false when pattern is longer than text', async () => {
                const contract = await SR.deployed();
                const text = "Hello World!";
                const pattern = "Hello World!!"
                assert.equal(await contract.contains(pattern, text), false);
            })
        })
    })
    describe('Core Function', () => {
        describe('addService', () => {
            it('should add new service', async () => {
                const contract = await SR.deployed();
                assert(await contract.addService(...services[0]));
                assert.equal(await contract.getMyLatestServiceId(),0);
                assert(await contract.addService(...services[1]));
                assert.equal(await contract.getMyLatestServiceId(), 1);
                assert(await contract.addService(...services[2]));
                assert.equal(await contract.getMyLatestServiceId(), 2);
                let res = await contract.getAllServices();
                assert.equal(res[0], 3);
            })
        })
        describe('getAllServices', () => {
            it('should return zero when no service stored in system', async () => {
                const contract = await SR.new();
                let res = await contract.getAllServices();
                assert.equal(res[0], 0);
                res = await contract.getAllServicesPaged(20, 0);
                assert.equal(res[0], 0)
            })
            it('should return all service when user when size and page not defined', async () => {
                const contract = await SR.deployed();
                for(let i = 0; i < 10; i++) {
                    await contract.addService(...services[i%3]);
                }
                let res = await contract.getAllServices();
                assert.equal(res[0], 13);
            })
            it('should return only specific amount of services when size and page defined', async () => {
                const contract = await SR.deployed();
                let res = await contract.getAllServicesPaged(10, 0);
                assert.equal(res[0], 10);
                res = await contract.getAllServicesPaged(10, 1);
                assert.equal(res[0], 3);
            })
        })
        describe('findServices', () => {
            it('should return return all services when query empty', async () => {
                const contract = await SR.deployed() ;
                let res = await contract.findServices("");
                assert.equal(res[0], 13);
            })
            it('should return zero when no service satisfy the query', async () => {
                const contract = await SR.deployed();
                let res = await contract.findServices("asdf");
                assert.equal(res[0], 0);
                res = await contract.findServices("Fresh");
                assert.equal(res[0], 0);
                res = await contract.findServices("this is a long query that no service able to satisfy the query");
                assert.equal(res[0], 0);
            })
            it('should return any service that satisfy the query regardless the letter case', async () => {
                const contract = await SR.deployed();
                const service = ["To be found Service", "Find me", "This is a service that is going to be found", "1" ,"", "", ""];
                await contract.addService(...service);
                let res = await contract.findServices("To be");
                assert.equal(res[0], 1);
                assert.equal(res[1][0].name, 'To be found Service')
                res = await contract.findServices("find me");
                assert.equal(res[0], 1);
                assert.equal(res[1][0].name, 'To be found Service')
                res = await contract.findServices("going to be found");
                assert.equal(res[0], 1);
                assert.equal(res[1][0].name, 'To be found Service')
            })
        })
        describe('deleteService', () => {
            it('should delete the service when caller is owner', async () => {
                const contract = await SR.deployed();
                await contract.addService("To be deleted", "", "", "0", "", "", "");
                let id = await contract.getMyLatestServiceId();
                await contract.addService("Sentinel", "Sentinel", "Sentinel Service", "0","","","");
                let id2 = await contract.getMyLatestServiceId();
                let res = await contract.findServices("to be deleted");
                assert.equal(res[0], 1);
                assert.equal(res[1][0].name, "To be deleted");
                res = await contract.getServiceDetail(id);
                assert.equal(res.generalInfo.name, "To be deleted");
                await contract.deleteService(id);
                res = await contract.findServices("to be deleted");
                assert.equal(res[0], 0);
                res = await contract.getServiceDetail(id2);
                assert.equal(res.generalInfo.name, "Sentinel")
            })
            it('should not delete the service when caller is not the owner', async () => {
                const contract = await SR.deployed();
                await contract.addService("To be deleted", "", "", "0", "", "", "");
                let id = await contract.getMyLatestServiceId();
                await truffleAssert.reverts(contract.deleteService(id, {from: accounts[1]}))
            })
        })
        describe('payForService', () => {
            it('should not allow payment when payer is the owner', async () => {
                const contract = await SR.deployed();
                let id = 1;
                await truffleAssert.reverts(contract.payForService(id, {value: 50000000000000000}))
            })
            it('should not allow payment when value is not enough', async () => {
                const contract = await SR.deployed();
                let id = 1;
                await truffleAssert.reverts(contract.payForService(id, {value: 10000000000000000}))
            })
            it('should not allow payment when service price is zero', async () => {
                const contract = await SR.deployed();
                let id = 0;
                await truffleAssert.reverts(contract.payForService(id, {value: 10000000000000000}))
            })
            it('should allow payment when value is right', async () => {
                const contract = await SR.deployed();
                let id = 1;
                await truffleAssert.passes(contract.payForService(id, {value: 50000000000000000, from: accounts[1]}))
            })
            it('should not allow payment when the payer already paid', async () => {
                const contract = await SR.deployed();
                let id = 1;
                await truffleAssert.reverts(contract.payForService(id, {value: 50000000000000000, from: accounts[1]}))
            })
        })
        describe('getServiceDetail', () => {
            it('should return detailed service information', async () => {
                const contract = await SR.deployed();
                let res = await contract.getServiceDetail(0);
                assert.equal(res.generalInfo.name, services[0][0]);
                assert.equal(res.additionalInfo, services[0][4]);
                res =  await contract.getServiceDetail(2);
                assert.equal(res.generalInfo.name, services[2][0]);
                assert.equal(res.additionalInfo, services[2][4]);
            })
            it('should return allowed true when caller is the owner', async () => {
                const contract = await SR.deployed() ;
                let res = await contract.getServiceDetail(1);
                assert.equal(res.allowed, true);
            })
            it('should return allowed true when the service is free', async () => {
                const contract = await SR.deployed();
                let res = await contract.getServiceDetail(0, {from: accounts[2]});
                assert.equal(res.allowed, true);
            })
            it('should return allowed true when the caller already paid the service', async () => {
                const contract = await SR.deployed();
                let res = await contract.getServiceDetail(1, {from: accounts[1]});
                assert.equal(res.allowed, true);
            })
            it('should return allowed false when the caller have no access to the service', async () => {
                const contract = await SR.deployed();
                let res = await contract.getServiceDetail(1, {from: accounts[2]});
                assert.equal(res.allowed, false);
            })
        })
        describe('updateDescription', () => {
            it('should not allow update when the caller not the owner', async () => {
                const contract = await SR.deployed();
                await truffleAssert.reverts(contract.updateDescription(2, "sample2.xml", "<sample2wsdl></sample2wsdl>", {from: accounts[1]}));
            })
            it('should allow update when the caller is the owner', async () => {
                const contract = await SR.deployed();
                await truffleAssert.passes(contract.updateDescription(2, "sample2.xml", "<sample2wsdl></sample2wsdl>"));
            })
        })
        describe('getServiceDescription', () => {
            it('should revert when the caller have no access', async () => {
                const contract = await SR.deployed();
                await truffleAssert.reverts(contract.getServiceDescription(1, {from: accounts[3]}))
            })
            it('should return service description when caller is the owner', async () => {
                const contract = await SR.deployed();
                await truffleAssert.passes(contract.getServiceDescription(1))
            })
            it('should return service description when caller have paid for the access', async () => {
                const contract = await SR.deployed();
                await truffleAssert.passes(contract.getServiceDescription(1, {from: accounts[1]}))
            })
            it('should return service description when the service is free', async () => {
                const contract = await SR.deployed();
                await truffleAssert.passes(contract.getServiceDescription(0, {from: accounts[3]}))
            })
            it('should retrieve the last version when no version defined', async () => {
                const contract = await SR.deployed();
                let res = await contract.getServiceDescription(2);
                assert.equal(res[0], 2);
            })
            it('should retrieve specific version of the service description when defined', async () => {
                const contract = await SR.deployed();
                let res = await contract.getServiceDescriptionSpec(2,1);
                assert.equal(res[0], 1);
            })
            it('should revert when defined version higher than latest version', async () => {
                const contract = await SR.deployed();
                await truffleAssert.reverts(contract.getServiceDescriptionSpec(2,4));

            })
            it('should revert when defined version is lesser than 1', async () => {
                const contract = await SR.deployed();
                await truffleAssert.reverts(contract.getServiceDescriptionSpec(2,0));
            })
        })
        describe('rateService', () => {
            it('should not allow when rater is the owner', async () => {
                const contract = await SR.deployed();
                await truffleAssert.reverts(contract.rateService(0, 10));
            })
            it('should not allow when rater do not have the access to the service', async () => {
                const contract = await SR.deployed();
                await truffleAssert.reverts(contract.rateService(1, 10, {from: accounts[2]}))
            })

            it('should allow anyone to rate when service is free', async () => {
                const contract = await SR.deployed();
                await truffleAssert.passes(contract.rateService(0,10, {from: accounts[2]}))
            })
            it('should not allow when rater give rate that outside the bound', async () => {
                const contract = await SR.deployed();
                await truffleAssert.reverts(contract.rateService(0,11, {from: accounts[3]}))
                await truffleAssert.reverts(contract.rateService(0,0, {from: accounts[2]}))
            })
            it('should allow when rater have access to the service', async () => {
                const contract = await SR.deployed();
                await truffleAssert.passes(contract.rateService(1,10, {from: accounts[1]}))
            })
            it('should update the rate if the rater already rate the service before', async () => {
                const contract = await SR.deployed();
                let detail = await contract.getServiceDetail(1);
                assert.equal(detail.generalInfo.ratingCount, 1);
                assert.equal(detail.generalInfo.ratingTotal, 10);
                await truffleAssert.passes(contract.rateService(1, 5, {from: accounts[1]}));
                detail = await contract.getServiceDetail(1);
                assert.equal(detail.generalInfo.ratingCount, 1);
                assert.equal(detail.generalInfo.ratingTotal, 5);
            })
        })
        describe('getUserRate', () => {
            it('should return 0 when user never rate the service', async() => {
                const contract  = await SR.deployed();
                let rate = await contract.getUserRate(0, {from: accounts[5]});
                assert.equal(rate, 0)
            })
            it('should return user rate when user already rate the service', async () => {
                const contract = await SR.deployed();
                let rate = await contract.getUserRate(1, {from: accounts[1]});
                assert.equal(rate, 5);
            })
        })

    })
})
