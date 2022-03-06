import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import {Web3AuthContext, Web3AuthProvider} from '../services/web3auth';
import { CHAIN_CONFIG_TYPE } from "../config/chainConfig";
import { WEB3AUTH_NETWORK_TYPE } from "../config/web3AuthNetwork";
import Setting from "../components/setting";
import { useState } from "react";
const Home: NextPage = () => {
    const [web3AuthNetwork, setWeb3AuthNetwork] = useState<WEB3AUTH_NETWORK_TYPE>("mainnet");
    const [chain, setChain] = useState<CHAIN_CONFIG_TYPE>("mainnet");

    return (
        <div className={styles.container}>
            <Web3AuthProvider chain={chain} web3AuthNetwork={web3AuthNetwork}>
                <Setting setNetwork={setWeb3AuthNetwork} setChain={setChain} />
            </Web3AuthProvider>
            <footer className={styles.footer}>
            </footer>
        </div>
    );
};

export default Home;
