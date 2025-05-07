import { Signal } from "@preact/signals-react";
import { CSSProperties, useEffect } from "react";

interface IPropsRadioButton {
  className?: string | ((e: any) => string);
  style?: CSSProperties;
  classNameLabel?: string | ((e: any) => string);
  labelStyle?: CSSProperties;
  label?: string;

  required?: boolean;
  disabled?: boolean;

  valueRadioButton: number | string | readonly string[] | undefined;
  name: string;
  form?: any;

  onKeyUp?: (e: any) => any;
  onBlur?: (e: any) => any;

  update?: Signal<boolean>;
}

let countInstancia = 1;

const RadioButton = (props: IPropsRadioButton) => {
  const { className, style } = props;
  const { classNameLabel, labelStyle, label } = props;
  const { valueRadioButton } = props;
  const { form, name, update } = props;
  const { onBlur } = props;
  const onlyClassName = `radio-button-${new Date().getTime() + countInstancia}`;
  countInstancia = countInstancia + 1;

  const handleChangeClick = (ev: any) => {
    if (onBlur) onBlur(ev);
    form[name];
    handleChangeProccessData();
  };

  const handleChangeProccessData = (value?: string) => {
    const inputs = document.querySelectorAll(`input[name=${name}]`);
    inputs.forEach((input) => {
      if (input instanceof HTMLInputElement) {
        if (value != undefined) {
          input.checked = input.defaultValue == value ? true : false;
        } else {
          input.checked = input.classList.contains(onlyClassName)
            ? true
            : false;
        }
      }
    });
  };

  const handleClickLabel = () => {
    const event = {
      target: {
        name,
        value: valueRadioButton,
      },
    };
    handleChangeClick(event);
  };

  useEffect(() => {
    handleChangeProccessData(form[name] || "");
  }, [update?.value]);

  return (
    <div className={`${className} `} style={style}>
      <div className="inline-flex items-center">
        <span
          className="relative flex cursor-pointer items-center rounded-full p-2"
          data-ripple-dark="true"
        >
          <input
            name={name}
            type="radio"
            value={valueRadioButton}
            onChange={(ev) => handleChangeClick(ev)}
            className={`${onlyClassName} before:content[''] peer relative h-6 w-6 cursor-pointer appearance-none rounded-full border border-gray-400 text-primary-color transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-2 before:w-8 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-primary-color checked:before:bg-primary-color hover:before:opacity-10`}
            // className="before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-full border border-blue-gray-200 text-primary-color transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-primary-color checked:before:bg-primary-color hover:before:opacity-10"
          />
          <div className="pointer-events-none absolute top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 text-primary-color opacity-0 transition-opacity peer-checked:opacity-100">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 16 16"
              fill="currentColor"
            >
              <circle data-name="ellipse" cx="8" cy="8" r="6"></circle>
            </svg>
          </div>
        </span>
        <span
          className={`${classNameLabel} cursor-pointer select-none font-light text-text-color text-lg`}
          style={labelStyle}
          onClick={handleClickLabel}
        >
          {label}
        </span>
      </div>
    </div>
  );
};
export default RadioButton;
