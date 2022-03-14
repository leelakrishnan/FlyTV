import { useWeb3Auth } from "../services/web3auth";
import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "../styles/Home.module.css";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { toast } from "react-toastify";
import { useMoralis } from "react-moralis";

const Nav = () => {
  const { authenticate, user, isAuthenticated, logout } = useMoralis();
  const [loadingState, setLoadingState] = useState("not-loaded");
  const { provider, logoutWeb3Auth, getAccounts } = useWeb3Auth();
  const [walletAddress, setWalletAddress] = useState("not-set");

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

  function copy() {
    toast.success(walletAddress + " copied to clipboard!", {
      position: toast.POSITION.BOTTOM_CENTER,
    });
  }

  return (
    <nav>
      <Link href="/MyProfile" passHref>
        <a className={styles.logo}>My Profile</a>
      </Link>
      <Link href="/MyTeam" passHref>
        <a className={styles.logo}>MyTeam</a>
      </Link>
      <Link href="/ProjectMan" passHref>
        <a className={styles.logo}>ProjectMan</a>
      </Link>
      <div className={styles.rightNav}>
        {loadingState == "loaded" && walletAddress != "not-set" && (
          <CopyToClipboard text={walletAddress}>
            <button className={styles.connect} onClick={copy}>
              <span>Copy Wallet To Clipboard</span>
            </button>
          </CopyToClipboard>
        )}
        {loadingState == "loaded" && (
          <button className={styles.logout} onClick={logoutFlyTV}>
            <span>Log Out</span>
          </button>
        )}
        <div className={styles.displayNone} id="console">
          <p className={styles.code}></p>
        </div>
      </div>
    </nav>
  );
};
export default Nav;
