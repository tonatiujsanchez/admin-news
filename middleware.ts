import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

import * as jose from 'jose'


export async function middleware( req: NextRequest ) {

    const cookieAuthKey = 'news_session_ed4c1de1770480153a06fa2349f501f0'

    const token = req.cookies.get(cookieAuthKey)
    const { protocol, host } = req.nextUrl 

    
    // ===== ===== ===== Frontend ===== ===== =====

    if (
        req.nextUrl.pathname.startsWith('/admin/autores') || 
        req.nextUrl.pathname.startsWith('/admin/categorias') ||
        req.nextUrl.pathname.startsWith('/admin/usuarios')
    ) {

        if (!token) {            
            return NextResponse.redirect(`${protocol}//${host}/iniciar-sesion`)
        }
        
        try {
            const { payload } = await jose.jwtVerify(String(token.value), new TextEncoder().encode(process.env.JWT_SECRET_SEED))
            
            
            if(payload.role !== 'admin'){
                return NextResponse.redirect(`${protocol}//${host}/admin`)
            } 
    
            return NextResponse.next()
            
        } catch (error) {
            console.log(error)
            return NextResponse.redirect(`${protocol}//${host}/iniciar-sesion`)
        }
        
    }


    if( req.nextUrl.pathname.startsWith('/admin') ){
       

        if( !token ){
            return NextResponse.redirect(`${protocol}//${host}/iniciar-sesion`)
        }
        
        try {
            
            await jose.jwtVerify(String(token.value), new TextEncoder().encode(process.env.JWT_SECRET_SEED))   
            return NextResponse.next()


        } catch (error) {
            console.log(error)
            return NextResponse.redirect(`${protocol}//${host}/iniciar-sesion`)
        }

    }


    if (req.nextUrl.pathname.startsWith('/iniciar-sesion')) {

        if( !token ){
            return NextResponse.next()
        }

        try {
            
            await jose.jwtVerify(String(token.value), new TextEncoder().encode(process.env.JWT_SECRET_SEED))
            return NextResponse.redirect(`${protocol}//${host}/admin`)
            
        } catch (error) {

            return NextResponse.next()
        }
    }

    // ===== ===== ===== API ===== ===== =====

    if (req.nextUrl.pathname.startsWith('/api/shared')) {

        if (!token) {            
            return NextResponse.redirect(new URL('/api/unauthorized', req.url))
        }

        try {
            
            await jose.jwtVerify(String(token.value), new TextEncoder().encode(process.env.JWT_SECRET_SEED))
            return NextResponse.next()

        } catch (error) {

            return NextResponse.redirect(new URL('/api/unauthorized', req.url))
        }
    }

    
    if (req.nextUrl.pathname.startsWith('/api/admin')) {

        if (!token) {            
            return NextResponse.redirect(new URL('/api/unauthorized', req.url))
        }

        try {
            
            const { payload } = await jose.jwtVerify(String(token.value), new TextEncoder().encode(process.env.JWT_SECRET_SEED))
            
            if(payload.role !== 'admin'){
                return NextResponse.redirect(new URL('/api/unauthorized', req.url))
            }

            return NextResponse.next()

        } catch (error) {

            return NextResponse.redirect(new URL('/api/unauthorized', req.url))
        }
    }

    


}


export const config = {
    matcher: [
        '/admin/:path*',
        '/admin/autores/:path*',
        '/admin/categorias/:path*',
        '/admin/usuarios/:path*',

        '/iniciar-sesion',

        // Api
        '/api/admin/:path*',
        '/api/shared/:path*',
    ]
}