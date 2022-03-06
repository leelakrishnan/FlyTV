import { ADAPTER_EVENTS, SafeEventEmitterProvider } from "@web3auth/base";
import type { Web3Auth } from "@web3auth/web3auth";
import { createContext, FunctionComponent, ReactNode, useCallback, useContext, useEffect, useState } from "react";
import { CHAIN_CONFIG, CHAIN_CONFIG_TYPE } from "../config/chainConfig";
import { WEB3AUTH_NETWORK_TYPE } from "../config/web3AuthNetwork";
import { getWalletProvider, IWalletProvider } from "./walletProvider";
import { useRouter } from 'next/router'
import Web3 from "web3";

export interface IWeb3AuthContext {
    web3Auth: Web3Auth | null;
    provider: IWalletProvider | null;
    isLoading: boolean;
    user: unknown;
    login: () => Promise<void>;
    logout: () => Promise<void>;
    getUserInfo: () => Promise<any>;
    signMessage: () => Promise<any>;
    getAccounts: () => Promise<any>;
    getBalance: () => Promise<any>;
}

export const Web3AuthContext = createContext<IWeb3AuthContext>({
    web3Auth: null,
    provider: null,
    isLoading: false,
    user: null,
    login: async () => {},
    logout: async () => {},
    getUserInfo: async () => {},
    signMessage: async () => {},
    getAccounts: async () => {},
    getBalance: async () => {},
});

export function useWeb3Auth() {
    return useContext(Web3AuthContext);
}

interface IWeb3AuthState {
    web3AuthNetwork: WEB3AUTH_NETWORK_TYPE;
    chain: CHAIN_CONFIG_TYPE;
}
interface IWeb3AuthProps {
    children?: ReactNode;
    web3AuthNetwork: WEB3AUTH_NETWORK_TYPE;
    chain: CHAIN_CONFIG_TYPE;
}

export const Web3AuthProvider: FunctionComponent<IWeb3AuthState> = ({ children, web3AuthNetwork, chain }: IWeb3AuthProps) => {
    const [web3Auth, setWeb3Auth] = useState<Web3Auth | null>(null);
    const [provider, setProvider] = useState<IWalletProvider | null>(null);
    const [user, setUser] = useState<unknown | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter()
    const setWalletProvider = useCallback(
        (web3authProvider: SafeEventEmitterProvider) => {
            const walletProvider = getWalletProvider(chain, web3authProvider, uiConsole);
            setProvider(walletProvider);
            newGetAccount(walletProvider).then(
                (message) => {
                    debugger;
                }
            )
            debugger
        },
        [chain]
    );

    async function newGetAccount(walletProvider: any) {
        try {
            const web3 = new Web3(walletProvider as any);
            const accounts = await web3.eth.getAccounts();
            uiConsole("Eth accounts", accounts);
            debugger;
            return accounts;
        } catch (error) {
            console.error("Error", error);
            uiConsole("error", error);
        }
    };

    useEffect(() => {
        const subscribeAuthEvents = (web3auth: Web3Auth) => {
            // Can subscribe to all ADAPTER_EVENTS and LOGIN_MODAL_EVENTS
            web3auth.on(ADAPTER_EVENTS.CONNECTED, (data: unknown) => {
                console.log("Yeah!, you are successfully logged in", data);
                setUser(data);
                setWalletProvider(web3auth.provider!);

                router.push("/MyProfile");
            });

            web3auth.on(ADAPTER_EVENTS.CONNECTING, () => {
                console.log("connecting");
            });

            web3auth.on(ADAPTER_EVENTS.DISCONNECTED, () => {
                console.log("disconnected");
                setUser(null);
            });

            web3auth.on(ADAPTER_EVENTS.ERRORED, (error) => {
                console.error("some error or user has cancelled login request", error);
            });
        };

        const currentChainConfig = CHAIN_CONFIG[chain];

        async function newGetAccount() {
            try {
                const web3 = new Web3(provider as any);
                const accounts = await web3.eth.getAccounts();
                uiConsole("Eth accounts", accounts);
                return accounts;
            } catch (error) {
                console.error("Error", error);
                uiConsole("error", error);
            }
        };

        async function init() {
            try {
                const { Web3Auth } = await import("@web3auth/web3auth");
                const { OpenloginAdapter } = await import("@web3auth/openlogin-adapter");
                const clientId = "BKPxkCtfC9gZ5dj-eg-W6yb5Xfr3XkxHuGZl2o2Bn8gKQ7UYike9Dh6c-_LaXlUN77x0cBoPwcSx-IVm0llVsLA";
                setIsLoading(true);
                const web3AuthInstance = new Web3Auth({
                    chainConfig: currentChainConfig,
                    // get your client id from https://dashboard.web3auth.io
                    clientId,
                });

                const adapter = new OpenloginAdapter({ adapterSettings: { network: web3AuthNetwork, clientId } });
                web3AuthInstance.configureAdapter(adapter);
                subscribeAuthEvents(web3AuthInstance);
                setWeb3Auth(web3AuthInstance);
                await web3AuthInstance.initModal();
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        }
        init();
    }, [chain, web3AuthNetwork, setWalletProvider]);

    const login = async () => {
        if (!web3Auth) {
            console.log("web3auth not initialized yet");
            uiConsole("web3auth not initialized yet");
            return;
        }
        const localProvider = await web3Auth.connect();
        setWalletProvider(localProvider!);
    };

    const logout = async () => {
        if (!web3Auth) {
            console.log("web3auth not initialized yet");
            uiConsole("web3auth not initialized yet");
            return;
        }
        await web3Auth.logout();
        setProvider(null);
        router.push("/");
    };

    const getUserInfo = async () => {
        if (!web3Auth) {
            console.log("web3auth not initialized yet");
            uiConsole("web3auth not initialized yet");
            return;
        }
        const user = await web3Auth.getUserInfo();
        uiConsole(user);
        return user;
    };

    const getAccounts = async () => {
        if (!provider) {
            console.log("provider not initialized yet");
            uiConsole("provider not initialized yet");
            return;
        }
        const accounts = await provider.getAccounts();
        return accounts;
    };

    const getBalance = async () => {
        if (!provider) {
            console.log("provider not initialized yet");
            uiConsole("provider not initialized yet");
            return;
        }
        provider.getBalance();
    };

    const signMessage = async () => {
        if (!provider) {
            console.log("provider not initialized yet");
            uiConsole("provider not initialized yet");
            return;
        }
        provider.signMessage();
    };

    const uiConsole = (...args: unknown[]): void => {
        const el = document.querySelector("#console>p");
        if (el) {
            el.innerHTML = JSON.stringify(args || {}, null, 2);
        }
    };

    const contextProvider = {
        web3Auth,
        provider,
        user,
        isLoading,
        login,
        logout,
        getUserInfo,
        getAccounts,
        getBalance,
        signMessage,
    };
    return <Web3AuthContext.Provider value={contextProvider}>{children}</Web3AuthContext.Provider>;
};
