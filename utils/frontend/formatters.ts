


export const sizeFileFormatter = ( size:number ):string => {
    
    if( size >= 1073741824 ){
        return `${ size / 1073741824 } GB`
    }

    if( size >= 1048576 ){
        return `${ (size / 1048576).toFixed(2) } MB`
    }

    if( size >= 1024 ){
        return `${ (size / 1024).toFixed(2) } KB`
    }

    return `${ size } B`
}