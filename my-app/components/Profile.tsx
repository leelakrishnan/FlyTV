import { useState, useEffect } from "react";
import {useMoralis} from "react-moralis";
import { toast } from 'react-toastify';
import { MultiSelect } from "react-multi-select-component";
import styles from "../styles/Form.module.css";
import { useRouter } from 'next/router'
import Moralis from "moralis";

const options = [
  { label: "HTML/CSS", value: "HTML/CSS" },
  { label: "Java", value: "Java" },
  { label: "JavaScript", value: "JavaScript" },
  { label: "TypeScript", value: "TypeScript" },
  { label: "SQL", value: "SQL" },
  { label: "Swift", value: "Swift" },
  { label: "Node.Js", value: "Node.Js" },
  { label: "Python", value: "Python" },
  { label: "PHP", value: "PHP" },
  { label: "NextJS", value: "NextJS" },
  { label: "React", value: "React" },
  { label: "Moralis", value: "Moralis" },
  { label: "Web3Knowledge", value: "Web3Knowledge" },
  { label: "Solidity", value: "Solidity" },
];

const Profile = () => {
  const router = useRouter();
  const [selectedSkill, setSelectedSkill] = useState([]);
  const [selectedLevel, setSelectedLevel] = useState("");
  const [formValues, setFormValues] = useState({
    userName: "",
    email: "",
    firstName: "",
    lastName: "",
    company: "",
    university: "",
    githubUserName: "",
    linkedInProfile: "",
    experience: "",
    interests: "",
    otherInfo: "",
    city: "",
    skills: []
  });
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const {user, setUserData, userError, isUserUpdating, refetchUserData} = useMoralis();
  const postTitle = {
    textAlign: "center",
    fontSize: "2rem",
    fontWeight: "bold",
    marginBottom: "1rem",
    fontFamily: "Press Start 2P",
  };

  const formErrorStyle = {
    color: "red",
    fontSize: "1.2rem",
    paddingBottom: "0.5rem",
  };

  const {profileId} = router.query;

  useEffect(() => {
    if (profileId) {
      loadProfileByProfileId(profileId);
    } else {
      mapMoralisUserInfoToFormValues(user);
    }
  }, [user]);

  function loadProfileByProfileId(profileId: string) {
    async function getMemberInfo(profileId: string) {
      const userQuery = new Moralis.Query(Moralis.User);
      userQuery.equalTo("objectId",
          profileId);
      const data = await userQuery.find({useMasterKey: true});
      if (data && data.length > 0 && data[0].id) {
        mapMoralisUserInfoToFormValues(data[0]);
      }
    }
    if (profileId) {
      getMemberInfo(profileId).then((value) => {
      });
    }
  }

  function mapMoralisUserInfoToFormValues(user: any) {
    const email = user?.get("email");
    const emailAddress = user?.get("emailAddress");
    const userName = user?.get("username");
    const firstName = user?.get("firstName");
    const lastName = user?.get("lastName");
    const company = user?.get("company");
    const university = user?.get("university");
    const githubUserName = user?.get("githubUserName");
    const linkedInProfile = user?.get("linkedInProfile");
    const experience = user?.get("experience");
    const interests = user?.get("interests");
    const otherInfo = user?.get("otherInfo");
    const city = user?.get("city");
    // MultiSelect DropDown
    const skills = user?.get("skills");
    const level = user?.get("level");

    if (email) {
      formValues.email = email;
    } else if (emailAddress) {
      formValues.email = emailAddress;
    }

    if (userName)
      formValues.userName = userName;
    if (firstName)
      formValues.firstName = firstName;
    if (lastName)
      formValues.lastName = lastName;
    if (company)
      formValues.company = company;
    if (university)
      formValues.university = university;
    if (githubUserName)
      formValues.githubUserName = githubUserName;
    if (linkedInProfile)
      formValues.linkedInProfile = linkedInProfile;
    if (experience)
      formValues.experience = experience;
    if (interests)
      formValues.interests = interests;
    if (otherInfo)
      formValues.otherInfo = otherInfo;
    if (city)
      formValues.city = city;
    if (level) {
      setSelectedLevel(level);
    }
    if (skills) {
      let skillsObj = JSON.parse(skills);
      if (skillsObj) {
        setSelectedSkill(skillsObj);
      }
    }
  }

  // create a function which set the values of form field
  const handleOnChange = (e) => {
    setFormValues({...formValues, [e.target.name]: e.target.value});
  };

  const validateError = () => {
    const errors = {};
    if (formValues.email === "") {
      errors.email = "Email is required";
    }
    return errors;
  };

  const handleCancel = async (e) => {
    e.preventDefault();
    router.push('/Team');
  };

  function getBadges() {
    let initialUserEmall = user?.get("email");
    if (initialUserEmall) {
    } else {
      return 1;
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
    let badges = getBadges();

    setUserData({
      email: formValues.email === "" ? undefined : formValues.email,
      emailAddress: formValues.email === "" ? undefined : formValues.email,
      firstName: formValues.firstName === "" ? undefined : formValues.firstName,
      lastName: formValues.lastName === "" ? undefined : formValues.lastName,
      company: formValues.company === "" ? undefined : formValues.company,
      university: formValues.university === "" ? undefined : formValues.university,
      githubUserName: formValues.githubUserName === "" ? undefined : formValues.githubUserName,
      linkedInProfile: formValues.linkedInProfile === "" ? undefined : formValues.linkedInProfile,
      experience: formValues.experience === "" ? undefined : formValues.experience,
      interests: formValues.interests === "" ? undefined : formValues.interests,
      otherInfo: formValues.otherInfo === "" ? undefined : formValues.otherInfo,
      city: formValues.city === "" ? undefined : formValues.city,
      skills: selectedSkill.length === 0 ? undefined : JSON.stringify(selectedSkill),
      level: selectedLevel === "" ? undefined : selectedLevel,
      badges: badges
    });
    const UserObj = Moralis.Object.extend("User");
    const publicUser = new UserObj();
    const postACL = new Moralis.ACL(Moralis.User.current());
    postACL.setPublicReadAccess(true);
    publicUser.set("id", user.id);
    publicUser.setACL(postACL);
    publicUser.save();
    toast.success(" Profile Saved!", {
      position: toast.POSITION.BOTTOM_CENTER,
    });
    router.push('/Hackathon');
    setLoading(false);
  };

  return (
      <>
        <p style={postTitle}>Profile</p>
        <div className={styles.container}>
          <form className={styles.form}>
            <div className={styles.formGroups}>
              <label htmlFor="name">UserName</label>
              <input
                  type="text"
                  value={formValues.userName}
                  name={Object.keys(formValues)[0]}
                  disabled={true}
              />
            </div>
            <div className={styles.formGroups}>
              {formErrors.email && (
                  <p style={formErrorStyle}>{formErrors.email}</p>
              )}
              <label htmlFor="name">Email</label>
              <input
                  type="text"
                  value={formValues.email}
                  name={Object.keys(formValues)[1]}
                  onChange={handleOnChange}
                  placeholder="Email"
              />
            </div>

            <div className={styles.formGroups}>
              {formErrors.firstName && (
                  <p style={formErrorStyle}>{formErrors.firstName}</p>
              )}
              <label htmlFor="name">FirstName</label>
              <input
                  type="text"
                  value={formValues.firstName}
                  name={Object.keys(formValues)[2]}
                  onChange={handleOnChange}
                  placeholder="firstName"
              />
            </div>

            <div className={styles.formGroups}>
              {formErrors.lastName && (
                  <p style={formErrorStyle}>{formErrors.lastName}</p>
              )}
              <label htmlFor="name">LastName</label>
              <input
                  type="text"
                  value={formValues.lastName}
                  name={Object.keys(formValues)[3]}
                  onChange={handleOnChange}
                  placeholder="lastName"
              />
            </div>

            <div className={styles.formGroups}>
              {formErrors.company && (
                  <p style={formErrorStyle}>{formErrors.company}</p>
              )}
              <label htmlFor="name">Company</label>
              <input
                  type="text"
                  value={formValues.company}
                  name={Object.keys(formValues)[4]}
                  onChange={handleOnChange}
                  placeholder="company"
              />
            </div>

            <div className={styles.formGroups}>
              {formErrors.university && (
                  <p style={formErrorStyle}>{formErrors.university}</p>
              )}
              <label htmlFor="name">University</label>
              <input
                  type="text"
                  value={formValues.university}
                  name={Object.keys(formValues)[5]}
                  onChange={handleOnChange}
                  placeholder="university"
              />
            </div>
            <div className={styles.formGroups}>
              {formErrors.githubUserName && (
                  <p style={formErrorStyle}>{formErrors.githubUserName}</p>
              )}
              <label htmlFor="name">GithubUserName</label>
              <input
                  type="text"
                  value={formValues.githubUserName}
                  name={Object.keys(formValues)[6]}
                  onChange={handleOnChange}
                  placeholder="githubUserName"
              />
            </div>
            <div className={styles.formGroups}>
              {formErrors.linkedInProfile && (
                  <p style={formErrorStyle}>{formErrors.linkedInProfile}</p>
              )}
              <label htmlFor="name">LinkedInProfile</label>
              <input
                  type="text"
                  value={formValues.linkedInProfile}
                  name={Object.keys(formValues)[7]}
                  onChange={handleOnChange}
                  placeholder="linkedInProfile"
              />
            </div>

            <div className={styles.formGroups}>
              {formErrors.experience && (
                  <p style={formErrorStyle}>{formErrors.experience}</p>
              )}
              <label htmlFor="name">Experience</label>
              <input
                  type="text"
                  value={formValues.experience}
                  name={Object.keys(formValues)[8]}
                  onChange={handleOnChange}
                  placeholder="experience"
              />
            </div>
            <div className={styles.formGroups}>
              {formErrors.interests && (
                  <p style={formErrorStyle}>{formErrors.interests}</p>
              )}
              <label htmlFor="name">interests</label>
              <input
                  type="text"
                  value={formValues.interests}
                  name={Object.keys(formValues)[9]}
                  onChange={handleOnChange}
                  placeholder="interests"
              />
            </div>
            <div className={styles.formGroups}>
              {formErrors.otherInfo && (
                  <p style={formErrorStyle}>{formErrors.otherInfo}</p>
              )}
              <label htmlFor="name">otherInfo</label>
              <input
                  type="text"
                  value={formValues.otherInfo}
                  name={Object.keys(formValues)[10]}
                  onChange={handleOnChange}
                  placeholder="otherInfo"
              />
            </div>
            <div className={styles.formGroups}>
              {formErrors.city && (
                  <p style={formErrorStyle}>{formErrors.city}</p>
              )}
              <label htmlFor="name">City</label>
              <input
                  type="text"
                  value={formValues.city}
                  name={Object.keys(formValues)[11]}
                  onChange={handleOnChange}
                  placeholder="city"
              />
            </div>
            <div className={styles.formGroups}>
              <label htmlFor="name">Skills</label>
              <div>
                <MultiSelect className=""
                             options={options}
                             value={selectedSkill}
                             onChange={setSelectedSkill}
                             labelledBy="Select"
                />
              </div>
            </div>
            <div className={styles.formGroups}>
              <label htmlFor="name">How would you describe your experience level</label>
              <select
                  value={selectedLevel}
                  onChange={(e) => {
                    setSelectedLevel(e.target.value);
                  }}
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Expert">Expert</option>
              </select>
            </div>

            {!loading ? (
                <div className={styles.formGroups}>
                  <button onClick={handleSubmit} className={styles.submit}>
                    Submit
                  </button>
                  <button onClick={handleCancel} className={styles.submit}>
                    Cancel
                  </button>
                </div>
            ) : (
                <div className="loader-center">
                  <div className="loader"></div>
                </div>
            )}
          </form>
        </div>
      </>
  );
}
export default Profile;
