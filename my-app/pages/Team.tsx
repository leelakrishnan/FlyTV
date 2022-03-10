import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import {useEffect, useState} from "react";
import styles from "../styles/Home.module.css";
import Nav from "../components/Nav";
import { toast } from "react-toastify";

const Team: NextPage = () => {
    const router = useRouter();
    const [selectedOption, setSelectedOption] = useState("");

    useEffect(() => {
    }, []);

    function joinTeam() {
        router.push('/MyTeam');
    }

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
                        <h5>Looking to join a team</h5>
                        <h6 className={styles.about}>
                            FlyTV allows you to join team and find people with
                            common goals and interests
                        </h6>
                        <select
                            value={selectedOption}
                            onChange={(e) => {
                                setSelectedOption(e.target.value);
                            }}
                        >
                            <option value="lookingForATeam">I am looking for a team to join</option>
                            <option value="hackingAlone">I am hacking alone and want to create team</option>
                            <option value="havingOwnTeam">I am having my own team members and want to create team</option>
                        </select>
                        <button
                            className={styles.join}
                            onClick={() => {
                                joinTeam();
                            }}
                        >
                            Create or Join Team
                        </button>
                    </div>
                </div>
            </main>
        </>
    );
};
export default Team;
