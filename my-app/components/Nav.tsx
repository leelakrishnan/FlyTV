import * as React from "react";
import { useRouter } from "next/router";
import {useWeb3Auth} from "../services/web3auth";
import {useEffect, useState} from "react";
import Link from 'next/link';
import styles from '../styles/Home.module.css';
import {CopyToClipboard} from "react-copy-to-clipboard";
import { toast } from 'react-toastify';

const Nav = () => {
    const router = useRouter();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loadingState, setLoadingState] = useState("not-loaded");
    const {provider, login, user, logout, getUserInfo, getAccounts, getBalance, signMessage} = useWeb3Auth();
    const [walletAddress, setWalletAddress] = useState("not-set");

    useEffect(() => {
        debugger;
        if (provider) {
            setIsLoggedIn(true);
        }
        setLoadingState('loaded');
    }, []);

    function copy() {
        toast.success("copied to clipboard!", {
            position: toast.POSITION.BOTTOM_CENTER,
        });
    }

    function showAddressQR() {

    }

    function getUserInfoCall() {
        getUserInfo().then(
            (message) => {
                debugger;
            }
        )

        getAccounts().then(
            (message) => {
                debugger;
            }
        )

    }

    return (

        <nav>
            <Link href="/" passHref>
                <a className={styles.logo}>My Profile</a>
            </Link>
            <div className={styles.rightNav}>

                <CopyToClipboard text={walletAddress}>
                    <button className={styles.connect} onClick={copy}>
                        <span>Copy Wallet To Clipboard</span>
                    </button>
                </CopyToClipboard>
                <button className={styles.logout} onClick={showAddressQR}>
                    <span>Address QR</span>
                </button>
                <button className={styles.logout} onClick={logout}>
                    <span>Log Out</span>
                </button>
            </div>
        </nav>
    );
};
export default Nav;
