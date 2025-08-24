import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Box, Checkbox, Chip, FormControl, InputLabel, MenuItem, Select, OutlinedInput, LinearProgress, useTheme, useMediaQuery } from '@mui/material';
import ApiConfiguration from '../../apiConfig';
import { CommonApi, EGitLabels, SelectOptionDto } from '../../gen/api/src';
import NewLevelButton from '../../components/NewLevelButton';
import NewLevelLoading from '../../components/NewLevelLoading';
import Swal from 'sweetalert2';
import * as toastr from 'toastr';

const IssueReport = () => {
    const commonApi = new CommonApi(ApiConfiguration);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));
    
    const [loading, setLoading] = useState<boolean>(false);
    const [issueCreated, setIssueCreated] = useState<string>('');
    const [progress, setProgress] = useState(0);
    const [problemTypes, setProblemTypes] = useState<SelectOptionDto[]>([]);
    const [devices, setDevices] = useState<SelectOptionDto[]>([]);
    const [selectedProblemTypes, setSelectedProblemTypes] = useState<number[]>([]);
    const [selectedDevices, setSelectedDevices] = useState<number[]>([]);
    const [formData, setFormData] = useState({
        title: '',
        description: ''
    });

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleProblemTypeChange = (event: any) => {
        setSelectedProblemTypes(event.target.value);
    };

    const handleDeviceChange = (event: any) => {
        setSelectedDevices(event.target.value);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        try {
            setLoading(true)
            const allLabels = [...selectedDevices, ...selectedProblemTypes]
            const result = await commonApi.apiCommonCreateIssuePost({
                createGitIssueInput: {
                    description: formData.description,
                    title: formData.title,
                    gitLabels: allLabels as EGitLabels[]
                }
            })
            setFormData({
                title: '',
                description: ''
            })
            setSelectedDevices([])
            setSelectedProblemTypes([])
            if (result.isSuccess) {
                toastr.success('Report criado com sucesso', 'Relatório criado', { timeOut: 3000, progressBar: true, positionClass: "toast-bottom-right" });
                setIssueCreated(result.data!)
            } else {
                Swal.fire({
                    title: 'Erro',
                    text: (result as any).message!,
                    icon: 'error'
                })
            }
        } catch (error) {

        } finally {
            setLoading(false)
        }
        console.log(formData);
    };

    React.useEffect(() => {
        if (issueCreated) {
            const timeoutDuration = 10000;
            const interval = timeoutDuration / 100;

            let currentProgress = 0;
            const timer = setInterval(() => {
                currentProgress += 1;
                setProgress(currentProgress);

                if (currentProgress >= 100) {
                    clearInterval(timer);
                }
            }, interval);

            const timeout = setTimeout(() => {
                setIssueCreated('');
                setProgress(0);
            }, timeoutDuration);

            return () => {
                clearTimeout(timeout);
                clearInterval(timer);
            };
        }
    }, [issueCreated]);

    React.useEffect(() => {
        (async () => {
            try {
                const result = (await commonApi.apiCommonGetDisplayGitLabelsGet()).data;
                if (result === undefined || result === null) {
                    return;
                }
                setProblemTypes(result.filter(x => x.value == 1 || x.value == 2));
                setDevices(result.filter(x => x.value == 3 || x.value == 4));
            } catch (error) {
                console.error(error);
            }
        })();
    }, []);

    return (
        <Container 
            component="main" 
            maxWidth="md"
            sx={{
                p: {
                    xs: 2,
                    sm: 3,
                    md: 4
                }
            }}
        >
            <NewLevelLoading isLoading={loading} />
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    bgcolor: '#fff',
                    borderRadius: 1,
                    boxShadow: 3,
                    p: {
                        xs: 2,
                        sm: 3
                    },
                    mt: {
                        xs: 3,
                        sm: 4,
                        md: 5
                    },
                    width: '100%'
                }}
            >
                <Typography 
                    variant={isSmallMobile ? "h5" : "h4"} 
                    component="h1" 
                    gutterBottom
                    sx={{
                        fontSize: {
                            xs: "1.5rem",
                            sm: "2rem",
                            md: "2.125rem"
                        },
                        fontWeight: "bold",
                        textAlign: "center"
                    }}
                >
                    Reportar um Problema
                </Typography>
                <form noValidate style={{ width: "100%" }}>
                    <TextField
                        label="Título"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        sx={{
                            '& .MuiInputBase-input': {
                                fontSize: {
                                    xs: '0.875rem',
                                    sm: '1rem'
                                }
                            },
                            '& .MuiInputLabel-root': {
                                fontSize: {
                                    xs: '0.875rem',
                                    sm: '1rem'
                                }
                            }
                        }}
                    />
                    <TextField
                        label="Descrição"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        multiline
                        rows={isSmallMobile ? 3 : 4}
                        required
                        sx={{
                            '& .MuiInputBase-input': {
                                fontSize: {
                                    xs: '0.875rem',
                                    sm: '1rem'
                                }
                            },
                            '& .MuiInputLabel-root': {
                                fontSize: {
                                    xs: '0.875rem',
                                    sm: '1rem'
                                }
                            }
                        }}
                    />
                    <FormControl 
                        fullWidth 
                        sx={{ 
                            mt: 2,
                            '& .MuiInputLabel-root': {
                                fontSize: {
                                    xs: '0.875rem',
                                    sm: '1rem'
                                }
                            }
                        }}
                    >
                        <InputLabel>Problema/Sugestão</InputLabel>
                        <Select
                            multiple
                            input={<OutlinedInput label="Problema/Sugestão" />}
                            value={selectedProblemTypes}
                            onChange={handleProblemTypeChange}
                            renderValue={(selected) => (
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                    {selected.map((value) => (
                                        <Chip 
                                            key={value} 
                                            label={problemTypes.find(option => option.value === value)?.name}
                                            size={isSmallMobile ? "small" : "medium"}
                                        />
                                    ))}
                                </Box>
                            )}
                            sx={{
                                maxHeight: 200,
                                '& .MuiSelect-select': {
                                    fontSize: {
                                        xs: '0.875rem',
                                        sm: '1rem'
                                    }
                                }
                            }}
                        >
                            {problemTypes.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                    <Checkbox checked={selectedProblemTypes.includes(option.value!)} />
                                    <Typography
                                        sx={{
                                            fontSize: {
                                                xs: '0.875rem',
                                                sm: '1rem'
                                            }
                                        }}
                                    >
                                        {option.name}
                                    </Typography>
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl 
                        fullWidth 
                        sx={{ 
                            mt: 2,
                            mb: 2,
                            '& .MuiInputLabel-root': {
                                fontSize: {
                                    xs: '0.875rem',
                                    sm: '1rem'
                                }
                            }
                        }}
                    >
                        <InputLabel>Dispositivos</InputLabel>
                        <Select
                            multiple
                            input={<OutlinedInput label="Dispositivos" />}
                            value={selectedDevices}
                            onChange={handleDeviceChange}
                            renderValue={(selected) => (
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                    {selected.map((value) => (
                                        <Chip 
                                            key={value} 
                                            label={devices.find(option => option.value === value)?.name}
                                            size={isSmallMobile ? "small" : "medium"}
                                        />
                                    ))}
                                </Box>
                            )}
                            sx={{
                                maxHeight: 200,
                                '& .MuiSelect-select': {
                                    fontSize: {
                                        xs: '0.875rem',
                                        sm: '1rem'
                                    }
                                }
                            }}
                        >
                            {devices.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                    <Checkbox checked={selectedDevices.includes(option.value!)} />
                                    <Typography
                                        sx={{
                                            fontSize: {
                                                xs: '0.875rem',
                                                sm: '1rem'
                                            }
                                        }}
                                    >
                                        {option.name}
                                    </Typography>
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    
                    {issueCreated && (
                        <Box mb={2} sx={{ width: '100%' }}>
                            <Typography 
                                fontWeight="bold"
                                sx={{
                                    fontSize: {
                                        xs: "0.875rem",
                                        sm: "1rem"
                                    },
                                    mb: 1
                                }}
                            >
                                Report criado, caso queira visualizar veja{' '}
                                <a href={issueCreated} target='_blank' rel="noopener noreferrer">
                                    aqui
                                </a>
                            </Typography>
                            <LinearProgress variant="determinate" value={progress} />
                        </Box>
                    )}
                    
                    <NewLevelButton 
                        onClick={(e: any) => { e.preventDefault(); handleSubmit(e); }} 
                        title='Enviar' 
                        maxWidth 
                    />
                </form>
            </Box>
        </Container>
    );
};

export default IssueReport;
