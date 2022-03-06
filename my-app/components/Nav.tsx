import {useWeb3Auth} from "../services/web3auth";
import {useEffect, useState} from "react";
import Link from 'next/link';
import styles from '../styles/Home.module.css';
import {CopyToClipboard} from "react-copy-to-clipboard";
import { toast } from 'react-toastify';

const Nav = () => {
    const [loadingState, setLoadingState] = useState("not-loaded");
    const {provider,logout, getAccounts} = useWeb3Auth();
    const [walletAddress, setWalletAddress] = useState("not-set");

    useEffect(() => {
        if (provider) {
            getAccounts().then(
                (result) => {
                    if (result && result.length > 0) {
                        setWalletAddress(result[0]);
                    }
                }
            )
        }
        setLoadingState('loaded');
    }, []);

    function copy() {
        toast.success(walletAddress +  " copied to clipboard!", {
            position: toast.POSITION.BOTTOM_CENTER,
        });
    }

    return (
        <nav>
            <Link href="/" passHref>
                <a className={styles.logo}>My Profile</a>
            </Link>
            <div className={styles.rightNav}>

                {loadingState == 'loaded' && walletAddress != 'not-set' &&
                    <CopyToClipboard text={walletAddress}>
                        <button className={styles.connect} onClick={copy}>
                            <span>Copy Wallet To Clipboard</span>
                        </button>
                    </CopyToClipboard>
                }
                {loadingState == 'loaded' &&
                    <button className={styles.logout} onClick={logout}>
                        <span>Log Out</span>
                    </button>
                }
                <div className={styles.displayNone} id="console">
                    <p className={styles.code}></p>
                </div>
            </div>
        </nav>
    );
};
export default Nav;
