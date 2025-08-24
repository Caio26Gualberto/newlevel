import { Box, FormControl, InputLabel, Input, Button, TextField, useTheme, useMediaQuery } from '@mui/material'
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import React from 'react'

interface MemberAndInstrument {
    [key: string]: string;
}

interface Member {
    id: string;
    data: MemberAndInstrument;
    deleteMember: (id: string) => void;
}

const DynamicRow: React.FC<Member> = ({ id, data, deleteMember }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));
    
    return (
        <Box 
            sx={{
                display: "flex",
                width: "100%",
                flexDirection: {
                    xs: "column",
                    sm: "row"
                },
                mt: 1,
                gap: 2
            }}
        >
            {Object.entries(data).map(([key, value]) => (
                <TextField
                    key={value}
                    label="Integrante"
                    value={key}
                    color="success"
                    fullWidth
                    variant="outlined"
                    disabled
                    sx={{
                        '& .MuiInputBase-input': {
                            fontSize: {
                                xs: '0.75rem',
                                sm: '0.875rem'
                            }
                        },
                        '& .MuiInputLabel-root': {
                            fontSize: {
                                xs: '0.75rem',
                                sm: '0.875rem'
                            }
                        }
                    }}
                />
            ))}
            {Object.entries(data).map(([key, value]) => (
                <TextField
                    key={key}
                    label="Instrumento"
                    value={value}
                    color="success"
                    fullWidth
                    variant="outlined"
                    disabled
                    sx={{
                        '& .MuiInputBase-input': {
                            fontSize: {
                                xs: '0.75rem',
                                sm: '0.875rem'
                            }
                        },
                        '& .MuiInputLabel-root': {
                            fontSize: {
                                xs: '0.75rem',
                                sm: '0.875rem'
                            }
                        }
                    }}
                />
            ))}
            <Button 
                onClick={() => deleteMember(id)}
                sx={{
                    minWidth: {
                        xs: "40px",
                        sm: "48px"
                    },
                    height: {
                        xs: "40px",
                        sm: "48px"
                    }
                }}
            >
                <DeleteRoundedIcon 
                    color='error'
                    sx={{
                        fontSize: {
                            xs: "1.25rem",
                            sm: "1.5rem"
                        }
                    }}
                />
            </Button>
        </Box>
    )
}

export default DynamicRow