import { useRouter } from "next/router";
import {useEffect, useState} from "react";
import Nav from "../components/Nav";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import {useMoralis} from "react-moralis";
import Moralis from "moralis";
import Loader from "../components/Loader";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { Button, Container, Stack, TextField, Typography } from "@mui/material";
import Profile from "../components/Profile";
import TeamMission from "../components/TeamMission";
import TeamGithub from "../components/TeamGithub";

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

function a11yProps(index: any) {
    return {
        id: `simple-tab-${index}`,
        "aria-controls": `simple-tabpanel-${index}`,
    };
}
const MyTeam = () => {
    const router = useRouter();
    const {user, setUserData, userError, isUserUpdating, refetchUserData} = useMoralis();
    const [teamId, setTeamId] = useState("");
    const [loading, setLoading] = useState("not-loaded");
    const [teamData, setTeamData] = useState({});
    const [teamLoaded, setTeamLoaded] = useState("not-loaded");

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
                            debugger;
                        });
                }

                await getTeamForUser("NUvcIkTFL8shCKYa2vbxtLmJ");
                setLoading("loaded");
            }
        })();
    }, [user]);

    const [value, setValue] = useState(0);

    const handleChange = (event: any, newValue: any) => {
        setValue(newValue);
    };

    const handleTeamMission = async (values: any) => {
        try {
            debugger;
        } catch (error) {
            console.log(error);
        }
        console.log(values);
    }

    const handleGitHub = async (values: any) => {
        try {
            debugger;
        } catch (error) {
            console.log(error);
        }
        console.log(values);
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
                {loading == "not-loaded" ? (
                    <Loader loaderMessage="Processing..."/>
                ) : teamId && teamData && teamLoaded === "loaded"  && (
                    <Box sx={{borderBottom: 1, borderColor: "divider"}}>
                        <Tabs
                            value={value}
                            onChange={handleChange}
                            aria-label="My Team"
                        >
                            <Tab label="Team Mission" {...a11yProps(0)} />
                            <Tab label="Github" {...a11yProps(1)} />
                        </Tabs>
                        <TabPanel value={value} index={0}>
                            <TeamMission teamData={teamData} />
                        </TabPanel>
                        <TabPanel value={value} index={1}>
                            <TeamGithub teamData={teamData}  />
                        </TabPanel>
                    </Box>
                )}
                {/* <Footer /> */}
            </main>
        </>
    );
};

export default MyTeam;
