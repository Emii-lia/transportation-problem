import { GraphSolutionResponse } from "@/api";
import useOptimizedGraph from "@/features/OptimizedGraph/useOptimizedGraph";
import dynamic from "next/dynamic";
import "./OptimizedGraph.scss"
import { NodeTypes } from "reactflow";
import NodeItem from "@/components/NodeItem";

const ReactFlow = dynamic(() =>
  import("reactflow").then(mod => mod.default), {ssr: false})
const Controls = dynamic(() => import('reactflow').then(mod => mod.Controls), { ssr: false });
const Background = dynamic(() => import('reactflow').then(mod => mod.Background), { ssr: false });

const nodeTypes: NodeTypes = {
  nodeItem: NodeItem,
}
type Props = {
  graph: GraphSolutionResponse
}
const OptimizedGraph = ({
  graph
}: Props) => {
  const {
    edges,
    nodes
  } = useOptimizedGraph(graph)

  return (
    <div className="OptimizedGraph">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        minZoom={0.1}
        maxZoom={2}
        fitView
      >
        <Controls/>
        <Background color="#F8F8F8" gap={16}/>
      </ReactFlow>
    </div>
  )
}

export default OptimizedGraph;