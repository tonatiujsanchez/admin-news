import { createContext } from "react";

interface ContextProps {
    showSideMenu: boolean

    // Methods
    toggleSideMenu: () => void
}

export const UIContext = createContext({} as ContextProps)