const { ethers } = require("hardhat");
const { NFT_CONTRACT_ADDRESS } = require("../constants");

async function main() {
    // Deploy the FakeNFTMarketplace contract first
    const FakeNFTMarketplace = await ethers.getContractFactory(
        "FakeNFTMarketplace"
    );
    const fakeNftMarketplace = await FakeNFTMarketplace.deploy();
    await fakeNftMarketplace.deployed();

    console.log("FakeNFTMarketplace deployed to: ", fakeNftMarketplace.address);

    // Now deploy the FlyTVDAO contract
    const FlyTVDAO = await ethers.getContractFactory("FlyTVDAO");
    const flyTVDAO = await FlyTVDAO.deploy(
        fakeNftMarketplace.address,
        NFT_CONTRACT_ADDRESS,
        {
            // This assumes your account has at least 1 ETH in it's account
            // Change this value as you want
            value: ethers.utils.parseEther("1"),
        }
    );
    await flyTVDAO.deployed();

    console.log("FlyTVDAO deployed to: ", flyTVDAO.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
