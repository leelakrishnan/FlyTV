import React, { useState, useEffect } from "react";
import {useMoralis} from "react-moralis";
import { toast } from 'react-toastify';
import styles from "../styles/Form.module.css";
import { useRouter } from 'next/router'
import Moralis from "moralis";
import ReactTooltip from "react-tooltip";
const { NFTStorage, Blob } = require('nft.storage');
const client = new NFTStorage({ token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweGY1RjViM2RGQzkwZmI1QzFhYTJENWU3NmYyNjIxMjQ3NDczZGRFMzYiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY0NzQ4NTIzMTcxNywibmFtZSI6IkZseVRWIn0.I5e-Fe7u6XeYayYkL0yyRl7HWGz1LrGjp-oGhUJ8Mo0'});

type Props = {
    teamData: any,
}

const TeamProjectBlobAsNFT = ({ teamData }: Props)  => {
    const router = useRouter();
    const [formValues, setFormValues] = useState({
        metaDataUrl: ""
    });
    const {user, setUserData, userError, isUserUpdating, refetchUserData} = useMoralis();
    const [loader, setLoader] = useState("not-loaded");
    const [loading, setLoading] = useState(false);

    useEffect(() => {

        mapMoralisTeamToFormValues()
        setLoader("loaded");

    }, [user]);

    function mapMoralisTeamToFormValues() {
        const metaDataUrl = teamData?.get("metaDataUrl");

        if (metaDataUrl)
            formValues.metaDataUrl = metaDataUrl;
    }

    // create a function which set the values of form field
    const handleOnChange = (e) => {
    };

    const validateError = () => {
    };

    async function store(data: string) {
        
        const fileCid = await client.storeBlob(new Blob([data]));
        const fileUrl = "https://ipfs.io/ipfs/" + fileCid;
        let teamName = teamData?.get("teamName");

        const obj = {
            "name": "Project Blob " + teamName ? teamName : "",
            "information": data,
            "creator": "FlyTV",
            "file_url": fileUrl
        };
        
        const metadata = new Blob([JSON.stringify(obj)]);
        const metadataCid = await client.storeBlob(metadata);
        const metadataUrl = "https://ipfs.io/ipfs/" + metadataCid;
        
        return metadataUrl;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        const metadataUrl = await store(JSON.stringify(teamData));
        formValues.metaDataUrl = metadataUrl;
        
        const myTeam = Moralis.Object.extend("Team");
        const myTeamObj = new myTeam();
        myTeamObj.set("id", teamData.id);
        if (formValues.metaDataUrl) {
            myTeamObj.set("metaDataUrl", formValues.metaDataUrl);
        }
        myTeamObj.save();
        toast.success("Project is minted as NFT!", {
            position: toast.POSITION.BOTTOM_CENTER,
        });
        setLoading(false);
    };

    return (
        <>
            <div className={styles.pagetooltip}>
                <a data-tip='Fill me'>Help</a>
                <ReactTooltip className='extraClass' delayHide={1000} effect='solid'/>
            </div>
        <div className={styles.container}>
            {loader == "loaded" &&
                <form className={styles.form}>
                        <div className={styles.formGroups}>
                            <button onClick={handleSubmit} className={styles.submit}>
                                Mint Project as NFT
                            </button>
                        </div>
                    {formValues.metaDataUrl !== "" &&
                        <div className={styles.formGroups}>
                            <label htmlFor="name">Metadata URL</label>
                            <input
                                type="text"
                                value={formValues.metaDataUrl}
                                name={"MetadataURL"}
                                disabled={true}
                            />
                        </div>
                    }
                </form>
            }
        </div>

        </>
    );
}
export default TeamProjectBlobAsNFT;
