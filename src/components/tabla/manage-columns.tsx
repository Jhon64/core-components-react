import buttons from "../buttons/buttons";
import React, { Component, useState } from "react";
// import { IColumnsTabla } from "./tabla"
import CheckBox2 from "../checkboxes";
import labels from "../labels";
import "../scss/manage-columns.scss";
import { ArrayToHelper } from "../../helpers/array-to.helper";
import { IColumnsTabla } from "../interfaces/ITablaComponent";

const { Button2, ButtonAdd } = buttons;
const { Label, Label2 } = labels;

interface IManageColumnsProps {
  columns: IColumnsTabla[];
  getIdsHidden?: (ids: Set<string>) => void;
}
interface IManageColumnsState {
  stateColumns: any[];
  columnsMap: Map<any, any>;
  idsEliminarSet?: Set<any>;
  isActive: boolean;
  idsHiddenSet?: Set<any>;
}

export class ManageColumns extends Component<
  IManageColumnsProps,
  IManageColumnsState
> {
  constructor(props: IManageColumnsProps) {
    super(props);
    console.log("PROPS CMANAGE COLUMNS", props);
    this.state = {
      stateColumns: props.columns,
      columnsMap: ArrayToHelper._Map(props.columns, "_key") || new Map(),
      idsEliminarSet: new Set(),
      isActive: false,
    };
  }

  componentDidMount(): void {
    const props = this.props;
    const idsSet = new Set<string>();
    for (let item of props.columns) {
      if (item.hideColumn) continue;
      idsSet.add(item._key);
    }
    this.setState({
      stateColumns: props.columns,
      columnsMap: ArrayToHelper._Map(props.columns, "_key") || new Map(),
      idsHiddenSet: idsSet,
    });
  }
  componentDidUpdate(
    prevProps: Readonly<IManageColumnsProps>,
    prevState: Readonly<any>,
    snapshot?: any
  ): void {
    if (this.props.columns.length != prevProps.columns.length) {
      this.componentDidMount();
    }
  }

  handleClickActive() {
    this.setState({ isActive: !this.state.isActive });
  }
  render(): React.ReactNode {
    const state = this.state;
    return (
      <React.Fragment>
        <div className="relative manage-columns-component">
          <Button2
            secondary
            outline
            size="md"
            icon="fa fa-cog"
            onClick={() => this.handleClickActive()}
            class={state.isActive ? "active" : ""}
          />
          <div
            className={
              "absolute card  bg-white shadow-sm shadow-gray-500  right-0 rounded " +
              (state.isActive ? "active" : "")
            }
            style={{ minWidth: "14rem", zIndex: 99 }}
          >
            <div className="flex  items-center justify-center content-center py-1 px-2">
              <label className="text-muted">COLUMNAS</label>
            </div>
            <hr />
            <div className="py-3 px-5">
              {state.stateColumns.map((x: any) => {
                return (
                  <div className="flex">
                    <CheckBox2
                      checked={state.idsHiddenSet?.has(x._key)}
                      onChange={(v) => {
                        const idsSet = state.idsHiddenSet || new Set();
                        if (idsSet.has(x._key)) {
                          idsSet.delete(x._key);
                        } else {
                          idsSet.add(x._key);
                        }
                        this.setState({ idsHiddenSet: idsSet });
                      }}
                    />
                    &nbsp;
                    <label
                      className="text-gray-600 font-light"
                      style={{ fontSize: "12px" }}
                    >
                      {x.label}
                    </label>
                  </div>
                );
              })}
              <Button2
                outline
                info
                text="Aplicar"
                class="w-full mt-2"
                onClick={() => {
                  this.setState({ isActive: false });
                  if (this.props.getIdsHidden && state.idsHiddenSet)
                    this.props.getIdsHidden(state.idsHiddenSet);
                }}
              />
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}
