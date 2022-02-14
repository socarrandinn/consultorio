import Drawer from "components/Drawer"
import { useApiSWR } from "hooks/useApiSWR";
import Table from 'components/Table'
import { Box, Button, Grid, LinearProgress, Link, Stack } from "@mui/material";
import { gridRowsLookupSelector } from "@mui/x-data-grid";

export default function index() {


    const { data, isLoading, isError } = useApiSWR("/api/poblacion")

    if (isError) {
        return <Box sx={{ display: "flex" }}>error</Box>;
    }

    if (isLoading) {
        return (
            <Drawer title=" Población" description="-" asunto="Población">
                <Box sx={{ width: '100%' }}>
                    <LinearProgress />
                </Box>
            </Drawer>
        );
    }


    function createData(id, nombre_apellidos, edad, sexo, direccion) {
        return { id, nombre_apellidos, edad, sexo, direccion };
    }
    const rows = []
    data?.map((p) => {
        rows.push(createData(p._id, `${p.nombre} ${p.apellidos}`, p.edad, p.sexo, `${p.calle.calle} No. ${p.no_vivienda}`))
    })

    const column = [
        { field: 'id', headerName: 'ID', width: 50, type: 'string' },
        { field: 'nombre_apellidos', headerName: 'Nombre y Apellidos', width: 200, type: 'string' },
        { field: 'edad', headerName: 'Edad', width: 100, type: 'string' },
        { field: 'sexo', headerName: 'Sexo', width: 100, type: 'string' },
        { field: 'direccion', headerName: 'Dirección', width: 300, type: 'string' }
    ]


    const deleteData = async (id) => {
        try {
            await fetch('/api/poblacion/' + id, {
                method: 'DELETE'
            })
            setPoblacion(poblacion)
            router.push('/poblacion')

        } catch (error) {

        }
    }

    return (
        <Drawer
            title='Listado Población'
            description='-'
            asunto='Listado de Población'
        >

            
                <Grid container >
                    <Grid item mb={2} xs={8}>
                        <Link href="/poblacion/new">
                            <Button variant="contained">Adicionar Población</Button>
                        </Link>
                    </Grid>
                    <Grid item xs={12} md={12}>


                        <Table
                            height={380}
                            ischeckbox={false}
                            rows={rows}
                            num_row={5}
                            columns={column}
                        />


                    </Grid>
                </Grid>
         


        </Drawer>
    )
}
 /*

export async function getServerSideProps(){
try {
   await conectarDB() 
          
   const res = await Poblacion.find({}).populate('consultorio')
    
   const poblaciones = res.map(doc => {
       const poblacion = doc.toObject()
       poblacion._id = poblacion._id.toString() 
       poblacion.consultorio._id = poblacion.consultorio._id.toString()
       poblacion.calle._id = poblacion.calle._id.toString()
       poblacion.fecha_nacimiento = poblacion.fecha_nacimiento.toString()
       return poblacion
   })

   console.log(poblaciones)

   return {props: {poblaciones}}


} catch (error) {
   console.log("error")
   return {props: {success: false, error: 'Error!'}}
}

}*/