"use client"
import dataQuestion from '@/app/data.json'
import { useEffect, useRef, useState } from 'react';
import { AlertTriangle, Trash, Filter, ChevronDown, ChevronUp } from 'react-feather'
import short from 'short-uuid'
import CardPerson from '@/app/_components/card-person'
// import LottieData from '@/app/_assets/lottie/Animation - 1733357726977.json'
// import Lottie from 'lottie-react'

export default function Home() {
  const [listQuestion, setListQuestion]: any = useState(dataQuestion)
  const [listPerson, setListPerson]: any = useState([])
  const [activePerson, setActivePerson]: any = useState(null)
  const inputRef: any = useRef(null)

  const [namePerson, setNamePerson] = useState("")
  const [isPlaying, setIsPlaying] = useState(false)
  const [isErrorRequired, setIsErrorRequired] = useState(false)
  const [isContinue, setIsContinue] = useState(false)
  const [isAllDone, setIsAllDone] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isCollapse, setIsCollapse] = useState(false)

  useEffect(() => {
    try {
      if (typeof window !== "undefined" && localStorage) {
        const getItem = (key: string) => {
          return Promise.resolve().then(function () {
            return localStorage.getItem(key) || '';
          });
        }

        getItem('listPerson')
          .then((res: any) => {
            setListPerson(JSON.parse(res))
          }).finally(() => {
            setTimeout(() => {
              setIsLoading(false)
            }, 1000);
          });
      }
    } catch (error) {
      console.error('Error while setting data in localStorage:', error);
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
    const shuffledQuestions = listQuestion.map((item: any) => {
      return {
        ...item,
        listOptions: item.listOptions.sort(() => Math.random() - 0.5)
      }
    });

    const allQuestionRandom = shuffledQuestions[Math.floor(Math.random() * shuffledQuestions.length)]
    const questionNotAnswered = shuffledQuestions.filter((item: any) => item.answered === false)
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

    const userObj: any = { id: short?.generate() || listPerson.length + 1, name: namePerson, isDone: false }
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

      try {
        if (typeof window !== "undefined" && localStorage) {
          localStorage?.setItem('listPerson', JSON.stringify(listPerson))
        }
      } catch (error) {
        console.error('Error while setting data in localStorage:', error);
      }
    }
  }

  const handleSelected = (person: any) => {
    if (!person.isDone) {
      setActivePerson({...person})
      setIsPlaying(true)
    }
    return
  }

  const handleAnswering = (option: any) => {
    handleNextPerson({ isTrue: option.value === true, ...option })
  }

  const handleNextPerson = (answer = {}) => {
    const newListPerson: any = listPerson.map((person: any) => person.id === activePerson.id ? { ...person, isDone: true, answer: { ...answer } } : person)
    setListPerson(newListPerson)
    const getNextPerson = newListPerson.filter((item: any) => !item.isDone)
    if (getNextPerson.length > 0) {
      setActivePerson({ ...getNextPerson[0] })
    } else {
      setIsPlaying(false)
      setActivePerson(null)
    }

    try {
      if (typeof window !== "undefined" && localStorage) {
        localStorage?.setItem('listPerson', JSON.stringify(newListPerson))
      }
    } catch (error) {
      console.error('Error while setting data in localStorage:', error);
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
    if (!id) return
    const newListPerson = listPerson.filter((item: any) => item.id !== id)
    setListPerson(newListPerson)
    try {
      if (typeof window !== "undefined" && localStorage) {
        localStorage?.setItem('listPerson', JSON.stringify(newListPerson))
      }
    } catch (error) {
      console.error('Error while setting data in localStorage:', error);
    }

    if (activePerson && activePerson.id === id) {
      const getNextPerson = newListPerson.filter((item: any) => !item.isDone)
      if (getNextPerson.length > 0) {
        const personObj: any = { ...getNextPerson[0] }
        setActivePerson({ ...personObj })
      } else {
        setActivePerson(null)
      }
    }

    watchingData()

    const filteredList = getFilteredList(newListPerson);
    if (filteredList.length === 0) {
      setFilterStatus('all')
    }
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
    handleFilterChange('all')
  }, [isPlaying])

  useEffect(() => {
    watchingData()
  })

  const [filterStatus, setFilterStatus] = useState('all')
  const handleFilterChange = (status: any) => {
    setFilterStatus(status)
  }

  const getFilteredList = (data: any) => {
    if (filterStatus === 'unanswered') {
      return data.filter((item: any) => !item.isDone && !item.answer)
    } else if (filterStatus === 'correct') {
      return data.filter((item: any) => item.answer && item.answer.isTrue)
    } else if (filterStatus === 'incorrect') {
      return data.filter((item: any) => item.answer && !item.answer.isTrue)
    } else {
      return data
    }
  };
  const filteredList = getFilteredList(listPerson)

  const hasAnswered = listPerson.some((item: any) => item.answer)
  const hasUnanswered = listPerson.some((item: any) => !item.isDone && !item.answer)

  const clearData = () => {
    try {
      if (typeof window !== "undefined" && localStorage) {
        const isConfirmed = confirm('Yakin ingin menghapus semua data peserta?')
        if (isConfirmed) {
          setListPerson([])
          setListQuestion(dataQuestion)
          setActivePerson(null)
          handleFilterChange('all')
          localStorage?.setItem('listPerson', JSON.stringify([]))
        }
      }
    } catch (error) {
      console.error('Error while setting data in localStorage:', error);
    }
  }

  return (
    <div className="h-[90vh] overflow-auto py-6 sm:pt-12 sm:pb-8 px-3 sm:px-6 lg:px-8 xl:px-14">
      { !isLoading ? (
        <>
          <div className="relative top-0 left-0 w-full flex items-center flex-col flex-wrap mb-2">
            <div className="w-full flex justify-center ">
              <span className="w-full sm:w-[370px] h-[84px] gTitle cursor-pointer" onClick={() => handleStartGame(false)}>
                <h2 className="mt-5 sm:mt-3 text-xl sm:text-2xl">Quizz Dev / Edu</h2>
                <p className="font-bold text-sm mt-0 sm:mt-1 text-[#868d96]">by Ranty & Fariz</p>
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
                        className="w-full p-3 sm:p-4 rounded-xl text-md sm:text-lg font-bold"
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
                
                <div className="mt-10">
                  <div className="grid sm:grid-cols-2 gap-4 sm:gap-5">
                    {
                      listPerson.length > 0 ? (
                        <div className="col-span-full flex flex-wrap gap-2 mb-2">
                          <div className="flex justify-between items-center flex-wrap w-full gap-2">
                            <div className="flex flex-wrap items-center gap-3">
                              <button
                                className="border rounded-xl p-3"
                                onClick={() => handleFilterChange('all')}
                              >
                                <Filter color="#002043" size={16} />  
                              </button>
                              <p className="font-semibold text-md text-[#8A8D8F]">Filter</p>
                            </div>      
                            <div className="pl-3 border-l gap-1 flex flex-wrap">
                              <button
                                className={`border rounded-xl p-3`}
                                onClick={() => setIsCollapse(!isCollapse)}
                              >
                                {
                                  isCollapse ? (
                                    <ChevronUp color="#002043" size={16} />
                                  ) : (
                                    <ChevronDown color="#002043" size={16} />
                                  )
                                }
                              </button>
                              <button
                                className={`bg-[#002043] border rounded-xl p-3 shadow-none hover:shadow-lg hover:translate-y-[-3px] duration-300 transition-all`}
                                onClick={clearData}
                              >
                                <Trash color="#FFFFFF" size={16} />
                              </button>
                            </div>
                          </div>
                          <div className="flex flex-1 overflow-auto items-center gap-2 py-2">
                            <button
                              className={`flex-shrink-0 w-auto rounded-full text-sm px-4 py-1 ${
                                filterStatus === 'all' ? 'bg-[#D9D9D9] font-semibold' : 'text-[#656565] bg-[#EBEBEB] border-[#CACACA]'
                              }`}
                              onClick={() => handleFilterChange('all')}
                            >
                              Semua ({listPerson.length})
                            </button>

                            {
                              hasAnswered && hasUnanswered && (
                                <button
                                  className={`flex-shrink-0 w-auto rounded-full text-sm px-4 py-1 ${
                                    filterStatus === 'unanswered' ? 'bg-[#EBEBEB] font-semibold' : 'text-[#656565] bg-[#EBEBEB] border-[#CACACA]'
                                  }`}
                                  onClick={() => handleFilterChange('unanswered')}
                                >
                                  Tidak terjawab ({listPerson?.filter((item: any) => !item.isDone && !item.answer).length})
                                </button>
                              )
                            }
                            
                            {
                              listPerson?.filter((item: any) => item.answer && item.answer.isTrue).length > 0 && (
                                <button
                                  className={`flex-shrink-0 w-auto rounded-full text-sm px-4 py-1 ${
                                    filterStatus === 'correct' ? 'bg-[#E8F8E4] font-semibold' : 'text-[#36B500] bg-[#E8F8E4] border-[#B8E2AC]'
                                  }`}
                                  onClick={() => handleFilterChange('correct')}
                                >
                                  Benar ({listPerson?.filter((item: any) => item.answer && item.answer.isTrue).length})
                                </button>
                              )
                            }

                            {
                              listPerson?.filter((item: any) => item.answer && !item.answer.isTrue).length > 0 && (
                                <button
                                  className={`flex-shrink-0 w-auto rounded-full text-sm px-4 py-1 ${
                                    filterStatus === 'incorrect' ? 'bg-[#FFE6E3] font-semibold' : 'text-[#F41903] bg-[#FFE6E3] border-[#FCB2A7]'
                                  }`}
                                  onClick={() => handleFilterChange('incorrect')}
                                >
                                  Salah ({listPerson?.filter((item: any) => item.answer && !item.answer.isTrue).length})
                                </button>
                              )
                            }
                          </div>
                        </div>
                      ) : null
                    }
                    { filteredList && filteredList.length > 0 ? (
                      <>
                        {filteredList.map((person: any, index: number) => (
                          <CardPerson
                            data={person}
                            handleDelete={handleDeletePerson}
                            handleSelected={handleSelected}
                            handleIsCollapse={setIsCollapse}
                            key={person.id}
                            isCollapse={isCollapse}
                          />
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
          <p className="relative z-10 font-semibold text-lg sm:text-xl text-[#868d96] my-4">Memuat..</p>
        </div>
      )}
    </div>
  );
}
