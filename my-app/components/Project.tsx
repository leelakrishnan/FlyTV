// this component is to create an example of a hardcoded but easily modifiable react-checklist
// checklist for team project management.
// correct sequence obtained thanks to Shomari
import React, {useEffect, useState} from "react";

import { useChecklist } from "react-checklist";
import styles from "../styles/Form.module.css";
import {useMoralis} from "react-moralis";

const data = [
  { _id: 1, label: "warm up" },
  { _id: 2, label: "team >= 3" },
  { _id: 3, label: "brainstorm" },
  { _id: 4, label: "roadmaps(s)" },
  { _id: 5, label: "agree on idea(s)" },
  { _id: 6, label: "GitHub activities" },
  { _id: 7, label: "#BUIDL prototype(s)" },
  { _id: 8, label: "begin documentation" },
  { _id: 9, label: "meeting(s) with mentors" },
  { _id: 10, label: "help each other get unstuck" },
  { _id: 11, label: "Next Steps 🔘🔘🔘 into Flightpath 🚀" },
  { _id: 12, label: "completed documentation (demo video!!!)" },
  { _id: 13, label: "BadgeReward Ceremony (completed feedback loop!)" },
  { _id: 14, label: "Submitted Final Project!!!!!!!!!!!!!!!!!!!!!!!!!!" },
];

type Props = {
  teamData: any,
}

const TeamProject = ({ teamData }: Props)  => {

  const {handleCheck, isCheckedAll, checkedItems} = useChecklist(data, {
    key: "_id",
    keyType: "number",
  });
  const [loading, setLoading] = useState(false);
  const {user, setUserData, userError, isUserUpdating, refetchUserData} = useMoralis();
  const [loader, setLoader] = useState("not-loaded");

  useEffect(() => {
    setLoader("loaded");

  }, [user]);

  return (
      <>
        <div className={styles.container}>
          {loader == "loaded" &&
              <>
                <form className={styles.form}>
                  <h1>Project Man 💸 Checklist</h1>
                  <div className={styles.formGroups}>
                    <ul>
                      <li>
                        <input
                            type="checkbox"
                            onChange={handleCheck} // 1
                            checked={isCheckedAll} // 2
                        />
                        <label>Check All</label>
                      </li>

                      {data.map((v, i) => (
                          <li key={i}>
                            <input
                                type="checkbox"
                                data-key={v._id} // 3
                                onChange={handleCheck} // 4
                                checked={checkedItems.has(v._id)} // 5
                            />
                            <label>{v.label}</label>
                          </li>
                      ))}
                    </ul>
                  </div>
                </form>
              </>
          }
        </div>
      </>
  );
}

export default TeamProject;
