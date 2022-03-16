// this component is to create an example of a hardcoded but easily modifiable react-checklist
// checklist for team project management, doubled down on documentation thanks to Brian
// correct sequence obtained thanks to Shomari
import React from "react";

import { useChecklist } from "react-checklist";

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

function Project() {
  const { handleCheck, isCheckedAll, checkedItems } = useChecklist(data, {
    key: "_id",
    keyType: "number",
  });

  // console.log(checkedItems); // Set(0) - handling with Set
  // console.log([...checkedItems]); // []     - handling with Array
  return (
    <div>
      <h1>Project Man 💸 Checklist</h1>
      <h2>Using react-checklist in the component?</h2>
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
  );
}

// function Project() {
//   return (
//     <div>
//       <h1>Project Man 💸 Checklist</h1>
//       <h2>Using react-checklist in the component?</h2>
//     </div>
//   );
// }

export default Project;
