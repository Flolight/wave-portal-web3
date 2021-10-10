// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract WavePortal {
    uint256 totalWaves;
    address[] senders;
    
    constructor() {
        console.log("Wow, this is really a fancy & smart contract! :o");
    }

    function wave() public {
        totalWaves += 1;
        senders.push(msg.sender);
        console.log("%s have waved!", msg.sender);
    }

    function getTotalWaves() public view returns (uint256) {
        console.log("We have %d total waves", totalWaves);
        return totalWaves;
    }

    function logAllSenders() public view {
        console.log("\n --- LISTING ALL SENDERS ---");
            for(uint i = 0; i < senders.length; i++){
                console.log("%s", senders[i]);
            }
    }
}


