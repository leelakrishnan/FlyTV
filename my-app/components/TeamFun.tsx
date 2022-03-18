import React, { useState, useEffect } from "react";
import {useMoralis} from "react-moralis";
import { toast } from 'react-toastify';
import styles from "../styles/Form.module.css";
import { useRouter } from 'next/router'
import Moralis from "moralis";
import ReactTooltip from "react-tooltip";

type Props = {
    teamData: any,
}

const TeamFun = ({ teamData }: Props)  => {
    const router = useRouter();


    const [loading, setLoading] = useState(false);
    const {user, setUserData, userError, isUserUpdating, refetchUserData} = useMoralis();
    const [loader, setLoader] = useState("not-loaded");
    const [meme, setMeme] = useState({
        topText: "",
        bottomText: "",
        randomImage: "http://i.imgflip.com/1bij.jpg"
    })
    const [allMemes, setAllMemes] = useState([])

    /**
     useEffect takes a function as its parameter. If that function
     returns something, it needs to be a cleanup function. Otherwise,
     it should return nothing. If we make it an async function, it
     automatically retuns a promise instead of a function or nothing.
     Therefore, if you want to use async operations inside of useEffect,
     you need to define the function separately inside of the callback
     function, as seen below:
     */
    useEffect(() => {
        async function getMemes() {
            const res = await fetch("https://api.imgflip.com/get_memes")
            const data = await res.json()
            setAllMemes(data.data.memes)
        }

        getMemes()
    }, [])

    const getMemeImage= async (e) => {
        e.preventDefault();
        const randomNumber = Math.floor(Math.random() * allMemes.length)
        const url = allMemes[randomNumber].url;
        setMeme(prevMeme => ({
            ...prevMeme,
            randomImage: url
        }))
    }

    function handleChange(event) {
        const {name, value} = event.target
        setMeme(prevMeme => ({
            ...prevMeme,
            [name]: value
        }))
    }

    return (
        <>
            <div className={styles.pagetooltip}>
                <a data-tip='Hackathons can be stressful. Create random memes with your team at the beginning of a meeting to warm up!
Create and propose ideas for your collaboration. Use this DOA to make have more transparent decision making and accountability,
 by having team mates vote on any project suggestions'>Help</a>
                <ReactTooltip className='extraClass' delayHide={1000} effect='solid'/>
            </div>
            <div className={styles.container}>
                    <form className={styles.form}>
                        <div className={styles.formGroups}>
                            <input
                                type="text"
                                placeholder="Top text"
                                className="form--input"
                                name="topText"
                                value={meme.topText}
                                onChange={handleChange}
                            />
                        </div>
                        <div className={styles.formGroups}>
                            <input
                                type="text"
                                placeholder="Bottom text"
                                className="form--input"
                                name="bottomText"
                                value={meme.bottomText}
                                onChange={handleChange}
                            />
                        </div>
                        <div className={styles.formGroups}>
                            <button
                                className="form--button"
                                onClick={getMemeImage}
                            >
                                Get a new meme image 🖼
                            </button>
                        </div>
                        <div className={styles.formGroups}>
                            <div className="meme">
                                <img src={meme.randomImage} className="meme--image"/>
                                <h2 className="meme--text top">{meme.topText}</h2>
                                <h2 className="meme--text bottom">{meme.bottomText}</h2>
                            </div>
                        </div>
                    </form>
            </div>
        </>
    );
}
export default TeamFun;
