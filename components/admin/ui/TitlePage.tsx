import { FC } from "react"

interface Props {
  title: string
}

export const TitlePage:FC<Props> = ({ title='' }) => {
  return (
    <h1 className="text-5xl sm:text-6xl mb-4 sm:mb-6  font-extrabold">{ title }</h1>
  )
}

