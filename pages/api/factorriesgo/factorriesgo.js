import conectarDB from 'lib/dbConnect'
import FactorRiesgo from 'models/FactorRiesgo'

export default async function handler(req, res) {

    await conectarDB()

    const { method, body } = req
    switch (method) {
        case 'POST':
            try {
                const factorriesgo = new FactorRiesgo(body)
                await factorriesgo.save();
                return res.status(200).json({ success: true, factorriesgo });

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