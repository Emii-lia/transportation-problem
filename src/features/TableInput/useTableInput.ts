import React, { useEffect, useState } from "react";
import { useBalas, useMiniTab, useOptimizeGraph, useStepByStepBalas, useStepByStepMinitab } from "@/rq-hooks/transport";
import {
  BalasTrasportationDataStepByStep,
  GraphSolutionResponse,
  MinitabTransportationDataStepByStep,
  SteppingStoneDto
} from "@/api";
import { toast } from "react-toastify";

const useTableInput = () => {
  const [row, setRow] = useState(0)
  const [col, setCol] = useState(0)
  const [isByStep, setIsByStep] = useState(false)
  const [isBalas, setIsBalas] = useState(false)
  const [isSatisfied, setIsSatisfied] = useState(false)
  const [stepCount, setStepCount] = useState(0)
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
  const [optimizedGraph, setOptimizedGraph] = useState<GraphSolutionResponse | null>(null)

  const {
    mutate: miniTab
  } = useMiniTab()

  const {
    mutate: stepByStepMinitab
  } = useStepByStepMinitab()
  const {
    mutate: balas
  } = useBalas()
  const {
    mutate: stepByStepBalas
  } = useStepByStepBalas()
  const {
    mutate: optimizeGraph,
    isLoading: optimizeGraphLoading,
  } = useOptimizeGraph()

  const onCellChange = (
    rowIndex: number, colIndex: number, value: number
  ) => {
    setCosts((prev) => {
      const newCosts = [...prev]
      newCosts[rowIndex][colIndex] = value
      return newCosts
    })
    setAllocationMatrix(Array.from({ length: row }, () => Array.from({ length: col }, () => 0)))
  }

  const onSupplyChange = (index: number, value: number) => {
    setSupplies((prev) => {
      const newSupplies = [...prev]
      newSupplies[index] = value
      return newSupplies
    })
    setAllocationMatrix(Array.from({ length: row }, () => Array.from({ length: col }, () => 0)))
  }

  const onDemandChange = (index: number, value: number) => {
    setDemands((prev) => {
      const newDemands = [...prev]
      newDemands[index] = value
      return newDemands
    })
    setAllocationMatrix(Array.from({ length: row }, () => Array.from({ length: col }, () => 0)))
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
      setIsSatisfied(false)
      return !prev
    })
    setStepCount(0)
    setAllocationMatrix(Array.from({ length: row }, () => Array.from({ length: col }, () => 0)))
    setResult(null)
  }

  const toggleBalas = () => {
    setResult(null)
    setAllocationMatrix(Array.from({ length: row }, () => Array.from({ length: col }, () => 0)))
    setIsBalas((prev) => !prev)
    setStepCount(0)
  }

  const handleGraphOptimization = async (
    allocation: Array<Array<number>>
  ) => {
    if (
      optimizeGraphLoading ||
      !allocation
    ) return
    const data: SteppingStoneDto = {
      initialMatrix: costs,
      allocationMatrix: allocation,
    }
    optimizeGraph(data, {
      onSuccess: (data) => {
        setOptimizedGraph(data)
      },
      onError: () => {
        toast.error("Error optimizing graph. Please check your input data.")
      },
      onSettled: () => {
        console.log(optimizedGraph)
      }
    })
  }

  const handleStepByStepMinitab = async (
    stepMinitabData: MinitabTransportationDataStepByStep
  ) => {

    stepByStepMinitab(stepMinitabData, {
      onSuccess: (data) => {
        setResult(data)
        setStepCount(prev => prev + 1)
        if (data["Allocation"]) {
          setIsSatisfied(true)
          handleGraphOptimization(data["Allocation"] as number[][]);
          setAllocationMatrix(data["Allocation"] as number[][]);
          setResult({
            ...data,
            "supply": Array.from({ length: row }, () => 0),
            "demand": Array.from({ length: col }, () => 0),
          })

        } else {
          setIsSatisfied(false)
          if (stepCount === 0)
            toast.info("Click anywhere to continue")

        }
      },
      onSettled: () => {
        console.log(result)
      }
    })
  }

  const handleStepByStepBalas = async (
    stepBalasData: BalasTrasportationDataStepByStep) => {
    stepByStepBalas(stepBalasData, {
      onSuccess: (data) => {
        setResult(data)
        setStepCount((prev) => prev + 1)
        if (data["Allocation"]) {
          setIsSatisfied(true)
          handleGraphOptimization(data["Allocation"] as number[][]);
          setAllocationMatrix(data["Allocation"] as number[][]);
          setResult({
            ...data,
            "supply": Array.from({ length: row }, () => 0),
            "demand": Array.from({ length: col }, () => 0),
          })
        } else {
          setIsSatisfied(false)

          if (stepCount === 0)
            toast.info("Click anywhere to continue")

        }
      },
      onSettled: () => {
        console.log(result)
      }
    })
  }

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    if (isBalas) {
      if (isByStep) {
        setStepCount(0)
        const stepBalasData: BalasTrasportationDataStepByStep = {
          balasMatrix: costs,
          supply: supplies,
          costMatrix: costs,
          demand: demands,
          allocationMatrix: Array.from({ length: row }, () => Array.from({ length: col }, () => 0)),
          totalCost: 0
        }
        await handleStepByStepBalas(stepBalasData)
        return
      }
      balas({
        cost: costs,
        supply: supplies,
        demand: demands
      }, {
        onSuccess: (data) => {
          setResult(data)
          handleGraphOptimization(data["Allocation"] as number[][]);
        },
        onSettled: () => {
          console.log(result)
        }
      })
    } else {
      if (isByStep) {
        setStepCount(0)
        const stepMinitabData: MinitabTransportationDataStepByStep = {
          minitabMatrix: costs,
          supply: supplies,
          demand: demands,
          allocationMatrix: Array.from({ length: row }, () => Array.from({ length: col }, () => 0)),
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
          handleGraphOptimization(data["Allocation"] as number[][]);
        },
        onSettled: () => {
          console.log(result)
        }
      })
    }
  }

  const handleNextStep = async () => {
    if (!result || result["Graph"]) return
    if (isByStep && !isSatisfied) {
      if (isBalas) {
        const stepBalasData: BalasTrasportationDataStepByStep = {
          balasMatrix: result["balasMatrix"],
          supply: result["supply"] ?? supplies,
          demand: result["demand"] ?? demands,
          costMatrix: costs,
          allocationMatrix: result["allocationMatrix"] ?? allocationMatrix,
          totalCost: result["totalCost"]
        }
        await handleStepByStepBalas(stepBalasData)
      } else {
        const stepMinitabData: MinitabTransportationDataStepByStep = {
          minitabMatrix: costs,
          supply: result["supply"] ?? supplies,
          demand: result["demand"] ?? demands,
          allocationMatrix: result["allocationMatrix"] ?? allocationMatrix,
          totalCost: result["totalCost"] ?? 0
        }
        await handleStepByStepMinitab(stepMinitabData)
      }
    }
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
    optimizedGraph,
    stepToggle: {
      isActive: isByStep,
      onChange: toggleByStep,
    },
    balasToggle: {
      isActive: isBalas,
      onChange: toggleBalas,
    },
    handleNextStep,
    isSatisfied
  }
}

export default useTableInput;