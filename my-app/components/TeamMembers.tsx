import { useState, useEffect } from "react";
import {useMoralis} from "react-moralis";
import { toast } from 'react-toastify';
import styles from "../styles/Form.module.css";
import { useRouter } from 'next/router'
import Moralis from "moralis";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

type Props = {
    teamData: any,
}

const TeamMembers = ({ teamData }: Props)  => {
    const router = useRouter();

    // @ts-ignore
    // @ts-ignore
    // @ts-ignore
    const [formValues, setFormValues] = useState({
        membersIds: [],
        members:  []
    });
    const [formErrors, setFormErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const {user, setUserData, userError, isUserUpdating, refetchUserData} = useMoralis();
    const [loader, setLoader] = useState("not-loaded");

    useEffect(() => {
        async function getMemberInfo(membersIds: string[]) {
            const userQuery = new Moralis.Query(Moralis.User);
            userQuery.containedIn("objectId",
                membersIds);
            const data = await userQuery.find({ useMasterKey: true });
            debugger;
            if (data) {
                // @ts-ignore
                formValues.members = data;
            }
        }
        const memberIds = teamData?.get("users");
        if (memberIds) {
            formValues.membersIds = memberIds;
            getMemberInfo(memberIds);
        }
        setLoader("loaded");
    }, [user]);

    const formErrorStyle = {
        color: "red",
        fontSize: "1.2rem",
        paddingBottom: "0.5rem",
    };

    // create a function which set the values of form field
    const handleOnChange = (e) => {
        setFormValues({...formValues, [e.target.name]: e.target.value});
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

    return (
        <>
            <div className={styles.container}>
                {loader == "loaded" &&
                    <form className={styles.form}>
                        <div className={styles.formGroups}>
                            {formErrors.repoName && (
                                <p style={formErrorStyle}>{formErrors.repoName}</p>
                            )}
                            <label htmlFor="name">Add Team Member</label>
                            <input
                                type="text"
                                value={formValues.repoName}
                                name={Object.keys(formValues)[0]}
                                onChange={handleOnChange}
                                placeholder="Search And Add Team Member"
                            />
                        </div>
                        <div className={styles.formGroups}>
                            <input
                                type="text"
                                value={formValues.repoName}
                                name={Object.keys(formValues)[0]}
                                disabled={true}
                            />
                        </div>
                        {!loading ? (
                            <div className={styles.formGroups}>
                                <button onClick={handleSubmit} className={styles.submit}>
                                    Search And Add
                                </button>
                            </div>
                        ) : (
                            <div className="loader-center">
                                <div className="loader"></div>
                            </div>
                        )}
                    </form>
                }
            </div>
        </>
    );
}
export default TeamMembers;
