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

import "@pancakeswap/pancake-swap-lib/contracts/token/BEP20/BEP20.sol";

// TapeToken
contract TapeToken is BEP20('TapeToken', 'TAPE') {
    using SafeMath for uint256;
    
    // mints new tape tokens, can only be called by CumToken
    // contract during burns, no users or dev can call this
    function mint(address _to, uint256 _amount) public onlyOwner {
        _mint(_to, _amount);
    }
    
}
