// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Migrations {
  address public owner = msg.sender;
  uint public last_completed_migration; 
  // 마지막에 추가된 스마트 컨트렉트만 추가되게 하는 구문
  // 기존 스마트 컨트렉트 를 수정하기 위해서는 "migrate --comlie-all --reset"

  modifier restricted() {
    require(
      msg.sender == owner,
      "This function is restricted to the contract's owner"
    );
    _;
  }

  function setCompleted(uint completed) public restricted {
    last_completed_migration = completed;
  }
}
