import { useState, useEffect } from "react";
import { useMoralis } from "react-moralis";
import { toast } from "react-toastify";
import styles from "../styles/Form.module.css";
import { useRouter } from "next/router";
import Moralis from "moralis";
import ReactTooltip from "react-tooltip";

type Props = {
  teamData: any;
};

const TeamMission = ({ teamData }: Props) => {
  const router = useRouter();

  const [formValues, setFormValues] = useState({
    teamName: "",
    mission: "",
    vision: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { user, setUserData, userError, isUserUpdating, refetchUserData } =
    useMoralis();
  const [loader, setLoader] = useState("not-loaded");
  const [lookingForTeamMembers, setLookingForTeamMembers] = useState(false);

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
    const teamName = teamData?.get("teamName");
    const vision = teamData?.get("vision");
    const mission = teamData?.get("mission");
    const lookingForTeamMembers = teamData?.get("lookingForTeamMembers");

    if (teamName) formValues.teamName = teamName;
    if (vision) formValues.vision = vision;
    if (mission) formValues.mission = mission;
    if (lookingForTeamMembers) setLookingForTeamMembers(lookingForTeamMembers);
  }

  // create a function which set the values of form field
  const handleOnChange = (e) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };

  const validateError = () => {
    const errors = {};
    if (formValues.teamName === "") {
      errors.teamName = "Team Name is required";
    }
    if (formValues.vision === "") {
      errors.vision = "Vision is required";
    }
    if (formValues.mission === "") {
      errors.mission = "Mission is required";
    }
    return errors;
  };

  function incrementBadge() {
    const teamName = teamData?.get("teamName");
    if (teamName) {
    } else {
      // @ts-ignore
      user.increment("badges");
      user.save();
    }
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
    setLoading(true);
    incrementBadge();
    const myTeam = Moralis.Object.extend("Team");
    const myTeamObj = new myTeam();
    myTeamObj.set("id", teamData.id);
    if (formValues.teamName) {
      myTeamObj.set("teamName", formValues.teamName);
    }
    if (formValues.mission) {
      myTeamObj.set("mission", formValues.mission);
    }
    if (formValues.vision) {
      myTeamObj.set("vision", formValues.vision);
    }
    myTeamObj.set("lookingForTeamMembers", lookingForTeamMembers);
    myTeamObj.save();
    toast.success(" Team Info is Saved!", {
      position: toast.POSITION.BOTTOM_CENTER,
    });
    setLoading(false);
  };

  function handleCheckChange(e) {
    e.preventDefault();
    if (e.target.checked) setLookingForTeamMembers(true);
  }

  return (
    <>
      <div className={styles.pagetooltip}>
        <a data-tip='  Team Info allows the team members to update the public values as they
        gain clarity. The team mission must be a clear statement and the
        changes to these should be trackable.
        Most importantly, we are rewarding our users for good habits
        And even more importantly than most, a team can be looking for members
        or closed!'>Help</a>
        <ReactTooltip className='extraClass' delayHide={1000} effect='solid'/>
      </div>

      <div className={styles.container}>
        {loader == "loaded" && (
          <form className={styles.form}>
            <div className={styles.formGroups}>
              {formErrors.teamName && (
                <p style={formErrorStyle}>{formErrors.teamName}</p>
              )}
              <label htmlFor="name">TeamName</label>
              <input
                type="text"
                value={formValues.teamName}
                name={Object.keys(formValues)[0]}
                onChange={handleOnChange}
                placeholder="TeamName"
              />
            </div>
            <div className={styles.formGroups}>
              {formErrors.mission && (
                <p style={formErrorStyle}>{formErrors.mission}</p>
              )}
              <label htmlFor="name">Mission</label>
              <input
                type="text"
                value={formValues.mission}
                name={Object.keys(formValues)[1]}
                onChange={handleOnChange}
                placeholder="Mission"
              />
            </div>
            <div className={styles.formGroups}>
              {formErrors.vision && (
                <p style={formErrorStyle}>{formErrors.vision}</p>
              )}
              <label htmlFor="name">Vision</label>
              <input
                type="text"
                value={formValues.vision}
                name={Object.keys(formValues)[2]}
                onChange={handleOnChange}
                placeholder="Vision"
              />
            </div>
            <div className={styles.formGroups}>
              <label htmlFor="lookingForTeamMembers">
                Are your team looking for Team members?
              </label>
              {!lookingForTeamMembers ? (
                <input
                  onChange={handleCheckChange}
                  type="checkbox"
                  id="lookingForTeamMembers"
                  name={"lookingForTeamMembers"}
                ></input>
              ) : (
                <input
                  onChange={handleCheckChange}
                  checked={true}
                  type="checkbox"
                  id="lookingForTeamMembers"
                  name={"lookingForTeamMembers"}
                ></input>
              )}
            </div>
            {!loading ? (
              <div className={styles.formGroups}>
                <button onClick={handleSubmit} className={styles.submit}>
                  Submit
                </button>
              </div>
            ) : (
              <div className="loader-center">
                <div className="loader"></div>
              </div>
            )}
          </form>
        )}
      </div>
    </>
  );
};
export default TeamMission;
