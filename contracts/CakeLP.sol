pragma solidity 0.6.12;

/*
 * ApeSwapFinance 
 * App:             https://apeswap.finance
 * Medium:          https://medium.com/@ape_swap    
 * Twitter:         https://twitter.com/ape_swap 
 * Telegram:        https://t.me/ape_swap
 * Announcements:   https://t.me/ape_swap_news
 * GitHub:          https://github.com/ApeSwapFinance
 */

import "./libs/token/BEP20.sol";

// CumToken with Governance.
contract CakeLPToken is BEP20('UniHubSwapFinance Cake LP', 'CAKELP') {
    /// @notice Creates `_amount` token to `_to`. Must only be called by the owner (MasterUniHub).
    function mint(address _to, uint256 _amount) public onlyOwner {
        _mint(_to, _amount);
    }

    // Copied and modified from YAM code:
    // https://github.com/yam-finance/yam-protocol/blob/master/contracts/token/YAMGovernanceStorage.sol
    // https://github.com/yam-finance/yam-protocol/blob/master/contracts/token/YAMGovernance.sol
    // Which is copied and modified from COMPOUND:
    // https://github.com/compound-finance/compound-protocol/blob/master/contracts/Governance/Comp.sol

}