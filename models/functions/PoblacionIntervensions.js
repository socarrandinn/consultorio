import conectarDB from 'lib/dbConnect'
import PoblacionIntervension from 'models/PoblacionIntervension'

export const postPoblacionIntervension = async (intervension, poblacion) => {

    await conectarDB()

    const objPoblacionIntervension = await PoblacionIntervension.find({ intervension: intervension, poblacion: poblacion })
    return objPoblacionIntervension
}