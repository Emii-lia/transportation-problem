"use client"
import { QueryClient, QueryClientProvider } from "react-query";
import React from "react";

export const queryClient = new QueryClient()

type Props = {
  children: React.ReactNode
}
const ReactQuery = ({
  children
}: Props) => {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}

export default ReactQuery