import { useRouter } from 'next/router'
import NextLink from 'next/link'

import styled from "@emotion/styled"

import { useAuth, useUI } from "../../../hooks"



export const SideMenu = () => {

    const { pathname } = useRouter()

    const { user } = useAuth()
    const { showSideMenu, toggleSideMenu } = useUI()

    return (
        <SidebarConatiner>
            {
                !user 
                ? (
                    <div className={`nav`}>
                        <nav className="nav__content">
                            <button
                                className={`nav__toggle`}>
                                <i className='bx bx-menu-alt-left' ></i>
                            </button>
                            <NextLink href="/admin" className="nav__logo">          
                                    <i className='bx bxs-dashboard'></i>
                                    <span className="nav__logo-name">ADMIN</span>
                            </NextLink>
                            <div className="nav__list">
                                {
                                    [0,1,2,3,4].map( (item, index) => (
                                        <span key={index} className={`nav__link`}>
                                            <i className="animate-pulse space-x-4 rounded-sm bg-slate-300 h-7 w-7"></i>
                                            <span className="nav__name">Cargado...</span>
                                        </span>
                                    ))
                                }                             
                            </div>
                        </nav>
                    </div>
                ) : (
                    <div className={`nav ${showSideMenu ? 'show-menu' : ''}`}>
                        <nav className="nav__content">
                            <button
                                onClick={() => toggleSideMenu()}
                                className={`nav__toggle ${showSideMenu ? 'rotate-icon' : ''}`}>
                                <i className='bx bx-menu-alt-left' ></i>
                            </button>
                            <NextLink href="/admin" className="nav__logo">
                                <i className='bx bxs-dashboard'></i>
                                <span className="nav__logo-name">ADMIN</span> 
                            </NextLink>
                            <div className="nav__list">
                                <NextLink href="/admin/nuevo" className={`nav__link ${(pathname.split('/')[2]) === ('/admin/nuevo').split('/')[2] ? 'active-link' : ''}`}>
                                    <i className='bx bxs-plus-square' ></i>
                                    <span className="nav__name">Nuevo artículo</span>                               
                                </NextLink>
                                <NextLink href="/admin/articulos" className={`nav__link ${(pathname.split('/')[2]) === ('/admin/articulos').split('/')[2] ? 'active-link' : ''}`}>
                                        <i className='bx bx-list-ul' ></i>
                                        <span className="nav__name">Artículos</span>
                                </NextLink>
                                <NextLink href="/admin/imagenes" className={`nav__link ${(pathname.split('/')[2]) === ('/admin/imagenes').split('/')[2] ? 'active-link' : ''}`}>
                                    <i className='bx bx-image' ></i>
                                    <span className="nav__name">Imagenes</span>
                                </NextLink>
                                {
                                    user.role === 'admin' &&
                                    <>
                                        <NextLink href="/admin/categorias" className={`nav__link ${(pathname.split('/')[2]) === ('/admin/categorias').split('/')[2] ? 'active-link' : ''}`}>
                                            <i className='bx bx-category-alt' ></i>
                                            <span className="nav__name">Categorías</span>
                                        </NextLink>
                                        <NextLink href="/admin/autores" className={`nav__link ${(pathname.split('/')[2]) === ('/admin/autores').split('/')[2] ? 'active-link' : ''}`}>
                                                <i className='bx bxs-user-circle' ></i>
                                                <span className="nav__name">Autores</span>
                                        </NextLink>
                                    </>
                                }
                            </div>
                        </nav>
                    </div>
                )
            }
        </SidebarConatiner>
    )
}



const SidebarConatiner = styled.div`

    @media screen and (max-width: 767px) {
        .nav__logo,
        .nav__toggle,
        .nav__name {
            display: none;
        }

        .nav__list {
            position: fixed;
            bottom: 3rem;
            box-shadow: 0 8px 24px hsla(228, 81%, 24%, 0.15);
            width: 90%;
            padding: 25px 40px;
            border-radius: 1rem;
            margin: 0 auto;
            left: 0;
            right: 0;
            display: flex;
            justify-content: center;
            column-gap: 36px;
            transition: 0.4s;
            background-color: var(--white-color);
            z-index: 98;
        }
    }

    .nav__link {
        display: flex;
        font-size: 1.7rem;
        font-weight: 500;
        transition: 0.3s;
        color: var(--slate-color-600);
    }

    .nav__link i {
        font-size: 2rem;
    }

    .nav__link:hover {
        color: var(--primary-color);
    }

    /* Active link */
    .active-link {
        color: var(--primary-color);
    }


    @media screen and (max-width: 320px) {
        .nav__list {
            column-gap: 20px;
        }    
    }

    /* For medium devices */
    @media screen and (min-width: 576px) {
        .nav__list {
            width: 33.2rem;
        }    
    }

    @media screen and (min-width: 767px) {
    
        .nav {
            position: fixed;
            left: 0;
            box-shadow: 1px 0 4px hsla(228, 81%, 24%, 0.15);
            width: 8.4rem;
            height: 100vh;
            padding: 3rem;
            transition: 0.3s;
            background-color: #FFF;
        }

        .nav__logo {
            display: flex;
        }

        .nav__logo i {
            font-size: 2rem;
            color: var(--first-color);
        }

        .nav__logo-name {
            color: var(--title-color);
            font-weight: 600;
        }

        .nav__logo,
        .nav__link {
            align-items: center;
            column-gap: 2rem;
        }

        .nav__list {
            display: grid;
            row-gap: 4rem;
            margin-top: 10.5rem;
        }

        .nav__content {
            overflow: hidden;
            height: 100%;
        }

        .nav__toggle {
            position: absolute;
            width: 24px;
            height: 24px;
            background-color: black;
            color: #FFF;
            border-radius: 50%;
            font-size: 1.6rem;
            display: grid;
            place-items: center;
            top: 3rem;
            right: -10px;
            cursor: pointer;
            transition: .4s;
        }
    }

    /* Show menu */
    .show-menu {
        width: 25.5rem;
    }

    /* Rotate toggle icon */
    .rotate-icon {
        /* transform: rotate(180deg); */
        transform: scaleX(-1);
    }
`