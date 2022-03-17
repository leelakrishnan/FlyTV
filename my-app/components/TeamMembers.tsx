import { useState, useEffect } from "react";
import {useMoralis} from "react-moralis";
import { toast } from 'react-toastify';
import styles from "../styles/Form.module.css";
import Moralis from "moralis";
import MaterialTable from "material-table";
type Props = {
    teamData: any,
}
const TeamMembers = ({ teamData }: Props)  => {
    const options = {
        filterType: 'checkbox',
    };

    const [formValues, setFormValues] = useState({
        membersIds: [],
        members: [],
        columns: [
        ],
        data: [],
        emailAddress: ""
    });
    const [columns, setColumns] = useState([]);
    const [data, setData] = useState([]);


    const [formErrors, setFormErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const {user, setUserData, userError, isUserUpdating, refetchUserData} = useMoralis();
    const [loader, setLoader] = useState("not-loaded");

    function loadTeamInfo() {
        async function getMemberInfo(membersIds: string[]) {
            const userQuery = new Moralis.Query(Moralis.User);
            userQuery.containedIn("objectId",
                membersIds);
            const data = await userQuery.find({useMasterKey: true});
            formValues.columns = [
                {title: 'FirstName', field: 'firstName'},
                {title: 'LastName', field: 'lastName'},
                {title: 'Email', field: 'emailAddress'},
                {title: 'GitHubUsername', field: 'githubUserName'},
                {title: 'UserId', field: 'userId'}

            ];
            formValues.data = [];
            if (data) {
                // @ts-ignore
                formValues.members = data;
                // @ts-ignore
                for (let i = 0; i < data.length; i++) {
                    let firstName = data[i]?.get("firstName") ? data[i]?.get("firstName") : "";
                    let lastName = data[i]?.get("lastName") ? data[i]?.get("lastName") : "";
                    let emailAddress = data[i]?.get("emailAddress") ? data[i]?.get("emailAddress") : "";
                    let githubUserName = data[i]?.get("githubUserName") ? data[i]?.get("githubUserName") : "";
                    let userId = data[i]?.id ? data[i]?.id : "";

                    formValues.data.push({
                        firstName: firstName,
                        lastName: lastName,
                        emailAddress: emailAddress,
                        githubUserName: githubUserName,
                        userId: userId
                    });
                    // @ts-ignore
                    setData(formValues.data);
                }
            }
        }
        const memberIds = teamData?.get("users");
        if (memberIds) {
            formValues.membersIds = memberIds;
            getMemberInfo(memberIds).then((value) => {
                setLoader("loaded");
            });
        }
    }

    useEffect(() => {
        loadTeamInfo();
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
        if (formValues.emailAddress === "") {
            errors.emailAddress = "EmailAddress is required";
        }
        return errors;
    };

    const getUserNotAvailableError = () => {
        const errors = {};
        errors.emailAddress = "User is not available in our system";
        return errors;
    };

    const getUserAlreadyInTeamError = () => {
        const errors = {};
        errors.emailAddress = "User is already in the team";
        return errors;
    };

    // @ts-ignore
    async function getTeamForUser(userId: string) {
        const Team = Moralis.Object.extend("Team");
        const query = new Moralis.Query(Team);
        query.equalTo("users", userId);
        const data = await query.find({useMasterKey: true});
        return data;
    }

    async function getUserInfoByEmail(emailAddress: string) {
        const userQuery = new Moralis.Query(Moralis.User);
        userQuery.equalTo("emailAddress",emailAddress);
        const data = await userQuery.find({useMasterKey: true});
        return data;
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

    async function deleteUser(event: any, rowData: any) {
        console.log("deleteUser");
        console.dir(rowData);
        event.preventDefault();
        let userId = rowData?.userId;
        if(userId) {
            const memberIds = teamData?.get("users");
            if (memberIds) {
                for( let i = 0; i < memberIds.length; i++){
                    if ( memberIds[i] === userId) {
                        memberIds.splice(i, 1);
                    }
                }
                const myTeam = Moralis.Object.extend("Team");
                const myTeamObj = new myTeam();
                myTeamObj.set("id", teamData.id);
                myTeamObj.set("users", memberIds);
                myTeamObj.save();
                toast.success("User Removed to Team!", {
                    position: toast.POSITION.BOTTOM_CENTER,
                });
            }
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
        // check if email entered is in User
        const userInfo = await getUserInfoByEmail(formValues.emailAddress);
        if (userInfo && userInfo.length > 0) {
            if (userInfo && userInfo[0] && userInfo[0].id) {
                const teamData = await getTeamForUser(userInfo[0].id);
                if (teamData && teamData.length > 0) {
                    const errors = getUserAlreadyInTeamError();
                    if (Object.keys(errors).length > 0) {
                        setFormErrors(errors);
                        setLoading(false);
                    }
                } else {
                    await addUserToTeam(userInfo[0].id);
                    let firstName = teamData[0]?.get("firstName") ? teamData[0]?.get("firstName") : "";
                    let lastName = teamData[0]?.get("lastName") ? teamData[0]?.get("lastName") : "";
                    let emailAddress = teamData[0]?.get("emailAddress") ? teamData[0]?.get("emailAddress") : "";
                    let githubUserName = teamData[0]?.get("githubUserName") ? teamData[0]?.get("githubUserName") : "";
                    let userId = userInfo[0].id ? userInfo[0].id: "";
                    formValues.data.push({
                        firstName: firstName,
                        lastName: lastName,
                        emailAddress: emailAddress,
                        githubUserName: githubUserName,
                        userId: userId
                    });
                    setData(formValues.data);

                }
            }
        } else {
            const errors = getUserNotAvailableError();
            if (Object.keys(errors).length > 0) {
                setFormErrors(errors);
            }
        }
        setLoading(false);
    };


    return (
        <>
            <div className={styles.container}>
                {loader == "loaded" &&
                    <form className={styles.form}>
                        <div className={styles.formGroups}>
                            {formErrors.emailAddress && (
                                <p style={formErrorStyle}>{formErrors.emailAddress}</p>
                            )}
                            <label htmlFor="name">Add Team Member</label>
                            <input
                                type="text"
                                value={formValues.emailAddress}
                                name={'emailAddress'}
                                onChange={handleOnChange}
                                placeholder="Enter Email of the Team member to add"
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
                        {loader == "loaded" && data &&
                            <div className={styles.formGroups}>
                                <MaterialTable
                                    title="Team members"
                                    columns={formValues.columns}
                                    data={data}
                                    // other props
                                    actions={[
                                        {
                                            icon: 'Delete',
                                            tooltip: 'Delete User',
                                            onClick: (event, rowData) => {
                                                console.dir(rowData);
                                               deleteUser(event, rowData);
                                            }
                                        }
                                    ]}
                                />
                            </div>
                        }

                    </form>
                }
            </div>
        </>
    );
}
export default TeamMembers;
