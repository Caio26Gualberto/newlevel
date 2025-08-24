import React from 'react';
import { Box, Tabs, Tab, Typography, Paper, useTheme, useMediaQuery } from '@mui/material';
import VideoRequest from './components/VideoRequest';
import PhotoRequest from './components/PhotoRequest';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`tabpanel-${index}`}
            aria-labelledby={`tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box 
                    sx={{
                        p: {
                            xs: 2,
                            sm: 3
                        }
                    }}
                >
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

function a11yProps(index: number) {
    return {
        id: `tab-${index}`,
        'aria-controls': `tabpanel-${index}`,
    };
}

const Request: React.FC = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));
    
    const [value, setValue] = React.useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return (
        <Box 
            sx={{
                minHeight: "92.5vh",
                bgcolor: "#F3F3F3",
                p: {
                    xs: 2,
                    sm: 3,
                    md: 4
                }
            }}
        >
            <Box 
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    pt: {
                        xs: 8,
                        sm: 10
                    }
                }}
            >
                <Box 
                    sx={{
                        flex: 1,
                        maxWidth: "1200px",
                        width: "100%"
                    }}
                >
                    <Paper 
                        elevation={3}
                        sx={{
                            overflow: "hidden"
                        }}
                    >
                        <Tabs
                            value={value}
                            onChange={handleChange}
                            aria-label="basic tabs example"
                            variant={isSmallMobile ? "fullWidth" : "standard"}
                            indicatorColor="primary"
                            textColor="primary"
                            centered={!isSmallMobile}
                            sx={{
                                '& .MuiTab-root': {
                                    fontSize: {
                                        xs: '0.875rem',
                                        sm: '1rem'
                                    },
                                    minHeight: {
                                        xs: '48px',
                                        sm: '56px'
                                    }
                                }
                            }}
                        >
                            <Tab label="Vídeos" {...a11yProps(0)} />
                            <Tab label="Fotos" {...a11yProps(1)} />
                        </Tabs>
                        <TabPanel value={value} index={0}>
                            <VideoRequest />
                        </TabPanel>
                        <TabPanel value={value} index={1}>
                            <PhotoRequest />
                        </TabPanel>
                    </Paper>
                </Box>
            </Box>
        </Box>
    );
};

export default Request;
