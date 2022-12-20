import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

import * as jose from 'jose'


export async function middleware( req: NextRequest ) {

    const cookieAuthKey = 'news_session_ed4c1de1770480153a06fa2349f501f0'

    const token = req.cookies.get(cookieAuthKey)
    const { protocol, host } = req.nextUrl 


    
    // ===== ===== ===== Frontend ===== ===== =====
    if( req.nextUrl.pathname.startsWith('/admin') ){

        if( !token ){
            return NextResponse.redirect(`${protocol}//${host}/iniciar-sesion`)
        }

        console.log(token);
        

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


}


export const config = {
    matcher: [
        '/admin/:path*',
        '/iniciar-sesion',
    ]
}