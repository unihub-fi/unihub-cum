pragma solidity 0.6.12;

/*
__________________________________________________________________
 /_________________________________________________________________/|\
 l                                                                 || \
 l   ,-,.              #            #                  #         ||
 l  { / ,__\                                                       ||
 l { `}'- -/    #               #             #                  # ||
 l {`}'\ o/                                                        ||
 l  U__J  L   C'mon - it's wide open; surely you can stick it in!||
 l .'   ' ._.      Website: unihub.fi                   ||
 l/ /; o )  o) \    TG: https://t.me/unihub_chat          ||
 / / \`~' `;'} :                                                   ||
: {   )    (/ /                     #                 #            ||
 \ \ /   .  )/                                                     ||
 l\ Y      l/                #                 #              #    ||
 l Y    \#/ \                                                      ||
 l {     \  | .....................................................||..
 l  \     \ |                                                      ||
 l   `.    \;                                                      ||
 l     `.   \                                                      ||
 l       |)  :                                                     ||
.l......./  /......................................................|'..
         : /
        / /{
       / /_`-,
      (_ \_~^^
        `~~
*/

import "@pancakeswap/pancake-swap-lib/contracts/token/BEP20/BEP20.sol";

// TapeToken
contract TapeToken is BEP20('TAPE token', 'TAPE') {
    using SafeMath for uint256;
    
    // mints new tape tokens, can only be called by CumToken
    // contract during burns, no users or dev can call this
    function mint(address _to, uint256 _amount) public onlyOwner {
        _mint(_to, _amount);
    }
    
}
