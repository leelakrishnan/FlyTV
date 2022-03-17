import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { SetStateAction, useEffect, useState } from "react";
import styles from "../styles/Home.module.css";
import Nav from "../components/Nav";
import { toast } from "react-toastify";
import { useMoralis } from "react-moralis";
import Moralis from "moralis";
import Loader from "../components/Loader";
import MaterialTable from "material-table";
import ReactTooltip from "react-tooltip";

const Team: NextPage = () => {
  const router = useRouter();
  const [selectedOption, setSelectedOption] = useState("");
  const { user, setUserData, userError, isUserUpdating, refetchUserData } =
    useMoralis();
  const [teamId, setTeamId] = useState("");
  const [loading, setLoading] = useState("not-loaded");
  const [teamData, setTeamData] = useState({});
  const [teamLoaded, setTeamLoaded] = useState("not-loaded");
  const [value, setValue] = useState("1");
  const [teamsLooking, setTeamsLooking] = useState([]);
  const [allTeamData, setAllTeamData] = useState({});

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
