import conectarDB from 'lib/dbConnect'
import Intervension from 'models/Intervension'

export const  getIntervensionByName = (name) => {

    await conectarDB()

    const objIntervension = await Intervension.find({intervension: name})

    if (!objIntervension){
        const newIntervension = new Intervension({
            intervension: name
        })
        await newIntervension.save();
        return newIntervension
    }   
    return objIntervension
}