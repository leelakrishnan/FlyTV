import Head from 'next/head';
import  '../styles/Home.module.css';
import  styles  from '../styles/Home.module.css'
import { useRouter } from "next/router";
import Nav from '../components/Nav';
import React, { useEffect, useState } from 'react';
import { useMoralis } from "react-moralis";
import { useForm } from "react-hook-form";
import Loader from "../components/Loader";
import Profile from "../components/Profile";

let listOfTeams:string[] = [];
export default function TeamCreate() {
  
    const { user, Moralis, isAuthenticated } = useMoralis();
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
      const router = useRouter();
      const {setUserData, userError, isUserUpdating, refetchUserData} = useMoralis();
      const [teamId, setTeamId] = useState("");
      const [loading, setLoading] = useState("not-loaded");
     
      
      const getInitialState = () => {
        const value = "1";
        return value;
      };
    
      const [value, setValue] = useState(getInitialState);
      const [showChoices, setShowChoices] = useState(true);
      const [showTeamCreate, setShowTeamCreate] = useState(false);
      const [showList, setShowList] = useState(false);
      const [showVerify, setShowVerify] = useState(false);

      const handleChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
        setValue(e.target.value);

      };
 

      function cancelCreate(){
        setShowChoices(true);
        setShowList(false);
        setShowTeamCreate(false);


      }
    function saveChoice() {
          switch(value) {
              case '1':
                setShowChoices(false);
                setShowVerify(true);
               let listOfTeams =  getAllTeams();   
                
                break;
              case '2':
                setShowChoices(false);
                setShowTeamCreate(true);
            
                break;
              case '3':
                setShowChoices(false);
                setShowTeamCreate(true);
            
                break;
              case '4':
                setShowChoices(false);
                setShowTeamCreate(true);
              
                break;
              default:

          }

        }

        const saveNewTeam = async (
          tn : string,
          pi : string,
          lo : string,
          sk : string,
          m1 : string,): Promise<any> => {
         
        let dt = Math.floor(Date.now() / 1000);
        // save Team record
         const MTeam =  await Moralis.Object.extend("Team");
         const mteam = new MTeam();
        // cuser.set('muser', Moralis.User.current())
         mteam.set('createdAt', dt) 
         mteam.set('teamName', tn)
         mteam.set('projectIdea', pi)
         mteam.set('location', lo)
         mteam.set('skills', sk)
         mteam.set('member_1', m1)
   
         let response = await mteam.save();
           alert("saved");
           setShowTeamCreate(false);
      }

       const getAllTeams = async () => {
        const Teams = Moralis.Object.extend("Team");
        let query = new Moralis.Query(Teams);
        query.select( "location","projectIdea");
        query.notEqualTo("teamName", "x");
        const results = await query.find();
        
        listOfTeams = [];
        for (let i = 0; i < results.length; i++) {
            const object = results[i];
            listOfTeams[i] = object.id + " - "  + object.get("projectIdea");
        }

       return listOfTeams;
      }

function doSomething(){
  alert("got here");
}

