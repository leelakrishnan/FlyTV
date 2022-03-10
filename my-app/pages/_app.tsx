import "../styles/globals.css";
import type { AppProps } from "next/app";
import {Web3AuthProvider} from "../services/web3auth";
import Setting from "../components/setting";
import {useState} from "react";
import {WEB3AUTH_NETWORK_TYPE} from "../config/web3AuthNetwork";
import {CHAIN_CONFIG_TYPE} from "../config/chainConfig";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { MoralisProvider } from "react-moralis";

function MyApp({ Component, pageProps }: AppProps) {
    const [web3AuthNetwork] = useState<WEB3AUTH_NETWORK_TYPE>("testnet");
    const [chain] = useState<CHAIN_CONFIG_TYPE>("polygon");

    if (!process.env.NEXT_PUBLIC_MORALIS_APP_ID || !process.env.NEXT_PUBLIC_MORALIS_SERVER_URL) {
        return (
            <>
                <h1>Moralis server not configured</h1>
                <h3>Consult a dev on the team for the environmental variables</h3>
            </>
        )
    }

    if (!process.env.WEB3AUTH_CLIENT_ID) {
        return (
            <>
                <h1>Web 3 Auth not configured</h1>
                <h3>Consult a dev on the team for the environmental variables</h3>
            </>
        )
    }

    return (
        <>
            <MoralisProvider
                appId={process.env.NEXT_PUBLIC_MORALIS_APP_ID || ""}
                serverUrl={process.env.NEXT_PUBLIC_MORALIS_SERVER_URL || ""}
                initializeOnMount={true}
            >
                <Web3AuthProvider chain={chain} web3AuthNetwork={web3AuthNetwork}>
                    <Setting/>
                    <ToastContainer/>
                    {/*  WRAP THE WHOLE APP TO PROVIDE STATE*/}
                    <Component {...pageProps} />
                </Web3AuthProvider>
            </MoralisProvider>
        </>
    )
}

export default MyApp;
