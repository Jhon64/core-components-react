import React, { CSSProperties, Fragment } from "react";

import "./scss/modal.scss";
import { Drawer } from "@material-tailwind/react";
interface IModalProps {
  show?: boolean;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  css?: CSSProperties;
  cssModal?: CSSProperties;
  backdrop?: boolean;
  showHeader?: boolean;
  textHeader?: string;
  setHeader?: () => JSX.Element | JSX.Element;
  children?: JSX.Element;
  setFooter?: () => JSX.Element;
  onCloseDrawer?: (isClosed?: boolean) => void;
  items?: string;
  // size?:number
}
export const Drawer2 = React.memo((props: IModalProps) => {
  const width =
    props?.size == "xl"
      ? 1200
      : props?.size == "lg"
      ? 900
      : props?.size == "md"
      ? 550
      : 400;
  return (
    <Drawer
      onPointerEnterCapture={undefined}
      onPointerLeaveCapture={undefined}
      onResize={null}
      onResizeCapture={null}
      placement="right"
      open={!!props?.show}
      size={width}
      placeholder={null}
      onClose={() => {
        if (props.onCloseDrawer) props?.onCloseDrawer(true);
      }}
    >
      {!props.show && <></>}
      {props.show && (
        <>
          <div
            className="h-full pb-2"
            style={{ zIndex: 1501, ...props.cssModal }}
          >
            {(props.showHeader || props.textHeader || props.setHeader) && (
              <>
                <div className="px-5 py-3 flex justify-between">
                  {!props.setHeader && (
                    <h1 className="text-muted">
                      {props.textHeader || "Header"}
                    </h1>
                  )}
                  {props.setHeader && (
                    <>
                      {typeof props.setHeader == "string"
                        ? props.setHeader
                        : props.setHeader()}
                    </>
                  )}
                  {/* <Button icon="fa fa-close" secondary outline /> */}
                </div>
                <hr />
              </>
            )}
            <div
              style={{ height: props.setFooter ? "calc(100% - 8rem)" : "100%" }}
              className={
                "h-full  p-2 " +
                (props.setHeader || props.textHeader || props.showHeader
                  ? "py-2"
                  : "py-6")
              }
            >
              <div
                className={`h-full flex ${
                  props?.items ? props?.items : "items-center"
                }`}
              >
                {props.children}{" "}
              </div>
            </div>
            {typeof props.setFooter == "function" && (
              <>
                <hr />
                <div className="px-5 pt-3 pb-3">{props.setFooter()}</div>
              </>
            )}
          </div>
        </>
      )}
    </Drawer>
  );
});
