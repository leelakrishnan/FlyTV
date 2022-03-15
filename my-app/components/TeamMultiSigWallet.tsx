import { useState, useEffect } from "react";
import {useMoralis} from "react-moralis";
import { toast } from 'react-toastify';
import styles from "../styles/Form.module.css";
import { useRouter } from 'next/router'
import Moralis from "moralis";

type Props = {
    teamData: any,
}

const TeamMultiSigWallet = ({ teamData }: Props)  => {
    useRouter();
    const [formValues, setFormValues] = useState({
        multiSigWallet: ""
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
        const multiSigWallet = teamData?.get("multiSigWallet");

        if (multiSigWallet)
            formValues.multiSigWallet = multiSigWallet;
    }

    // create a function which set the values of form field
    const handleOnChange = (e) => {
        setFormValues({...formValues, [e.target.name]: e.target.value});
    };

    const validateError = () => {
        const errors = {};
        if (formValues.multiSigWallet === "") {
            errors.multiSigWallet = "MultiSigWallet is required";
        }
        return errors;
    };

    const handleMultiSigWallet = (e) => {
        e.preventDefault();
        window.open('https://gnosis-safe.io/app/open', '_blank');
    }

    function incrementBadge() {
        debugger;
        const multiSigWallet = teamData?.get("multiSigWallet");
        if (multiSigWallet) {
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
        if (formValues.multiSigWallet) {
            myTeamObj.set("multiSigWallet", formValues.multiSigWallet);
        }
        myTeamObj.save();
        toast.success("Multi Sig Wallet Info Saved!", {
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
                            <button onClick={handleMultiSigWallet} className={styles.submit}>
                                Create Multi sig wallet
                            </button>
                        </div>
                        <div className={styles.formGroups}>
                            {formErrors.multiSigWallet && (
                                <p style={formErrorStyle}>{formErrors.multiSigWallet}</p>
                            )}
                            <label htmlFor="name">Multi Sig Wallet Address</label>
                            <input
                                type="text"
                                value={formValues.multiSigWallet}
                                name={Object.keys(formValues)[0]}
                                onChange={handleOnChange}
                                placeholder="Multi Sig Wallet Address"
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
                }
            </div>
        </>
    );
}
export default TeamMultiSigWallet;
