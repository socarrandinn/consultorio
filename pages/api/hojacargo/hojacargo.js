import conectarDB from 'lib/dbConnect'
import HojaCargo from 'models/HojaCargo'
import Poblacion from 'models/Poblacion'
import Intervension from 'models/Intervension'
import PoblacionIntervension from 'models/PoblacionIntervension'

export default async function handler(req, res) {

    await conectarDB()

    const { method, body } = req
    switch (method) {
        case 'POST':
            try {
                const hojacargo = new HojaCargo(body)
                await hojacargo.save();

                if (hojacargo) {
                    const id = body.poblacion._id
                    var poblacion = await Poblacion.findByIdAndUpdate(
                        id,
                        {
                            'fecha_hojacargo': body.fecha
                        },
                        {
                            new: true,
                            runValidators: true
                        }
                    ).lean()

                    //obuscar Intervension
                   // var objIntervension = await Intervension.find({ intervension: body.intervension })



                    /*   const newIntervension = new Intervension({
                           intervension: body.intervension
                       })
                       await newIntervension.save();
                       await new PoblacionIntervension({ intervension: newIntervension, poblacion: poblacion })
                    */

                }
                return res.status(200).json({ success: true, hojacargo: hojacargo, poblacion: poblacion, log: objIntervension });

            } catch (error) {
                return res
                    .status(400)
                    .json({ success: false, error: error });
            }
        default:
            return res
                .status(500)
                .json({ success: false, error: 'Falla de servidor' });
    }

}