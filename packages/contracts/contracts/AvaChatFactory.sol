// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./AvaChatWallet.sol";
import "@openzeppelin/contracts/proxy/Clones.sol";

contract AvaChatFactory {
    using Clones for address;

    address public immutable walletImplementation;
    mapping(address => address) public getWallet;

    event WalletCreated(address indexed owner, address wallet);

    constructor(address _implementation) {
        walletImplementation = _implementation;
    }

    function createWallet(address owner) external returns (address) {
        if (getWallet[owner] != address(0)) {
            return getWallet[owner];
        }

        address clone = walletImplementation.clone();
        AvaChatWallet(payable(clone)).initialize(owner);
        
        getWallet[owner] = clone;
        emit WalletCreated(owner, clone);
        return clone;
    }

    function getAddress(address owner) external view returns (address) {
        return getWallet[owner];
    }
}
