import conectarDB from 'lib/dbConnect'
import HojaCargo from 'models/HojaCargo'
import Poblacion from 'models/Poblacion'

//functions
import { postIntervensionByName } from 'models/functions/Intervensions'
import { postPoblacionIntervension } from 'models/functions/PoblacionIntervensions'
import { putPoblacionById } from 'models/functions/Poblacions'

export default async function handler(req, res) {

    await conectarDB()

    const { method, body } = req
    switch (method) {
        case 'POST':
            try {
                const hojacargo = new HojaCargo(body)
                await hojacargo.save()

                if (hojacargo) {
                    const id = body.poblacion._id
                    var poblacion = await putPoblacionById(id, { 'fecha_hojacargo': body.fecha })
                    
                    if (body.intervension == 'Consulta' || body.intervension == 'Terreno') {
                        const intervension = await postIntervensionByName(body.intervension)
                        await postPoblacionIntervension(intervension, poblacion, body.fecha);
                    }

                }
                return res.status(200).json({ success: true, hojacargo: hojacargo, poblacion: poblacion });

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