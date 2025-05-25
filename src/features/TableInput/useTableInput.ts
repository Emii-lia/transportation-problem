import React, { useEffect, useState } from "react";
import { useMiniTab, useStepByStepMinitab } from "@/rq-hooks/transport";
import { MinitabTransportationDataStepByStep } from "@/api";

const useTableInput = () => {
  const [row, setRow] = useState(0)
  const [col, setCol] = useState(0)
  const [isByStep, setIsByStep] = useState(false)
  const [isBalas, setIsBalas] = useState(false)
  const [isSatisfied, setIsSatisfied] = useState(false)
  const [allocationMatrix, setAllocationMatrix] = useState<number[][]>(
    Array.from({ length: row }, () => Array.from({ length: col }, () => 0))
  )
  const [costs, setCosts] = useState<number[][]>(
    Array.from({ length: row }, () => Array.from({ length: col }, () => 0))
  )
  const [supplies, setSupplies] = useState<number[]>(
    Array.from({ length: row }, () => 0)
  )
  const [demands, setDemands] = useState<number[]>(
    Array.from({ length: col }, () => 0)
  )
  const [result, setResult] = useState<Record<string, any> | null>(null)

  const {
    mutate: miniTab
  } = useMiniTab()

  const {
    mutate: stepByStepMinitab
  } = useStepByStepMinitab()

  const onCellChange = (
    rowIndex: number, colIndex: number, value: number
  ) => {
    setCosts((prev) => {
      const newCosts = [...prev]
      newCosts[rowIndex][colIndex] = value
      return newCosts
    })
  }

  const onSupplyChange = (index: number, value: number) => {
    setSupplies((prev) => {
      const newSupplies = [...prev]
      newSupplies[index] = value
      return newSupplies
    })
  }

  const onDemandChange = (index: number, value: number) => {
    setDemands((prev) => {
      const newDemands = [...prev]
      newDemands[index] = value
      return newDemands
    })
  }

  const handleColChange = (e: React.FormEvent<HTMLInputElement>) => {
    const value = e.currentTarget.valueAsNumber
    setCol(value)
  }

  const handleRowChange = (e: React.FormEvent<HTMLInputElement>) => {
    const value = e.currentTarget.valueAsNumber
    setRow(value)
  }

  const toggleByStep = () => {
    setIsByStep((prev) => {
      setIsSatisfied(!prev)
      return !prev
    })
  }

  const toggleBalas = () => {
    setIsBalas((prev) => !prev)
  }

  const handleStepByStepMinitab = async (
    stepMinitabData: MinitabTransportationDataStepByStep
  ) => {

    stepByStepMinitab(stepMinitabData, {
      onSuccess: (data) => {
        setResult(data)
        if (data["Allocation"]) {
          setIsSatisfied(true)
          setAllocationMatrix(data["Allocation"] as number[][]);
          setResult({
            ...data,
            "supply": Array.from({ length: row }, () => 0),
            "demand": Array.from({ length: col }, () => 0),
          })

        } else {
          setIsSatisfied(false)

          setTimeout(() => {
            handleStepByStepMinitab({
              minitabMatrix: costs,
              supply: data["supply"] as number[],
              demand: data["demand"] as number[],
              totalCost: data["totalCost"] as unknown as number,
              allocationMatrix: data["allocationMatrix"] as number[][]
            })
          }, 3000);

        }
      },
      onSettled: () => {
        console.log(result)
      }
    })
  }
  const handleSubmit = async () => {
    if (isByStep) {
      const stepMinitabData: MinitabTransportationDataStepByStep = {
        minitabMatrix: costs,
        supply: supplies,
        demand: demands,
        allocationMatrix,
        totalCost: 0
      }
      await handleStepByStepMinitab(stepMinitabData)
      return
    }
    miniTab({
      cost: costs,
      supply: supplies,
      demand: demands
    }, {
      onSuccess: (data) => {
        setResult(data)
      },
      onSettled: () => {
        console.log(result)
      }
    })
  }

  useEffect(() => {
    setCosts(Array.from({ length: row }, () => Array.from({ length: col }, () => 0)))
    setSupplies(Array.from({ length: row }, () => 0))
    setDemands(Array.from({ length: col }, () => 0))
  }, [col, row]);

  return {
    costs,
    supplies,
    demands,
    onCellChange,
    onSupplyChange,
    onDemandChange,
    colInput: {
      value: col,
      onInput: handleColChange,
    },
    rowInput: {
      value: row,
      onInput: handleRowChange,
    },
    handleSubmit,
    result,
    stepToggle: {
      isActive: isByStep,
      onChange: toggleByStep,
    },
    balasToggle: {
      isActive: isBalas,
      onChange: toggleBalas,
    },
    isSatisfied
  }
}

export default useTableInput;