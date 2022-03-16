import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import {SetStateAction, useEffect, useState} from "react";
import styles from "../styles/Home.module.css";
import Nav from "../components/Nav";
import { toast } from "react-toastify";
import {useMoralis} from "react-moralis";
import Moralis from "moralis";
import Loader from "../components/Loader";
import MaterialTable from "material-table";

const Team: NextPage = () => {
    const router = useRouter();
    const [selectedOption, setSelectedOption] = useState("");
    const {user, setUserData, userError, isUserUpdating, refetchUserData} = useMoralis();
    const [teamId, setTeamId] = useState("");
    const [loading, setLoading] = useState("not-loaded");
    const [teamData, setTeamData] = useState({});
    const [teamLoaded, setTeamLoaded] = useState("not-loaded");
    const [value, setValue] = useState("1");
    const [teamsLooking, setTeamsLooking] = useState([]);
    const columns = [
        {title: 'TeamName', field: 'teamName'},
        {title: 'TeamMission', field: 'mission'},
        {title: 'TeamVision', field: 'vision'}
    ];
    useEffect(() => {
        (async () => {
            if (user && user.id) {
                // @ts-ignore
                async function getTeamForUser(userId: string) {
                    const Team = Moralis.Object.extend("Team");
                    const query = new Moralis.Query(Team);
                    query.equalTo("users", userId);
                    query.find()
                        .then(function (results: any) {
                            if (results && results[0].id) {
                                setTeamId(results[0].id);
                                setTeamData(results[0]);
                                setTeamLoaded("loaded");
                            }
                        })
                        .catch(function (error) {
                            setTeamLoaded("loaded");
                        });
                }

                await getTeamForUser(user.id);
                setLoading("loaded");
            }
        })();
    }, [user]);

    function takeToMyTeam(e: any) {
        e.preventDefault();
        router.push('/MyTeam');
    }


    const handleTeamCreateChange = (e: { target: { value: SetStateAction<string>; }; }) => {
        setValue(e.target.value);
    };

    const createTeam = async () => {
        const Team = Moralis.Object.extend("Team");
        const publicTeam = new Team();
        const postACL = new Moralis.ACL(Moralis.User.current());
        postACL.setPublicReadAccess(true);
        publicTeam.set("users", [user.id.toString()]);
        publicTeam.setACL(postACL);

        publicTeam.save();
        toast.success("Team Created!", {
            position: toast.POSITION.BOTTOM_CENTER,
        });
        router.push('/MyTeam');
    }

    async function getTeamsLookingForTeamMebers() {
        const Team = Moralis.Object.extend("Team");
        const query = new Moralis.Query(Team);
        return query.find();
    }

    const searchTeam = async () => {
        const teamData = await getTeamsLookingForTeamMebers();
        if (teamData && teamData.length > 0) {
            let teamsFilteredData = [];

            for (let i = 0; i < teamData.length; i++) {
                const teamName = teamData[i]?.get("teamName");
                const lookingForTeamMembers = teamData[i]?.get("lookingForTeamMembers");

                if (teamName && lookingForTeamMembers) {
                    let teamName = teamData[i]?.get("teamName") ? teamData[i]?.get("teamName") : "";
                    let mission = teamData[i]?.get("mission") ? teamData[i]?.get("mission") : "";
                    let vision = teamData[i]?.get("vision") ? teamData[i]?.get("vision") : "";

                    teamsFilteredData.push({
                        teamName: teamName,
                        mission: mission,
                        vision: vision
                    });
                }
            }
            // @ts-ignore
            setTeamsLooking(teamsFilteredData);
            debugger;
        }
    }

    const createOrApplyTeam = async (e) => {
        e.preventDefault();
        switch (value) {
            case '1':
                await searchTeam();
                break;
            case '2':
                await createTeam();
                break;
            case '3':
                await createTeam();
                break;
            case '4':
                await createTeam();
                break;
            default:
        }
    }

    // @ts-ignore
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
                    <div className={styles.container2} style={{height: "500px"}}>
                        <div className={styles.container3}>
                            {loading == "not-loaded" &&
                                <Loader loaderMessage="Processing..."/>
                            }
                            {loading == "loaded" && teamId && teamData && teamLoaded === "loaded" &&
                                <button
                                    className={styles.join}
                                    onClick={(e) => {
                                        takeToMyTeam(e);
                                    }}
                                >
                                    Take to My Team
                                </button>
                            }
                            {loading == "loaded" && teamId === "" && teamLoaded === "loaded" &&
                                <>
                                    <div className={styles.teamGroups}>
                                        <select value={value} onChange={handleTeamCreateChange}>
                                            <option value="1">I am looking for a team to join</option>
                                            <option value="2">I am hacking alone want to create a team</option>
                                            <option value="3">I have my own team members want to create a team</option>
                                        </select>
                                        <button
                                            className={styles.join}
                                            onClick={(e) => {
                                                createOrApplyTeam(e);
                                            }}
                                        >
                                            Create/Apply Team
                                        </button>
                                    </div>
                                    {teamsLooking.length > 0 &&
                                        <div className={styles.teamGroups}>
                                            <>
                                                <div className={styles.allTribes}>
                                                    <MaterialTable
                                                        title="Team members"
                                                        columns={columns}
                                                        data={teamsLooking}
                                                    />
                                                </div>
                                            </>
                                        </div>
                                    }
                                </>
                            }
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
};
export default Team;
