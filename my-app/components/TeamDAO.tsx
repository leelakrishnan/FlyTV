import { useState, useEffect } from "react";
import {useMoralis} from "react-moralis";
import { toast } from 'react-toastify';
import styles from "../styles/Form.module.css";
import { useRouter } from 'next/router'
import Moralis from "moralis";
type Props = {
    teamData: any,
}

const TeamDAO = ({ teamData }: Props)  => {
    const router = useRouter();
    const [formValues, setFormValues] = useState({
        repoName: ""
    });
    const {user, setUserData, userError, isUserUpdating, refetchUserData} = useMoralis();
    const [loader, setLoader] = useState("not-loaded");

    useEffect(() => {
        setLoader("loaded");

    }, [user]);

    // create a function which set the values of form field
    const handleOnChange = (e) => {
    };

    const validateError = () => {
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    };

    return (
        <div className={styles.container}>
            {loader == "loaded" &&
                <form className={styles.form}>
                    <div className={styles.formGroups}>

                    </div>
                </form>
            }
        </div>
    );
}
export default TeamDAO;
