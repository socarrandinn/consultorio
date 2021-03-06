import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import { useState } from "react";
import { useRouter } from 'next/dist/client/router';
import { FormControl, InputLabel, MenuItem, Select, Stack, Typography } from '@mui/material';


import { LocalizationProvider, MobileDatePicker } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import TextAutoComplete from 'components/TextAutoComplete';
import MensageError from 'components/MensageError';
import BackdropProgress from 'components/Alert/BackdropProgress';

//hooks
import { useMessageError } from 'hooks/useMessageError';


const FormPoblacion = ({ formData, accion = true, calles = [], consultorios = [] }) => {
    const router = useRouter()

    const [form, setForm] = useState(formData);
    const [open, setOpen] = useState(false);

    console.log(form)

    const calcular_edad = (fecha_nacimiento) => {
        const hoy = new Date()
        const fecha = new Date(fecha_nacimiento)
        const edad = (hoy.getFullYear() - fecha.getFullYear())
        const mes = (hoy.getMonth() - fecha.getMonth())
        if (mes < 0 || (mes === 0 && hoy.getDate() < fecha.getDate())) {
            edad--
        }
        return edad
    }

    const autocompleteCalle = {
        options: calles,
        getOptionLabel: (option) => option.calle,
        value: form.calle == '' ? null : form.calle,
        onChange: (event, newValue) => {
            setForm({
                ...form,
                ['calle']: newValue
            })

        }
    };

    const autocompleteConsultorio = {
        options: consultorios,
        getOptionLabel: (option) => option.nombre,
        value: form.consultorio == '' ? null : form.consultorio,
        onChange: (event, newValue) => {
            setForm({
                ...form,
                ['consultorio']: newValue
            })

        }
    };


    //use de fecha
    const [fecha, setFecha] = useState(new Date());

    const [message, setMessage] = useState([])

    const handleChange = e => {
        const { value, name } = e.target
        if (name === 'fecha_nacimiento') {
            setForm({
                ...form,
                [name]: value,
                ['edad']: calcular_edad(value)
            })

        } else {
            setForm({
                ...form,
                [name]: value
            })
        }

    }



    const handleSubmit = e => {
        e.preventDefault()
        if (accion) {
            postData(form)
        } else {
            putData(form)
        }
    }

    const putData = async (form) => {
        setMessage([])
        const { id } = router.query
        try {
            setOpen(true)
            const res = await fetch('/api/poblacion/' + id, {
                method: 'PUT',
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify(form)
            })
            const data = await res.json();
            if (!data.success) {
                setOpen(false)
                const { errors } = useMessageError(data.error)
                setMessage(errors)

            } else {
                setMessage([])
                setOpen(false)
                setForm(formData)
                //router.push('/poblacion')
            }

        } catch (error) {
            console.log(error)

        }
    }

    const postData = async (form) => {
        setMessage([])
        try {
            setOpen(true)
            const res = await fetch('/api/poblacion/poblacion', {
                method: 'POST',
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify(form)
            })
            const data = await res.json();
            if (!data.success) {
                setOpen(false)
                const { errors } = useMessageError(data.error)
                setMessage(errors)

            } else {
                setMessage([{
                    message: 'Datos guardados correctamente',
                    path: '',
                    tipo_error: 'success'
                }])
                setOpen(false)
                setForm(formData)
                // router.push('/poblacion')
            }

        } catch (error) {
            console.log(error)
        }
    }

    return (
        <>
            <BackdropProgress open={open} />
            <form onSubmit={handleSubmit}>

                <Stack justifyContent="center" alignItems="center">
                    <Grid item xs={12} md={6}>
                        <Grid container spacing={2} justifyContent="center" alignItems="center">
                            <Grid item xs={12} md={12}>
                                <Typography variant="h4" component="div">
                                    Datos Personales
                                </Typography>
                            </Grid>
                            <Grid item xs={12} md={12}>
                                <TextAutoComplete
                                    label='Consultorio M??dico'
                                    defaultProps={autocompleteConsultorio}
                                    noOptionsText="No existe consultorio"
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    id="outlined-textarea"
                                    label="Escribe el nombre"
                                    placeholder="Nombre"
                                    name="nombre"
                                    value={form.nombre}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    id="outlined-textarea"
                                    label="Escribe los apellidos"
                                    placeholder="Apellidos"
                                    name="apellidos"
                                    value={form.apellidos}
                                    onChange={handleChange}

                                />
                            </Grid>

                            <Grid item xs={6} md={4}>

                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <Stack spacing={3}>
                                        <MobileDatePicker
                                            label="Fecha Nacimiento"
                                            value={form.fecha_nacimiento = fecha}
                                            name="fecha_nacimiento"
                                            onChange={(handleChange) => {
                                                setFecha(handleChange);
                                                setForm({
                                                    ...form,
                                                    ['edad']: calcular_edad(form.fecha_nacimiento)
                                                })
                                            }}
                                            renderInput={(params) => <TextField {...params} />}
                                        />
                                    </Stack>
                                </LocalizationProvider>

                            </Grid>
                            <Grid item xs={6} md={4}>
                                <FormControl fullWidth>
                                    <InputLabel id="select-sexo-label">Sexo</InputLabel>
                                    <Select
                                        labelId="select-sexo-label"
                                        id="select-sexo"
                                        name="sexo"
                                        value={form.sexo}
                                        label="Sexo"
                                        onChange={handleChange}
                                    >
                                        <MenuItem value={"Femenino"}>Femenino</MenuItem>
                                        <MenuItem value={"Masculino"}>Masculino</MenuItem>

                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={6} md={4}>
                                <FormControl fullWidth>
                                    <InputLabel id="select-grupo_dispensarial-label">Grupo</InputLabel>
                                    <Select
                                        labelId="select-grupo_dispensarial-label"
                                        id="select-grupo-dispensarial"
                                        name="grupo_dispensarial"
                                        value={form.grupo_dispensarial}
                                        label="Grupo Dispensarial"
                                        onChange={handleChange}
                                    >
                                        <MenuItem value={"Grupo I"}>Grupo I</MenuItem>
                                        <MenuItem value={"Grupo II"}>Grupo II</MenuItem>
                                        <MenuItem value={"Grupo III"}>Grupo III</MenuItem>
                                        <MenuItem value={"Grupo IV"}>Grupo IV</MenuItem>

                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={6} md={4}>
                                <TextField
                                    fullWidth
                                    id="outlined-textarea"
                                    label="Escribe el CI"
                                    placeholder="ci"
                                    name="ci"
                                    value={form.ci}
                                    onChange={handleChange}
                                />
                            </Grid>

                            <Grid item xs={6} md={4}>

                                <TextAutoComplete
                                    label='Calle / Ave'
                                    defaultProps={autocompleteCalle}
                                    noOptionsText="No existe Calle/ Ave"
                                />

                            </Grid>

                            <Grid item xs={6} md={4}>
                                <TextField
                                    fullWidth
                                    id="outlined-textarea"
                                    label="Escribe el N??mero de la vivienda"
                                    placeholder="N??mero Vivienda"
                                    name="no_vivienda"
                                    value={form.no_vivienda}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={6} md={4}>
                                <TextField
                                    fullWidth
                                    id="outlined-textarea"
                                    label="Escribe el N??mero del n??cleo"
                                    placeholder="N??mero N??cleo"
                                    name="no_nucleo"
                                    value={form.no_nucleo}
                                    onChange={handleChange}
                                />
                            </Grid>
                        </Grid>
                    </Grid>


                    <Grid pt={2} container justifyContent="center" alignItems="center">

                        <Grid item xs={12} md={12} >
                            <Button variant="contained" onClick={handleSubmit}>+ Adicionar</Button>
                        </Grid>
                        <Grid item xs={12} md={12}>
                            <Stack sx={{ width: '100%' }} spacing={1}>
                                {

                                    message.map(({ message, tipo_error }) => (
                                        <MensageError
                                            tipoError= {tipo_error}
                                            message={message}
                                        />
                                    ))
                                }
                            </Stack>
                        </Grid>
                    </Grid>
                </Stack>
            </form>
        </>
    )
}

export default FormPoblacion 
