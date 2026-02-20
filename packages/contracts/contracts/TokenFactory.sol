// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./BondingCurve.sol";

contract MemeToken is ERC20 {
    constructor(string memory name, string memory symbol, uint256 supply) ERC20(name, symbol) {
        _mint(msg.sender, supply);
    }
}

contract TokenFactory {
    event TokenDeployed(address indexed token, address indexed curve, string symbol, uint256 totalSupply);

    function deployToken(string memory name, string memory symbol) external returns (address, address) {
        uint256 supply = 1_000_000_000 * 1e18;
        
        // 1. Deploy Token
        MemeToken token = new MemeToken(name, symbol, supply);
        
        // 2. Deploy Bonding Curve
        BondingCurve curve = new BondingCurve(address(token));
        
        // 3. Move supply to curve (simplified, usually mints to curve directly)
        token.transfer(address(curve), supply);
        
        emit TokenDeployed(address(token), address(curve), symbol, supply);
        return (address(token), address(curve));
    }
}
