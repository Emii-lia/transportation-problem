"use client"
import useTableInput from "@/features/TableInput/useTableInput";
import TransportTable from "@/components/TransportTable";
import Input from "@/components/Input";
import "./TableInput.scss"
import Button from "@/components/Button";
import Graph from "@/features/Graph";
import ToggleInput from "@/features/ToggleInput";
import React from "react";
import OptimizedGraph from "@/features/OptimizedGraph";

const TableInput = () => {
  const {
    colInput,
    rowInput,
    handleSubmit,
    result,
    isSatisfied,
    balasToggle,
    stepToggle,
    handleNextStep,
    optimizedGraph,
    ...tr
  } = useTableInput()
  return (
    <div
      className="TableInput"
      onClick={handleNextStep}
    >
      <div className="toggle-input-group">
        <h1 className="section-title">
          Transportation Problem ( Minitab/Balas )
        </h1>
        <ToggleInput {...stepToggle}>
          {stepToggle.isActive ? "Step by Step" : "Final Result"}
        </ToggleInput>
        <ToggleInput {...balasToggle}>
          {balasToggle.isActive ? "Ballas" : "Minitab"}
        </ToggleInput>
      </div>
      <div className="input-group">
        <div className="t-input-field">
          <label
            htmlFor="row"
            className="input-label"
          >
            Rows
          </label>
          <Input
            id="row"
            type="number"
            name="row"
            {...rowInput}
          />
        </div>
        <div className="t-input-field">
          <label
            htmlFor="col"
            className="input-label"
          >
            Columns
          </label>
          <Input
            id="col"
            type="number"
            name="col"
            {...colInput}
          />
        </div>
      </div>
      <div className="input-group">
        <div className="t-input-field">
          <label
            htmlFor="row"
            className="input-label"
          >
            Table Input
          </label>
        <TransportTable {...tr}/>
        </div>
      </div>
      <Button
        className="button"
        label="Submit"
        onClick={handleSubmit}
      />
      {result &&
        (
          <React.Fragment>
            {(stepToggle.isActive && !isSatisfied) &&
              <div
                className="result-container"
                id="step-result"
              >
                <h2 className="section-title">
                  Results
                </h2>
                <div className="result-item">
                  <h2 className="item-title">
                    Allocation
                  </h2>
                  <TransportTable
                    demands={result["demand"]}
                    supplies={result["supply"]}
                    costs={result["allocationMatrix"]}
                    disabled
                  />
                </div>
                {result["balasMatrix"] &&
                  <div className="result-item">
                    <h2 className="item-title">
                      Balas Matrix
                    </h2>
                    <TransportTable
                      costs={result["balasMatrix"]}
                      demands={[]}
                      supplies={[]}
                      disabled
                    />
                  </div>
                }
                <div className="result-item">
                  <h2 className="item-title">
                    Total Cost (Z)
                  </h2>
                  <div className="result-value">
                    {result["totalCost"]}
                  </div>
                </div>
              </div>
            }
            {(!stepToggle.isActive || isSatisfied) &&
              <div
                className="result-container"
                id="final-result"
              >
                <h2 className="section-title">
                  Results
                </h2>
                <div className="result-item">
                  <h2 className="item-title">
                    Allocation
                  </h2>
                  <TransportTable
                    demands={result["demand"]}
                    supplies={result["supply"]}
                    costs={result["Allocation"] ?? result["allocationMatrix"]}
                    disabled
                  />
                </div>
                <div className="result-item">
                  <h2 className="item-title">
                    Total Cost (Z)
                  </h2>
                  <div className="result-value">
                    {result["Total Cost"]}
                  </div>
                </div>
                <div className="result-item">
                  <h2 className="item-title">
                    Graph
                  </h2>
                  <Graph
                    allocation={result["Allocation"]}
                    graph={result["Graph"]}
                  />
                </div>
                {optimizedGraph &&
                  <div className="result-item">
                    <h2 className="item-title">
                      Optimized Graph
                    </h2>
                    <OptimizedGraph graph={optimizedGraph}/>
                  </div>
                }
              </div>
            }
          </React.Fragment>
        )
      }
    </div>
  )
}

export default TableInput