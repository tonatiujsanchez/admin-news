
import { toast } from 'react-toastify'


export const notifySuccess = ( msg:string ) => toast.success(msg, {
    theme: "colored",
    autoClose: 1000
})

export const notifyError = ( msg:string ) => toast.error(msg, {
    theme: "colored",
    autoClose: 3000
})

export const notifyDark = ( msg:string ) => toast.dark(msg, {
    theme: "dark",
    hideProgressBar: true,
    autoClose: 300
})
