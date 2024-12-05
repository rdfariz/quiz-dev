"use client"
import { useEffect, useRef, useState } from 'react';
import { AlertTriangle, Trash, File, Check, X } from 'react-feather'

export default function Component({
  data = {},
  handleDelete = () => {},
  handleSelected = () => {},
  handleIsCollapse = () => {},
  isCollapse = false
}: {
  data: any, handleDelete: Function, handleSelected: Function, handleIsCollapse: Function, isCollapse: boolean
}) {
  const [isDetail, setIsDetail] = useState(false)

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

  useEffect(() => {
    setIsDetail(isCollapse)
  }, [isCollapse])

  const handleChangeIsDetail = () => {
    if (isDetail) {
      handleIsCollapse(false)
    }
    setIsDetail(!isDetail)
  }

  return (
    <div>
      <div
        className={`box grid w-full border rounded-xl`}
      >
        <div
          className="w-full flex justify-between overflow-hidden gap-2 p-2 sm:p-3 cursor-pointer"
          onClick={handleChangeIsDetail}
        >
          <div className="flex flex-wrap gap-3 w-full pl-1">
            <p className="flex-1 my-auto font-bold text-md sm:text-lg text-[#8B8B8B] text-left line-clamp-1 break-all">
              {data.name || '-'}
            </p>
          </div>
          <div className="flex gap-2">
            {
              data.isDone && data.answer ? (
                <>
                  {data.answer.isTrue ? (
                    <button
                      className="bg-[#73BE68] rounded-xl p-2 flex items-center gap-1"
                    >
                      <Check className="m-auto" color="#FFFFFF" size={15} />
                      <p className="text-white text-xs">Benar</p>
                    </button>
                  ) : (
                    <button
                      className="bg-[#F23B78] rounded-xl p-2 flex items-center gap-1"
                    >
                      <X className="m-auto"  color="#FFFFFF" size={15} />
                      <p className="text-white text-xs">Salah</p>
                    </button>
                  )}
                </>
              ) : null
            }
            <button
              className="border rounded-xl p-2 shadow-none hover:shadow-lg hover:translate-y-[-3px] duration-300 transition-all" 
              onClick={(e) => {
                e.stopPropagation()
                handleDelete(data.id)
              }}
            >
              <Trash color="#002043" size={16} />
            </button>
          </div>
        </div>
        {(isDetail || isCollapse) && (
          <>
            {
              data.isDone && data.answer ? (
                <div className="w-full text-sm border-t flex flex-col flex-wrap overflow-hidden gap-2 p-2 sm:p-4 ">
                  <p className="">{data.question.question}</p>
                  {data.question.listOptions?.map((option: any, childIndex: any) => (
                    <div
                      className="flex w-full gap-2 justify-start items-center flex-wrap"
                      key={childIndex}
                    >
                      {
                        option.value ? (
                          <Check color="#73BE68" size={16} />
                        ) : null
                      }
                      <p
                        className={`flex-1 text-left ${option.value ? 'font-bold' : ''} ${data.answer.label === option.label && !data.answer.isTrue ? 'line-through font-bold' : ''}`}
                      >
                        {renderOptionSymbol(childIndex)} {option.label}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="w-full text-sm border-t flex flex-col flex-wrap overflow-hidden gap-2 p-2 sm:p-4 ">
                  <p className="text-center text-[#8B8B8B] opacity-90">Peserta belum menjawab quiz</p>
                  <button
                    className="border-2  transition-all duration-300 mt-2 py-2 px-4 rounded-xl"
                    onClick={() => handleSelected(data)}
                  >
                    Jawab Quiz
                  </button>
                </div>
              )
            }
          </>
        )}
      </div>
    </div>
  );
}
