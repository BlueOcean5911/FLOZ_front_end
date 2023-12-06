import React, { useEffect, useState } from "react";
import SelectForPeople from "./SelectForPeople";

const Transcript = ({ transcript: content, people, assignPeopleMap, setAssignPeopleMap }) => {

  const [transcript, setTranscript] = useState([]);

  console.log("transcript hereis ");

  const processTranscript = () => {
    const transcriptContent = content || ""
    const conversationData = [];
    transcriptContent.split('\n').forEach((conversationForEach) => {
      const items = conversationForEach.split(':');
      if (items.length > 1) {
        conversationData.push({
          name: items[0],
          content: items[1]
        })
      }
    })
    setTranscript(conversationData);
  }

  useEffect(() => {
    processTranscript();
  }, [content])

  const handleChange = (val, speakerName) => {
    // TODO handle change assigned name
    const tempAssignPeopleMap = {...assignPeopleMap};
    tempAssignPeopleMap[speakerName] = val;
    setAssignPeopleMap(tempAssignPeopleMap);
  }

  return (
    <div className="flex font-[13px] h-full flex-col space-y-2  mb-[26px] overflow-auto leading-5 shadow-sm p-10">
      {transcript.map((item, index) => (
        <div key={index}>
          <div className="flex gap-2">
            <h3 className="text-xl font-bold">{item.name}</h3>
            <SelectForPeople
              people={people}
              value={assignPeopleMap[item.name]}
              defaultValue={assignPeopleMap[item.name]}
              name={item.name}
              onChange={(val) => handleChange(val, item.name)} />
          </div>
          <p>{item.content}</p>
        </div>
      ))}
    </div>
  )
}

export default Transcript;