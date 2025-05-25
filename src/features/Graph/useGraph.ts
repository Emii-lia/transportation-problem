import { Edge, Node } from "reactflow";
import { useEffect, useMemo } from "react";

const useGraph = ({
  allocation,
  graph,
}: {
  allocation: number[][],
  graph: Record<string, (string | number)[]>
}) => {
  const nodes: Node[] = [
    ...Object.keys(graph).map((source, index) => ({
      id: source,
      data: {
        label: source
      },
      draggable: true,
      position: {
        x: 100 + index*(-40),
        y: 100 + index*220,
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
    })),
    ...Array.from({ length: allocation[0].length }, (_, i) => i + 1)
      .map((target, index) => ({
        id: target.toString(),
        data: {
          label: target.toString()
        },
        draggable: true,
        position: {
          x: 600 + index*40,
          y: 100 + index*200,
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
      }))
  ]

  const edges: Edge[] = useMemo(() => (
    Object.entries((graph as Record<string, (string | number)[]>)).flatMap(([source, targets], index) => (
      targets.map((target) => ({
        id: `${source}-${target}`,
        source: source,
        target: target.toString(),
        type: "default",
        focusable: true,
        label: `${allocation[index][Number(target)-1]}`,
        sourceNode: nodes.find(node => node.id === source),
        targetNode: nodes.find(node => node.id === target.toString()),
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
      }))
    ))
  ), [graph, allocation])

  useEffect(() => {
    console.log(graph)
    console.log(allocation)
    console.log(edges, ' ')
  }, [edges, graph, allocation]);
  return {
    nodes,
    edges
  }
}

export default useGraph