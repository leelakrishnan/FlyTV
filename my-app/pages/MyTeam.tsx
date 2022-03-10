import { useRouter } from "next/router";
import { useEffect } from "react";
import Nav from "../components/Nav";
import Head from "next/head";
import Profile from "../components/Profile";
import styles from "../styles/Home.module.css";

const MyTeam = () => {
    const router = useRouter();
    useEffect(() => {
    }, []);
    return (
        <>
            <Head>
                <title>Fly TV</title>
                <meta
                    name="description"
                    content="Home for hackathon"
                />
            </Head>
            <main>
                <Nav/>
                <div className={styles.hero}>
                    <div className={styles.header}>
                        <h1> My Team</h1>
                    </div>
                </div>
                {/* <Footer /> */}
            </main>
        </>
    );
};

export default MyTeam;
