import { useWeb3Auth } from "../services/web3auth";
import {useEffect, useRef, useState} from "react";
import Link from "next/link";
import styles from "../styles/Home.module.css";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { toast } from "react-toastify";
import { useMoralis } from "react-moralis";
import { AvatarPickerDialog, Avatar as AtlaskAvatar } from '@atlaskit/media-avatar-picker';
import { ModalTransition } from '@atlaskit/modal-dialog';
import { Avatar } from "@mui/material";
import Moralis from "moralis";
import { PROFILE_MINT_ADDRESS, PROFILE_MINT_CONTRACT_ABI} from "../constants";
import {Contract, providers, utils} from "ethers";
import Web3Modal from "web3modal";

const avatars: Array<AtlaskAvatar> = [
  {dataURI:'https://ipfs.io/ipfs/bafybeih4oxzw7zfgpokhfk3amxhkkkxkn54xow4uwskdb2nhgnfqqmvbbq'},
  {dataURI:'https://ipfs.io/ipfs/bafybeihxazgvkvu5ql6xy67usboq5t2eb4mntqqmjxbcl3vppaenxtcgb4'},
  {dataURI:'https://ipfs.io/ipfs/bafybeidl2fxdcublvkhtnjyorvdwktz4byyb57md22gcte6cgtgd7ijeme'},
  {dataURI:'https://ipfs.io/ipfs/bafybeibsnh2zxfgwzcjezld2meuv6e3fzhowike2wkodr2u4dverwyoanm'},
  {dataURI:'https://ipfs.io/ipfs/bafybeibdt2iiml5kmzllqiyruy5zzcjjmxqqczzmx7mudyyz5pnfmtzp2u'},
  {dataURI:'https://ipfs.io/ipfs/bafybeidm3jer3h2bflgykurcbtuxoplgswvgmvkbtri3cw5lem3j352hcu'},
  {dataURI:'https://ipfs.io/ipfs/bafybeiaz6vu66ko4qeeapors2ldv7qs7qynl2upaqy6lvnp5wiuqonapku'},
  {dataURI:'https://ipfs.io/ipfs/bafybeibbbuatg37nerjc74xke7lxn2ofzhl4yo7cpinyik7iajt46s7bua'},
  {dataURI:'https://ipfs.io/ipfs/bafybeibhekxlwe3eksmu6ooezlk7qjey256su4lziocjbytgdzm5j2mgrq'},
  {dataURI:'https://ipfs.io/ipfs/bafybeia7sq2hddrgeczaqhkxabkjbr2e5gfyt6ntn5trbxrwhzhu55dfkq'},
  {dataURI:'https://ipfs.io/ipfs/bafybeigyr2oacxcb7ffvoisrfb2tid4u7zzhym3ulkh6laixj4hmf4pzau'},
  {dataURI:'https://ipfs.io/ipfs/bafybeidf3q2xinbfv5ecoxffosliag3n44zax7dbfz4sye5uldtynq7uue'},
  {dataURI:'https://ipfs.io/ipfs/bafybeifqkcwtaxasrxapjlq6ovbrietwp26yfumhxgcoq2wkwjudflxsye'},
  {dataURI:'https://ipfs.io/ipfs/bafybeicg3noennhgwjepstuusxhfo2aigursmq7tdlkwijwln5e5ttos4m'},
  {dataURI:'https://ipfs.io/ipfs/bafybeidd7syfuwaarddndz6wvwzanbjqqwbry5pqfc3l5kwuxtd75xneoq'},
  {dataURI:'https://ipfs.io/ipfs/bafybeibi4xdec4xxy27pbhdcqn5ntvl2wi6qzjcoe4wpuewojjpwa7yuie'},
  {dataURI:'https://ipfs.io/ipfs/bafybeihponuvg6qk2vuna3icnwonnkufzddhj5hfpwxrbdbefnsiqadbhe'},
  {dataURI:'https://ipfs.io/ipfs/bafybeidztsjtlpxuya4exc4vyhqnxxncmsoeprrrd5wo4rkijhyr5rxr2y'},
  {dataURI:'https://ipfs.io/ipfs/bafybeifgjikfedbubmsgppikbl5fccdbjsgitsqgvbk6fhdhcajmrrfhb4'},
  {dataURI:'https://ipfs.io/ipfs/bafybeihx5iloylvzrynibxz77qlsnl44pxh6x3t6y333veikfdqngwwcka'},
  {dataURI:'https://ipfs.io/ipfs/bafybeifocns76bdxzcb2xsro6hweou2d242lne7xuazrqqpnhveeaqxm7a'}
  ];

