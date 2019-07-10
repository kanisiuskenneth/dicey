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
  mapping(uint64 => ServiceDescription) private descriptions;
  mapping(address => mapping(uint64 => bool)) acl;
  address owner = msg.sender;

  constructor() public {
    serviceCount = 0;
    i = 0;
  }

  function addService(string memory _name, string memory _category, string memory _description, uint _price, string memory additionalInfo, string memory fileName, string memory fileContent)  public returns (uint64){
    services.push(Service(i, msg.sender, _name, _category, _description, _price, now));
    indexes[i] = serviceCount;
    serviceCount++;
    if(bytes(additionalInfo).length != 0x0) {
      additionalInfos[i] = additionalInfo;
    }
    descriptions[i] = ServiceDescription(1, fileName, fileContent, now);
    i++;
    return (i-1);
  }

  function getAllServices() public view returns(uint64, Service[] memory) {
    return (serviceCount, services);
  }
  function getServiceDetail(uint64 id) public view returns(Service memory generalInfo, string memory additionalInfo, bool allowed) {
    uint64 index = indexes[id];
    bool allow = acl[msg.sender][id] || services[id].owner == msg.sender || services[id].price == 0;
    return (services[index], additionalInfos[index], allow);
  }
  function getServiceDescription(uint64 id) public view returns(ServiceDescription memory serviceDescription) {
    bool allowed = acl[msg.sender][id] || services[id].owner == msg.sender || services[id].price == 0;
    require(allowed, "Access not allowed");
    return (descriptions[id]);
  }
  function deleteService(uint64 id) public {
    uint64 index = indexes[id];
    Service memory deleted = services[index];
    require(msg.sender == deleted.owner);
    services[index] = services[serviceCount-1];
    services.pop();
    indexes[id] = index;
    serviceCount--;
  }
  function payForService(uint64 id) payable public {
    uint64 index = indexes[id];
    Service memory service = services[index];
    require(msg.value >= service.price, "Value not right!");
    service.owner.transfer(service.price);
    acl[msg.sender][id] = true;
  }
}
