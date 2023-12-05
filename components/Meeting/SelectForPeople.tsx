import { IPerson } from "@models";
import { useState } from "react";

const SelectForPeople = ({people, onChange:change}:{
  people: IPerson[],
  onChange: (val:string) => void,
}) => {
  const [selectedPerosn, setSelectedPerson] = useState('');

  const handleChange = (e) => {
    setSelectedPerson(e.target.value);
    change(e.target.value);
  }

  return (
    <select className="border rounded-md focus:outline-none" value={selectedPerosn} onChange={handleChange}>
      {
        people.map(person => (
          <option value={person._id}>{person.name}</option>
        ))
      }
    </select>
  )
}

export default SelectForPeople;