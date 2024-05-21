import React from 'react';
import { Box, Tabs, Tab, Typography, Paper } from '@mui/material';
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
                <Box p={3}>
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
    const [value, setValue] = React.useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return (
        <Box height="100vh" bgcolor="#F3F3F3">
            <Box display="flex" pt={10} justifyContent="center" alignItems="center">
                <Box flex={1} maxWidth="1200px">
                    <Paper elevation={3}>
                        <Tabs
                            value={value}
                            onChange={handleChange}
                            aria-label="basic tabs example"
                            variant="fullWidth"
                            indicatorColor="primary"
                            textColor="primary"
                            centered
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