function saveVerifyRandom(){

 }

 function saveVerify(){
    setShowList(true);
    setShowVerify(false);
    setShowList(true);
 }
        const onSubmit = async (data:any) => {
          console.log(data);
           let tn = data.teamName;
           let pi = data.projectIdea;
           let lo = data.location;
           let sk = data.skills;
           let m1 = data.member_1;

           const saveIt =  await saveNewTeam(
               tn, pi, lo, sk, m1);
               //, m2, m3, m4, m5, m6, m7);

        listOfTeams =  await getAllTeams();   
        setShowList(true);
            };   

  return (

<div className="choices">
<Nav/>
{showChoices ? (
  <><br /><br /><br /><br />
        <h3> Choose your preferred method of teaming up</h3><br /><br />
       <select value={value} onChange={handleChange} >
          <option value="1">I am looking for a team to join</option>
          <option value="2">I am hacking alone want to create a team</option>
          <option value="3">I have my own team members want to create a team</option>
          <option value="4">I am my own team</option>
        </select>
        
        <p></p>
        <br /><br /><br /><br /><button className={styles.teamButton} onClick={saveChoice}>
            Save Choice
          </button></>

):( 
              
  <h4></h4>

    
 )} 

{showVerify ? (
<div className={styles.verifyTop}>
<h2>Please verify by clicking either button below how we can get you into a team.</h2>
<p>Be aware that the first two options don't guarantee that you will get into the team that you want or even a team at all for certain.</p>
      <div className={styles.verifyGroup}>
       
        <div className={styles.verifyButtonRow}>
          <span className={styles.verifybtn}><button className={styles.teamButton} onClick={saveVerify}>
            Choose
          </button></span>
          <span className={styles.verifytxt}>I want to request to be in a certain team that I will choose.</span>
        </div>

        <div className={styles.verifyButtonRow}>
          <span className={styles.verifybtn}><button className={styles.teamButton} onClick={saveVerify}>
            Choose
          </button></span>
          <span className={styles.verifytxt}>I want to just be on a list of potential candidates and let a team choose me.</span>
        </div>

        <div className={styles.verifyButtonRow}>
          <span className={styles.verifybtn}><button className={styles.teamButton} onClick={saveVerifyRandom}>
            Choose
          </button></span>
          <span className={styles.verifytxt}>I want to be randomly matched to a team.</span>
        </div>  
      
      </div>

</div>

):(
<div></div>

)}





{showTeamCreate ? (

<div>
<div id="ttform">
          

<div className={styles.teamInstructions}>
      <p className={styles.teamP}>In order to create a team, you must have a project idea and enter yourself as the team leader ( member_1 ).</p>
      <p className={styles.teamP}>you can specify whether you are open to new, randomly matched team members to be added to your team, or if the team roster should be closed.</p>
      <p className={styles.teamP}>Additionally, you can enter more team members you already have agreed to have a team with in the other members input fields.</p>
      <p className={styles.teamP}>Only the team leader will be able to come back in and either remove members or add new members to the team.</p>
      <p className={styles.teamP}>Randomly matched members will not be allowed to quit a team without the team leaders permission, nor will they be allowed to be on more than one team at a time.</p>

</div>

<br /><br /><br /><br />
<h3>Create a Team</h3>
<div className={styles.teamcreatediv}>
<form onSubmit={handleSubmit(onSubmit)}>
     

    
        <div className="float-label">
        <input  {...register("projectIdea", { required: true, maxLength: 200 })} />
        <label htmlFor="projectIdea">Project Idea and Desired Platform</label>
        </div>
    
        <div className="float-label">
        <select {...register("location")}>
            <option value="U.S.A">Usa</option>
            <option value="Asia">Asia</option>
            <option value="Aust">Austrailia</option>
            <option value="Euro">Europe</option>
            <option value="Afri">Africa</option>
            <option value="S.A.">South America</option>
           
        </select>
        <label htmlFor="location">Location</label>
        </div>
    



      <br /><div><span><button className={styles.teamButton} type="submit">
                  Save Team
                </button></span><span>
                <button className={styles.teamButton3} type="button" onClick={cancelCreate}>
                  Cancel
                </button></span>
                </div>      
    </form>
    </div>
    </div>
</div>

):(             
  <><h1></h1><br /><br /></>
    
 )} 

{showList ? (
       <><div className={styles.listTop}>
          <h1>List All Teams</h1>
          <br /><br />
              <div>
                <span className={styles.tlistHead}>TeamID</span>
                <span  className={styles.tlistHeadR}>Mission</span>
              </div>
        </div>
        <div className={styles.tList}>
            {listOfTeams.map((_team, index) => (
              <div key={index}>
                <div className={styles.lot} onClick={doSomething}>
                  {_team}
                  
                </div>
              </div>))}
          </div></>
):(
  <div>
  </div>
)}
</div>
)};
