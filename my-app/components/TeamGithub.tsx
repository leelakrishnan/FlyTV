import { useState, useEffect } from "react";
import { useMoralis } from "react-moralis";
import { toast } from "react-toastify";
import styles from "../styles/Form.module.css";
import { useRouter } from "next/router";
import Moralis from "moralis";

type Props = {
  teamData: any;
};

const TeamGithub = ({ teamData }: Props) => {
  const router = useRouter();

  const [formValues, setFormValues] = useState({
    repoName: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { user, setUserData, userError, isUserUpdating, refetchUserData } =
    useMoralis();
  const [loader, setLoader] = useState("not-loaded");

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
    const repoName = teamData?.get("repoName");

    if (repoName) formValues.repoName = repoName;
  }

  // create a function which set the values of form field
  const handleOnChange = (e) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };

  const validateError = () => {
    const errors = {};
    if (formValues.repoName === "") {
      errors.repoName = "RepoName is required";
    }
    return errors;
  };

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
    if (formValues.repoName) {
      myTeamObj.set("repoName", formValues.repoName);
    }
    myTeamObj.save();
    toast.success(" Github Info Saved!", {
      position: toast.POSITION.BOTTOM_CENTER,
    });
    setLoading(false);
  };

  function incrementBadge() {
    const repoName = teamData?.get("repoName");
    if (repoName) {
    } else {
      // @ts-ignore
      user.increment("badges");
      user.save();
    }
  }

  return (
    <>
      <div className="descriptions">
        We realized that not everybody knows where everything is <br />
        or at least, could waste time looking or asking for it. <br />
        And even more importantly than ever, we can track github activity and
        verify! <br /> Check out this document we wrote about using{" "}
        <a href="https://iodized-motorcycle-19d.notion.site/Github-Flow-for-Hackathons-e0d394f3a1e64757b04b7e045ca0970a">
          GitHub for Hackathons
        </a>
      </div>
      <div className={styles.container}>
        {loader == "loaded" && (
          <form className={styles.form}>
            <div className={styles.formGroups}>
              {formErrors.repoName && (
                <p style={formErrorStyle}>{formErrors.repoName}</p>
              )}
              <label htmlFor="name">Repository Name</label>
              <input
                type="text"
                value={formValues.repoName}
                name={Object.keys(formValues)[0]}
                onChange={handleOnChange}
                placeholder="Repository Name"
              />
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
export default TeamGithub;
