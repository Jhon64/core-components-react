import React, { useEffect, useState } from "react";
import { Stepper, Step, Button, Typography } from "@material-tailwind/react";

interface StepperWithContentProps {
  className: string;
  initActive: number;
  options: any[];
  buttons: any[];
}

export const Stepper1: React.FC<StepperWithContentProps> = ({
  className,
  initActive,
  options,
  buttons,
}) => {
  const [activeStep, setActiveStep] = useState<number>(initActive || 0);
  const [isLastStep, setIsLastStep] = useState<boolean>(false);
  const [isFirstStep, setIsFirstStep] = useState<boolean>(false);

  const handleNext = () => !isLastStep && setActiveStep((cur) => cur + 1);

  return (
    <div className={`w-full px-24 py-4 ${className}`}>
      onResizeCapture={null}
      <Stepper onPointerEnterCapture={undefined}onPointerLeaveCapture={undefined}
        onResize={null}
        onResizeCapture={null}
        placeholder="a"
        activeStep={activeStep}
        isLastStep={(value: boolean) => setIsLastStep(value)}
        isFirstStep={(value: boolean) => setIsFirstStep(value)}
      >
        {options.map((option, index) => (
          <Step onPointerEnterCapture={undefined}onPointerLeaveCapture={undefined}
            onResize={null}
            onResizeCapture={null}
            placeholder="a"
            key={index}
            onClick={() => {
              if (!option.disabled) setActiveStep(index);
            }}
          >
            {index + 1}

            <div className="absolute -bottom-[2rem] w-max text-center">
              <Typography onPointerEnterCapture={undefined}onPointerLeaveCapture={undefined}
                onResize={null}
                onResizeCapture={null}
                placeholder="a"
                variant="h6"
                color={activeStep === index ? "blue-gray" : "gray"}
              >
                {option.label}
              </Typography>
            </div>
          </Step>
        ))}
      </Stepper>
      <div className="mt-12 flex justify-end gap-2">
        {buttons.map((button, index) => (
          <>
            {button && (
              <Button onPointerEnterCapture={undefined}onPointerLeaveCapture={undefined}
                onResize={null}
                onResizeCapture={null}
                placeholder="a"
                onClick={async () => {
                  const isNext = await button.onClick();
                  if (isNext) handleNext();
                }}
                disabled={button.disabled}
              >
                {button.label}
              </Button>
            )}
          </>
        ))}
      </div>
    </div>
  );
};
