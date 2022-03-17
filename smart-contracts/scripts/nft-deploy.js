const { ethers } = require("hardhat");
require("dotenv").config({ path: ".env" });
const { WHITELIST_CONTRACT_ADDRESS, METADATA_URL } = require("../constants");

async function main() {
    // Address of the whitelist contract that you deployed in the previous module
    const whitelistContract = WHITELIST_CONTRACT_ADDRESS;
    // URL from where we can extract the metadata for a FlyTV NFT
    const metadataURL = METADATA_URL;
    /*
    A ContractFactory in ethers.js is an abstraction used to deploy new smart contracts,
    so FlyTVContract here is a factory for instances of our FlyTV contract.
    */
    const cryptoDevsContract = await ethers.getContractFactory("FlyTV");

    // deploy the contract
    const deployedFlyTVContract = await cryptoDevsContract.deploy(
        metadataURL,
        whitelistContract
    );

    // print the address of the deployed contract
    console.log(
        "FlyTV Contract Address:",
        deployedFlyTVContract.address
    );
}

// Call the main function and catch if there is any error
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
