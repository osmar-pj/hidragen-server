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

export const createArrNullsBefore = (hour) => {
    const arr = new Array(hour).fill(0)
    const dato = arr.map((item, index) => {
      return {
        combustible: {
            x: index.toString(),
            y: null
        },
        kilometraje: {
            x: index.toString(),
            y: null
        },
        horas: {
            x: index.toString(),
            y: null
        },
        speedAv: {
            x: index.toString(),
            y: null
        },
        speedMax: {
            x: index.toString(),
            y: null
        }
      }
    })
    return { dato }
  }