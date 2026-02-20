// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/proxy/utils/Initializable.sol";

/**
 * @title AvaChatWallet
 * @dev Simple Smart Account for AvaChat users. Controlled by a signer (Privy embedded wallet).
 */
contract AvaChatWallet is Initializable, Ownable {
    using ECDSA for bytes32;

    uint256 public nonce;

    event Executed(address indexed target, uint256 value, bytes data);
    event Received(address indexed sender, uint256 value);

    constructor() Ownable(msg.sender) {}

    function initialize(address _owner) public initializer {
        _transferOwnership(_owner);
    }

    /**
     * @dev Execute a transaction (call) to another contract or address.
     * Can only be called by the owner (Privacy Signer) or the EntryPoint (if we add full 4337 support later).
     */
    function execute(address dest, uint256 value, bytes calldata func) external onlyOwner {
        _call(dest, value, func);
    }

    /**
     * @dev Execute a batch of transactions.
     */
    function executeBatch(address[] calldata dest, uint256[] calldata value, bytes[] calldata func) external onlyOwner {
        require(dest.length == value.length && value.length == func.length, "Invalid array lengths");
        for (uint256 i = 0; i < dest.length; i++) {
            _call(dest[i], value[i], func[i]);
        }
    }

    function _call(address target, uint256 value, bytes memory data) internal {
        (bool success, bytes memory result) = target.call{value: value}(data);
        if (!success) {
            assembly {
                revert(add(result, 32), mload(result))
            }
        }
        emit Executed(target, value, data);
    }

    // Allow receiving AVAX
    receive() external payable {
        emit Received(msg.sender, msg.value);
    }
}
