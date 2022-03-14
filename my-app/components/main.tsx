import { useWeb3Auth } from "../services/web3auth";
import styles from "../styles/Home.module.css";
import { useEffect, useState } from "react";
import Loader from "./Loader";

const Main = () => {
  const {
    provider,
    login,
    logoutWeb3Auth,
    getUserInfo,
    getAccounts,
    getBalance,
    signMessage,
  } = useWeb3Auth();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loadingState, setLoadingState] = useState("not-loaded");

  useEffect(() => {
    if (provider) {
      setIsLoggedIn(true);
    }
    setLoadingState("loaded");
  }, [provider]);

  function localgetUserInfo() {
    getUserInfo();
  }

  const loggedInView = (
    <>
      <button onClick={localgetUserInfo} className={styles.card}>
        Get User Info
      </button>
      <button onClick={getAccounts} className={styles.card}>
        Get Accounts
      </button>
      <button onClick={getBalance} className={styles.card}>
        Get Balance
      </button>
      <button onClick={signMessage} className={styles.card}>
        Sign Message
      </button>
      <button onClick={logoutWeb3Auth} className={styles.card}>
        Log Out
      </button>
      <div className={styles.console} id="console">
        <p className={styles.code}></p>
      </div>
    </>
  );

  const unloggedInView = (
    <button onClick={login} className={styles.card}>
      Press Start
    </button>
  );

  if (loadingState !== "loaded") return <Loader />;

  if (loadingState === "loaded" && isLoggedIn)
    return <div className={styles.grid}>{loggedInView}</div>;

  if (loadingState === "loaded" && !isLoggedIn)
    return <div className={styles.grid}>{unloggedInView}</div>;
};

export default Main;
