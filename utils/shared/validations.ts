
export const isValidEmail = (email:string):boolean => {

    const match = String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );

    return !!match;
}



export const isEmail = (email:string): string | undefined => {
    
    return isValidEmail(email)
        ? undefined
        : 'El correo no es válido';
}


export const isSocialUsername = ( username: string ): string | undefined => {

    if(username[0] !== '@'){
        return 'Nombre de usuario no válido'
    }

    if( !username[1] ){
        return 'Nombre de usuario no válido'
    }

    if(username[1] && username[1].trim() === ''){
        return 'Nombre de usuario no válido'
    }

    return  undefined
    
}