import styled from "@emotion/styled"
import Head from "next/head"
import { FC, ReactNode } from "react"
import { useAuth, useUI } from "../../hooks"
import { ProfileBar, SideMenu } from "../admin/shared"
import { LoadingLetters } from "../admin/utilities"


interface Props {
    children: ReactNode
    title: string
    isMain?: boolean

}

export const LayoutAdmin:FC<Props> = ({ children, title='', isMain=false }) => {

    const { showSideMenu } = useUI()
    const { user, isLoggedIn } = useAuth()

    // if(!isLoggedIn){
    //     return(
    //         <div className="h-screen w-full flex justify-center items-center">
    //             <LoadingLetters />
    //             <p className="ml-3">Cargando...</p>
    //         </div>
    //     )
    // }

    return (
        <>
            <Head>
                <title>{`Admin ${title}`}</title>
            </Head>
            <AdminLayoutContainer className={`bg-admin min-h-screen ${ isMain ? 'pb-36' : 'pb-4' }`}>
                <div className={`z-50 ${isMain ? 'block' : 'hidden'} sm:block`}>
                    <SideMenu />
                </div>
                <div className="sticky z-40 top-0 sm:static sm:-z-0">
                    <ProfileBar />
                </div>
                <main className={`container-admin section ${showSideMenu ? 'container-show-sidemenu' : ''}`}>
                { !user
                        ? (
                            <div className="flex justify-center mt-96">
                                <LoadingLetters />
                            </div>
                        ):(
                            children
                        )
                }
                </main>
                
            </AdminLayoutContainer>
        </>
    )
}

const AdminLayoutContainer = styled.div`
    position: relative;
    /* background-color: rgb(250, 250, 255); */
    background-color: rgb(248, 248, 255);
    
    .container-admin {
        margin-left: 1rem;
        margin-right: 1rem;
    }
    
    .section {
        padding-top: 1rem;
        padding-bottom: 2rem;
        padding-right: 1rem;
        padding-left: 1rem;        
        transition: 0.3s;
    }
    
    @media screen and (min-width: 767px) {
        padding-bottom: 4rem;

        .section {
            padding-top: 2rem;
            padding-bottom: 3rem;
            padding-right: 2rem;
            padding-left: 2rem;
            transition: 0.3s;
        }
        .container-admin{
            margin-left: 9rem;
            margin-right: 1.5rem;
        }

        .container-show-sidemenu {
            margin-left: 26rem;
        }
    }
`
