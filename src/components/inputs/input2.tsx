import { Input, InputProps } from "@material-tailwind/react";
import React, {
  CSSProperties,
  HTMLInputTypeAttribute,
  useEffect,
  useState,
} from "react";

/**
 * @param label - label del input
 * @param noCero : sin cero
 * @param noNegativo: sin numeros negativos
 */
export interface Input2Props extends Omit<InputProps, "onBlur" | "onKeyUp"> {
  label: string;
  noMoreFourDecimal?: boolean;
  minWidth?: string;
  labelClass?: string;
  inputClass?: string;
  inputCss?: React.CSSProperties;
  placeholder?: string;
  type?: HTMLInputTypeAttribute;
  noCero?: boolean;
  noNegativos?: boolean;
  useUpper?: boolean;
  sinEspacios?: boolean;
  noDecimales?: boolean;
  icon?: string;
  textPreviewIcon?: string;
  class?: string;
  style?: CSSProperties;
  saveForm?: {
    [props: string]: any;
  };
  saveKey?: string;
  labelRequired?: string;
  required?: boolean;
  rounded?: number;
  _errors?: any[];
  _getErrors?: (_errors: any[]) => void;
  onBlur?: (value: any) => void;
  onEnter?: (value?: string | number) => void;
  onKeyUp?: (value?: string | number) => void;
  initializeNull?: boolean;
  useMaskDate?: boolean;
  onChange?: (value: any) => void;
  isDate?: boolean;
}

export interface IBaseForm {
  _errors?: InputError[];
}

export interface InputErrors {
  message: string;
  type: "required";
  keyInput: string;
  value: any;
  isInvalid: boolean;
}
export interface InputError {
  keyInput: string;
  errors: InputErrors[];
  isInvalid: boolean;
}

