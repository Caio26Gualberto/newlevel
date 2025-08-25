import NewLevelModalHeader from "../../../../components/NewLevelModalHeader";
import NewLevelModal from "../../../../components/NewLevelModal";
import { PhotoResponseDto } from "../../../../gen/api/src";
import { Box, Divider, TextField, ThemeProvider, Typography, createTheme, useTheme, useMediaQuery } from "@mui/material";

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
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));
    
    return (
        <NewLevelModal 
            height="50vh" 
            width={isSmallMobile ? 350 : isMobile ? 600 : 1000} 
            open={open}
        >
            <>
                <NewLevelModalHeader closeModal={onClose} title="Detalhes da foto" />
                <Divider />
                <Box 
                    sx={{
                        display: "flex",
                        justifyContent: "center"
                    }}
                >
                    <Typography 
                        variant="h6" 
                        component="h6" 
                        sx={{
                            mr: {
                                xs: 1,
                                sm: 2,
                                md: 4
                            },
                            mt: 1,
                            mb: 2,
                            fontSize: {
                                xs: "1rem",
                                sm: "1.25rem"
                            }
                        }}
                    >
                        {photoData.nickname}
                    </Typography>
                </Box>
                <Box 
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        ml: {
                            xs: 1,
                            sm: 2,
                            md: 5
                        },
                        width: {
                            xs: "95%",
                            sm: "90%"
                        }
                    }}
                >
                    <ThemeProvider theme={theme}>
                        <TextField
                            value={photoData.description}
                            fullWidth
                            multiline
                            rows={isSmallMobile ? 4 : 6}
                            inputProps={{ readOnly: true }}
                            style={styles.textField}
                            sx={{
                                '& .MuiInputBase-input': {
                                    fontSize: {
                                        xs: '0.75rem',
                                        sm: '0.875rem'
                                    }
                                }
                            }}
                        />
                    </ThemeProvider>
                </Box>
            </>
        </NewLevelModal>
    )
}

export default PhotoDetailsRequestModal
