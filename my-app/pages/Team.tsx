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

  const columns = [
    { title: "TeamName", field: "teamName" },
    { title: "TeamMission", field: "mission" },
    { title: "TeamVision", field: "vision" },
    { title: "TeamId", field: "teamId" },
  ];
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
    router.push("/MyTeam");
  }

  const handleTeamCreateChange = (e: {
    target: { value: SetStateAction<string> };
  }) => {
    setValue(e.target.value);
  };

  const createTeam = async () => {
    const Team = Moralis.Object.extend("Team");
    const publicTeam = new Team();
    const teamACL = new Moralis.ACL(Moralis.User.current());
    teamACL.setPublicReadAccess(true);
    publicTeam.set("users", [user.id.toString()]);
    publicTeam.setACL(teamACL);

    publicTeam.save();
    toast.success("Team Created!", {
      position: toast.POSITION.BOTTOM_CENTER,
    });
    router.push("/MyTeam");
  };

  async function getTeamsLookingForTeamMebers() {
    const Team = Moralis.Object.extend("Team");
    const query = new Moralis.Query(Team);
    return query.find();
  }

  async function getTeamInvitesByTeamId(teamId: string) {
    const TeamInvitees = Moralis.Object.extend("TeamInvitees");
    const query = new Moralis.Query(TeamInvitees);
    query.equalTo("teamId", teamId);
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
          let teamName = teamData[i]?.get("teamName")
            ? teamData[i]?.get("teamName")
            : "";
          let mission = teamData[i]?.get("mission")
            ? teamData[i]?.get("mission")
            : "";
          let vision = teamData[i]?.get("vision")
            ? teamData[i]?.get("vision")
            : "";
          let teamId = teamData[i]?.id ? teamData[i]?.id : "";
          teamsFilteredData.push({
            teamName: teamName,
            mission: mission,
            vision: vision,
            teamId: teamId,
          });
        }
      }
      setAllTeamData(teamData);
      // @ts-ignore
      setTeamsLooking(teamsFilteredData);
      debugger;
    }
  };

  const createOrApplyTeam = async (e) => {
    e.preventDefault();
    switch (value) {
      case "1":
        await searchTeam();
        break;
      case "2":
        await createTeam();
        break;
      case "3":
        await createTeam();
        break;
      case "4":
        await createTeam();
        break;
      default:
    }
  };

  const sendInvite = async (event: any, rowData: any) => {
    let currentTeamId = rowData?.teamId;

    if (allTeamData && currentTeamId) {
      let currentTeam = {};
      for (let i = 0; i < allTeamData.length; i++) {
        const teamId = allTeamData[i]?.id;
        if (teamId == currentTeamId) {
          currentTeam = allTeamData[i];
          break;
        }
      }

      debugger;

      if (currentTeam) {
        const TeamInvitees = Moralis.Object.extend("TeamInvitees");
        const publicTeamInvitees = new TeamInvitees();
        const teamInviteesACL = new Moralis.ACL(Moralis.User.current());
        teamInviteesACL.setPublicReadAccess(true);
        publicTeamInvitees.set("teamId", currentTeamId);

        const teamInvitees = await getTeamInvitesByTeamId(currentTeamId);
        let invitees = [];
        if (teamInvitees && teamInvitees.length > 0) {
          let currentInvitees = teamInvitees[0]?.get("invitees");
          if (currentInvitees && currentInvitees.length > 0) {
            for (let j = 0; j < currentInvitees.length; j++) {
              const existingInvitee = currentInvitees[j];
              if (existingInvitee == user.id) {
                toast.success(
                  "Invitation Already Sent! to Team " + rowData.teamName,
                  {
                    position: toast.POSITION.BOTTOM_CENTER,
                  }
                );
                return;
              }
            }
            invitees = currentInvitees;
            invitees.push(user.id);
          }
          publicTeamInvitees.set("id", teamInvitees[0].id);
        } else {
          invitees.push(user.id);
        }
        publicTeamInvitees.set("invitees", invitees);
        publicTeamInvitees.setACL(teamInviteesACL);
        publicTeamInvitees.save();

        toast.success("Invitation Sent! to Team " + rowData.teamName, {
          position: toast.POSITION.BOTTOM_CENTER,
        });
      }
    }
  };

  function checkTeam(event: any, rowData: any) {
    event.preventDefault();
    router.push("http://localhost:3000/MyTeam?teamQueryId=" + rowData.teamId);
  }

  // @ts-ignore
  return (
    <>
      <Head>
        <title>Team Fly TV</title>
        <meta name="description" content="Team for hackathon" />
      </Head>
      <main>
        <Nav />
        <div className={styles.hero}>
          <div className={styles.container2} style={{ height: "500px" }}>
            <div className={styles.container3}>
              {loading == "not-loaded" && (
                <Loader loaderMessage="Processing..." />
              )}
              {loading == "loaded" &&
                teamId &&
                teamData &&
                teamLoaded === "loaded" && (
                  <>
                    <div className="descriptions">
                      You are only seeing this page because you already <br />{" "}
                      have a team. What would it be helpful to see here? <br />{" "}
                      "_ new messages 💌" <br /> or money waiting <br />
                      or current proposals needing voting? yes to all?
                    </div>
                    <button
                      className={styles.join}
                      onClick={(e) => {
                        takeToMyTeam(e);
                      }}
                    >
                      Take to My Team
                    </button>
                  </>
                )}
              {loading == "loaded" && teamId === "" && teamLoaded === "loaded" && (
                <>
                  <div className="descriptions">
                    {" "}
                    You are only seeing this page because you don't have a team
                    yet <br />
                    This simple page is designed to streamline the process of
                    getting a team together <br />
                    we can programmatically require signing{" "}
                    <a href="https://github.com/leelakrishnan/FlyTV/issues/58">
                      Team Terms and Conditions
                    </a>{" "}
                    before joining a team
                  </div>
                  <div className={styles.teamGroups}>
                    <select value={value} onChange={handleTeamCreateChange}>
                      <option value="1">I am looking for a team to join</option>
                      <option value="2">
                        I am hacking alone want to create a team
                      </option>
                      <option value="3">
                        I have my own team members want to create a team
                      </option>
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
                  {teamsLooking.length > 0 && (
                    <div className={styles.teamGroups}>
                      <>
                        <div className={styles.allTribes}>
                          <MaterialTable
                            title="Team members"
                            columns={columns}
                            data={teamsLooking}
                            actions={[
                              {
                                icon: "Send Invite",
                                tooltip: "Send Invite",
                                onClick: (event, rowData) => {
                                  console.dir(rowData);
                                  sendInvite(event, rowData);
                                },
                              },
                              {
                                icon: "CheckTeam",
                                tooltip: "CheckTeam",
                                onClick: (event, rowData) => {
                                  console.dir(rowData);
                                  checkTeam(event, rowData);
                                },
                              },
                            ]}
                          />
                        </div>
                      </>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
};
export default Team;
