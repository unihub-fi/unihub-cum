# Cum Farming 💦

Feel free to read the code. More details coming soon.

https://unihub.fi

## Solidity Standard Input
With the help of solt we can easily verify our contracts on Etherscan: https://github.com/hjubb/solt

## Updates to MasterUniHub
As MasterUniHub is fork of Pancake's MasterChef, we want to be transparent about the updates that have been made: https://www.diffchecker.com/XSrDXXBe

- Migrator Function removed: This function has been used in rug pulls before and as we want to build trust in the community we have decided to remove this. We don't claim to be the first, but we agree with the decision. 
- Farm safety checks. When setting allocations for farms, if a pool is added twice it can cause inconsistencies.
- Helper view functions. View functions can only read data from the contract, but not alter anything which means these can not be used for attacks. 
- Only one admin. A recent project was exploited that used multiple forms of admins to control the project. An admin function that was not timelocked was used to make the exploit. We want the timelock to have full control over the contract so there are no surprises

### BSCMAINNET
