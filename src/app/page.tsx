"use client"
import data from '@/app/data.json'
import { useEffect, useState } from 'react';
import { Plus, Trash, CheckCircle, XCircle } from 'react-feather'

export default function Home() {
  const [listQuestion, setListQuestion]: any = useState(data)
  const [listPerson, setListPerson]: any = useState([])
  const [activePerson, setActivePerson]: any = useState(null)

  const [namePerson, setNamePerson] = useState("")
  const [historyAnswered, setHistoryAnswered] = useState([])
  const [isShowResults, setIsShowResults] = useState(false)
  
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
    let questionNotAnswered = listQuestion.filter((item: any) => item.answered === false); 
    let res = questionNotAnswered[Math.floor(Math.random() * questionNotAnswered.length)]
    return res || listQuestion[0]
  }

  const handleAddPerson = () => {
    const userObj: any = { id: listPerson.length + 1, name: namePerson, isDone: false }
    const questionObj: any = getRandomQuestion()
    
    // get list yang blm menjawab
    try {
      const payload: any = listPerson
      // .filter((item) => !item.isDone)
      const payloadQuestion = listQuestion.map((item: any) => item.idQuestion === questionObj.idQuestion
        ? ({ ...item, answered: true })
        : item)
      
      if (payload.length === 0 || (!activePerson && payload.length > 0)) {
        setActivePerson({...userObj, ...questionObj})  
      }

      payload.push(userObj)
      setListPerson(payload)
      setListQuestion(payloadQuestion)
    } catch (error) {
      console.log(error)
    } finally {
      setNamePerson("")
    }
  }

  const handleAnswering = (option: any) => {
    const historyPayload: any = historyAnswered
    // cek jawaban
    if (option.value === true) {
      historyPayload.push({ isTrue: true, data: { ...activePerson } })
      setHistoryAnswered(historyPayload)
    } else {
      historyPayload.push({ isTrue: false, data: { ...activePerson } })
      setHistoryAnswered(historyPayload)
    }

    handleNextPerson()
  }

  const handleNextPerson = () => {
    const newListPerson: any = listPerson.map((person: any) => person.id === activePerson.id ? { ...person, isDone: true } : person)
    setListPerson(newListPerson)
    const getNextPerson = newListPerson.filter((item: any) => !item.isDone)
    console.log(getNextPerson)
    if (getNextPerson.length > 0) {
      const userObj = { id: getNextPerson[0].id, name: getNextPerson[0].name, isDone: false }
      const questionObj = getRandomQuestion()
      setActivePerson({ ...userObj, ...questionObj })
    } else {
      setActivePerson(null)
    }
  }


  return (
    <div className="px-4">
      <div className="flex justify-between py-2 sticky w-full bg-white border-b mb-4 gap-4">
        <div className="p-2 flex justify-between items-center gap-2 rounded-full border overflow-hidden">
          <input className="inline-block px-4 py-2 rounded-xl text-sm border-none outline-none" placeholder="Nama Peserta"  value={namePerson} onChange={(e) => setNamePerson(e.target.value)} />
          <div className="cursor-pointer flex justify-center items-center w-10 h-10 border rounded-full" onClick={handleAddPerson}>
            <Plus color="#363848" size={18}/>
          </div>
        </div>
      </div>
      
      <div className="grid md:grid-cols-2 gap-4">
        <div className="p-4 border rounded-[16px] flex flex-col flex-wrap gap-4">
          {
            activePerson ? (
              <div className="mb-4">
                <h2>Penjawab: {activePerson.name}</h2>
                <p className="mb-2">{activePerson.question}</p>
                <div className="flex flex-col flex-wrap justify-center items-start gap-4">
                  {activePerson.listOptions?.map((option, childIndex) => (
                    <div className="rounded-[16px] px-4 py-2 border cursor-pointer" onClick={() => handleAnswering(option)}>
                      {renderOptionSymbol(childIndex)} {option.label}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p>Belum ada peserta aktif</p>
            )
          }
        </div>

        {
          listPerson && listPerson.length > 0 ? (
            <div className="p-4 rounded-[16px] border max-h-[300px] overflow-auto">
              <p className="px-4 py-2">List Status Peserta</p>
              <div>
                {listPerson.map((person, index) => (
                  <div className="text-sm flex justify-between border rounded-[16px] px-4 py-2 my-2" key={index}>
                    <div className="flex gap-4">
                      {person.isDone ? <CheckCircle /> : <XCircle />}
                      <p className="text-left line-clamp-1">{person.name || '-'}</p>
                    </div>
                    <button><Trash /></button>
                  </div>
                ))}
              </div>
              
              {
                historyAnswered.length > 0 && !activePerson ? (
                  <button className="bg-green-400 text-white border rounded-full px-4 py-2" onClick={() => setIsShowResults(!isShowResults)}>Lihat Hasil</button>
                ) : null
              }
            </div>
          ) : null
        }

        {
          isShowResults ? (
            <div className="col-span-2">
              <div className="grid md:grid-cols-2 border border rounded-[16px] overflow-hidden">
                <div className="flex flex-wrap flex-col border">
                  <div className="w-full text-center p-2 bg-red-400 text-white">
                    Menjawab Salah
                  </div>
                  <div className="max-h-[300px] overflow-auto">
                    {
                      historyAnswered.map((item, index) => !item.isTrue && (
                        <div className="p-2 text-left" key={index}>
                          {item.data.name || '-'}
                        </div>
                      ))
                    }
                  </div>
                </div>
                <div className="flex flex-wrap flex-col border">
                  <div className="w-full text-center p-2 bg-green-400 text-white">
                    Menjawab Benar
                  </div>
                  <div className="max-h-[300px] overflow-auto">
                    {
                      historyAnswered.map((item, index) => item.isTrue && (
                        <div key={index}>
                          {item.data.name || '-'}
                        </div>
                      ))
                    }
                  </div>
                </div>
              </div>
            </div>
          ) : null
        }
      </div>
      
    </div>
  );
}
