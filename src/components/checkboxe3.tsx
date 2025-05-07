import { Checkbox, CheckboxProps } from "@material-tailwind/react";
import React, { useEffect } from "react";
interface IPropsCheckbox3 extends CheckboxProps {
  saveKey?: string;
  saveForm?: any;
  keyValue?: string;
  keyLabel?: string;
  onChecked?: (value: boolean) => void;
}

const CheckBox3 = (props: IPropsCheckbox3) => {
  const [checked, setChecked] = React.useState(() => {
    if (props.saveForm && props.saveKey) return props.saveForm[props.saveKey];
    return false;
  });

  useEffect(() => {
    if (props.saveForm && props.saveKey)
      setChecked(props.saveForm[props.saveKey] ?? false);
  }, []);

  return (
    <>
      <Checkbox
        onPointerEnterCapture={undefined}
        onPointerLeaveCapture={undefined}
        onResize={undefined}
        onResizeCapture={undefined}
        label={props?.label}
        crossOrigin={null}
        onChange={(ev) => {
          const value = ev.target.checked;
          if (props?.saveForm && props?.saveKey)
            props.saveForm[props.saveKey] = value;
          if (props?.onChecked) props.onChecked(value);
          setChecked(value);
        }}
        key={props?.key || Date.now()}
        size={props?.size}
        color={props?.color}
        defaultChecked={checked}
        ripple={props?.ripple}
        disabled={props?.disabled}
      />
    </>
  );
};

export default CheckBox3;
