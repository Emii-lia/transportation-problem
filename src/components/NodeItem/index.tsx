import classNames from "classnames";
import "./NodeItem.scss"
import { Handle, NodeProps, Position } from "reactflow";

type PotentialPosition = "top" | "bottom" | "left" | "right"
type Props = {
  label: string
  potential: number
  position?: PotentialPosition
}
const NodeItem = ({ data }: NodeProps<Props>) => {
  const { potential, position, label } = data
  return (
    <div className="NodeItem">
      <Handle
        type="target"
        position={Position.Left}
        id="left"
        style={{ background: '#555' }}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="right"
        style={{ background: '#555' }}
      />
      <h2 className="label">
        {label}
      </h2>
      <div
        className={classNames("potential", position)}
        title={`Potential: ${potential}`}
      >
        {`${potential < - 10000 ? 'e' : potential}`}
      </div>
    </div>
  )
}

export default NodeItem;