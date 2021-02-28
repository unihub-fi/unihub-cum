const { BigNumber } = require("@ethersproject/bignumber");
const MasterUniHub = artifacts.require("MasterUniHub");
const SupportUniHub = artifacts.require("SupportUniHub");
const CumToken = artifacts.require("CumToken");
const CumShotBar = artifacts.require("CumShotBar");
const CakeLPToken = artifacts.require("CakeLPToken");
const TapeToken = artifacts.require("TapeToken");
const MultiCall = artifacts.require("MultiCall");
const BEP20 = artifacts.require("BEP20");

const INITIAL_MINT = "25000";
const BLOCKS_PER_HOUR = 3600 / 3; // 3sec Block Time
const TOKENS_PER_BLOCK = "10";
const BLOCKS_PER_DAY = 24 * BLOCKS_PER_HOUR;
const TIMELOCK_DELAY_SECS = 3600 * 24;
// Main Net
// const STARTING_BLOCK = 5232377;
// Test Net
const STARTING_BLOCK = 6670664;
const REWARDS_START = String(STARTING_BLOCK + BLOCKS_PER_HOUR * 6);
const FARM_FEE_ACCOUNT = "0xDf870513b94De9f82860BF68a83D1cBad296a382";

const logTx = (tx) => {
  console.dir(tx, { depth: 3 });
};

// let block = await web3.eth.getBlock("latest")
module.exports = async function (deployer, network, accounts) {
  console.log({ network });

  let currentAccount = accounts[0];
  let feeAccount = FARM_FEE_ACCOUNT;
  if (network == "testnet") {
    console.log(`WARNING: Updating current account for testnet`);
    currentAccount = accounts[1];
  }

  if (network == "development" || network == "testnet") {
    console.log(`WARNING: Updating feeAcount for testnet/development`);
    feeAccount = accounts[3];
  }

  let cumTokenInstance;
  let cumShotBarInstance;
  let masterUniHubInstance;
  let cakeLPInstance;
  let tapeInstance;
  let bep20Instance;

  /**
   * Deploy CumToken
   */
  deployer
    .deploy(TapeToken, FARM_FEE_ACCOUNT)
    .then((instance) => {
      tapeInstance = instance;
      /**
       * Mint intial tokens for liquidity pool
       */
      return tapeInstance.mint(
        BigNumber.from(INITIAL_MINT).mul(BigNumber.from(String(10 ** 18)))
      );
    })
    .then((instance) => {
      return deployer.deploy(CumToken, TapeToken.address, 100);
    })
    .then((instance) => {
      cumTokenInstance = instance;
      /**
       * Mint intial tokens for liquidity pool
       */
      return cumTokenInstance.mint(
        BigNumber.from(INITIAL_MINT).mul(BigNumber.from(String(10 ** 18)))
      );
    })
    .then((tx) => {
      logTx(tx);
      /**
       * Deploy CakeLPToken
       */
      return deployer.deploy(CakeLPToken, CumToken.address);
    })
    .then((instance) => {
      cakeLPInstance = instance;
      /**
       * Mint intial tokens for liquidity pool
       */
      return cakeLPInstance.mint(
        BigNumber.from(INITIAL_MINT).mul(BigNumber.from(String(10 ** 18)))
      );
    })
    .then((tx) => {
      logTx(tx);
      /**
       * Deploy CumShotBar
       */
      return deployer.deploy(CumShotBar, CakeLPToken.address);
    })
    .then((instance) => {
      cumShotBarInstance = instance;
      /**
       * Deploy MasterUniHub
       */
      if (network == "bsc" || network == "bsc-fork") {
        console.log(`Deploying MasterUniHub with BSC MAINNET settings.`);
        return deployer.deploy(
          MasterUniHub,
          CumToken.address, // _cum
          CumShotBar.address, // _cumShot
          feeAccount, // _devaddr
          BigNumber.from(TOKENS_PER_BLOCK).mul(
            BigNumber.from(String(10 ** 18))
          ), // _cumPerBlock
          REWARDS_START, // _startBlock
          4 // _multiplier
        );
      }
      console.log(`Deploying MasterUniHub with DEV/TEST settings`);
      return deployer.deploy(
        MasterUniHub,
        CumToken.address,
        CumShotBar.address,
        feeAccount,
        BigNumber.from(TOKENS_PER_BLOCK).mul(BigNumber.from(String(10 ** 18))),
        0,
        4
      );
    })
    .then((instance) => {
      masterUniHubInstance = instance;
      /**
       * TransferOwnership of CUM to MasterUniHub
       */
      return cumTokenInstance.transferOwnership(MasterUniHub.address);
    })
    .then((tx) => {
      logTx(tx);
      /**
       * TransferOwnership of CUMSHOT to MasterUniHub
       */
      return cumShotBarInstance.transferOwnership(MasterUniHub.address);
    })
    .then((tx) => {
      logTx(tx);
      /**
       * TransferOwnership of TAPE to CUM
       */
      return tapeInstance.transferOwnership(CumToken.address);
    })
    .then(() => {
      /**
       * Deploy MultiCall
       */
      return deployer.deploy(MultiCall);
    })
    .then((tx) => {
      logTx(tx);
      /**
       * Deploy SupportUniHub
       */
      /*        if(network == "bsc" || network == "bsc-fork") {
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
        )*/
    })
    .then(() => {
      console.log("Rewards Start at block: ", REWARDS_START);
      console.table({
        //BEP20: BEP20.address,
        MasterUniHub: MasterUniHub.address,
        //SupportUniHub:SupportUniHub.address,
        CumToken: CumToken.address,
        CumShotBar: CumShotBar.address,
        TapeToken: TapeToken.address,
        CakeLPToken: CakeLPToken.address,
        MultiCall: MultiCall.address,
        //Timelock:Timelock.address,
        //UniHubSwapBurn:UniHubSwapBurn.address
        // BnbStaking:BnbStaking.address,
      });
    });
};
