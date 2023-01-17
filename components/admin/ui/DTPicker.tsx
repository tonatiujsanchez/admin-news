import DateTimePicker from 'react-datetime-picker/dist/DateTimePicker'

import 'react-datetime-picker/dist/DateTimePicker.css'
import 'react-calendar/dist/Calendar.css'
// import 'react-clock/dist/Clock.css'

import styled from '@emotion/styled'

import { FC, useState } from 'react'

interface Props {
    value: Date
    onChangePublishedAt: (dateTime: Date) => void
    label: string
    processing?: boolean
}

export const DTPicker:FC<Props> = ({ value, onChangePublishedAt, label = "Fecha y hora", processing=false }) => {

    const [openCalendar, setOpenCalendar] = useState(false)

    const onChangeDateTime = (value:Date) => {
        onChangePublishedAt(value)
        setOpenCalendar(false)

    }

    return (
        <div>
            <p className="mb-2 block font-bold text-slate-800">{ label }</p>
            <DateTimePickerContainer className={`bg-admin flex justify-between items-center rounded-md border py-4 px-4 w-full ${ processing ? '' : 'hover:border-slate-800' }`}>

                <DateTimePicker 
                    onChange={onChangeDateTime} 
                    value={value || new Date()} 
                    locale="es-ES"
                    format="dd MMM yyyy ⏱ hh:mm a"
                    disableClock={true}
                    disableCalendar={!openCalendar}
                    isCalendarOpen={openCalendar}
                    className="absolute w-full"
                    disabled={processing}
                />

                <div className='flex items-center mt-1'>
                    <button disabled={processing} type='button' className='text-5xl mr-2' onClick={()=>onChangePublishedAt(new Date())} >
                        <i className='bx bx-x' ></i>
                    </button>
                    <button disabled={processing} type='button' className='text-4xl' onClick={()=>setOpenCalendar(!openCalendar)} >
                        <i className='bx bx-calendar'></i>
                    </button>
                </div>
                
            </DateTimePickerContainer>
        </div>
    )
}


const DateTimePickerContainer = styled.div`

    .react-datetime-picker__wrapper {
        border:none;
        font-size: 1.4rem;
        button {
            display: none;
        }
    }

    .react-datetime-picker__calendar {
        max-width: 30rem;
    }

    @media screen and (min-width: 960px) {
        .react-datetime-picker__wrapper {
        border:none;
        font-size: 1.5rem;
            button {
                display: none;
            }
        }

        .react-datetime-picker__calendar {
            max-width: 35rem;
        }
    }
`