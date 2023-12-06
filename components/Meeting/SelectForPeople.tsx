import { IPerson } from "@models";
import { useState } from "react";

const SelectForPeople = ({people, name, value, onChange:change, defaultValue,}:{
  people: IPerson[],
  onChange: (val:string) => void,
  defaultValue:string,
  name:string,
  value:string,
}) => {
  const [selectedPerosn, setSelectedPerson] = useState('');

  const handleChange = (e) => {
    setSelectedPerson(e.target.value);
    change(e.target.value);
  }

  return (
    <select className="border rounded-md focus:outline-none" defaultValue={defaultValue} value={value} onChange={handleChange}>
      <option value=""></option>
      {
        people.map(person => (
          <option value={person.name}>{person.name}</option>
        ))
      }
    </select>
  )
}

export default SelectForPeople;