import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';

import { useState } from "react";
import { Typography } from '@mui/material';

import Table from "components/Table"
import MensageError from 'components/MensageError';
import { useMessageError } from 'hooks/useMessageError';
import BackdropProgress from 'components/Alert/BackdropProgress';

const FormFactorRiesgo = ({ formData, factorriesgos }) => {

    const [form, setForm] = useState(formData);
    const [open, setOpen] = useState(false);

    const [message, setMessage] = useState([])

    function createData(id, factor_riesgo) {
        return { id, factor_riesgo };
    }
    const rows = []
    factorriesgos.map((r) => {
        rows.push(createData(r._id, r.factor_riesgo))
    })
    const [row, setRow] = useState(rows);

    console.log(row)

    const column = [
        { field: 'id', headerName: 'ID', width: 40 },
        { field: 'factor_riesgo', headerName: 'Factor Riesgo', width: 400, type: 'string' }
    ]


    const handleChange = e => {
        const { value, name } = e.target
        setForm({
            ...form,
            [name]: value
        })
    }


    const handleSubmit = e => {
        e.preventDefault()
        postData(form)
    }

    const postData = async (form) => {
        setMessage([])
        try {
            setOpen(true)
            const res = await fetch('/api/factorriesgo/factorriesgo', {
                method: 'POST',
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify(form)
            })
            const data = await res.json();
            if (!data.success) {
                const { errors } = useMessageError(data.error)
                setMessage(errors)
                setOpen(false)
            } else {  
                setRow([
                    ...row,
                    createData(data.factorriesgo._id, data.factorriesgo.factor_riesgo)
                ])
                setForm({
                    ...form,
                    ['factor_riesgo']: ''
                })
                setOpen(false)
                setMessage([{
                    message: 'Datos guardados correctamente',
                    path: '',
                    tipo_error: 'success'
                }])
            }

        } catch (error) {
            console.log(error)
        }
    }


    return (
        <>
            <BackdropProgress open={open} />
            <form onSubmit={handleSubmit}>

                <Grid container spacing={2} justifyContent="center" alignItems="center">

                    <Grid item xs={12} md={6}>
                        <Typography variant="h4" mb={2} component="div">
                            Listado de Factores de Riesgos
                        </Typography>
                        <TextField
                            fullWidth
                            label="Escribe el factor de riesgo"
                            placeholder="Factor de Riesgo"
                            name="factor_riesgo"
                            value={form.factor_riesgo}
                            onChange={handleChange}
                        />
                    </Grid>
                </Grid>
                <Grid container spacing={2} justifyContent="center" alignItems="center">
                    <Grid mt={2} item xs={12} md={6} >
                        <Button variant="contained" onClick={handleSubmit}>+ Adicionar</Button>
                    </Grid>
                </Grid>
                <Grid container spacing={2} justifyContent="center" alignItems="center">
                    <Grid item xs={12} md={12} mt={2}>
                        {
                            message.map(({ message, tipo_error}) => (

                                <MensageError
                                    tipoError={tipo_error}
                                    message={message}
                                />

                            ))
                        }
                    </Grid>
                </Grid>

            </form>

            <Grid  container justifyContent="center" alignItems="center" >

                <Grid item xs={12} md={6}  >

                    <Table
                        height={380}
                        ischeckbox={true}
                        rows={row}
                        num_row={5}
                        columns={column}
                    />


                </Grid>
            </Grid>
        </>
    )
}

export default FormFactorRiesgo 
