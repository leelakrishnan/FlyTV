import "../styles/globals.css";
import type { AppProps } from "next/app";
import {Web3AuthProvider} from "../services/web3auth";
import Setting from "../components/setting";
import {useState} from "react";
import {WEB3AUTH_NETWORK_TYPE} from "../config/web3AuthNetwork";
import {CHAIN_CONFIG_TYPE} from "../config/chainConfig";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function MyApp({ Component, pageProps }: AppProps) {
    const [web3AuthNetwork] = useState<WEB3AUTH_NETWORK_TYPE>("testnet");
    const [chain] = useState<CHAIN_CONFIG_TYPE>("polygon");

    return (
            <Web3AuthProvider chain={chain} web3AuthNetwork={web3AuthNetwork}>
                <Setting />
                <ToastContainer />
                {/*  WRAP THE WHOLE APP TO PROVIDE STATE*/}
                <Component {...pageProps} />
            </Web3AuthProvider>
    )
}

export default MyApp;
