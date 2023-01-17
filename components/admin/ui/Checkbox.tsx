import { FC } from 'react';


interface Props {
    value: boolean
    name : string
    onCheckChange: () => void
    label: string
    processing?: boolean
}

export const Checkbox:FC<Props> = ({ value, name, onCheckChange, label, processing=false }) => {
    
    
    return (
        <div className="flex flex-col items-start">
            <span className="mb-1 block font-bold text-slate-800">{ label }</span>
            <div className={`border p-2 rounded-lg flex items-center py-4 px-5 mt-2 ${ processing ? '' : 'hover:border-slate-800' }`}>
                <label htmlFor={`default-toggle-${name}`} className={`inline-flex relative items-center ${ processing ? 'cursor-default opacity-60' : 'cursor-pointer' }`}>
                    <input
                        type="checkbox"
                        id={`default-toggle-${name}`}
                        name={ name }
                        onChange={ onCheckChange }
                        className="sr-only peer"
                        checked={value}
                        disabled={processing}
                    />
                    <div
                        className={`w-[6rem] h-12 bg-gray-200 peer-focus:outline-none peer-focus:ring-0 peer-focus:ring-emerald-300 dark:peer-focus:ring-emerald-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[3px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-10 after:w-11 after:transition-all dark:border-gray-600 peer-checked:bg-emerald-600`}
                    >
                    </div>
                </label>
            </div>
        </div>
    )
}
