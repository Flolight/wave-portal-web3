// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract WavePortal {
    uint256 totalWaves;

    uint256 seed;

    event NewWave(address indexed from, uint256 timestamp, string message);

    struct Wave {
        address waver;
        string message;
        uint256 timestamp;
    }

    Wave[] waves;
    address[] senders;
    mapping(address => uint256) public lastWavedAt;
    
    constructor() payable {
        console.log("Wow, this is really a fancy & smart contract! :o");
    }

    function wave(string memory _message) public {
        require(
            lastWavedAt[msg.sender] + 15 minutes < block.timestamp,
            "Wait 15m" 
            );

        lastWavedAt[msg.sender] = block.timestamp;
        totalWaves += 1;

        waves.push(Wave(msg.sender, _message, block.timestamp));
        senders.push(msg.sender);

        uint256 randomNumber = (block.difficulty + block.timestamp + seed) % 100;
        console.log("Random number generated: %s", randomNumber);

        seed = randomNumber;

        if(randomNumber < 50) {
            console.log("%s won!", msg.sender);

            uint256 prizeAmount = 0.0001 ether;
            require(
                prizeAmount <= address(this).balance,
                "Seriously? Trying to withdraw more money than the contract has? I'm sure you can be better than that!"
            );
            (bool success, ) = (msg.sender).call{value: prizeAmount}("");
            require(success, "Failed to withdraw money from contract.");
        }


        emit NewWave(msg.sender, block.timestamp, _message);
        console.log("%s have waved!", msg.sender);

        
    }

    function getTotalWaves() public view returns (uint256) {
        console.log("We have %d total waves", totalWaves);
        return totalWaves;
    }

    function getAllWaves() public view returns (Wave[] memory) {
        return waves;
    }

    function logAllSenders() public view {
        console.log("\n --- LISTING ALL SENDERS ---");
            for(uint i = 0; i < senders.length; i++){
                console.log("%s", senders[i]);
            }
    }
}


