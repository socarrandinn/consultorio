export const useMessageError = (props) => {

    const errors = []

    if (!props.errors) {
        switch (props.code) {
            case 11000: {

                errors = [
                    ...errors,
                    {
                        message: `Ya existe la/el ${Object.keys(props.keyValue)}`,
                        path: Object.keys(props.keyValue),
                        tipo_error: 'error'
                    }
                ]
            }
        }
    } else {

        for (const key in props.errors) {
            let error = props.errors[key]

            if (error.kind == 'required'){
                errors = [
                    ...errors,
                    {
                        message: error.message,
                        path: error.path,
                        tipo_error: 'error'
                    }
                ]
            }else if(error.kind == 'ObjectId'){
                errors = [
                    ...errors,
                    {
                        message: `Selecione el/la ${error.path}`,
                        path: error.path,
                        tipo_error: 'error'
                    }
                ]    
            }

            

        }
    }
    return {
        errors: errors
    }
};