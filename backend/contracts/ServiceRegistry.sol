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
  uint64 idx;

  mapping(uint64 => uint64) indexes;
  mapping(uint64 => string) additionalInfos;
  mapping(uint64 => ServiceDescription[]) private descriptions;
  mapping(uint64 => mapping(address => uint64)) userRate;
  mapping(address => mapping(uint64 => bool)) acl;
  mapping(address => uint[]) public myservices;

  address public owner = msg.sender;

  constructor() public {
    serviceCount = 0;
    idx = 0;
  }
  function toLower(string memory str) public pure returns(string memory) {
    bytes memory src = bytes (str);
    bytes memory des = new bytes(src.length);
    for(uint i = 0; i < src.length; i++) {
      if(src[i] >= 'A' && src[i] <= 'Z') {
        des[i] = byte(uint8(src[i])+32);
      } else {
        des[i] = src[i];
      }
    }
    return string(des);
  }
  function contains (string memory _pattern, string memory _text) public pure returns(bool) {
      bytes memory pattern = bytes (_pattern);
      bytes memory text = bytes (_text);
    //   uint M = pattern.length;
    //   uint N = text.length;
    //   uint p = 0; // hash value for pattern
    //   uint t = 0; // hash value for txt
    //   uint h = 1;
    //   uint i;
    //   uint j;
    //   uint q = 101;
    //   bool found = false;
    //   uint d = 256;
    //   if(pattern.length == 0) {
    //     return true;
    //   } else if (pattern.length > text.length) {
    //     return false;
    //   }
    //   for (i = 0; i < M-1; i++)
    //     h = (h*d)%q;
    //   for (i = 0; i < M; i++) {
    //     p = (d*p + uint8(pattern[i]))%q;
    //     t = (d*t + uint8(text[i]))%q;
    //   }
    //    for (i = 0; i <= N - M; i++) {
    //       if ( p == t ) {
    //         for (j = 0; j < M; j++) {
    //             if (text[i+j] != pattern[j])
    //                 break;
    //         }
    //         if (j == M){
    //           found = true;
    //           break;
    //         }

    //     }
    //     if ( i < N-M ) {
    //         t = (d*(t - uint8(text[i])*h) + uint8(text[i+M]))%q;
    //         if (t < 0)
    //         t = (t + q);
    //     }
    // }
    bool found = false;

      if(pattern.length > text.length) return false;
      for (uint i = 0; i <= text.length - pattern.length; i++) {
          bool flag = true;
          for (uint j = 0; j < pattern.length; j++) {
              if (text [i + j] != pattern [j]) {
                  flag = false;
                  break;
              }
          }
          if (flag) {
              found = true;
              break;
          }
      }
      return found;
  }


  function addService(string memory _name, string memory _category, string memory _description, uint _price, string memory additionalInfo, string memory fileName, string memory fileContent)  public returns (Service memory){
    Service memory created = Service(idx, msg.sender, _name, _category, _description, _price, 0,0,now);
    services.push(created);
    indexes[idx] = serviceCount;
    myservices[msg.sender].push(idx);
    serviceCount++;
    if(bytes(additionalInfo).length != 0x0) {
      additionalInfos[idx] = additionalInfo;
    }
    descriptions[idx].push(ServiceDescription(1, fileName, fileContent, now));
    idx++;
    return (created);
  }
  function getMyLatestServiceId() public view returns (uint) {
    return myservices[msg.sender][myservices[msg.sender].length-1];
  }
  function getAllServices() public view returns(uint64, Service[] memory) {
    return (serviceCount, services);
  }
  function getAllServices(uint64 size, uint64 page) public view returns(uint, Service[] memory) {
    uint64 start = page*size;
    Service[] memory ret = new Service[](size);
    uint upperbound  = (page*size)+size > services.length? services.length-(page*size) : size;
    for(uint i = 0; i < upperbound; i++) {
      ret[i] = services[start+i];
    }
    return (upperbound, ret);
  }
  //Workaround for truffle test not supporting function overloading
  function getAllServicesPaged(uint64 size, uint64 page) public view returns(uint, Service[] memory) {
    return getAllServices(size,page);
  }
  function findServices(string memory query) public view returns (uint, Service[] memory) {
    Service[] memory ret = new Service[](50);
    uint count=0;
    string memory lower = toLower(query);
    for(uint j = 0; j < services.length; j++) {
      Service memory service = services[j];
      if (contains(lower,toLower(service.name))|| contains(lower, toLower(service.description)) || contains(lower, toLower(service.category))) {
        ret[count] = service;
        count++;
        if(count == 50) break;
      }
    }
    return (count, ret);
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
  function getServiceDescription(uint64 id, uint64 version) public view returns(ServiceDescription memory serviceDesciption) {
    uint64 index = indexes[id];
    bool allowed = acl[msg.sender][id] || services[index].owner == msg.sender || services[index].price == 0;
    require(allowed, "Access not allowed");
    require(version <= descriptions[id].length && version > 0);
    return (descriptions[id][version-1]);
  }
  //Workaround for truffle test not supporting function overloading
  function getServiceDescriptionSpec(uint64 id, uint64 version) public view returns(ServiceDescription memory serviceDescription) {
    return getServiceDescription(id,version);
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
    require(!(acl[msg.sender][id] || services[index].owner == msg.sender || services[index].price == 0));
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
    require(rate >= 1 && rate <= 10);
    require(allowed, "Access not allowed");
    if(userRate[id][msg.sender] == 0) {
      services[index].ratingTotal += rate;
      services[index].ratingCount++;
      userRate[id][msg.sender] = rate;
    } else {
      services[index].ratingTotal -= userRate[id][msg.sender];
      services[index].ratingTotal += rate;
      userRate[id][msg.sender] = rate;
    }
  }
  function getUserRate(uint64 id) public view returns (uint64) {
    return userRate[id][msg.sender];
  }
}
