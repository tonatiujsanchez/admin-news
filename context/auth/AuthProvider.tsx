
import { FC, useEffect, useReducer } from 'react';
import { useRouter } from 'next/router';

import axios from 'axios';
import Cookies from 'js-cookie'

import { AuthContext, authReducer } from './';

import { IUser } from '../../interfaces';


interface Props {
    children: JSX.Element
}

export interface AuthState {
    isLoggedIn: boolean;
    user?: IUser
}

const AUTH_INITIAL_STATE: AuthState = {
    isLoggedIn: false,
    user: undefined,
}

const cookieAuthKey = 'news_session_ed4c1de1770480153a06fa2349f501f0'

export const AuthProvider: FC<Props> = ({ children }) => {

    const router = useRouter()

    const [state, dispatch] = useReducer(authReducer, AUTH_INITIAL_STATE)

    useEffect(()=>{
        checkToken()
    },[])

    const checkToken = async () => {

        if( !Cookies.get(cookieAuthKey) ){ return }

        try {

            const { data } = await axios.get('/api/auth/validate-session')
            const { token, user } = data
            
            Cookies.set(cookieAuthKey, token)
            dispatch({ type: '[Auth] - Login', payload: user })
            
        } catch (error) {

            Cookies.remove(cookieAuthKey)
        }


    }

    const loginUser = async ( email:string, password:string ):Promise<boolean> => {
        try {

            const { data } = await axios.post('/api/auth/login', { email, password })
            const { token, user } = data

            Cookies.set(cookieAuthKey, token)
            dispatch({ type: '[Auth] - Login', payload: user })

            return true

        } catch (error) {
            return false
        }
    }

    const logout = ():void => {
        Cookies.remove( cookieAuthKey )
        router.reload()
    }


    return (
        <AuthContext.Provider value={{
            ...state,

            // Methods
            loginUser,
            logout
        }}>
            {children}
        </AuthContext.Provider>
    )
}
