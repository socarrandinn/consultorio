import conectarDB from 'lib/dbConnect'
import Poblacion from 'models/Poblacion'

export const putPoblacionById = async (id, body) => {

    await conectarDB()

    const poblacion = await Poblacion.findByIdAndUpdate(
        id,
        body,
        {
            new: true,
            runValidators: true
        }
    ).lean()

    return poblacion
}


export const deletePoblacionById = async (id) => {
    const poblacion = await Poblacion.findByIdAndUpdate(
        id,
        {
            isbaja: true
        },
        {
            new: true,
            runValidators: true
        }
    ).lean()

    return poblacion

}