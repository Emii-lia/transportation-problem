import { useMutation } from "react-query";
import { transportApi } from "@/api/apiClient";
import {
  BalasTrasportationDataStepByStep,
  MinitabTransportationDataStepByStep, SteppingStoneDto,
  TransportData
} from "@/api";
import { BalasResponseStepByStep } from "@/types/data";

export const useMiniTab = () => {
  return useMutation({
    mutationKey: ["miniTab"],
    mutationFn: async (data: TransportData) => {
      return transportApi.minitab(data)
    }
  })
}

export const useStepByStepMinitab = () => {
  return useMutation({
    mutationKey: ["miniTabStepByStep"],
    mutationFn: async (data: MinitabTransportationDataStepByStep) => {
      return transportApi.minitabStepByStep(data)
    }
  })
}

export const useBalas = () => {
  return useMutation({
    mutationKey: ["balas"],
    mutationFn: async (data: TransportData) => {
      return transportApi.balas(data)
    }
  })
}

export const useStepByStepBalas = () => {
  return useMutation({
    mutationKey: ["balasStepByStep"],
    mutationFn: async (data: BalasTrasportationDataStepByStep) => {
      return transportApi.balasStepBystep(data) as BalasResponseStepByStep
    }
  })
}

export const useOptimizeGraph = () => {
  return useMutation({
    mutationKey: ["optimizeGraph"],
    mutationFn: async (data: SteppingStoneDto) => {
      return transportApi.optimalSolution(data)
    }
  })
}