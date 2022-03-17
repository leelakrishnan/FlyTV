import { useState, useEffect } from "react";
import { useMoralis } from "react-moralis";
import { toast } from "react-toastify";
import styles from "../styles/Form.module.css";
import { useRouter } from "next/router";
import Moralis from "moralis";

type Props = {
  teamData: any;
};

const TeamProjectManagement = ({ teamData }: Props) => {
  useRouter();
  const [formValues, setFormValues] = useState({
    projectManagementUrl: "",
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
    const projectManagementUrl = teamData?.get("projectManagementUrl");

    if (projectManagementUrl)
      formValues.projectManagementUrl = projectManagementUrl;
  }

  // create a function which set the values of form field
  const handleOnChange = (e) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };

  const validateError = () => {
    const errors = {};
    if (formValues.projectManagementUrl === "") {
      errors.projectManagementUrl = "Project Management Url is required";
    }
    return errors;
  };

  function incrementBadge() {
    const projectManagementUrl = teamData?.get("projectManagementUrl");
    if (projectManagementUrl) {
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
    if (formValues.projectManagementUrl) {
      myTeamObj.set("projectManagementUrl", formValues.projectManagementUrl);
    }
    myTeamObj.save();
    toast.success("Project Management Url Saved!", {
      position: toast.POSITION.BOTTOM_CENTER,
    });
    setLoading(false);
  };

  return (
    <>
      <div className="descriptions">
        early on, Eric made an example of using github projects (see image
        below), <br />
        our team voted to track work using github{" "}
        <a href="https://qr.ae/pGLZcq">quora link</a> and thought we could
        create <br />
        or interact directly with github programmatically.
      </div>
      <div className={styles.container}>
        {loader == "loaded" && (
          <form className={styles.form}>
            <div className={styles.formGroups}>
              {formErrors.projectManagementUrl && (
                <p style={formErrorStyle}>{formErrors.projectManagementUrl}</p>
              )}
              <label htmlFor="name">Project Management Link</label>
              <input
                type="text"
                value={formValues.projectManagementUrl}
                name={Object.keys(formValues)[0]}
                onChange={handleOnChange}
                placeholder="Project Management Link"
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
export default TeamProjectManagement;
