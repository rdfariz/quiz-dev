"use client"
import data from '@/app/data.json'
import { useEffect, useRef, useState } from 'react';
import { AlertTriangle, Trash, Check, X } from 'react-feather'
import short from 'short-uuid'
// import LottieData from '@/app/_assets/lottie/Animation - 1733357726977.json'
// import Lottie from 'lottie-react'

export default function Home() {
  const [listQuestion, setListQuestion]: any = useState(data)
  const [listPerson, setListPerson]: any = useState([])
  const [activePerson, setActivePerson]: any = useState(null)
  const inputRef: any = useRef(null)

  const [namePerson, setNamePerson] = useState("")
  const [isPlaying, setIsPlaying] = useState(false)
  const [isErrorRequired, setIsErrorRequired] = useState(false)
  const [isContinue, setIsContinue] = useState(false)
  const [isAllDone, setIsAllDone] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const asyncLocalStorage = {
    setItem(key: string, value: any) {
      if (typeof window !== "undefined") {
        return Promise.resolve().then(function () {
          localStorage.setItem(key, value);
        });
      }
    },
    getItem(key: string) {
      return Promise.resolve().then(function () {
        return localStorage.getItem(key);
      });
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      asyncLocalStorage.getItem('listPerson')
        .then((res: any) => {
          setListPerson(JSON.parse(res))
          setTimeout(() => {
            setIsLoading(false)
          }, 1500);
        })
    }
  }, [])
  
  const renderOptionSymbol = (index: number = 0) => {
    if (index === 0) {
      return 'A. '
    } else if (index === 1) {
      return 'B. '
    } else if (index === 2) {
      return 'C. '
    } else if (index === 3) {
      return 'D. '
    }
  }
  
  const getRandomQuestion = () => {
    const allQuestionRandom = listQuestion[Math.floor(Math.random() * listQuestion.length)]
    const questionNotAnswered = listQuestion.filter((item: any) => item.answered === false) 
    const res = questionNotAnswered[Math.floor(Math.random() * questionNotAnswered.length)]

    if (res) {
      const payloadQuestion = listQuestion.map((item: any) => item.idQuestion === res.idQuestion
        ? ({ ...item, answered: true })
        : item)
      setListQuestion(payloadQuestion)
    }

    return res || allQuestionRandom || listQuestion[0]
  }

  const handleKeyDown = (e: any) => {
    if (e.key === 'Enter') {
      handleAddPerson()
    }
  }

  const handleAddPerson = () => {
    if (!namePerson) {
      setIsErrorRequired(true)
      return
    }

    const userObj: any = { id: short.generate() || listPerson.length + 1, name: namePerson, isDone: false }
    const questionObj: any = getRandomQuestion()
    const personObj: any = { ...userObj, question: { ...questionObj }}

    try {
      // set active person if empty
      const payload: any = listPerson
      if (payload.length === 0 || (!activePerson && payload.length > 0)) {
        setActivePerson({ ...personObj })  
      }

      payload.push(personObj)
      setListPerson(payload)
    } catch (error) {
    } finally {
      setNamePerson("")
      watchingData()
      if (inputRef.current) {
        inputRef.current.focus()
      }

      if (typeof window !== "undefined") {
        localStorage?.setItem('listPerson', JSON.stringify(listPerson))
      }
    }
  }

  const handleAnswering = (option: any) => {
    handleNextPerson({ isTrue: option.value === true, ...option })
  }

  const handleNextPerson = (answer = {}) => {
    const newListPerson: any = listPerson.map((person: any) => person.id === activePerson.id ? { ...person, isDone: true, answer: { ...answer } } : person)
    setListPerson(newListPerson)
    const getNextPerson = newListPerson.filter((item: any) => !item.isDone)
    if (getNextPerson.length > 0) {
      const userObj = { id: getNextPerson[0].id, name: getNextPerson[0].name, isDone: false }
      const questionObj: any = getRandomQuestion()
      const personObj: any = { ...userObj, question: { ...questionObj }}
      setActivePerson({ ...personObj })
    } else {
      setIsPlaying(false)
      setActivePerson(null)
    }

    if (typeof window !== "undefined") {
      localStorage?.setItem('listPerson', JSON.stringify(newListPerson))
    }
  }

  const handleStartGame = (val: boolean = true) => {
    const activePerson = listPerson.filter((item: any) => !item.isDone)
    if (activePerson.length > 0) {
      setActivePerson(activePerson[0])
      setIsPlaying(val)
    }
  }

  const handleChangeInput = (val: any) => {
    setNamePerson(val)
    if (!val) {
      setIsErrorRequired(true)
    } else {
      setIsErrorRequired(false)
    }
  }

  const handleDeletePerson = (id: number) => {
    const newListPerson = listPerson.filter((item: any) => item.id !== id)
    setListPerson(newListPerson)
    if (typeof window !== "undefined") {
      localStorage?.setItem('listPerson', JSON.stringify(newListPerson))
    }

    if (activePerson && activePerson.id === id) {
      const getNextPerson = newListPerson.filter((item: any) => !item.isDone)
      if (getNextPerson.length > 0) {
        const userObj = { id: getNextPerson[0].id, name: getNextPerson[0].name, isDone: false }
        const questionObj = getRandomQuestion()
        const personObj: any = { ...userObj, question: { ...questionObj }}
        setActivePerson({ ...personObj })
      } else {
        setActivePerson(null)
      }
    }

    watchingData()
  }

  const resetForm = () => {
    setNamePerson('')
    setIsErrorRequired(false)
  }
  
  const watchingData = () => {
    const personDone = listPerson.filter((item: any) => item.isDone === true)
    const allDone = listPerson.filter((item: any) => item.isDone === false && !item?.answer).length === 0 && listPerson.length > 0

    if (allDone) {
      setIsAllDone(true)
    } else {
      setIsAllDone(false)
    }

    if (personDone && personDone.length > 0) {
      setIsContinue(true)
    } else {
      setIsContinue(false)
    }
  }

  useEffect(() => {
    resetForm()
  }, [isPlaying])

  useEffect(() => {
    watchingData()
  })

  return (
    <div className="h-[90vh] overflow-auto py-6 sm:pt-12 sm:pb-8 px-3 sm:px-6 lg:px-8 xl:px-16">
      { !isLoading ? (
        <>
          <div className="relative top-0 left-0 w-full flex items-center flex-col flex-wrap mb-2">
            <div className="w-full flex justify-center ">
              <span className="w-full sm:w-[370px] h-[84px] gTitle cursor-pointer" onClick={() => handleStartGame(false)}>
                <h2 className="mt-5 sm:mt-3 text-xl sm:text-2xl">Quizz Dev / Edu</h2>
                <p className="font-bold text-sm mt-0 sm:mt-1 text-[#868d96] opacity-90">by Ranty & Fariz</p>
              </span>
            </div>
          </div>
          {
            isPlaying ? (
              <div className="flex flex-col flex-wrap gap-4 w-full py-4 my-6">
                {
                  activePerson ? (
                    <div className="mb-4">
                      <h2 className="text-lg break-all line-clamp-1">Peserta: <strong>{activePerson.name}</strong></h2>
                      <p className="mb-6 text-lg font-semibold">
                        {activePerson.question.question}</p>
                      <div className="flex flex-col flex-wrap justify-center items-start gap-6">
                        {activePerson.question.listOptions?.map((option: any, childIndex: any) => (
                          <button
                            className="btBlueBig px-4 py-2 font-bold flex w-full justify-center items-center flex-wrap cursor-pointer"
                            onClick={() => handleAnswering(option)}
                            key={childIndex}
                          >
                            <strong>{renderOptionSymbol(childIndex)} {option.label}</strong>
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : null
                }
              </div>
            ) : (
              <div className="grid w-full my-6">
                <div className="relative top-0 left-0 bg-white">
                  <div className="rounded-[16px] bg-white flex flex-col flex-wrap">
                    <div className="w-full">
                      <input
                        autoFocus
                        className="w-full p-4 rounded-xl text-md sm:text-lg font-bold"
                        placeholder="Nama Peserta"
                        value={namePerson}
                        onChange={(e) => handleChangeInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        type="text"
                        ref={inputRef}
                      />
                      {
                        isErrorRequired ? (
                          <div className="flex items-center gap-2 mt-2 border rounded-xl px-4 py-2 text-sm bg-[#F23B78] text-white">
                            <AlertTriangle color="#FFFFFF" size={18} />Nama Peserta Harus Diisi
                          </div>
                        ) : null
                      }
                    </div>
                    <div className="w-full grid sm:grid-cols-2 gap-5 mt-5 px-1 sm:px-0">
                      <button className="w-full btBlueBig font-bold flex gap-4 justify-center items-center flex-wrap cursor-pointer" onClick={handleAddPerson}>
                        <strong>Tambah Peserta</strong>
                      </button>
                      <button
                        className="w-full btYellowBig font-bold flex gap-4 justify-center items-center flex-wrap cursor-pointer"
                        disabled={isAllDone || listPerson.length <= 0}
                        onClick={() => isAllDone ? {} : handleStartGame(true)}
                      >
                        <strong>
                          {isContinue && !isAllDone ? 'Lanjutkan!' : 'Mulai!'}
                        </strong>
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="mt-12">
                  <div className="grid sm:grid-cols-2 gap-4 sm:gap-5">
                    { listPerson && listPerson.length > 0 ? (
                      <>
                        {listPerson.map((person: any, index: number) => (
                          <div
                            className={`box w-full flex justify-between overflow-hidden gap-2 p-2 sm:p-4 border rounded-xl ${index < listPerson.length - 1 ? '' : ''}`}
                            key={index}
                          >
                            <div className="flex gap-3 w-full pl-1">
                              {
                                person.isDone ? (
                                  <>
                                    {person.answer.isTrue ? (
                                      <Check className="m-auto" color="#73BE68" size={16} />
                                    ) : (
                                      <X className="m-auto"  color="#F23B78" size={16} />
                                    )}
                                  </>
                                ) : null
                              }
                              <p className="flex-1 my-auto font-bold text-md sm:text-lg text-[#8B8B8B] text-left line-clamp-1 break-all">{person.name || '-'}</p>
                            </div>
                            <div className="flex gap-2">
                              {/* {
                                person.isDone && person.answer ? (
                                  <button
                                    className="bg-[#FFBF01] rounded-xl p-2"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      handleDeletePerson(person.id)
                                    }}
                                  >
                                    <File color="#FFFFFF" size={18} />
                                  </button>
                                ) : null
                              } */}
                              <button
                                className="bg-[#F23B78] rounded-xl p-2"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleDeletePerson(person.id)
                                }}
                              >
                                <Trash color="#FFFFFF" size={16} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </>
                    ) : (
                      <div className="col-span-full">
                        {/* <div className="relative h-[220px] w-full">
                          <Image className="object-contain" alt="" fill src="/images/notfound.png" />
                        </div> */}
                        <p className="font-semibold text-[#868d96] opacity-90 text-center my-4">Belum ada peserta</p>
                      </div>
                    ) }
                  </div>
                </div>
              </div>
            )
          }
        </>
      ) : (
        <div className="flex flex-col items-center flex-wrap">
          {/* <Lottie style={{ width: '50%' }} animationData={LottieData} loop={true} /> */}
          <p className="relative z-10 font-semibold text-[#868d96] mt-[-40px]">Memuat..</p>
        </div>
      )}
    </div>
  );
}
