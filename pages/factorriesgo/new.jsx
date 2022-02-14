import Drawer from "components/Drawer";
import FormFactorRiesgo from "components/factorriesgo/FormFactorRiesgo";
//import conectarDB from "lib/dbConnect";
import { useApiSWR } from "hooks/useApiSWR";
import { Box, LinearProgress } from "@mui/material";

const New = () => {

   
  const { data, isLoading, isError } = useApiSWR("/api/factorriesgo")

  if (isError) {
    return <Box sx={{ display: "flex" }}>error</Box>;
  }

  if (isLoading) {
    return (
      <Drawer title="Adicionar Factor de Riesgo" description="-" asunto="Adicionar Factor de Riesgo">
        <Box sx={{ width: '100%' }}>
          <LinearProgress />
        </Box>
      </Drawer>
    );
  }

  const formData = { 
    factor_riesgo: ''
}

  

    return (
        <Drawer
            title='Adicionar Factor de Riesgo'
            description='-'
            asunto='Adicionar Factor de Riesgo'
        >
            <FormFactorRiesgo
                formData={formData}                
                factorriesgos={data}
            />

        </Drawer>
    )
}

export default New

