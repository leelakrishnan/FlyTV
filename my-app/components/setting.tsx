import { ChangeEvent } from "react";
import { CHAIN_CONFIG, CHAIN_CONFIG_TYPE } from "../config/chainConfig";
import { WEB3AUTH_NETWORK, WEB3AUTH_NETWORK_TYPE } from "../config/web3AuthNetwork";
import styles from "../styles/Home.module.css";
import {useWeb3Auth, Web3AuthContext} from "../services/web3auth";
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from "next/head";

interface IProps {
  setNetwork: (network: WEB3AUTH_NETWORK_TYPE) => void;
  setChain: (chain: CHAIN_CONFIG_TYPE) => void;
}

const Setting = ({ setNetwork, setChain }: IProps) => {
    const { provider, login } = useWeb3Auth();

  const loggedInView = (
      <>
      </>
  );

  const unloggedInView = (
      <>
      <Head>
          <title>Fly TV</title>
          <meta
              name="description"
              content="Home for hackathon"
          />
      </Head>
          <main>
              <div className={styles.hero}>
                  <div className={styles.header}>
                      <h1> FlyTV</h1>
                      <p className={styles.about}>
                          Home for Hackathon.
                      </p>
                  </div>
                  <button onClick={login} className={styles.join}>
                      Login
                  </button>
              </div>
          </main>
      </>
  );

  return <div className={styles.grid}>{provider ? loggedInView : unloggedInView}</div>;
};

export default Setting;
