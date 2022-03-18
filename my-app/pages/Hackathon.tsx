import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import {  useEffect } from "react";
import styles from "../styles/Home.module.css";
import Nav from "../components/Nav";
import { useMoralis } from "react-moralis";
import ReactTooltip from "react-tooltip";

const Team: NextPage = () => {
  const router = useRouter();
  const { user} =
    useMoralis();

  useEffect(() => {}, [user]);

  function takeToTeam(e: any) {
    e.preventDefault();
    router.push("/Team");
  }
  // @ts-ignore
  return (
    <>
      <Head>
        <title>Hackathon Fly TV</title>
        <meta name="description" content="Hackathon Home for hackathon" />
      </Head>
      <main>
        <Nav />
        <div className={styles.pagetooltip}>
          <a data-tip=' At the entrance to many hackathons, we ask the question:
              How many hackathons can you be in at once? Each Hackathon
              is different, so are the Admin who can access to commit their
              terms and conditions
              main missions, and adjust the required profile fields and
              milestones.'>Help</a>
          <ReactTooltip className='extraClass' delayHide={1000} effect='solid'/>
        </div>
        <div className={styles.hero}>
          <div className={styles.container2} style={{ height: "500px" }}>
            <div className={styles.container3}>
              <button
                className={styles.teamjoin}
                onClick={(e) => {
                  takeToTeam(e);
                }}
              >
                Faber Hackathon 🚀 <br /> Stellar Hackathon
              </button>
              <button
                className={styles.teamjoin}
                onClick={(e) => {
                  takeToTeam(e);
                }}
              >
                wen slackathon nft?
              </button>
              <button
                className={styles.teamjoin}
                onClick={(e) => {
                  takeToTeam(e);
                }}
              >
                web3 💡 meta-hackathon: <br /> a hackathon about __________
              </button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};
export default Team;
