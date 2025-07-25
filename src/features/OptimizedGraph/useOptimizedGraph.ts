import { Node, Edge } from "reactflow";
import { useEffect, useMemo } from "react";
import { GraphEdgeDto } from "@/api";

const useOptimizedGraph = (
  graph: Array<GraphEdgeDto>
) => {
  const nodes: Node[] = useMemo(() =>
    graph ?
    [
      ...graph.map((item, index) => ({
        id: `${item.leftNodeName}`,
        type: "nodeItem",
        data: {
          label: item.leftNodeName,
          potential: item.leftNodePotential ?? 0,
          position: "left"
        },
        draggable: true,
        position: {
          x: 100 + index * (-40),
          y: 100 + index * 220,
        },
        style: {
          background: '#ff9966',
          width: 60,
          height: 60,
          borderRadius: '50%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          border: '2px solid #333',
          fontSize: '20px',
          fontWeight: 'bold'
        },
        ariaLabel: item.leftNodePotential?.toString()
      })),
      ...graph.map((item, index) => ({
        id: `${item.rightNodeName}`,
        type: "nodeItem",
        data: {
          label: item.rightNodeName,
          potential: item.rightNodePotential ?? 0,
          position: "right"
        },
        draggable: true,
        position: {
          x: 600 + index * 40,
          y: 100 + index * 200,
        },
        style: {
          background: '#6699ff',
          width: 60,
          height: 60,
          borderRadius: '50%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          border: '2px solid #333',
          fontSize: '20px',
          fontWeight: 'bold'
        },
        ariaLabel: item.rightNodePotential?.toString()
      })).sort((a, b) => Number(a.data.label) - Number(b.data.label))
    ] :[]
  , [graph]);

  const edges: Edge[] = useMemo(() => (
    graph?
      graph.map((item) => ({
        id: `${item.leftNodeName}-${item.rightNodeName}`,
        source: `${item.leftNodeName}`,
        target: `${item.rightNodeName}`,
        type: 'default',
        focusable: true,
        label: item.edgeCost,
        sourceNode: nodes.find(node => node.id === item.leftNodeName),
        targetNode: nodes.find(node => node.id === item.rightNodeName),
        pathOptions: {
          curvature: 0.5,
          borderRadius: 1
        },
        labelStyle: {
          fill: '#d32',
          fontWeight: 'bold',
          fontSize: 14,
          background: 'white',
          padding: '2px 5px',
          borderRadius: '4px'
        },
        style: {
          strokeWidth: 2,
          stroke: '#333',
          fontSize: '20px',
          fontWeight: 'bold',
        },
      })) : []
  ), [graph, nodes])

  useEffect(() => {
    console.log("Nodes:", nodes);
    console.log("Edges:", edges);
  }, [nodes, edges]);

  return {
    nodes,
    edges
  };
}

export default useOptimizedGraph;