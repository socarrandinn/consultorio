import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';

import { useState } from "react";
import { Alert, Stack, Typography } from '@mui/material';

import TextAutoComplete from 'components/TextAutoComplete'
import Table from 'components/Table'
import BackdropProgress from 'components/Alert/BackdropProgress';

import MensageError from 'components/MensageError';
import { useMessageError } from 'hooks/useMessageError';


const FormPoblacionFactorRiesgo = ({ formData }) => {

    const [desactivado, setDesactivado] = useState(true);
    const [open, setOpen] = useState(false)

    const [form, setForm] = useState({
        _id: formData.poblacion._id,
        factor_riesgo: null
    });

    console.log(formData)

    function createData(id, factor_riesgo) {
        return { id, factor_riesgo };
    }
    const rows = []
    formData.factor_riesgos?.map((r) => {
        rows.push(createData(r._id, r.factor_riesgo))
    })

    const [row, setRow] = useState(rows);

    const column = [
        { field: 'id', headerName: 'ID', width: 40 },
        { field: 'factor_riesgo', headerName: 'Factor de Riesgo', width: 250, type: 'string' }
    ]

    const autocompleteProps = {
        options: formData.factor_riesgo,
        getOptionLabel: (option) => option.factor_riesgo,
        value: form.factor_riesgo,
        onChange: (event, newValue) => {
            setForm({
                ...form,
                ['factor_riesgo']: newValue
            })
            setDesactivado(desactivado = (newValue === null) ? true : false)
        }
    };

    const [message, setMessage] = useState([])

    const handleSubmit = e => {
        e.preventDefault()
        postData(form)
    }


    const postData = async (form) => {
        setMessage([])
        try {
            setOpen(true)
            const res = await fetch('/api/poblacion/factorriesgo', {
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

                setDesactivado(true)
                setRow([
                    ...row,
                    data.newFactorRiesgo
                ])
                setForm({
                    ...form,
                    ['factor_riesgo']: null
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

                <Stack m={2} justifyContent="center" alignItems="center">
                    <Grid container pb={2} pt={2} spacing={2} justifyContent="center" alignItems="center">
                        <Grid item>
                            <Typography variant="h5" component="div">
                                Factores de Riesgos
                            </Typography>
                        </Grid>
                    </Grid>

                    <Grid container spacing={2} justifyContent="center" alignItems="center">

                        <Grid item xs={12} md={12}>
                            <TextAutoComplete
                                label='Factor de Riesgos'
                                defaultProps={autocompleteProps}
                            />
                        </Grid>
                    </Grid>


                    <Grid container justifyContent="center" alignItems="center" mt={2}>
                        <Grid item xs={12} md={12} >
                            <Button disabled={desactivado === true} type='submit' variant="contained"> + Adicionar </Button>
                        </Grid>
                        <Grid item xs={12} md={12}>
                            {
                                message.map(({ message, tipo_error }) => (

                                    <MensageError
                                        tipoError={tipo_error}
                                        message={message}
                                    />

                                ))
                            }
                        </Grid>
                    </Grid>

                    <Grid mt={2} container justifyContent="center" alignItems="center" >

                        <Grid item xs={12} md={12}>

                            <Table
                                height={350}
                                ischeckbox={false}
                                rows={row}
                                num_row={5}
                                columns={column}
                            />


                        </Grid>
                    </Grid>
                </Stack>

            </form>
        </>
    )
}

export default FormPoblacionFactorRiesgo 
