import React from "react";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import { size } from "@material-tailwind/react/types/components/dialog";

interface DialogWithContentProps {
  show: boolean;
  setFooter: any;
  setHeader: any;
  children: any;
  size?: size;
}

 const Dialog1: React.FC<DialogWithContentProps> = ({
  show,
  setFooter,
  setHeader,
  children,
  size = "lg",
}) => {
  return (
    <Dialog
      onPointerEnterCapture={undefined}
      onPointerLeaveCapture={undefined}
      onResize={null}
      onResizeCapture={null}
      size={size}
      placeholder="a"
      open={show}
      handler={() => console.log()}
    >
      <DialogHeader
        onPointerEnterCapture={undefined}
        onPointerLeaveCapture={undefined}
        onResize={null}
        onResizeCapture={null}
        placeholder="a"
      >
        {setHeader()}
      </DialogHeader>
      <DialogBody    onPointerEnterCapture={undefined}
        onPointerLeaveCapture={undefined} onResize={null} onResizeCapture={null} placeholder="a">
        {children}
      </DialogBody>
      <DialogFooter    onPointerEnterCapture={undefined}
        onPointerLeaveCapture={undefined} onResize={null} onResizeCapture={null} placeholder="a">
        {setFooter()}
      </DialogFooter>
    </Dialog>
  );
};

export default Dialog1;