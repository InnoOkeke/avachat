// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

interface IUniswapV2Router02 {
    function addLiquidityETH(
        address token,
        uint amountTokenDesired,
        uint amountTokenMin,
        uint amountETHMin,
        address to,
        uint deadline
    ) external payable returns (uint amountToken, uint amountETH, uint liquidity);
}

contract BondingCurve is ReentrancyGuard, Ownable {
    IERC20 public token;
    uint256 public constant TOTAL_SUPPLY = 1_000_000_000 * 1e18; // 1 Billion
    uint256 public constant CURVE_SUPPLY = 800_000_000 * 1e18; // 80% for curve
    uint256 public constant TARGET_ETH = 20 ether; // Target raised to graduate

    uint256 public tokensSold;
    uint256 public ethRaised;
    bool public graduated;

    event Trade(address indexed trader, bool isBuy, uint256 tokenAmount, uint256 ethAmount);
    event Graduated(uint256 ethAmount, uint256 tokenAmount, address pool);

    constructor(address _token) Ownable(msg.sender) {
        token = IERC20(_token);
    }

    function getPrice(uint256 supply, uint256 amount) public pure returns (uint256) {
         // Simple linear curve: Price = 0.000000001 * supply
         // This is a placeholder. Real implementation uses Bancor formula or x*y=k
         uint256 price = (supply * 100) / 1e18; 
         return (price * amount) / 1e18; 
    }
    
    // Simplified Buy for MVP
    function buy(uint256 amountOut) external payable nonReentrant {
        require(!graduated, "Already graduated");
        require(tokensSold + amountOut <= CURVE_SUPPLY, "Exceeds curve supply");

        // Calculate cost (Linear: Price increases with supply)
        // Cost = (CurrentSupply * NewSupply) integral... simplified
        uint256 cost = (amountOut * (tokensSold + 1000)) / 1000000; // Mock calculation
        require(msg.value >= cost, "Insufficient ETH");

        tokensSold += amountOut;
        ethRaised += msg.value;
        token.transfer(msg.sender, amountOut);

        emit Trade(msg.sender, true, amountOut, cost);

        if (ethRaised >= TARGET_ETH) {
             _graduate();
        }
    }

    function sell(uint256 amountIn) external nonReentrant {
        require(!graduated, "Already graduated");
        require(token.balanceOf(msg.sender) >= amountIn, "Insufficient balance");

        // Calculate refund
        uint256 refund = (amountIn * (tokensSold)) / 1000000; // Mock reverse calc
        
        token.transferFrom(msg.sender, address(this), amountIn);
        tokensSold -= amountIn;
        ethRaised -= refund;
        
        (bool success, ) = payable(msg.sender).call{value: refund}("");
        require(success, "Transfer failed");

        emit Trade(msg.sender, false, amountIn, refund);
    }

    function _graduate() internal {
        graduated = true;
        // Migration logic: Add liquidity to TraderJoe/Uniswap
        // For MVP, we just emit event. In prod, we call Router.addLiquidityETH
        emit Graduated(ethRaised, token.balanceOf(address(this)), address(0));
    }
}
