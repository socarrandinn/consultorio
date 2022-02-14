import mongoose from 'mongoose'

const FactorRiesgoSchema = new mongoose.Schema({
    factor_riesgo: {
        type: String,
        unique: true,
        required: [true, "Por favor ingrese el factor de riesgo"],
    }
})

export default mongoose.models.FactorRiesgo || mongoose.model('FactorRiesgo', FactorRiesgoSchema)