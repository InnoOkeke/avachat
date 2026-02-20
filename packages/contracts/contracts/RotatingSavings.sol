// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract RotatingSavings is ReentrancyGuard {
    struct Group {
        address creator;
        IERC20 token;
        uint256 contributionAmount;
        uint256 cycleDuration; // in seconds
        uint256 startTime;
        uint256 currentRound;
        address[] members;
        bool active;
        uint256 totalCollected;
    }

    mapping(uint256 => Group) public groups;
    uint256 public nextGroupId;

    mapping(uint256 => mapping(uint256 => address)) public roundWinner; // groupId -> round -> winner
    mapping(uint256 => mapping(uint256 => mapping(address => bool))) public hasPaid; // groupId -> round -> member -> paid

    event GroupCreated(uint256 indexed groupId, address creator, uint256 amount);
    event ContributionPaid(uint256 indexed groupId, address member, uint256 round);
    event RoundDistributed(uint256 indexed groupId, uint256 round, address winner, uint256 amount);

    function createGroup(
        address _token,
        uint256 _amount,
        uint256 _duration,
        address[] memory _members
    ) external returns (uint256) {
        uint256 groupId = nextGroupId++;
        Group storage g = groups[groupId];
        g.creator = msg.sender;
        g.token = IERC20(_token);
        g.contributionAmount = _amount;
        g.cycleDuration = _duration;
        g.members = _members; // Include creator if needed, handled by UI
        g.active = true;
        g.startTime = block.timestamp;

        emit GroupCreated(groupId, msg.sender, _amount);
        return groupId;
    }

    function contribute(uint256 groupId) external nonReentrant {
        Group storage g = groups[groupId];
        require(g.active, "Group inactive");
        
        // Calculate current round
        uint256 round = (block.timestamp - g.startTime) / g.cycleDuration;
        require(!hasPaid[groupId][round][msg.sender], "Already paid");

        // Transfer funds
        g.token.transferFrom(msg.sender, address(this), g.contributionAmount);
        hasPaid[groupId][round][msg.sender] = true;
        g.totalCollected += g.contributionAmount;

        emit ContributionPaid(groupId, msg.sender, round);

        // Check if round is complete (simplified logic: if pot full, distribute)
        if (g.totalCollected >= g.contributionAmount * g.members.length) {
            _distribute(groupId, round);
        }
    }

    function _distribute(uint256 groupId, uint256 round) internal {
        Group storage g = groups[groupId];
        
        // Determine winner (Round Robin: round % members.length)
        address winner = g.members[round % g.members.length];
        
        uint256 pot = g.totalCollected;
        g.totalCollected = 0;
        
        g.token.transfer(winner, pot);
        roundWinner[groupId][round] = winner;
        
        emit RoundDistributed(groupId, round, winner, pot);
    }
}
