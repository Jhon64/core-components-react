import { Input, Option, Select, SelectProps } from "@material-tailwind/react";
import React, { CSSProperties, useEffect, useState } from "react";
import ReactSelect from "react-select";

export interface ISelect3Props<T /* , K */>
  extends Omit<SelectProps, "children" | "placeholder"> {
  label?: string;
  minWidth?: string;
  keyValue?: string;
  keyLabel?: string;
  required?: boolean;
  onSelect?: (value: any, item?: T) => void;
  onSearch?: (searchText: string) => void | Promise<void>;
  saveKey?: string;
  saveForm?: any;
  options: T[] | (() => T[]);
  disabled?: boolean;
  noSelectedText?: string;
  inputCss?: CSSProperties;
  classSelect?: string;
  class?: string;
  multiple?: boolean;
  multipleDate?: boolean;
  useSearch?: boolean;
  labelRequired?: string;
  top?: number;
}

 function SelectSearch<T>(props: ISelect3Props<T>) {
  const [formSave, setFormSave] = useState(props?.saveForm || {});
  const [labelRequired, setLabelRequired] = useState(
    props?.labelRequired || ""
  );
  const [value, setValue] = React.useState(() => {
    if (props?.saveForm && props?.saveKey)
      return props?.saveForm[props?.saveKey];
    return -1;
  });

  const [activeSearch, setActiveSearch] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const generateErrors = (tempvalue?: any) => {
    if (!formSave) {
      return;
    }
    if (props?.required) {
      if (!Object.keys(formSave["errors"] || {}).length)
        formSave["errors"] = {};
    }
    let erroresMessage = undefined;
    if (props?.required && (!tempvalue || tempvalue < 0)) {
      erroresMessage = labelRequired || "Este campo es requerido";
      formSave["errors"][props.saveKey] =
        props?.label || "Este campo es requerido";
    } else {
      if (formSave["errors"] && props.saveKey) {
        delete formSave["errors"][props.saveKey];
      }
    }
  };

  const [validRequired, setValidRequired] = useState(() => {
    generateErrors(formSave[props?.saveKey || ""]);
    return props.required
      ? formSave[props?.saveKey || ""]
        ? true
        : false
      : true;
  });

  const initLoadOptions = () => {
    let propsOptions: any[] = [];
    if (typeof props.options == "function") {
      propsOptions = props.options();
    } else propsOptions = props.options;
    if (
      !propsOptions?.filter((x) => (x[props.keyValue || ""] || "") == -1).length
    ) {
      const itemDefault = {
        [props.keyValue]: -1,
        [props.keyLabel]: "Seleccione",
      };
      propsOptions?.unshift(itemDefault);
    }

    return propsOptions;
  };

  const [THIS] = useState(() => {
    return {
      optionsAll: initLoadOptions(),
    };
  });

  const [listOptions, setListOptions] = React.useState(() => {
    return initLoadOptions();
  });

  useEffect(() => {
    setListOptions(initLoadOptions());
    return () => {
      return null;
    };
  }, [props.options]);

  useEffect(() => {
    if (Object.keys(props.saveForm).length) setFormSave(props.saveForm);
    if (props?.saveForm && props?.saveKey) {
      let valor = props?.saveForm[props?.saveKey];

      if (valor === -1) {
        generateErrors(-1);
        setValidRequired(false);
      }
      if (valor) setValue(valor);
    }
    return () => {
      return null;
    };
  }, [props.saveForm]);

  const generateOptions = () => {
    return listOptions
      .map((x) => {
        return (
          <Option value={x[props.keyValue]}>{x[props.keyLabel] || "-"}</Option>
        );
      })
      .filter((x, i) => {
        if (!!props.top) {
          return props.top >= i;
        }
        return true;
      });
  };

  const handleSave = (val: any) => {
    generateErrors(val);
    if (typeof val == "number") {
      if (val !== -1) {
        setValidRequired(true);
      } else {
        setValidRequired(false);
      }
    } else {
      setValidRequired(true);
      if (val !== "-1") {
        setValidRequired(true);
      } else {
        setValidRequired(false);
      }
    }
    if (props?.saveForm && props?.saveKey) props.saveForm[props.saveKey] = val;
    setValue(val);
    if (props?.onSelect && props?.keyValue) {
      let options = listOptions;
      const item = options.find((x) => x[props.keyValue] == val);
      if (item) props.onSelect(item);
    }
  };

  const cardSelect = () => {
    return (
      <ul
        role="listbox"
        className="w-full max-h-96 bg-white p-3 border border-blue-gray-50 rounded-md shadow-lg shadow-blue-gray-500/10 font-sans text-sm font-normal text-blue-gray-500 overflow-auto focus:outline-none"
        id=":ra:"
        aria-orientation="vertical"
        style={{
          position: "absolute",
          overflow: "auto",
          opacity: 1,
          zIndex: 99,
        }}
      >
        {listOptions.map((item) => {
          return (
            <li
              id="material-tailwind-select-0"
              role="option"
              className="pt-[9px] w-full pb-2 px-3 rounded-md leading-tight cursor-pointer select-none hover:bg-blue-gray-50 focus:bg-blue-gray-50 hover:bg-opacity-80 focus:bg-opacity-80 hover:text-blue-gray-900 focus:text-blue-gray-900 outline outline-0 transition-all"
              onClick={(_) => {
                setListOptions(THIS.optionsAll.filter((x) => x));
                handleSave(item[props.keyValue] || -1);
                setActiveSearch(false);
              }}
              aria-selected="false"
              data-selected="false"
            >
              <label>{item[props.keyLabel] || "-"}</label>
            </li>
          );
        })}
      </ul>
    );
  };

  const handleSearch = (ev: any) => {
    const valueSearch = ev.target.value + "";
    setSearchValue(valueSearch);

    let filtered = [];
    if ((valueSearch + "").trim().length) {
      filtered = THIS.optionsAll.filter((x) =>
        x[props.keyLabel]?.toLowerCase()?.includes(valueSearch.toLowerCase())
      );
    } else {
      filtered = THIS.optionsAll.filter((x) => x);
    }

    setListOptions(filtered);
  };

  const handleExternalSearch = async () => {
    if (props.onSearch) {
      if (props?.saveForm && props?.saveKey) {
        props.saveForm[props.saveKey] = -1;
        setValue(-1);
      }
      await props.onSearch(searchValue);
    }
  };

  return (
    <>
      <div className="relative w-full">
        {props.useSearch && !props.disabled && (
          <>
            <div className=" relative">
              {!activeSearch && (
                <span
                  onClick={() => {
                    setActiveSearch(true);
                  }}
                  className={
                    "mr-1 bg-gray-100 absolute top-1 right-0  text-gray-500 block z-10 p-2 rounded-lg hover:cursor-pointer hover:bg-gray-400 hover:text-white   fa fa-search"
                  }
                  style={{ fontSize: "13px" }}
                ></span>
              )}
              {activeSearch && (
                <div className="relative">
                  <div className="absolute top-1 right-0 flex gap-1 z-10">
                    <span
                      onClick={() => {
                        handleExternalSearch();
                      }}
                      className="bg-gray-100 text-gray-500 p-2 rounded-lg hover:cursor-pointer hover:bg-blue-500 hover:text-white fa fa-search"
                      style={{ fontSize: "13px" }}
                    ></span>
                    <span
                      onClick={() => {
                        setActiveSearch(false);
                        setSearchValue("");
                        setListOptions(THIS.optionsAll); // Restaurar lista original
                      }}
                      className="bg-gray-100 text-gray-500 p-2 rounded-lg hover:cursor-pointer hover:bg-red-500 hover:text-white fa fa-close"
                      style={{ fontSize: "13px" }}
                    ></span>
                  </div>
                  {props?.disabled &&
                    props?.saveForm[props?.saveKey] != null &&
                    props?.saveForm[props?.saveKey] >= 0 && (
                      <span className="absolute text-gray-600 z-10 bottom-7 left-2">
                        {props.label}
                      </span>
                    )}
                  <Input
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                    onResize={null}
                    onResizeCapture={null}
                    containerProps={{ className: `min-w-[80px]` }}
                    crossOrigin={null}
                    variant={props.variant}
                    label={props.label}
                    className="w-full bg-white"
                    onKeyUp={(e) => handleSearch(e)}
                    onBlur={(e) => handleSearch(e)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleExternalSearch();
                      }
                    }}
                  ></Input>
                  {activeSearch && (
                    <div className="absolute w-full">{cardSelect()}</div>
                  )}
                </div>
              )}
            </div>
          </>
        )}
        {!activeSearch && (
          <>
            {props?.disabled &&
              props?.saveForm[props?.saveKey] != null &&
              props?.saveForm[props?.saveKey] >= 0 && (
                <span className="absolute text-gray-600 z-10 bottom-7 left-2">
                  {props.label}
                </span>
              )}
            <Select
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
              onResize={null}
              onResizeCapture={null}
              animate={{
                mount: { y: 0 },
                unmount: { y: 25 },
              }}
              containerProps={{ className: `min-w-[80px]` }}
              error={!validRequired && props?.required}
              color={validRequired ? "blue" : props.color || "indigo"}
              placeholder={props?.label}
              className={" disabled:border disabled:border-gray-500"}
              label={props?.label}
              size={props?.size}
              disabled={props?.disabled}
              success={props?.success}
              value={value}
              onChange={(val) => handleSave(val)}
              variant={props?.variant || "outlined"}
            >
              {generateOptions()}
            </Select>
          </>
        )}
        {props.required && !validRequired && props.disabled && (
          <>
            <span className="text-red-700">
              {labelRequired || "Este campo es requerido"}
            </span>
          </>
        )}
      </div>
    </>
  );
}

export  default SelectSearch;