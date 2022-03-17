import { useEffect, useRef, useState } from "react";
import {useMoralis} from "react-moralis";
import { toast } from 'react-toastify';
import styles from "../styles/Form.module.css";
import { useRouter } from 'next/router'
import Web3Modal from "web3modal";
import { formatEther } from "ethers/lib/utils";
import {BigNumber, providers, Contract, utils} from "ethers";
import { WHITELIST_CONTRACT_ADDRESS, WHITELIST_ABI, NFT_CONTRACT_ADDRESS, NFT_ABI,
    TOKEN_CONTRACT_ADDRESS, TOKEN_CONTRACT_ABI, FAKE_NFT_MARKETPLACE_ADDRESS, FAKE_NFT_ABI,
    DAO_CONTRACT_ADDRESS, DAO_CONTRACT_ABI } from "../constants";

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

// Create a BigNumber `0`
    const zero = BigNumber.from(0);

    // tokensToBeClaimed keeps track of the number of tokens that can be claimed
    // based on the FlyTV NFT's held by the user for which they havent claimed the tokens
    const [tokensToBeClaimed, setTokensToBeClaimed] = useState(zero);
    // balanceOfFlyTVTokens keeps track of number of FlyTV tokens owned by an address
    const [balanceOfFlyTVTokens, setBalanceOfFlyTVTokens] = useState(
        zero
    );
    // amount of the tokens that the user wants to mint
    const [tokenAmount, setTokenAmount] = useState(zero);
    // tokensMinted is the total number of tokens that have been minted till now out of 10000(max total supply)
    const [tokensMinted, setTokensMinted] = useState(zero);
    const [tokensClaimed, setTokensClaimed] = useState(0);

    const [showClaims, setShowClaims] = useState("dontshow");

    // ETH Balance of the DAO contract
    const [treasuryBalance, setTreasuryBalance] = useState("0");
    // Number of proposals created in the DAO
    const [numProposals, setNumProposals] = useState("0");
    // Array of all proposals created in the DAO
    const [proposals, setProposals] = useState([]);
    // User's balance of FlyTV NFTs
    const [nftBalance, setNftBalance] = useState(0);
    // Fake NFT Token ID to purchase. Used when creating a proposal.
    const [featureRequest, setFeatureRequest] = useState("");
    // One of "Create Proposal" or "View Proposals"
    const [selectedTab, setSelectedTab] = useState("");


    // Reads the ETH balance of the DAO contract and sets the `treasuryBalance` state variable
    const getDAOTreasuryBalance = async () => {
        try {
            const provider = await getProviderOrSigner();
            const balance = await provider.getBalance(
                DAO_CONTRACT_ADDRESS
            );
            
            setTreasuryBalance(balance.toString());
        } catch (error) {
            console.error(error);
        }
    };

    // Reads the number of proposals in the DAO contract and sets the `numProposals` state variable
    const getNumProposalsInDAO = async () => {
        try {
            const provider = await getProviderOrSigner();
            const contract = getDaoContractInstance(provider);
            const daoNumProposals = await contract.numProposals();
            if (daoNumProposals > 0) {
                setNumProposals(daoNumProposals.toString());
            }
        } catch (error) {
            console.error(error);
        }
    };

    // Reads the balance of the user's FlyTV NFTs and sets the `nftBalance` state variable
    const getUserNFTBalance = async () => {
        try {
            const signer = await getProviderOrSigner(true);
            const nftContract = getFlyTVNFTContractInstance(signer);
            const balance = await nftContract.balanceOf(signer.getAddress());
            setNftBalance(parseInt(balance.toString()));
        } catch (error) {
            console.error(error);
        }
    };

    // Calls the `createProposal` function in the contract, using the tokenId from `fakeNftTokenId`
    const createProposal = async (e) => {
        e.preventDefault();
        try {
            const signer = await getProviderOrSigner(true);
            const daoContract = getDaoContractInstance(signer);
            const txn = await daoContract.createProposal(featureRequest);
            setLoading(true);
            await txn.wait();
            await getNumProposalsInDAO();
            setLoading(false);
        } catch (error) {
            console.error(error);
            window.alert(error.data.message);
        }
    };

    // Helper function to fetch and parse one proposal from the DAO contract
    // Given the Proposal ID
    // and converts the returned data into a Javascript object with values we can use
    const fetchProposalById = async (id) => {
        try {
            debugger;
            const provider = await getProviderOrSigner();
            const daoContract = getDaoContractInstance(provider);
            const proposal = await daoContract.proposals(id);
            debugger;
            const parsedProposal = {
                proposalId: id,
                featureRequest: proposal.featureRequest,
                deadline: new Date(parseInt(proposal.deadline.toString()) * 1000),
                yayVotes: proposal.yayVotes.toString(),
                nayVotes: proposal.nayVotes.toString(),
                executed: proposal.executed,
            };
            debugger;
            return parsedProposal;
        } catch (error) {
            console.error(error);
        }
    };

    // Runs a loop `numProposals` times to fetch all proposals in the DAO
    // and sets the `proposals` state variable
    const fetchAllProposals = async () => {
        try {
            const proposals = [];
            debugger;
            for (let i = 0; i < numProposals; i++) {
                debugger;

                const proposal = await fetchProposalById(i);
                debugger;

                proposals.push(proposal);
            }
            debugger;
            setProposals(proposals);
            return proposals;
        } catch (error) {
            console.error(error);
        }
    };

    // Calls the `voteOnProposal` function in the contract, using the passed
    // proposal ID and Vote
    const voteOnProposal = async (proposalId, _vote) => {
        try {
            const signer = await getProviderOrSigner(true);
            const daoContract = getDaoContractInstance(signer);

            let vote = _vote === "YAY" ? 0 : 1;
            const txn = await daoContract.voteOnProposal(proposalId, vote);
            setLoading(true);
            await txn.wait();
            setLoading(false);
            await fetchAllProposals();
        } catch (error) {
            console.error(error);
            window.alert(error.data.message);
        }
    };

    // Calls the `executeProposal` function in the contract, using
    // the passed proposal ID
    const executeProposal = async (proposalId) => {
        try {
            const signer = await getProviderOrSigner(true);
            const daoContract = getDaoContractInstance(signer);
            const txn = await daoContract.executeProposal(proposalId);
            setLoading(true);
            await txn.wait();
            setLoading(false);
            await fetchAllProposals();
        } catch (error) {
            console.error(error);
            window.alert(error.data.message);
        }
    };

    // Helper function to return a DAO Contract instance
    // given a Provider/Signer
    const getDaoContractInstance = (providerOrSigner) => {
        return new Contract(
            DAO_CONTRACT_ADDRESS,
            DAO_CONTRACT_ABI,
            providerOrSigner
        );
    };

    // Helper function to return a FlyTV NFT Contract instance
    // given a Provider/Signer
    const getFlyTVNFTContractInstance = (providerOrSigner) => {
        return new Contract(
            NFT_CONTRACT_ADDRESS,
            NFT_ABI,
            providerOrSigner
        );
    };

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


    /**
     * getTokensToBeClaimed: checks the balance of tokens that can be claimed by the user
     */
    const getTokensToBeClaimed = async () => {
        try {
            // Get the provider from web3Modal, which in our case is MetaMask
            // No need for the Signer here, as we are only reading state from the blockchain
            
            const provider = await getProviderOrSigner();
            // Create an instance of NFT Contract
            const nftContract = new Contract(
                NFT_CONTRACT_ADDRESS,
                NFT_ABI,
                provider
            );
            // Create an instance of tokenContract
            const tokenContract = new Contract(
                TOKEN_CONTRACT_ADDRESS,
                TOKEN_CONTRACT_ABI,
                provider
            );
            // We will get the signer now to extract the address of the currently connected MetaMask account
            const signer = await getProviderOrSigner(true);
            // Get the address associated to the signer which is connected to  MetaMask
            const address = await signer.getAddress();
            // call the balanceOf from the NFT contract to get the number of NFT's held by the user
            const balance = await nftContract.balanceOf(address);
            // balance is a Big number and thus we would compare it with Big number `zero`
            
            if (balance === zero) {
                setTokensToBeClaimed(zero);
            } else {
                
                setShowClaims("show");
                // amount keeps track of the number of unclaimed tokens
                var amount = 0;
                // For all the NFT's, check if the tokens have already been claimed
                // Only increase the amount if the tokens have not been claimed
                // for a an NFT(for a given tokenId)
                for (var i = 0; i < balance; i++) {
                    const tokenId = await nftContract.tokenOfOwnerByIndex(address, i);
                    const claimed = await tokenContract.tokenIdsClaimed(tokenId);
                    if (!claimed) {
                        amount++;
                    }
                }
                //tokensToBeClaimed has been initialized to a Big Number, thus we would convert amount
                // to a big number and then set its value
                setTokensToBeClaimed(BigNumber.from(amount));


                getDAOTreasuryBalance();
                getUserNFTBalance();
                getNumProposalsInDAO();
                getTotalTokensMinted();
            }
        } catch (err) {
            console.error(err);
            setTokensToBeClaimed(zero);
        }
    };

    /**
     * getBalanceOfFlyTVTokens: checks the balance of FlyTV Tokens's held by an address
     */
    const getBalanceOfFlyTVTokens = async () => {
        try {
            // Get the provider from web3Modal, which in our case is MetaMask
            // No need for the Signer here, as we are only reading state from the blockchain
            const provider = await getProviderOrSigner();
            // Create an instace of token contract
            const tokenContract = new Contract(
                TOKEN_CONTRACT_ADDRESS,
                TOKEN_CONTRACT_ABI,
                provider
            );
            // We will get the signer now to extract the address of the currently connected MetaMask account
            const signer = await getProviderOrSigner(true);
            // Get the address associated to the signer which is connected to  MetaMask
            const address = await signer.getAddress();
            // call the balanceOf from the token contract to get the number of tokens held by the user
            const balance = await tokenContract.balanceOf(address);
            // balance is already a big number, so we dont need to convert it before setting it
            setBalanceOfFlyTVTokens(balance);
        } catch (err) {
            console.error(err);
            setBalanceOfFlyTVTokens(zero);
        }
    };

    /**
     * mintFlyTVToken: mints `amount` number of tokens to a given address
     */
    const mintFlyTVToken = async (e: any, amount: any) => {
        e.preventDefault();
        try {
            // We need a Signer here since this is a 'write' transaction.
            // Create an instance of tokenContract
            const signer = await getProviderOrSigner(true);
            // Create an instance of tokenContract
            const tokenContract = new Contract(
                TOKEN_CONTRACT_ADDRESS,
                TOKEN_CONTRACT_ABI,
                signer
            );
            // Each token is of `0.001 ether`. The value we need to send is `0.001 * amount`
            const value = 0.001 * amount;
            const tx = await tokenContract.mint(amount, {
                // value signifies the cost of one crypto dev token which is "0.001" eth.
                // We are parsing `0.001` string to ether using the utils library from ethers.js
                value: utils.parseEther(value.toString()),
            });
            setLoading(true);
            // wait for the transaction to get mined
            await tx.wait();
            setLoading(false);
            window.alert("Sucessfully minted FlyTV Tokens");
            await getBalanceOfFlyTVTokens();
            await getTotalTokensMinted();
            await getTokensToBeClaimed();
        } catch (err) {
            console.error(err);
        }
    };

    /**
     * claimFlyTVTokens: Helps the user claim Fly TV Tokens
     */
    const claimFlyTVTokens = async (e) => {
        e.preventDefault();
        try {
            // We need a Signer here since this is a 'write' transaction.
            // Create an instance of tokenContract
            const signer = await getProviderOrSigner(true);
            // Create an instance of tokenContract
            const tokenContract = new Contract(
                TOKEN_CONTRACT_ADDRESS,
                TOKEN_CONTRACT_ABI,
                signer
            );
            const tx = await tokenContract.claim();
            setLoading(true);
            // wait for the transaction to get mined
            await tx.wait();
            setLoading(false);
            window.alert("Sucessfully claimed FlyTV Tokens");
            await getBalanceOfFlyTVTokens();
            await getTotalTokensMinted();
            await getTokensToBeClaimed();
        } catch (err) {
            console.error(err);
        }
    };

    /**
     * getTotalTokensMinted: Retrieves how many tokens have been minted till now
     * out of the total supply
     */
    const getTotalTokensMinted = async () => {
        try {
            // Get the provider from web3Modal, which in our case is MetaMask
            // No need for the Signer here, as we are only reading state from the blockchain
            const provider = await getProviderOrSigner();
            // Create an instance of token contract
            const tokenContract = new Contract(
                TOKEN_CONTRACT_ADDRESS,
                TOKEN_CONTRACT_ABI,
                provider
            );
            // Get all the tokens that have been minted
            const _tokensMinted = await tokenContract.totalSupply();
            debugger;
            setTokensMinted(_tokensMinted);
            setTokensClaimed(BigNumber.from(_tokensMinted));
        } catch (err) {
            console.error(err);
        }
    };
    /**
     * Returns a Provider or Signer object representing the Ethereum RPC with or without the
     * signing capabilities of metamask attached
     *
     * A `Provider` is needed to interact with the blockchain - reading transactions, reading balances, reading state, etc.
     *
     * A `Signer` is a special type of Provider used in case a `write` transaction needs to be made to the blockchain, which involves the connected account
     * needing to make a digital signature to authorize the transaction being sent. Metamask exposes a Signer API to allow your website to
     * request signatures from the user using Signer functions.
     *
     * @param {*} needSigner - True if you need the signer, default false otherwise
     */
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
                WHITELIST_ABI,
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
                WHITELIST_ABI,
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
            
            // We need a Signer here since this is a 'write' transaction.
            const signer = await getProviderOrSigner(true);
            // Create a new instance of the Contract with a Signer, which allows
            // update methods
            const whitelistContract = new Contract(
                NFT_CONTRACT_ADDRESS,
                NFT_ABI,
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
                NFT_ABI,
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
            const nftContract = new Contract(NFT_CONTRACT_ADDRESS, NFT_ABI, provider);
            // call the presaleStarted from the contract
            const _presaleStarted = await nftContract.presaleStarted();
            if (!_presaleStarted) {
                await getOwner();
            }
            setPresaleStarted(_presaleStarted);

            if (_presaleStarted) {
                getTokensToBeClaimed();
            }
            return _presaleStarted;
        } catch (err) {
            console.error(err);
            return false;
        }
    };

    const selectTab = (e: any, optionValue: any) => {
        e.preventDefault();
        setSelectedTab(optionValue);
        fetchAllProposals();
    }

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
            const nftContract = new Contract(NFT_CONTRACT_ADDRESS, NFT_ABI, provider);
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

    // Render the contents of the appropriate tab based on `selectedTab`
    function renderTabs() {
        if (selectedTab === "Create Proposal") {
            return renderCreateProposalTab();
        } else if (selectedTab === "View Proposals") {
            return renderViewProposalsTab();
        }
        return null;
    }

    const handleOnChangeProposal = (e) => {
        setFeatureRequest(e.target.value);
    };

    // Renders the 'Create Proposal' tab content
    function renderCreateProposalTab() {
        if (loading) {
            return (
                <div className={styles.description}>
                    Loading... Waiting for transaction...
                </div>
            );
        } else if (nftBalance === 0) {
            return (
                <div className={styles.description}>
                    You do not own any FlyTV NFTs. <br/>
                    <b>You cannot create or vote on proposals</b>
                </div>
            );
        } else {
            return (
                <div className={styles.formGroups}>
                    <label htmlFor="featureRequest">Please enter Idea or Feature Request</label>
                    <input
                        type="text"
                        value={featureRequest}
                        name={"featureRequest"}
                        onChange={handleOnChangeProposal}
                        placeholder="Idea or Feature Request"
                    />
                    <button className={styles.submit} onClick={createProposal}>
                        Create
                    </button>
                </div>
            );
        }
    }

    // Renders the 'View Proposals' tab content
    function renderViewProposalsTab() {
        if (loading) {
            return (
                <div className={styles.description}>
                    Loading... Waiting for transaction...
                </div>
            );
        } else if (proposals.length === 0) {
            return (
                <div className={styles.description}>
                    No proposals have been created
                </div>
            );
        } else {
            return (
                <div>
                    {proposals.map((p, index) => (
                        <div key={index} className={styles.proposalCard}>
                            <p>Proposal ID: {p.proposalId}</p>
                            <p>Feature Request/ Ideas proposed: {p.featureRequest}</p>
                            <p>Deadline: {p.deadline.toLocaleString()}</p>
                            <p>Yay Votes: {p.yayVotes}</p>
                            <p>Nay Votes: {p.nayVotes}</p>
                            <p>Executed?: {p.executed.toString()}</p>
                            {p.deadline.getTime() > Date.now() && !p.executed ? (
                                <div className={styles.formGroups}>
                                    <button
                                        className={styles.submit}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            voteOnProposal(p.proposalId, "YAY")
                                        }
                                        }
                                    >
                                        Vote YAY
                                    </button>

                                    <button
                                        className={styles.submit}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            voteOnProposal(p.proposalId, "NAY")
                                        }
                                        }
                                    >
                                        Vote NAY
                                    </button>
                                </div>
                            ) : p.deadline.getTime() < Date.now() && !p.executed ? (
                                <div className={styles.formGroups}>
                                    <button
                                        className={styles.submit}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            executeProposal(p.proposalId);
                                        }
                                        }
                                    >
                                        Execute Proposal{" "}
                                        {p.yayVotes > p.nayVotes ? "(YAY)" : "(NAY)"}
                                    </button>
                                </div>
                            ) : (
                                <div className={styles.description}>Proposal Executed</div>
                            )}
                        </div>
                    ))}
                </div>
            );
        }
    }


    /*
   renderButton: Returns a button based on the state of the dapp
 */
    const renderButton = () => {
        if (walletConnected) {
            if (joinedWhitelist) {
                // @ts-ignore
                // @ts-ignore
                return (
                    <>
                        {isOwner && !presaleStarted &&
                            <div className={styles.formGroups}>
                                <button className={styles.submit} onClick={startFlyTV}>
                                    As a owner Start FlyTV DAO
                                </button>
                            </div>
                        }
                        {presaleStarted && nftBalance <= 0  &&
                            <div className={styles.formGroups}>
                                <button className={styles.submit} onClick={mintBuilderNFT}>
                                    Mint Your Builder NFT!
                                </button>
                            </div>
                        }
                        {/* ToDo: show this after Mint Button is there */}
                        {presaleStarted && nftBalance >= 0 && tokensToBeClaimed.toNumber() > 0 &&
                            <div className={styles.formGroups}>
                                <div className={styles.description}>
                                    {tokensToBeClaimed.toNumber() * 100} Tokens can be claimed!
                                </div>
                                <button className={styles.submit} onClick={claimFlyTVTokens}>
                                    Claim Tokens
                                </button>
                            </div>}
                        {presaleStarted && tokensClaimed > 0 &&
                            <>
                                <div className={styles.formGroups}>
                                    <div className={styles.description}>
                                        Your FlyTV NFT Balance: {nftBalance}
                                        <br/>
                                        Treasury Balance: {formatEther(treasuryBalance)} ETH
                                        <br/>
                                        Total Number of Proposals: {numProposals}
                                    </div>
                                </div>
                                <div className={styles.formGroups}>
                                    <button
                                        className={styles.submit}
                                        onClick={(e) => selectTab(e, "Create Proposal")}
                                    >
                                        Create Proposal
                                    </button>
                                    <button
                                        className={styles.submit}
                                        onClick={(e) => selectTab(e, "View Proposals")}
                                    >
                                        View Proposals
                                    </button>
                                </div>
                                {renderTabs()}
                            </>
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
