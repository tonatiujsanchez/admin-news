import { FC } from 'react';
import NextLink from 'next/link'

interface Props {
    text     : string
    link     : string
    disabled?: boolean
}

export const LinkPrimary:FC<Props> = ({ text, link, disabled=false }) => {
    return (
        <NextLink 
            href={link}
            className={`bg-sky-500 px-8 py-5 font-semibold rounded-md color-admin w-full sm:w-auto ml-auto flex justify-center gap-1 ${ disabled ? 'pointer-events-none bg-sky-300' : 'hover:bg-sky-600' }`}
        >
            <i className='bx bx-plus text-4xl'></i>
            {text}
        </NextLink>
    )
}
