


export const sizeFileFormatter = (size: number): string => {

    if (size >= 1073741824) {
        return `${size / 1073741824} GB`
    }

    if (size >= 1048576) {
        return `${(size / 1048576).toFixed(2)} MB`
    }

    if (size >= 1024) {
        return `${(size / 1024).toFixed(2)} KB`
    }

    return `${size} B`
}


export const dateFormatter = (fecha: string) => {

    const newDate = new Date(fecha);

    return newDate.toLocaleDateString('es-Es', {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
    })
}


export const timeFormatter = (fecha: string) => {

    const newDate = new Date(fecha);

    return newDate.toLocaleTimeString('es-Es', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    })
}
