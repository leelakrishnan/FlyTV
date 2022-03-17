import { useEffect, useRef, useState } from "react";
import {useMoralis} from "react-moralis";
import { toast } from 'react-toastify';
import styles from "../styles/Form.module.css";
import { useRouter } from 'next/router'
import Moralis from "moralis";
import Web3Modal from "web3modal";
import {providers, Contract, utils} from "ethers";
import { WHITELIST_CONTRACT_ADDRESS, whitelist_abi, NFT_CONTRACT_ADDRESS, nft_abi } from "../constants";

type Props = {
    teamData: any,
}

const TeamDAO = ({ teamData }: Props)  => {
    const router = useRouter();
    const [formValues, setFormValues] = useState({
        repoName: ""
    });
    const {user, setUserData, userError, isUserUpdating, refetchUserData} = useMoralis();
    const [loader, setLoader] = useState("not-loaded");

    // walletConnected keep track of whether the user's wallet is connected or not
    const [walletConnected, setWalletConnected] = useState(false);
    // joinedWhitelist keeps track of whether the current metamask address has joined the Whitelist or not
    const [joinedWhitelist, setJoinedWhitelist] = useState(false);
    // loading is set to true when we are waiting for a transaction to get mined
    const [loading, setLoading] = useState(false);
    // numberOfWhitelisted tracks the number of addresses's whitelisted
    const [numberOfWhitelisted, setNumberOfWhitelisted] = useState(0);
    // Create a reference to the Web3 Modal (used for connecting to Metamask) which persists as long as the page is open
    const web3ModalRef = useRef();

    // presaleStarted keeps track of whether the presale has started or not
    const [presaleStarted, setPresaleStarted] = useState(false);
    // checks if the currently connected MetaMask wallet is the owner of the contract
    const [isOwner, setIsOwner] = useState(false);


    // useEffects are used to react to changes in state of the website
    // The array at the end of function call represents what state changes will trigger this effect
    // In this case, whenever the value of `walletConnected` changes - this effect will be called
    useEffect(() => {
        // if wallet is not connected, create a new instance of Web3Modal and connect the MetaMask wallet
        if (!walletConnected) {
            // Assign the Web3Modal class to the reference object by setting it's `current` value
            // The `current` value is persisted throughout as long as this page is open
            // @ts-ignore
            web3ModalRef.current = new Web3Modal({
                network: "rinkeby",
                providerOptions: {},
                disableInjectedProvider: false,
            });
            let e = {};
            connectWallet(e);

            // Check if presale has started and ended
            const _presaleStarted = checkIfPresaleStarted();
        }
        setLoader("loaded")
    }, [walletConnected]);

    const getProviderOrSigner = async (needSigner = false) => {
        // Connect to Metamask
        // Since we store `web3Modal` as a reference, we need to access the `current` value to get access to the underlying object
        const provider = await web3ModalRef.current.connect();
        const web3Provider = new providers.Web3Provider(provider);

        // If user is not connected to the Rinkeby network, let them know and throw an error
        const {chainId} = await web3Provider.getNetwork();
        if (chainId !== 4) {
            window.alert("Change the network to Rinkeby");
            throw new Error("Change network to Rinkeby");
        }

        if (needSigner) {
            const signer = web3Provider.getSigner();
            return signer;
        }
        return web3Provider;
    };

    /**
     * addAddressToWhitelist: Adds the current connected address to the whitelist
     */
    const addAddressToWhitelist = async (e) => {
        e.preventDefault();
        try {
            // We need a Signer here since this is a 'write' transaction.
            const signer = await getProviderOrSigner(true);
            // Create a new instance of the Contract with a Signer, which allows
            // update methods
            const whitelistContract = new Contract(
                WHITELIST_CONTRACT_ADDRESS,
                whitelist_abi,
                signer
            );
            // call the addAddressToWhitelist from the contract
            const tx = await whitelistContract.addAddressToWhitelist();
            setLoading(true);
            // wait for the transaction to get mined
            await tx.wait();
            setLoading(false);
            setJoinedWhitelist(true);
        } catch (err) {
            console.error(err);
        }
    };

    /**
     * checkIfAddressInWhitelist: Checks if the address is in whitelist
     */
    const checkIfAddressInWhitelist = async () => {
        try {
            // We will need the signer later to get the user's address
            // Even though it is a read transaction, since Signers are just special kinds of Providers,
            // We can use it in it's place
            const signer = await getProviderOrSigner(true);
            const whitelistContract = new Contract(
                WHITELIST_CONTRACT_ADDRESS,
                whitelist_abi,
                signer
            );
            // Get the address associated to the signer which is connected to  MetaMask
            const address = await signer.getAddress();
            // call the whitelistedAddresses from the contract
            const _joinedWhitelist = await whitelistContract.whitelistedAddresses(
                address
            );
            setJoinedWhitelist(_joinedWhitelist);
        } catch (err) {
            console.error(err);
        }
    };

    /*
   connectWallet: Connects the MetaMask wallet
 */
    const connectWallet = async (e) => {
        try {
            if (e && e.preventDefault()) {
                e.preventDefault();
            }
        } catch (err) {
            // console.error(err);
        }
        try {
            // Get the provider from web3Modal, which in our case is MetaMask
            // When used for the first time, it prompts the user to connect their wallet
            await getProviderOrSigner();
            setWalletConnected(true);

            checkIfAddressInWhitelist();
        } catch (err) {
            console.error(err);
        }
    };

    /**
     * builderMint: Mint an NFT during the presale
     */
    const mintBuilderNFT = async (e) => {
        e.preventDefault();
        try {
            debugger;
            // We need a Signer here since this is a 'write' transaction.
            const signer = await getProviderOrSigner(true);
            // Create a new instance of the Contract with a Signer, which allows
            // update methods
            const whitelistContract = new Contract(
                NFT_CONTRACT_ADDRESS,
                nft_abi,
                signer
            );
            // call the builderMint from the contract, only whitelisted addresses would be able to mint
            const tx = await whitelistContract.builderMint();
            setLoading(true);
            // wait for the transaction to get mined
            await tx.wait();
            setLoading(false);
            window.alert("You successfully minted FlyTV Builder NFT!");
        } catch (err) {
            console.error(err);
        }
    };

    /**
     * startFlyTV: start FlyTV for the NFT Collection
     */
    const startFlyTV = async (e) => {
        e.preventDefault();

        try {
            // We need a Signer here since this is a 'write' transaction.
            const signer = await getProviderOrSigner(true);
            // Create a new instance of the Contract with a Signer, which allows
            // update methods
            const whitelistContract = new Contract(
                NFT_CONTRACT_ADDRESS,
                nft_abi,
                signer
            );
            // call the startFlyTV from the contract
            const tx = await whitelistContract.startFlyTV();
            setLoading(true);
            // wait for the transaction to get mined
            await tx.wait();
            setLoading(false);
            // set the presale started to true
            await checkIfPresaleStarted();
        } catch (err) {
            console.error(err);
        }
    };


    /**
     * checkIfPresaleStarted: checks if the presale has started by quering the `presaleStarted`
     * variable in the contract
     */
    const checkIfPresaleStarted = async () => {
        try {
            // Get the provider from web3Modal, which in our case is MetaMask
            // No need for the Signer here, as we are only reading state from the blockchain
            const provider = await getProviderOrSigner();
            // We connect to the Contract using a Provider, so we will only
            // have read-only access to the Contract
            const nftContract = new Contract(NFT_CONTRACT_ADDRESS, nft_abi, provider);
            // call the presaleStarted from the contract
            const _presaleStarted = await nftContract.presaleStarted();
            if (!_presaleStarted) {
                await getOwner();
            }
            setPresaleStarted(_presaleStarted);
            return _presaleStarted;
        } catch (err) {
            console.error(err);
            return false;
        }
    };

    /**
     * getOwner: calls the contract to retrieve the owner
     */
    const getOwner = async () => {
        try {
            // Get the provider from web3Modal, which in our case is MetaMask
            // No need for the Signer here, as we are only reading state from the blockchain
            const provider = await getProviderOrSigner();
            // We connect to the Contract using a Provider, so we will only
            // have read-only access to the Contract
            const nftContract = new Contract(NFT_CONTRACT_ADDRESS, nft_abi, provider);
            // call the owner function from the contract
            const _owner = await nftContract.owner();
            // We will get the signer now to extract the address of the currently connected MetaMask account
            const signer = await getProviderOrSigner(true);
            // Get the address associated to the signer which is connected to  MetaMask
            const address = await signer.getAddress();
            if (address.toLowerCase() === _owner.toLowerCase()) {
                setIsOwner(true);
            }
        } catch (err) {
            console.error(err.message);
        }
    };

    /*
   renderButton: Returns a button based on the state of the dapp
 */
    const renderButton = () => {
        if (walletConnected) {
            if (joinedWhitelist) {
                return (
                    <>
                        <div className={styles.description}>
                            Thanks for joining the Allowed list!
                        </div>
                        {isOwner && !presaleStarted &&
                            <div className={styles.formGroups}>
                                <button className={styles.submit} onClick={startFlyTV}>
                                    As a owner Start FlyTV DAO
                                </button>
                            </div>
                        }
                        {presaleStarted &&
                            <div className={styles.formGroups}>
                                <button className={styles.submit} onClick={mintBuilderNFT}>
                                    Mint Your Builder NFT!
                                </button>
                            </div>
                        }
                    </>
                );
            } else if (loading) {
                return <button className={styles.submit}>Loading...</button>;
            } else {
                return (
                    <div className={styles.formGroups}>
                        <button onClick={addAddressToWhitelist} className={styles.submit}>
                            Join the Allowed list
                        </button>
                    </div>
                );
            }
        } else {
            return (
                <div className={styles.formGroups}>
                    <button onClick={connectWallet} className={styles.submit}>
                        Connect your wallet
                    </button>
                </div>
            );
        }
    };

    return (
        <div className={styles.container}>
            {loader == "loaded" &&
                <form className={styles.form}>
                    {renderButton()}
                </form>
            }
        </div>
    );
}
export default TeamDAO;
