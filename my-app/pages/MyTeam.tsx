import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Nav from "../components/Nav";
import Head from "next/head";
import { useMoralis } from "react-moralis";
import Moralis from "moralis";
import Loader from "../components/Loader";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { Typography } from "@mui/material";
import TeamMission from "../components/TeamMission";
import TeamGithub from "../components/TeamGithub";
import TeamGatherRoom from "../components/TeamGatherRoom";
import TeamAcceptRejectInvitees from "../components/TeamAcceptRejectInvitees";
import TeamVideoDrive from "../components/TeamVideoDrive";
import TeamMultiSigWallet from "../components/TeamMultiSigWallet";
import TeamProjectManagement from "../components/TeamProjectManagement";
import TeamMembers from "../components/TeamMembers";
import TeamFun from "../components/TeamFun";
import Project from "../components/Project";
import TeamDAO from "../components/TeamDAO";
import TeamProjectBlobAsNFT from "../components/TeamProjectBlobAsNFT";

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

//this makes the site more accessible
function a11yProps(index: any) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}
const MyTeam = () => {
  const router = useRouter();
  const { user} =
    useMoralis();
  const [teamId, setTeamId] = useState("");
  const [loading, setLoading] = useState("not-loaded");
  const [teamData, setTeamData] = useState({});
  const [teamLoaded, setTeamLoaded] = useState("not-loaded");

  const { teamQueryId } = router.query;

  useEffect(() => {
    (async () => {
      if (user && user.id) {
        // @ts-ignore
        async function getTeamForUser(userId: string) {
          const Team = Moralis.Object.extend("Team");
          const query = new Moralis.Query(Team);
          query.equalTo("users", userId);
          query
            .find()
            .then(function (results: any) {
              if (results && results[0].id) {
                setTeamId(results[0].id);
                setTeamData(results[0]);
                setTeamLoaded("loaded");
              }
            })
            .catch(function (error) {
              console.log(error);
            });
        }

        // @ts-ignore
        async function getTeamByTeamId(teamId: string) {
          const Team = Moralis.Object.extend("Team");
          const query = new Moralis.Query(Team);
          query.equalTo("objectId", teamId);
          query
            .find()
            .then(function (results: any) {
              if (results && results[0].id) {
                setTeamId(results[0].id);
                setTeamData(results[0]);
                setTeamLoaded("loaded");
              }
            })
            .catch(function (error) {});
        }

        if (teamQueryId) {
          await getTeamByTeamId(teamQueryId);
        } else {
          await getTeamForUser(user.id);
        }
        setLoading("loaded");
      }
    })();
  }, [user]);

  const [value, setValue] = useState(0);

  const handleChange = (event: any, newValue: any) => {
    setValue(newValue);
  };

  // @ts-ignore
  return (
    <>
      <Head>
        <title>Fly TV</title>
        <meta name="description" content="Home for hackathon" />
      </Head>
      <main>
        <Nav />

        {loading == "not-loaded" ? (
          <Loader loaderMessage="Processing..." />
        ) : (
          teamId &&
          teamData &&
          teamLoaded === "loaded" && (
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Tabs value={value} onChange={handleChange} aria-label="My Team">
                <Tab label="Team Info" {...a11yProps(0)} />
                <Tab label="Github" {...a11yProps(1)} />
                <Tab label="GatherTown Space" {...a11yProps(2)} />
                <Tab label="Video Drive" {...a11yProps(3)} />
                <Tab label="Multi Sig Wallet" {...a11yProps(4)} />
                <Tab label="Project Management" {...a11yProps(5)} />
                <Tab label="Team Members" {...a11yProps(6)} />
                <Tab label="Accept Reject Invitees" {...a11yProps(7)} />
                <Tab label="Project Man" {...a11yProps(8)} />
                <Tab label="Mint Project" {...a11yProps(9)} />
                <Tab label="DAO" {...a11yProps(10)} />
                <Tab label="Fun" {...a11yProps(11)} />
              </Tabs>
              <TabPanel value={value} index={0}>
                <TeamMission teamData={teamData} />
              </TabPanel>
              <TabPanel value={value} index={1}>
                <TeamGithub teamData={teamData} />
              </TabPanel>
              <TabPanel value={value} index={2}>
                <TeamGatherRoom teamData={teamData} />
              </TabPanel>
              <TabPanel value={value} index={3}>
                <TeamVideoDrive teamData={teamData} />
              </TabPanel>
              <TabPanel value={value} index={4}>
                <TeamMultiSigWallet teamData={teamData} />
              </TabPanel>
              <TabPanel value={value} index={5}>
                <TeamProjectManagement teamData={teamData} />
              </TabPanel>
              <TabPanel value={value} index={6}>
                <TeamMembers teamData={teamData} />
              </TabPanel>
              <TabPanel value={value} index={7}>
                <TeamAcceptRejectInvitees teamData={teamData} />
              </TabPanel>
              <TabPanel value={value} index={8}>
                <Project teamData={teamData} />
              </TabPanel>
              <TabPanel value={value} index={9}>
                <TeamProjectBlobAsNFT teamData={teamData} />
              </TabPanel>
              <TabPanel value={value} index={10}>
                <TeamDAO teamData={teamData} />
              </TabPanel>
              <TabPanel value={value} index={11}>
                <TeamFun teamData={teamData} />
              </TabPanel>
            </Box>
          )
        )}
        {/* <Footer /> */}
      </main>
    </>
  );
};

export default MyTeam;
