import { CSSProperties, useRef } from "react"

interface IImgPrev {
  urlImage: string
  css?: CSSProperties
  class?: string
}
 const ImgPrev = (props: IImgPrev) => {
  const baseFILES = ''//window.baseUrlAPI
  const urlDefault = "/images/default-img.gif"
  const prevImgRef = useRef(null as HTMLImageElement)
  return <>
    <img src={props.urlImage ? baseFILES + "/" + props.urlImage : urlDefault}
      ref={prevImgRef}
      className={"hover:shadow-sm hover:bg-blue-gray-600 hover:cursor-pointer"
        + (props.class)}
      style={{ border: "1px solid #ddd", ...props.css }} />
  </>
}

export default ImgPrev