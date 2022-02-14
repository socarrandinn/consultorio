import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';

import { useState } from "react";
import {Stack, TextField, Typography } from '@mui/material';

import TextAutoComplete from 'components/TextAutoComplete'
import Table from 'components/Table'

import { LocalizationProvider, MobileDatePicker } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';

import BackdropProgress from 'components/Alert/BackdropProgress';

import MensageError from 'components/MensageError';
import { useMessageError } from 'hooks/useMessageError';

const FormPoblacionIntervension = ({ formData }) => {

    const [desactivado, setDesactivado] = useState(true);
    const [open, setOpen] = useState(false)

    const [form, setForm] = useState({
        poblacion: formData.poblacion,
        intervension: null,
        fecha: ''
    });

    function createData(id, intervension, fecha) {
        return { id, intervension, fecha };
    }
    const rows = []
    formData.intervensions.map((r) => {
        rows.push(createData(r._id, r.intervension.intervension, new Date(r.fecha).toLocaleDateString()))
    })

    const [row, setRow] = useState(rows);
    const [fecha, setFecha] = useState(new Date());

    const column = [
        { field: 'id', headerName: 'ID', width: 40 },
        { field: 'intervension', headerName: 'Intervensión', width: 200, type: 'string' },
        { field: 'fecha', headerName: 'Fecha Intervensión', width: 200, type: 'string', sortable: false }
    ]

    const autocompleteProps = {
        options: formData.intervension,
        getOptionLabel: (option) => option.intervension,
        value: form.intervension,
        onChange: (event, newValue) => {
            setForm({
                ...form,
                ['intervension']: newValue
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
            const res = await fetch('/api/poblacionintervension/poblacionintervension', {
                method: 'POST',
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify({
                    intervension: form.intervension,
                    poblacion: form.poblacion,
                    fecha: form.fecha
                })
            })
            const data = await res.json();
            if (!data.success) {
                const { errors } = useMessageError(data.error)
                setMessage(errors)
                setOpen(false)
            } else {
                setMessage([])
                setDesactivado(true)
                setRow([
                    ...row,
                    data.newIntervension
                ])
                setForm({
                    ...form,
                    ['intervension']: null
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
                                Listado de Intervensiones
                            </Typography>
                        </Grid>
                    </Grid>

                    <Grid container spacing={2} justifyContent="center" alignItems="center">

                        <Grid item xs={12} md={6}>

                            <TextAutoComplete
                                label='Intervensiones'
                                defaultProps={autocompleteProps}
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>

                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <Stack>
                                    <MobileDatePicker
                                        label="Fecha"
                                        value={form.fecha = fecha}
                                        name="fecha"
                                        onChange={(handleChange) => {
                                            setFecha(handleChange);
                                        }}
                                        renderInput={(params) => <TextField {...params} />}
                                    />
                                </Stack>
                            </LocalizationProvider>

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

export default FormPoblacionIntervension 
