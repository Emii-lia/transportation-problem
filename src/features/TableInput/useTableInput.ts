import React, { isValidElement, useEffect, useState } from "react";
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
  const [isFinal, setIsFinal] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [currentCycle, setCurrentCycle] = useState(0)
  const [isSatisfied, setIsSatisfied] = useState(false)
  const [stepCount, setStepCount] = useState(0)
  const [allocationMatrix, setAllocationMatrix] = useState<number[][]>(
    Array.from({ length: row }, () => Array.from({ length: col }, () => 0))
  )
  const [optimizedAllocationMatrix, setOptimizedAllocationMatrix] = useState<number[][]>(
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
    setOptimizedGraph(null)
    setCurrentStep(0)
    setOptimizedAllocationMatrix([])
    setIsFinal(false)
    setStepCount(0)
    setAllocationMatrix(Array.from({ length: row }, () => Array.from({ length: col }, () => 0)))
    setResult(null)
  }

  const toggleBalas = () => {
    setResult(null)
    setOptimizedGraph(null)
    setOptimizedAllocationMatrix([])
    setIsSatisfied(false)
    setIsFinal(false)
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
        setOptimizedAllocationMatrix(data.allocationMatrix ?? []);
      },
      onError: () => {
        toast.error("Error optimizing graph. Please check your input data.")
      }
    })
  }

  // const handleNextOptimization =  () => {
  //   if (optimizedGraph && optimizedGraph.allocationMatrixList && optimizedGraph.cycles) {
  //     const nextAllocation = optimizedGraph.allocationMatrixList[currentStep + 1];
  //     if (nextAllocation) {
  //       if (optimizedGraph.cycles[currentStep]) {
  //         const cycle = optimizedGraph.cycles[currentStep]
  //         if (cycle.length === currentCycle + 1 ) {
  //           setCurrentStep((prev) => prev + 1);
  //           setOptimizedAllocationMatrix(nextAllocation);
  //         } else {
  //           const coord = cycle[currentCycle]
  //           const currentCell = document.querySelector(`#optimized-table>.tr-row>.tr-col>#cost-cell-${coord[0]}-${coord[1]}`)
  //           if (currentCell) {
  //             currentCell.classList.add(currentCycle % 2 === 0 ? "green" : "red")
  //             setCurrentCycle(prev => prev + 1)
  //           }
  //         }
  //       }
  //     } else {
  //       setIsFinal(true);
  //       const allCell = document.querySelectorAll("#optimized-table>.tr-row>.tr-col>.CellInput")
  //       allCell.forEach((cell) => {
  //         cell.classList.remove("green", "red")
  //       })
  //       toast.info("No more optimization steps available.");
  //     }
  //   }
  // }

  const handleStepByStepMinitab = async (
    stepMinitabData: MinitabTransportationDataStepByStep
  ) => {

    stepByStepMinitab(stepMinitabData, {
      onSuccess: (data) => {
        setResult(data)
        setStepCount(prev => prev + 1)
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
          if (stepCount === 0)
            toast.info("Click anywhere to continue")

        }
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
      }
    })
  }

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    setIsFinal(false)
    setCurrentStep(0)
    setCurrentCycle(0)
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
        }
      })
    }
  }

  const handleNextStep = async () => {
    if (!result || isFinal) return
    if (isByStep) {
      if (isBalas) {
        if (isSatisfied) {
          if (!optimizedGraph) {
            await handleGraphOptimization(result["Allocation"] as number[][]);
          }
          // } else {
          //   handleNextOptimization()
          // }
        } else {
          const stepBalasData: BalasTrasportationDataStepByStep = {
            balasMatrix: result["balasMatrix"],
            supply: result["supply"] ?? supplies,
            demand: result["demand"] ?? demands,
            costMatrix: costs,
            allocationMatrix: result["allocationMatrix"] ?? allocationMatrix,
            totalCost: result["totalCost"]
          }
          await handleStepByStepBalas(stepBalasData)
        }
      } else {
        if (isSatisfied) {
          if (!optimizedGraph) {
            await handleGraphOptimization(result["Allocation"] as number[][]);
          }
          // } else {
          //   handleNextOptimization()
          // }
        } else {
          const stepMinitabData: MinitabTransportationDataStepByStep = {
            minitabMatrix : costs,
            supply : result["supply"] ?? supplies,
            demand : result["demand"] ?? demands,
            allocationMatrix : result["allocationMatrix"] ?? allocationMatrix,
            totalCost : result["totalCost"] ?? 0
          }
          await handleStepByStepMinitab(stepMinitabData)
        }
      }
    }
  }

  useEffect(() => {
    setCosts(Array.from({ length: row }, () => Array.from({ length: col }, () => 0)))
    setSupplies(Array.from({ length: row }, () => 0))
    setDemands(Array.from({ length: col }, () => 0))
  }, [col, row]);

  useEffect(() => {
    console.log("opt:", optimizedGraph)
  }, [optimizedGraph]);

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
    optimizedAllocationMatrix,
    stepToggle: {
      isActive: isByStep,
      onChange: toggleByStep,
    },
    balasToggle: {
      isActive: isBalas,
      onChange: toggleBalas,
    },
    handleNextStep,
    isSatisfied,
    isFinal
  }
}

export default useTableInput;