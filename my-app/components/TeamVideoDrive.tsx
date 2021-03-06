import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import styles from "../styles/Form.module.css";
import { IconButton } from "@mui/material";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import {
  useMoralis,
  useMoralisFile,
} from "react-moralis";
import Moralis from "moralis";
import ReactTooltip from "react-tooltip";
type Props = {
  teamData: any;
};

const TeamVideoDrive = ({ teamData }: Props) => {
  const { saveFile } = useMoralisFile();

  const [formValues] = useState({
    content: {},
    videoLinks: [],
  });
  const [ setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { user } =
    useMoralis();
  const [loader, setLoader] = useState("not-loaded");

  useEffect(() => {
    mapMoralisTeamToFormValues();
    setLoader("loaded");
  }, [user]);

  //is this where I could add in a "text description"?
  function mapMoralisTeamToFormValues() {
    const videoLinks = teamData?.get("videoLinks");

    if (videoLinks) formValues.videoLinks = videoLinks;
  }

  // create a function which set the values of form field
  const handleOnChange = (e) => {
    formValues.content = e.currentTarget.files[0];
  };

  const validateError = () => {
    const errors = {};
    if (formValues.content && formValues.content.type) {
    } else {
      errors.content = "Please upload file.";
    }
    return errors;
  };

  const uploadToIpfs = async (file: any) => {
    try {
      console.log(file);
      const uploadedFile = await saveFile(file.name, file, {
        saveIPFS: true,
      });
      if (uploadedFile?._ipfs) {
        return uploadedFile?._ipfs;
      } else {
        throw new Error("File Upload Failed");
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
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
    if (formValues.content) {
      const ipfsUrl = await uploadToIpfs(formValues.content);
      if (ipfsUrl) {
        const myTeam = Moralis.Object.extend("Team");
        const myTeamObj = new myTeam();
        myTeamObj.set("id", teamData.id);

        if (formValues.videoLinks) {
          formValues.videoLinks.push(ipfsUrl);
          myTeamObj.set("videoLinks", formValues.videoLinks);
        } else {
          formValues.videoLinks = [];
          formValues.videoLinks.push(ipfsUrl);
          myTeamObj.set("videoLinks", formValues.videoLinks);
        }
        myTeamObj.save();
      }

      formValues.content = {};

      toast.success(" File uploaded!", {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    }
    setLoading(false);
  };

  return (
    <>
      <div className={styles.pagetooltip}>
        <a data-tip=' where was that video of us running in circles? ----- flytv one stop shop
        -----
        with the goal of being a team dashboard, collecting all the videos is a
        no brainer.'>Help</a>
        <ReactTooltip className='extraClass' delayHide={1000} effect='solid'/>
      </div>
      <div className={styles.container}>
        {loader == "loaded" && (
          <form className={styles.form}>
            {!loading ? (
              <>
                <div className={styles.formGroups}>
                  <label htmlFor="content">
                    Upload Video
                    <input
                      accept="video/mp4,video/x-m4v,video/*"
                      name="content"
                      type="file"
                      id="content"
                      onChange={handleOnChange}
                    />
                    <IconButton
                      color="primary"
                      aria-label="upload image"
                      component="span"
                    >
                      <FileUploadOutlinedIcon />
                    </IconButton>
                    {/* <Input /> */}
                  </label>
                  {formValues &&
                    formValues.videoLinks &&
                    formValues.videoLinks.length > 0 && (
                      <label htmlFor="content">Video Urls</label>
                    )}
                  {formValues &&
                    formValues.videoLinks &&
                    formValues.videoLinks.length > 0 &&
                    formValues.videoLinks.map((ipfsUrl, index) => (
                      <div key={index} className={styles.formGroups}>
                        <label htmlFor="name">{ipfsUrl}</label>
                      </div>
                    ))}
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
                </div>
              </>
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
export default TeamVideoDrive;
