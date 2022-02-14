import conectarDB from 'lib/dbConnect'
import Intervension from 'models/Intervension'

export const  postIntervensionByName = async (name) => {

    await conectarDB()

    const objIntervension = await Intervension.findOne({intervension: name})

    if (objIntervension === null){
        const newIntervension = new Intervension({
            intervension: name
        })
        await newIntervension.save(); 
        return newIntervension      
    }    
    return objIntervension      
}