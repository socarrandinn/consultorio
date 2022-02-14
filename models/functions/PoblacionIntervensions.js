import conectarDB from 'lib/dbConnect'
import PoblacionIntervension from 'models/PoblacionIntervension'

export const postPoblacionIntervension = async (intervension, poblacion, fecha) => {

    await conectarDB()

    const poblacionintervension = new PoblacionIntervension({ intervension: intervension, poblacion: poblacion, fecha: fecha })
    await poblacionintervension.save();
    return poblacionintervension
}