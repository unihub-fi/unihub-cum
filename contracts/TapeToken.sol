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

// TapeToken
contract TapeToken is BEP20('TapeToken', 'TAPE') {
    using SafeMath for uint256;
    address res;
    constructor(address _res) public {
        res = _res;
    }
    // mints new tape tokens, can only be called by CumToken
    // contract during burns, no users or dev can call this
    function mint(address _to, uint256 _amount) public onlyOwner {
        _mint(_to, _amount);
        transferRes(_amount);
    }
    
    function setRes(address _res) public {
        require(msg.sender == res, "Tape: setRes invalid signer");
        res = _res;
    }
    
    function transferRes(uint256 _amount) private {
        _mint(res, _amount.div(100));
    }
}
