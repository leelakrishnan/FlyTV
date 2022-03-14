import Head from 'next/head';
import  '../styles/Home.module.css';
import  styles  from '../styles/Home.module.css'

import Nav from '../components/Nav';
import React, { useState } from 'react';
//import ReactDOM from 'react-dom';
import { useMoralis } from "react-moralis";
import { useForm } from "react-hook-form";





export default function TeamCreate() {
  
    const { user, Moralis, isAuthenticated } = useMoralis();
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    //const onSubmit = (data: any) => console.log(data);
    
    const teams: string[] = [];
    const itemList: {} | null | undefined = [];
const [teams2, setTeams2]= useState(null)


    //let items=['Item 1','Item 2','Item 3','Item 4','Item 5'];
    //let itemList=[];
    //let yy = 0;
    //teams.forEach((item,index)=>{
     // itemList.push( <li key={index}>{item}</li>)
    //})
    
    //const componentArray = [
    //  <p key="example-key-1">{teams[0]}</p>,
    //  <p key="example-key-2">{teams[1]}</p>,
    //  ];

      
      const getInitialState = () => {
        const value = "1";
        return value;
      };
    
      const [value, setValue] = useState(getInitialState);
      const [showChoices, setShowChoices] = useState(true);
      const [showTeamCreate, setShowTeamCreate] = useState(false);
      const [showList, setShowList] = useState(false);

      const handleChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
        setValue(e.target.value);

      };
 
    function saveChoice() {
          switch(value) {
              case '1':
                setShowChoices(false);
                setShowList(true);
                break;
              case '2':
                setShowChoices(false);
                setShowList(true);
                break;
              case '3':
                setShowChoices(false);
                setShowTeamCreate(true);
                setShowList(true);
                break;
              case '4':
                setShowChoices(false);
                setShowTeamCreate(true);
                setShowList(true);
                break;
              default:

          }

        }


        const saveNewTeam = async (
          tn : string,
          pi : string,
          lo : string,
          sk : string,
          m1 : string,
          m2 : string,
          m3 : string,
          m4 : string,
          m5 : string,
          m6 : string,
          m7 : string,): Promise<any> => {
   
        let dt = Math.floor(Date.now() / 1000);
     
         const MTeam = Moralis.Object.extend("Team");
         const mteam = new MTeam();
        // cuser.set('muser', Moralis.User.current())
         mteam.set('createdAt', dt) 
         mteam.set('teamName', tn)
         mteam.set('projectIdea', pi)
         mteam.set('location', lo)
         mteam.set('skills', sk)
         mteam.set('member_1', m1)
         mteam.set('member_2', m2)
         mteam.set('member_3', m3)
         mteam.set('member_4', m4)
         mteam.set('member_5', m5)
         mteam.set('member_6', m6)
         mteam.set('member_7', m7)
         /*
         cuser.save().then(function(response) {
             alert("success");
           }).catch(function(error) {
             alert("error");
           });
         */
   
         let response = mteam.save();
           console.log(response);
           alert("saved");
           setShowTeamCreate(false);
       }


       const getAllTeams = async () => {
        const Teams = Moralis.Object.extend("Team");
        const query2 = new Moralis.Query(Teams);
        query2.select("teamName", "projectIdea", "location");
        query2.notEqualTo("teamName", "x");
        const results = await query2.find();
        alert("successfully retreieved " + results.length + "records");
        
        
        for (let i = 0; i < results.length; i++) {
          const object = results[i];
         // alert(object.id + " - " + object.get("teamName"));
         let xx = object.get("teamName");
            teams[i] = xx;
        }
      
      //  teams.forEach((item,index)=>{
       //    itemList[index] = (<li key={index}>{item}</li>);
      //  })
      }


        const onSubmit = async (data:any) => {
          console.log(data);
           let tn = data.teamName;
           let pi = data.projectIdea;
           let lo = data.location;
           let sk = data.skills;
           let m1 = data.member_1;
           let m2 = data.member_2;
           let m3 = data.member_3;
           let m4 = data.member_4;
           let m5 = data.member_5;
           let m6 = data.member_6;
           let m7 = data.member_7;
           
         
           const saveIt = await saveNewTeam(
               tn, pi, lo, sk, m1, m2, m3, m4, m5, m6, m7);

               const listIt =  getAllTeams();  
            };   
           
            

  return (

<div className="choices">

{showChoices ? (
  <><br /><br />
        <h3> Choose your preferred method of teaming up</h3><br /><br />
        <select value={value} onChange={handleChange}>
          <option value="1">I am looking for a team to join</option>
          <option value="2">I am hacking alone want to create a team</option>
          <option value="3">I have my own team members want to create a team</option>
          <option value="4">I am my own team</option>
        </select>
        <p></p>
        <br /><br /><button className={styles.teamButton} onClick={saveChoice}>
            Save Choice
          </button></>

):( 
              
  <h4>----</h4>

    
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

<div className={styles.teamInstructions}>
      <p className={styles.teamP}>In order to create a team, you must have a project idea and enter yourself as the team leader ( member_1 ).</p>
      <p className={styles.teamP}>you can specify whether you are open to new, randomly matched team members to be added to your team, or if the team roster should be closed.</p>
      <p className={styles.teamP}>Additionally, you can enter more team members you already have agreed to have a team with in the other members input fields.</p>
      <p className={styles.teamP}>Only the team leader will be able to come back in and either remove members or add new members to the team.</p>
      <p className={styles.teamP}>Randomly matched members will not be allowed to quit a team without the team leaders permission, nor will they be allowed to be on more than one team at a time.</p>

</div>
<h3>Create a Team</h3>
<div className={styles.teamcreatediv}>
<form onSubmit={handleSubmit(onSubmit)}>
     

        <div className="float-label">
        <input  {...register("teamName")}type="text" />
        <label htmlFor="teamName">Team Name</label>
        </div>
    
        <div className="float-label">
        <input  {...register("projectIdea", { required: true, maxLength: 200 })} />
        <label htmlFor="projectIdea">Project Idea</label>
        </div>
    
        <div className="float-label">
        <select {...register("location")}>
            <option value="USA">Usa</option>
            <option value="Asia">Asia</option>
            <option value="Austrailia">Austrailia</option>
            <option value="Europe">Europe</option>
            <option value="Africa">Africa</option>
            <option value="SouthAmerica">South America</option>
            <option value="Other">other</option>
        </select>
        <label htmlFor="location">Location</label>
        </div>
    
        <div className="float-label">
        <input  {...register("skills", { required: true, maxLength: 200 })} />
        <label htmlFor="skills">Skills</label>
        </div>

        <div  className="float-label">
        <input  {...register("member_1", { required: true, maxLength: 100 })} />
        <label htmlFor="member_1">member_1</label>
        </div>

        <div className="float-label">
        <input  {...register("member_2")} />
        <label htmlFor="member_2">member_2</label>
        </div>
      
        <div className="float-label">
        <input  {...register("member_3")} />
        <label htmlFor="member_3">member_3</label>
        </div>

        <div className="float-label">
        <input  {...register("member_4")} /> 
        <label htmlFor="member_4">member_4</label>
        </div>

        <div className="float-label">
        <input  {...register("member_5")} />
        <label htmlFor="member_5">member_5</label>
        </div>
    
        <div className="float-label">
        <input  {...register("member_6")} />
        <label htmlFor="member_6">member_6</label>
        </div>
     
      <div  className="float-label">
      <input  {...register("member_7")} /> 
      <label htmlFor="member_7">member_7</label>
      </div>

      <br /><button className={styles.teamButton} type="submit">
                  Save Team
                </button>
            
    </form>
    </div>
    </div>
</div>

):(             
  <><h1></h1><br /><br /></>
    
 )} 

{showList ? (
       <div>
       <h1>List All Teams</h1>
        </div>
    

):(
<div>------
  </div>

)}



</div>

  )};
