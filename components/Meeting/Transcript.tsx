import React, { useEffect, useState } from "react";

const testData = [
  {
    name: 'Joseph',
    content: " Yeah. Cool. It says I could stay or leave the meeting. I'll stay. Okay. Sweet. Hey, Joseph. How's it going? So currently, I'm working on a project. For a residential project, in Berkeley Downtown. And then, the client is asking me for a quote. So I would like to know how much exactly to, it's going to cost. Can you do, like, the cost estimation for me for adding a new window to the bathroom? "
  },
  {
    name: 'Hania',
    content: " Hi, Hania. Yeah. We could try doing the cost estimation for a new window. I think we could have a quote for you ready in about a week from actual subcontractors, but I'm thinking it's gonna be roughly 300 to put in a new window in the bathroom with the current design. "
  },
  {
    name: 'Joseph',
    content: ' I see. Can you send me multiple like, windows, with different price and types. So I can do a comparison with these cost estimation. '
  },
  {
    name: 'Hania',
    content: " Sure. I'll make sure to send you some different window types tonight. I'll make sure to make a note of that. Off the top of my head, some different types that I know about are Sierra Pacific And Marvin Sierra Pacific being the cheaper option normally around 100 to 200 depending on the size. And then there's Marvin, which is the highest quality epid window, which could be a lot higher, maybe 300 to 350, but it has better quality since the place in downtown Berkeley has a lot of, a lot of salt in the air. So the the materials on the Marvin window will probably be better. "
  },
  {
    name: 'Joseph',
    content: " Okay. That's good information to know. Okay. I would use the tool to send you a e a follow-up email so you got all the stuff you needed. Thank you for the conversation. Sounds good. Talk later. Yep. See you later. Bye."
  }
]

const Transcript = () => {

  const [transcript, setTranscript] = useState([]);

  useEffect(() => {
    setTranscript(testData);
  }, [])

  return (
    <div className="flex font-[13px] h-full flex-col space-y-2  mb-[26px] overflow-auto leading-5 shadow-sm p-10">
      {transcript.map((item, index) => (
              <div key={index}>
                <h3 className="text-xl font-bold">{item.name}</h3>
                <p>{item.content}</p>
              </div>
        ))}
    </div>
  )
}

export default Transcript;