import NewLevelModalHeader from "../../../../components/NewLevelModalHeader";
import NewLevelModal from "../../../../components/NewLevelModal";
import { PhotoResponseDto } from "../../../../gen/api/src";
import { Box, Divider, TextField, ThemeProvider, Typography, createTheme } from "@mui/material";

interface PhotoDetailsRequestModalProps {
    open: boolean;
    onClose: () => void;
    photoData: PhotoResponseDto;
}

const theme = createTheme({
    components: {
        MuiInputBase: {
            styleOverrides: {
                input: {
                    cursor: 'default', // Define o cursor padrão
                    '&:hover': {
                        cursor: 'default', // Define o cursor padrão ao passar o mouse
                    },
                },
            },
        },
    },
});

const styles = {
    textField: {
        maxHeight: '200px', // Ajuste a altura máxima conforme necessário
        overflow: 'auto',
        cursor: 'default', // Define o cursor padrão para o campo
        '& .MuiInputBaseInput': {
            cursor: 'default', // Define o cursor padrão para o conteúdo do campo
        },
    },
};

const PhotoDetailsRequestModal: React.FC<PhotoDetailsRequestModalProps> = ({ open, onClose, photoData }) => {
    return (
        <NewLevelModal height="50vh" width={1000} open={open}>
            <>
                <NewLevelModalHeader closeModal={onClose} title="Detalhes da foto" />
                <Divider />
                <Box display="flex" justifyContent="center">
                    <Typography variant="h6" component="h6" mr={4} mt={1} mb={2}>{photoData.nickname}</Typography>
                </Box>
                <Box display="flex" alignItems="center" ml={5} width="90%">
                    <ThemeProvider theme={theme}>
                        <TextField
                            value={photoData.description}
                            fullWidth
                            multiline
                            rows={6}
                            inputProps={{ readOnly: true }}
                            style={styles.textField}
                        />
                    </ThemeProvider>
                </Box>
            </>
        </NewLevelModal>
    )
}

export default PhotoDetailsRequestModal