export const Input2 = (props: Input2Props) => {
  const [formSave, setFormSave] = useState(props.saveForm || {});
  const [labelRequired, setLabelRequired] = useState(props.labelRequired || "");
  const [validRequired, setValidRequired] = useState(
    props.required ? (formSave[props?.saveKey || ""] ? true : false) : true
  );
  const [showError, setShowError] = useState(props?.required || false);

  if (!props || !formSave) return <></>;

  const [defaultValue, setDefaultValue] = useState(
    props.defaultValue !== undefined
      ? props.defaultValue
      : formSave[props?.saveKey || ""]
  );

  const generateErrors = () => {
    if (props?.required) {
      if (!Object.keys(formSave["errors"] || {}).length)
        formSave["errors"] = {};
    }
    let erroresMessage = undefined;
    const getValorValue =
      typeof defaultValue === "function" ? null : defaultValue;

    if (
      props?.required &&
      (getValorValue === undefined ||
        getValorValue === null ||
        getValorValue === "") &&
      !formSave[props?.saveKey]
    ) {
      erroresMessage = labelRequired || "Este campo es requerido";
    }

    if (
      (props?.noCero && getValorValue === 0) ||
      (props?.noNegativos && getValorValue < 0) ||
      (props?.noMoreFourDecimal &&
        String(getValorValue).split(".")[1]?.length > 4) ||
      (getValorValue > Number(props?.max) && props?.max)
    ) {
      erroresMessage = labelRequired || "Este campo es requerido";
    }

    if (erroresMessage) {
      formSave["errors"] = { ...formSave["errors"] };
      formSave["errors"][props.saveKey] =
        labelRequired || "Este campo es requerido";
      return;
    } else {
      if (formSave?.errors && props?.saveKey)
        delete formSave["errors"][props.saveKey];
    }
  };
  generateErrors();

  const handleOnBlur = (e?: any) => {
    const value = e ? e.target.value : defaultValue;
    setShowError(false);
    let parseValueType = value;
    const validValue = (value + "").trim().length;
    setValidRequired(validValue >= 0 ? true : false);
    const form: any = formSave;
    let error = "";

    if (
      props?.noCero ||
      props?.noNegativos ||
      props?.noMoreFourDecimal ||
      props.type == "number"
    ) {
      if (isNaN(+value)) {
        error = "No es un valor numérico";
      } else {
        parseValueType = +value;
      }
    }

    if (props?.noDecimales) {
      parseValueType = parseInt(parseValueType);
      e.target.value = parseValueType;
    }
    if (props?.sinEspacios) {
      parseValueType = String(parseValueType).replace(" ", "");
      e.target.value = parseValueType;
    }

    if (props?.required && !validValue) {
      error = props?.labelRequired || "Este campo es requerido";
    }

    if (props?.noCero) {
      let numericValue = +value;

      if (numericValue == 0) {
        error = "No se acepta valores 0";
      }
    }

    if (props?.noNegativos || props?.noMoreFourDecimal || props?.max) {
      let numericValue = +value;

      if (numericValue < 0) {
        error = "No se acepta valores negativos";
      }
      if (String(numericValue).split(".")[1]?.length > 4) {
        error = "No se aceptan más de 4 decimales";
      }
      if (numericValue > Number(props?.max) && props?.max) {
        error = `La cantidad máxima es ${props?.max}`;
      }
    }

    if (error !== "") {
      form["errors"] = { ...form["errors"] };
      form["errors"][props.saveKey] = error;
      setLabelRequired(error);
      setValidRequired(false);
      setShowError(true);
    } else {
      form["errors"] = { ...form["errors"] };
    }
    if (props.saveKey) {
      form[props.saveKey] = validValue >= 0 ? parseValueType : null;
      setDefaultValue(parseValueType);
    }

    setFormSave(form);
    if (props?.onBlur) props.onBlur(value);
  };

  const onKeyUpHandler = (event: any) => {
    const key = event.key;
    const value = event?.target.value;
    if (props?.onKeyUp) props?.onKeyUp(event?.target?.value);
    if (props?.sinEspacios) {
      let parseValue = String(value).replace(" ", "");
      event.target.value = parseValue;
      handleOnBlur(event);
      setDefaultValue(parseValue);
    }
    if (key == "Enter") {
      if (props.onEnter) {
        handleOnBlur(event);
        props.onEnter(key);
      }
    }
  };

  useEffect(() => {
    let value =
      props?.defaultValue !== undefined
        ? props?.defaultValue
        : props?.saveForm[props?.saveKey];

    const validValue = (value + "").trim().length;
    const form: any = formSave;

    if (value) {
      setDefaultValue(value);
      setShowError(false);
    }

    if (Object.keys(form["errors"] || {}).length > 0) {
      setShowError(true);
    }

    if (!props?.isDate) {
      if (props.saveKey) form[props.saveKey] = validValue >= 0 ? value : null;
      setFormSave(form);
    }

    return () => null;
  }, [props?.defaultValue, props?.saveForm]);

  const handleChange = (e: any) => {
    if (props?.onChange) {
      props?.onChange(e.target.value);
    }
  };

  useEffect(() => {
    const handleWheel = (event: WheelEvent) => {
      if (document.activeElement === event.target) {
        event.preventDefault();
      }
    };

    const inputElement = document.querySelector<HTMLInputElement>(
      `input[name="${props.name}"]`
    );

    inputElement?.addEventListener("wheel", handleWheel);

    return () => {
      inputElement?.removeEventListener("wheel", handleWheel);
    };
  }, [props.name]);

  return (
    <>
      <div className="relative">
        <div className="w-full flex justify-end absolute top-3">
          {showError && (
            <span
              className={
                "mr-1 " +
                (validRequired
                  ? " text-blue-500 fa fa-check-circle"
                  : "text-red-600 fa fa-warning")
              }
              style={{ fontSize: "13px" }}
            ></span>
          )}
        </div>
        {props?.disabled && (
          <span
            className={`${props.labelClass} absolute text-gray-600 z-50 bottom-7 left-2 `}
          >
            {props.label}
          </span>
        )}
        <Input
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
          size={props.size || "md"}
          onResize={undefined}
          onResizeCapture={undefined}
          containerProps={{ className: `min-w-[80px]` }}
          error={!validRequired && showError}
          color={validRequired ? "blue" : props.color || "indigo"}
          name={props.name}
          onWheel={props.onWheel}
          type={props.type || "text"}
          onBlur={(e) => handleOnBlur(e)}
          onFocus={(e) => {
            if (props.onFocus) props.onFocus(e);
          }}
          value={defaultValue} // ✅ Ahora sí se actualizará cuando `defaultValue` cambie
          onChange={(e) => {
            setDefaultValue(e.target.value); // ✅ Esto asegurará que el estado interno cambie
            if (props.onChange) props.onChange(e.target.value);
          }}
          width={props?.width}
          onKeyUp={(e) => onKeyUpHandler(e)}
          autoFocus={props?.autoFocus}
          crossOrigin=""
          disabled={props?.disabled}
          defaultValue={defaultValue}
          label={props?.disabled ? "" : props.label}
          minLength={props?.minLength}
          maxLength={props?.maxLength}
          variant={props.variant ?? "standard"}
          className={
            "w-full " +
            props.class +
            " disabled:border disabled:border-gray-500"
          }
          placeholder={props.placeholder}
          style={{ fontSize: "1.2rem" }}
          labelProps={{ style: { fontSize: "0.9rem" } }}
          max={props?.max}
        />
        {showError && !validRequired && !props?.disabled && (
          <>
            <span className="text-red-700">
              {labelRequired || "Este campo es requerido"}
            </span>
          </>
        )}
      </div>
    </>
  );
};

export default Input2;