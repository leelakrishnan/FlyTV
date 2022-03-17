import { useState, useEffect } from "react";
import { useMoralis } from "react-moralis";
import { toast } from "react-toastify";
import styles from "../styles/Form.module.css";
import { useRouter } from "next/router";
import Moralis from "moralis";
import MaterialTable from "material-table";

type Props = {
  teamData: any;
};

const TeamAcceptRejectInvitees = ({ teamData }: Props) => {
  const router = useRouter();

  const [formValues, setFormValues] = useState({
    gatherRoom: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { user, setUserData, userError, isUserUpdating, refetchUserData } =
    useMoralis();
  const [loader, setLoader] = useState("not-loaded");
  const [columns, setColumns] = useState([]);
  const [data, setData] = useState([]);

  useEffect(() => {
    loadTeamInviteesInfo();
  }, [user]);

  function loadTeamInviteesInfo() {
    async function getTeamInviteesByTeamId(teamId: string) {
      const TeamInvitees = Moralis.Object.extend("TeamInvitees");
      const query = new Moralis.Query(TeamInvitees);
      query.equalTo("teamId", teamId);
      const teamInviteesData = await query.find({ useMasterKey: true });

      setColumns([
        { title: "UserInfo", field: "userInfo" },
        { title: "UserId", field: "userId" },
      ]);

      let currentInviteesData = [];
      if (teamInviteesData && teamInviteesData.length > 0) {
        let invitees = teamInviteesData[0]?.get("invitees")
          ? teamInviteesData[0]?.get("invitees")
          : [];
        for (let i = 0; i < invitees.length; i++) {
          currentInviteesData.push({
            userInfo:
              "http://localhost:3000/MyProfile?profileId=" + invitees[i],
            userId: invitees[i],
          });
        }
      }
      setData(currentInviteesData);
    }
    const teamId = teamData?.id;
    if (teamId) {
      getTeamInviteesByTeamId(teamId).then((value) => {
        setLoader("loaded");
      });
    }
  }

  function checkProfile(event: any, rowData: any) {
    event.preventDefault();
    router.push(rowData.userInfo);
  }

  function acceptUser(event: any, rowData: any) {
    event.preventDefault();
    addUserToTeam(rowData.userId);
  }

  async function addUserToTeam(userId: any) {
    const myTeam = Moralis.Object.extend("Team");
    const myTeamObj = new myTeam();
    myTeamObj.set("id", teamData.id);
    let memberIds = teamData?.get("users");
    if (memberIds) {
    } else {
      memberIds = [];
    }
    memberIds.push(userId);
    myTeamObj.save();
    toast.success("User Added to Team!", {
      position: toast.POSITION.BOTTOM_CENTER,
    });
  }

  return (
    <>
      <div className="descriptions">
        We needed a way for users without a team to apply for an invite to our
        team <br />
        Here, the team can review and choose to extend an invitation (adding
        them to the team!)
      </div>
      <div className={styles.container}>
        {loader == "loaded" && (
          <form className={styles.form}>
            {loader == "loaded" && data && (
              <div className={styles.formGroups}>
                <MaterialTable
                  title="Team invitees list"
                  columns={columns}
                  data={data}
                  // other props
                  actions={[
                    {
                      icon: "CheckProfile",
                      tooltip: "CheckProfile",
                      onClick: (event, rowData) => {
                        console.dir(rowData);
                        checkProfile(event, rowData);
                      },
                    },
                    {
                      icon: "AcceptUser",
                      tooltip: "AcceptUser",
                      onClick: (event, rowData) => {
                        console.dir(rowData);
                        acceptUser(event, rowData);
                      },
                    },
                  ]}
                />
              </div>
            )}
          </form>
        )}
      </div>
    </>
  );
};
export default TeamAcceptRejectInvitees;
