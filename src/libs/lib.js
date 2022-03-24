export const createArrNulls = (hour) => {
  const arr = new Array(hour < 12 ? 11 - hour : 23 - hour).fill(0)
  const dato = arr.map((item, index) => {
    return {
      combustible: {
          x: (hour + index + 1).toString(),
          y: null
      },
      kilometraje: {
          x: (hour + index + 1).toString(),
          y: null
      },
      horas: {
          x: (hour + index + 1).toString(),
          y: null
      },
      speedAv: {
          x: (hour + index + 1).toString(),
          y: null
      },
      speedMax: {
          x: (hour + index + 1).toString(),
          y: null
      }
    }
  })
  return { dato }
}