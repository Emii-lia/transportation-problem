import dynamic from "next/dynamic";
import useGraph from "@/features/Graph/useGraph";
import "./Graph.scss"
import { NodeTypes } from "reactflow";
import NodeItem from "@/components/NodeItem";

const ReactFlow = dynamic(() =>
  import("reactflow").then(mod => mod.default), {ssr: false})
const Controls = dynamic(() => import('reactflow').then(mod => mod.Controls), { ssr: false });
const Background = dynamic(() => import('reactflow').then(mod => mod.Background), { ssr: false });

type Props = {
  allocation: number[][],
  graph: Record<string, (string | number)[]>
}
const nodeTypes: NodeTypes = {
  nodeItem: NodeItem,
}

const Graph = ({
  allocation,
  graph
}: Props) => {
  const {
    nodes,
    edges
  } = useGraph({
    graph,
    allocation
  })
  return (
    <div className="Graph">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
      >
        <Controls/>
        <Background color="#F8F8F8" gap={16}/>
      </ReactFlow>
    </div>
  )
}

export default Graph