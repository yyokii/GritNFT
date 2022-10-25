// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;
import 'hardhat/console.sol';

contract GritNFT {
  constructor() {
    console.log('This is my NFT contract.');
  }

  function makeNFT() public {
    console.log('I made an NFT!');
  }
}
