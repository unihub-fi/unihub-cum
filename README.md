# Cum Farming 💦

Feel free to read the code. More details coming soon.

https://unihub.fi

## Solidity Standard Input
With the help of solt we can easily verify our contracts on Etherscan: https://github.com/hjubb/solt

## Updates to MasterUniHub
As MasterUniHub is fork of Pancake's MasterChef, we want to be transparent about the updates that have been made: https://www.diffchecker.com/2w2eGAyZ

- Migrator Function removed: Removing this function gives user certainty the contract owner cannot steal staked funds. We don't claim to be the first, but we agree with the decision.
- Farm safety checks: When setting allocations for farms, if a pool is added twice it can cause inconsistencies.
- Helper view functions: View functions can only read data from the contract, but not alter anything which means these cannot be used for attacks.
- Only one admin. A recent project was exploited that used multiple forms of admins to control the project. An admin function that was not timelocked was used to make the exploit. We want the timelock to have full control over the contract so there are no surprises
- Added TAPE token: TAPE are generated whenever CUM is sent to a new address (including harvesting and swapping). This twist lies in the few added lines in the transfer function.

Happy reviewing! Please share your greenlighting with the community before launch — most users cannot read code.

### BSCMAINNET
