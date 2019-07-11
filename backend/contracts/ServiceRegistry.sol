pragma solidity ^0.5;
pragma experimental ABIEncoderV2;

contract ServiceRegistry {
  struct Service {
    uint64 id;
    address payable owner;
    string name;
    string category;
    string description;
    uint price;
    uint ratingTotal;
    uint ratingCount;
    uint timestamp;
  }
  Service[] services;

  struct ServiceDescription {
    uint version;
    string fileName;
    string fileContent;
    uint timestamp;
  }


  uint64 serviceCount;
  uint64 i;

  mapping(uint64 => uint64) indexes;
  mapping(uint64 => string) additionalInfos;
  mapping(uint64 => ServiceDescription[]) private descriptions;
  mapping(uint64 => mapping(address => uint64)) userRate;
  mapping(address => mapping(uint64 => bool)) acl;
  mapping(address => uint[]) public myservices;

  address owner = msg.sender;

  constructor() public {
    serviceCount = 0;
    i = 0;
  }


  function addService(string memory _name, string memory _category, string memory _description, uint _price, string memory additionalInfo, string memory fileName, string memory fileContent)  public returns (Service memory){
    Service memory created = Service(i, msg.sender, _name, _category, _description, _price, 0,0,now);
    services.push(created);
    indexes[i] = serviceCount;
    myservices[msg.sender].push(i);
    serviceCount++;
    if(bytes(additionalInfo).length != 0x0) {
      additionalInfos[i] = additionalInfo;
    }
    descriptions[i].push(ServiceDescription(1, fileName, fileContent, now));
    i++;
    return (created);
  }
  function getMyLatestServiceId() public returns (uint) {
    return myservices[msg.sender][myservices[msg.sender].length-1];
  }
  function getAllServices() public view returns(uint64, Service[] memory) {
    return (serviceCount, services);
  }
  function getServiceDetail(uint64 id) public view returns(Service memory generalInfo, string memory additionalInfo, bool allowed) {
    uint64 index = indexes[id];
    bool allow = acl[msg.sender][id] || services[index].owner == msg.sender || services[index].price == 0;
    return (services[index], additionalInfos[index], allow);
  }
  function getServiceDescription(uint64 id) public view returns(ServiceDescription memory serviceDescription) {
    uint64 index = indexes[id];
    bool allowed = acl[msg.sender][id] || services[index].owner == msg.sender || services[index].price == 0;
    require(allowed, "Access not allowed");
    return (descriptions[id][descriptions[id].length-1]);
  }
  function getServiceDescription(uint64 id, uint version) public view returns(ServiceDescription memory serviceDesciption) {
    uint64 index = indexes[id];
    bool allowed = acl[msg.sender][id] || services[index].owner == msg.sender || services[index].price == 0;
    require(allowed, "Access not allowed");
    require(version <= descriptions[id].length);
    return (descriptions[id][version-1]);

  }

  function deleteService(uint64 id) public {
    uint64 index = indexes[id];
    Service memory deleted = services[index];
    require(msg.sender == deleted.owner);
    Service memory latest = services[serviceCount-1];
    services[index] = latest;
    services.pop();
    indexes[latest.id] = index;
    serviceCount--;
  }

  function payForService(uint64 id) payable public {
    uint64 index = indexes[id];
    Service memory service = services[index];
    require(msg.value >= service.price, "Value not right!");
    service.owner.transfer(service.price);
    acl[msg.sender][id] = true;
  }

  function updateDescription(uint64 id, string memory fileName, string memory fileDescription) public {
    uint64 index = indexes[id];
    require (msg.sender == services[index].owner, "Not Authorized");
    uint version = descriptions[id].length+1;
    descriptions[id].push(ServiceDescription(version, fileName, fileDescription, now));
  }

  function rateService(uint64 id, uint64 rate) public {
    uint64 index = indexes[id];
    bool allowed = (acl[msg.sender][id] || services[index].price == 0) && services[index].owner != msg.sender;
    require(allowed, "Access not allowed");
    uint64 val = rate*100;
    if(userRate[id][msg.sender] == 0) {
      services[index].ratingTotal += val;
      services[index].ratingCount++;
      userRate[id][msg.sender] = val;
    } else {
      services[index].ratingTotal -= userRate[id][msg.sender];
      services[index].ratingTotal += val;
      userRate[id][msg.sender] = val;
    }
  }
  function getUserRate(uint64 id) public returns (uint64) {
    return userRate[id][msg.sender];
  }
}
