import styles from "../styles/Home.module.css";
import { useWeb3Auth } from "../services/web3auth";
import Head from "next/head";

const Setting = () => {
  const { provider, login } = useWeb3Auth();

  const loggedInView = <></>;

  const unloggedInView = (
    <>
      <Head>
        <title>Fly TV</title>
        <meta name="description" content="Home for hackathon" />
      </Head>
      <main>
        <div className={styles.hero}>
          <div className={styles.header}>
            <h1> FlyTV</h1>
            <p className={styles.about}>
              Ride the Rocket <br />
              Home for Hackathon. <br />
              🚀 Fly 🛗 Team ✅ V ✌🏽
            </p>
          </div>
          <button onClick={login} className={styles.join}>
            Press Start to Fly
          </button>
        </div>
      </main>
    </>
  );

  return (
    <div className={styles.grid}>
      {provider ? loggedInView : unloggedInView}
    </div>
  );
};

export default Setting;
