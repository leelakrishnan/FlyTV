import { useState, useEffect } from "react";
import {useMoralis} from "react-moralis";
import { toast } from 'react-toastify';
import styles from "../styles/Form.module.css";
import { useRouter } from 'next/router'
import Moralis from "moralis";

type Props = {
    teamData: any,
}

const TeamAcceptRejectInvitees = ({ teamData }: Props)  => {
    const router = useRouter();

    const [formValues, setFormValues] = useState({
        gatherRoom: ""
    });
    const [formErrors, setFormErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const {user, setUserData, userError, isUserUpdating, refetchUserData} = useMoralis();
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
        const gatherRoom = teamData?.get("gatherRoom");

        if (gatherRoom)
            formValues.gatherRoom = gatherRoom;
    }

    // create a function which set the values of form field
    const handleOnChange = (e) => {
        setFormValues({...formValues, [e.target.name]: e.target.value});
    };

    const validateError = () => {
        const errors = {};
        if (formValues.gatherRoom === "") {
            errors.gatherRoom = "Gather Room is required";
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

        // ToDO
        // Call api to create Space. get teh LInk and save it to Team Moralis Object.

        toast.success(" Gathertown Space created!", {
            position: toast.POSITION.BOTTOM_CENTER,
        });
        setLoading(false);
    };

    return (
        <>
            <div className={styles.container}>
                {loader == "loaded" &&
                    <form className={styles.form}>
                        {formValues.gatherRoom !== "" &&
                            <div className={styles.formGroups}>
                                <label htmlFor="name">Gather Town Room</label>
                                <input
                                    type="text"
                                    value={formValues.gatherRoom}
                                    name={Object.keys(formValues)[0]}
                                    disabled={true}
                                />
                            </div>
                        }
                        {!loading ? (
                            <div className={styles.formGroups}>
                                <button onClick={handleSubmit} className={styles.submit}>
                                    Accept Reject Invitees
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
export default TeamAcceptRejectInvitees;