const Nav = () => {
  const {authenticate, setUserData, user, isAuthenticated, logout} = useMoralis();
  const [loadingState, setLoadingState] = useState("not-loaded");
  const {provider, logoutWeb3Auth, getAccounts} = useWeb3Auth();
  const [walletAddress, setWalletAddress] = useState("not-set");
  const [badges, setBadges] = useState(0);
  const [avatarOpen, setAvatarOpen] = useState(false);
  const [avatar, setAvatar] = useState("");
  // walletConnected keep track of whether the user's wallet is connected or not
  const [walletConnected, setWalletConnected] = useState(false);
  const web3ModalRef = useRef();

  useEffect(() => {
    if (provider) {
      getAccounts().then((result) => {
        if (result && result.length > 0) {
          setWalletAddress(result[0]);
        }
      });
      moralisAuthenticate();
    }
    setLoadingState("loaded");
  }, []);


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
    }
  }, [walletConnected]);

  function mapMoralisUserInfoToStateValues() {
    const badgesValue = user?.get("badges");
    const avatarData = user?.get("avatar");
    if (badgesValue)
      setBadges(badgesValue);

    if (avatarData)
      setAvatar(avatarData);
  }

  useEffect(() => {
    mapMoralisUserInfoToStateValues();
  }, [user && user.id]);

  function logoutFlyTV() {
    logoutWeb3Auth();
    if (isAuthenticated) logout();
  }

  function moralisAuthenticate() {
    if (!isAuthenticated) {
      authenticate().then((result) => {
        console.log(JSON.stringify(result));
      });
    }
  }

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

    } catch (err) {
      console.error(err);
    }
  };

  function copy() {
    toast.success(walletAddress + " copied to clipboard!", {
      position: toast.POSITION.BOTTOM_CENTER,
    });
  }

  function avatarClick(e) {
    e.preventDefault();
    setAvatarOpen(true);
  }

  const changeAvatar = async (selectedAvatar: any) => {

    setAvatar(selectedAvatar.dataURI);
    setUserData({
      avatar: selectedAvatar.dataURI === "" ? undefined : selectedAvatar.dataURI,
    });
    const UserObj = Moralis.Object.extend("User");
    const publicUser = new UserObj();
    const postACL = new Moralis.ACL(Moralis.User.current());
    postACL.setPublicReadAccess(true);
    publicUser.set("id", user.id);
    publicUser.setACL(postACL);
    publicUser.save();

    toast.success(" Profile picture Saved!", {
      position: toast.POSITION.BOTTOM_CENTER,
    });
    setAvatarOpen(false);
    await mintProfileAvatar(selectedAvatar.dataURI);
  }

  const getProviderOrSigner = async (needSigner = false) => {
    // Connect to Metamask
    // Since we store `web3Modal` as a reference, we need to access the `current` value to get access to the underlying object
    // @ts-ignore
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


  const mintProfileAvatar = async (profileUrl: string) => {
    try {
      // We need a Signer here since this is a 'write' transaction.
      // Create an instance of tokenContract
      const signer = await getProviderOrSigner(true);
      // Create an instance of tokenContract
      const profileMintContract = new Contract(
          PROFILE_MINT_ADDRESS,
          PROFILE_MINT_CONTRACT_ABI,
          signer
      );
      const tx = await profileMintContract.mintMyNFT(profileUrl);
      // wait for the transaction to get mined
      await tx.wait();
      window.alert("Sucessfully minted Avatar");
    } catch (err) {
      console.error(err);
    }
  };

  // @ts-ignore
  return (
      <nav>
        <Link href="/MyProfile" passHref>
          <a className={styles.logo}>My Profile</a>
        </Link>
        <Link href="/Hackathon" passHref>
          <a className={styles.logo}>Hackathon</a>
        </Link>
        <div className={styles.rightNav}>
          {loadingState == "loaded" && user && user.id && (
              <button className={styles.connect}>
                <span>Badges {badges}</span>
              </button>
          )}
          {loadingState == "loaded" && walletAddress != "not-set" && (
              <CopyToClipboard text={walletAddress}>
                <button className={styles.connect} onClick={copy}>
                  <span>Copy Wallet To Clipboard</span>
                </button>
              </CopyToClipboard>
          )}
          {loadingState == "loaded" && walletAddress != "not-set" && avatarOpen && (
              <>
                <ModalTransition>
                  <AvatarPickerDialog
                      avatars={avatars}
                      onImagePicked={(selectedImage, crop) => {
                        console.log(selectedImage.size, crop.x, crop.y, crop.size);
                      }}
                      onAvatarPicked={(selectedAvatar) => {
                        changeAvatar(selectedAvatar);
                      }}

                      onCancel={() => setAvatarOpen(false)}
                  />
                </ModalTransition>
              </>
          )}

          {loadingState == "loaded" && (
              <button className={styles.logout} onClick={logoutFlyTV}>
                <span>Log Out</span>
              </button>
          )}
          {loadingState == "loaded" && walletAddress != "not-set" && avatar && (
              <Avatar onClick={avatarClick}
                      alt=""
                      src={avatar}
              />
          )}
          {loadingState == "loaded" && walletAddress != "not-set" && user && !avatar && (
              <Avatar onClick={avatarClick}
                      alt=""
                      src=""
              />
          )}
          {loadingState == "not-loaded" &&
              <div className="loader-center">
                <div className="loader"></div>
              </div>}
          <div className={styles.displayNone} id="console">
            <p className={styles.code}></p>
          </div>
        </div>
      </nav>
  );
};
export default Nav;
