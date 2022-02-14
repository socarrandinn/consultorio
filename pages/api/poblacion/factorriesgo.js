import conectarDB from 'lib/dbConnect'
import Poblacion from 'models/Poblacion'

export default async function handler(req, res) {

    await conectarDB()

    const { method, body } = req
    switch (method) {
        case 'POST':
            try {
                const poblacion = await Poblacion.findById(body._id)
                poblacion.factor_riesgos = poblacion.factor_riesgos.concat(body.factor_riesgo._id)
                await poblacion.save();

                const newFactorRiesgo = {
                    id: body.factor_riesgo._id,
                    factor_riesgo: body.factor_riesgo.factor_riesgo
                }
                return res.status(200).json({ success: true, newFactorRiesgo });

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