"use client"
import data from '@/app/data.json'
import { useEffect, useState } from 'react';

export default function Home() {
  const [listQuestion, setListQuestion] = useState(data)
  const [listPerson, setListPerson] = useState([])
  const [activePerson, setActivePerson] = useState(null)
  const [activeQuestion, setActiveQuestion] = useState(null)
  
  const [namePerson, setNamePerson] = useState("")
  const [historyAnswered, setHistoryAnswered] = useState([])
  
  const renderOptionSymbol = (index: number = 0) => {
    if (index === 0) {
      return 'A. '
    } else if (index === 1) {
      return 'B. '
    } else if (index === 2) {
      return 'C. '
    }
  }
  
  const getRandomQuestion = () => {
    let questionNotAnswered = listQuestion.filter(item => item.answered === false); 
    let res = questionNotAnswered[Math.floor(Math.random() * questionNotAnswered.length)]
    return res
  }

  const handleAddPerson = () => {
    const payload = listPerson.filter((item) => !item.isDone)
    const userObj = { name: namePerson, isDone: false }
    const questionObj = getRandomQuestion()
    console.log(listQuestion)
    if (payload.length === 0) {
      setActivePerson({...userObj, ...questionObj})  
    }
    payload.push(userObj)
    setListPerson(payload)
    setNamePerson("")
  }

  const handleAnswering = (option) => {
    const payload = activePerson
    if (option.value === true) {
      setHistoryAnswered({ isTrue: true, data: { ...payload } })
    } else {
      setHistoryAnswered({ isTrue: false, data: { ...payload } })
    }
    const newListPerson = listPerson.map((person) => person.name === activePerson.name ? { ...person, isDone: true } : person)
    setListPerson(newListPerson)
    const getNextPerson = newListPerson.filter((item) => !item.isDone)
    if (getNextPerson.length > 0) {
      const getRandomNextPerson = getNextPerson[Math.floor(Math.random() * getNextPerson.length)]
      setActivePerson(getRandomNextPerson)
    } else {
      setActivePerson(null)
      alert('tambah orang dulu')
    }
  }

  
  return (
    <div className="p-4">
      <div className="flex gap-2 mb-4 ">
        <input className="border" value={namePerson} onChange={(e) => setNamePerson(e.target.value)}></input>
        <button className="border p-2" onClick={handleAddPerson}>Tambah</button>
      </div>
      <div className="flex flex-col gap-4 mb-2">
        {JSON.stringify(listPerson).toString()}<br/><br/>
        {JSON.stringify(activePerson)?.toString()}
      </div>
      {
        activePerson ? (
          <div className="mb-4">
            <p>{activePerson.question}</p>
            <div className="flex flex-col flex-wrap justify-center items-start gap-4">
              {activePerson.listOptions.map((option, childIndex) => (
                <div className="border cursor-pointer" onClick={() => handleAnswering(option)}>
                  {renderOptionSymbol(childIndex)} {option.label}
                </div>
              ))}
            </div>
          </div>
        ) : null
      }

      
      <div className="border mt-8">
      {
        JSON.stringify(historyAnswered)
      }
      </div>
    </div>
  );
}
