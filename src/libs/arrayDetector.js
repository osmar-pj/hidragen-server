export const array_detectors = (x) => {
    const nro_arrays = 5
    const p = x.length/nro_arrays
    let parameter = new Array(p)
    let count = 0
    for (let i =0; i < p; i++) {
        parameter[i] = new Array(nro_arrays)
        for (let j = 0; j < 5; j++) {
            parameter[i][j] = x[count]
            count++
        }
    }
    return parameter
}