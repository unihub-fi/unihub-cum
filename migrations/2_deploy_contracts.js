const { BigNumber } = require("@ethersproject/bignumber");
const MasterUniHub = artifacts.require("MasterUniHub");
const SupportUniHub = artifacts.require("SupportUniHub");
const CumToken = artifacts.require("CumToken");
const CumShotBar = artifacts.require("CumShotBar");
const MultiCall = artifacts.require("MultiCall");
const Timelock = artifacts.require("Timelock");
const UniHubSwapBurn = artifacts.require("UniHubSwapBurn");
const BnbStaking = artifacts.require("BnbStaking");

const INITIAL_MINT = '25000';
const BLOCKS_PER_HOUR = (3600 / 3) // 3sec Block Time
const TOKENS_PER_BLOCK = '10';
const BLOCKS_PER_DAY = 24 * BLOCKS_PER_HOUR
const TIMELOCK_DELAY_SECS = (3600 * 24); 
const STARTING_BLOCK = 4853714;
const REWARDS_START = String(STARTING_BLOCK + (BLOCKS_PER_HOUR * 6))
const FARM_FEE_ACCOUNT = '0xCEf34e4db130c8A64493517985b23af5B13E8cc6'
 
const logTx = (tx) => {
    console.dir(tx, {depth: 3});
}

// let block = await web3.eth.getBlock("latest")
module.exports = async function(deployer, network, accounts) {
    console.log({network});

    let currentAccount = accounts[0];
    let feeAccount = FARM_FEE_ACCOUNT;
    if (network == 'testnet') {
        console.log(`WARNING: Updating current account for testnet`)
        currentAccount = accounts[1];
    }

    if (network == 'development' || network == 'testnet') {
        console.log(`WARNING: Updating feeAcount for testnet/development`)
        feeAccount = accounts[3];
    }

    let cumTokenInstance;
    let cumShotBarInstance;
    let masterUniHubInstance;

    /**
     * Deploy CumToken
     */
    deployer.deploy(CumToken).then((instance) => {
        cumTokenInstance = instance;
        /**
         * Mint intial tokens for liquidity pool
         */
        return cumTokenInstance.mint(BigNumber.from(INITIAL_MINT).mul(BigNumber.from(String(10**18))));
    }).then((tx)=> {
        logTx(tx);
        /**
         * Deploy CumShotBar
         */
        return deployer.deploy(CumShotBar, CumToken.address)
    }).then((instance)=> {
        cumShotBarInstance = instance;
        /**
         * Deploy MasterUniHub
         */
        if(network == "bsc" || network == "bsc-fork") {
            console.log(`Deploying MasterUniHub with BSC MAINNET settings.`)
            return deployer.deploy(MasterUniHub, 
                CumToken.address,                                         // _cum
                CumShotBar.address,                                      // _cumShot
                feeAccount,                                                   // _devaddr
                BigNumber.from(TOKENS_PER_BLOCK).mul(BigNumber.from(String(10**18))),  // _cumPerBlock
                REWARDS_START,                                                // _startBlock
                4                                                            // _multiplier
            )
        }
        console.log(`Deploying MasterUniHub with DEV/TEST settings`)
        return deployer.deploy(MasterUniHub, 
            CumToken.address, 
            CumShotBar.address, 
            feeAccount,
            BigNumber.from(TOKENS_PER_BLOCK).mul(BigNumber.from(String(10**18))), 
            0, 
            4
        )
        
    }).then((instance)=> {
        masterUniHubInstance = instance;
        /**
         * TransferOwnership of CUM to MasterUniHub
         */
        return cumTokenInstance.transferOwnership(MasterUniHub.address);
    }).then((tx)=> {
        logTx(tx);
        /**
         * TransferOwnership of CUMSHOT to MasterUniHub
         */
        return cumShotBarInstance.transferOwnership(MasterUniHub.address);
    }).then((tx)=> {
        logTx(tx);
        /**
         * Deploy SupportUniHub
         */
        if(network == "bsc" || network == "bsc-fork") {
            console.log(`Deploying SupportUniHub with BSC MAINNET settings.`)
            return deployer.deploy(SupportUniHub, 
                CumShotBar.address,                  //_cumShot
                BigNumber.from(TOKENS_PER_BLOCK).mul(BigNumber.from(String(10**18))),                                      // _rewardPerBlock
                REWARDS_START,                            // _startBlock
                STARTING_BLOCK + (BLOCKS_PER_DAY * 365),  // _endBlock
            )
        }
        console.log(`Deploying SupportUniHub with DEV/TEST settings`)
        return deployer.deploy(SupportUniHub, 
            CumShotBar.address,                  //_cumShot
            BigNumber.from(TOKENS_PER_BLOCK).mul(BigNumber.from(String(10**18))),                                      // _rewardPerBlock
            STARTING_BLOCK + (BLOCKS_PER_HOUR * 6),   // _startBlock
            '99999999999999999',                      // _endBlock
        )
    }).then(()=> {
        /**
         * Deploy BnbStakingContract
         */
                // TODO:
        // constructor(
        //     IBEP20 _lp,
        //     IBEP20 _rewardToken,
        //     uint256 _rewardPerBlock,
        //     uint256 _startBlock,
        //     uint256 _bonusEndBlock,
        //     address _adminAddress,
        //     address _wbnb
        // ) 
        if(network == "bsc" || network == "bsc-fork") {

        }

        // return deployer.deploy(BnbStaking, CumToken.address)
    }).then(()=> {
        /**
         * Deploy MultiCall
         */
        return deployer.deploy(MultiCall);
    }).then(()=> {
        /**
         * Deploy Timelock
         */
        return deployer.deploy(Timelock, currentAccount, TIMELOCK_DELAY_SECS);
    }).then(()=> {
        /**
         * Deploy UniHubSwapBurn
         */
        return deployer.deploy(UniHubSwapBurn);
    }).then(()=> {
        console.log('Rewards Start at block: ', REWARDS_START)
        console.table({
            MasterUniHub:MasterUniHub.address,
            SupportUniHub:SupportUniHub.address,
            CumToken:CumToken.address,
            CumShotBar:CumShotBar.address,
            MultiCall:MultiCall.address,
            Timelock:Timelock.address,
            UniHubSwapBurn:UniHubSwapBurn.address
            // BnbStaking:BnbStaking.address,
        })
    });
};
