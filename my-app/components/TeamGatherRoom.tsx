import { useState, useEffect } from "react";
import { useMoralis } from "react-moralis";
import { toast } from "react-toastify";
import styles from "../styles/Form.module.css";
import { useRouter } from "next/router";
import Moralis from "moralis";
import axios from "axios";
import ReactTooltip from "react-tooltip";

type Props = {
  teamData: any;
};

const TeamGatherRoom = ({ teamData }: Props) => {
  const router = useRouter();

  const [formValues, setFormValues] = useState({
    gatherRoom: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { user, setUserData, userError, isUserUpdating, refetchUserData } =
    useMoralis();
  const [loader, setLoader] = useState("not-loaded");
  const [gatherLink, setGatherLink] = useState("");

  useEffect(() => {
    mapMoralisTeamToFormValues();
    setLoader("loaded");
  }, [user]);

  const formErrorStyle = {
    color: "red",
    fontSize: "1.2rem",
    paddingBottom: "0.5rem",
  };

  function mapMoralisTeamToFormValues() {
    const gatherRoom = teamData?.get("gatherRoom");
    if (gatherRoom) {
      setGatherLink("https://app.gather.town/app/" + gatherRoom);
    }
  }

  // create a function which set the values of form field
  const handleOnChange = (e) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };

  const validateError = () => {
    const errors = {};
    if (formValues.gatherRoom === "") {
      errors.gatherRoom = "Gather Room is required";
    }
    return errors;
  };

  function incrementBadge() {
    const gatherRoom = teamData?.get("gatherRoom");
    if (gatherRoom) {
    } else {
      // @ts-ignore
      user.increment("badges");
      user.save();
    }
  }

  async function makeGatherApiCall(roomName: string) {
    axios
      .post(
        "https://4lbyt5w5m7.execute-api.us-east-1.amazonaws.com/test/v1/createRoom",
        {
          name: roomName,
        }
      )
      .then((response) => {
        if (response && response.data) {
          const myTeam = Moralis.Object.extend("Team");
          const myTeamObj = new myTeam();
          myTeamObj.set("id", teamData.id);
          myTeamObj.set("gatherRoom", response.data);
          myTeamObj.save();

          setGatherLink("https://app.gather.town/app/" + response.data);

          toast.success(" GatherTown Room created!", {
            position: toast.POSITION.BOTTOM_CENTER,
          });
        }
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("HERE");
    // check form values are not empty
    const errors = validateError();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    validateError();
    console.log("formValues", formValues);
    if (formValues.gatherRoom) {
      setLoading(true);
      incrementBadge();
      const noSpecialCharactersGatherRoom = formValues.gatherRoom.replace(
        /[^a-zA-Z0-9 ]/g,
        ""
      );
      await makeGatherApiCall(noSpecialCharactersGatherRoom);
    }
  };

  return (
    <>
      <div className={styles.pagetooltip}>
        <a data-tip=' We had many hilarious times running in circles in gathertown 
        or at least, a decent place to meet, where even with no video theres
        still an avatar to relate to.  We all agreed on a system of "go to
        our office when working on the project" (like, clock in, and be
        available to help) 
        using the gathertown API, should be able to verify each user spent time
        there, 
        but even more importantly, we chose this because while its fun,
        something is missing. 
        Ideally, we also have the hackathons API key passed in to us 
        and can use the API to create a private room or passworded area in the
        official gathertown as well
        </a>'>Help</a>
        <ReactTooltip className='extraClass' delayHide={1000} effect='solid'/>
      </div>
      <div className={styles.container}>
        {loader == "loaded" && (
          <form className={styles.form}>
            <div className={styles.formGroups}>
              {formErrors.gatherRoom && (
                <p style={formErrorStyle}>{formErrors.gatherRoom}</p>
              )}
              <input type="text" value={gatherLink} disabled={true} />
            </div>
            <div className={styles.formGroups}>
              {formErrors.gatherRoom && (
                <p style={formErrorStyle}>{formErrors.gatherRoom}</p>
              )}
              <label htmlFor="name">Gather Town Room Name</label>
              <input
                type="text"
                value={formValues.gatherRoom}
                name={Object.keys(formValues)[0]}
                onChange={handleOnChange}
                placeholder="Gather Town Room Name"
              />
            </div>
            <div className={styles.formGroups}>
              <button onClick={handleSubmit} className={styles.submit}>
                Create/Update Gather Room
              </button>
            </div>
          </form>
        )}
      </div>
      <div className="descriptions">
       
      </div>
    </>
  );
};
export default TeamGatherRoom;
