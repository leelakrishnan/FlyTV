import Head from 'next/head';
import styles from '../styles/Home.module.css';
import Nav from '../components/Nav';
import type { NextPage } from 'next';

const MyProfile: NextPage = () => {
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
                <Nav />
                <div className={styles.hero}>
                    <div className={styles.header}>
                        <h1> FlyTV</h1>
                        <p className={styles.about}>
                            Home for Hackathon.
                        </p>
                    </div>

                </div>
                {/* <Footer /> */}
            </main>
        </>
    );
}
export default MyProfile;
