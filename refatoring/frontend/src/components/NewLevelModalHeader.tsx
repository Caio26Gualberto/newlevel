import React, { useEffect } from 'react'
import CloseIcon from '@mui/icons-material/Close';
import { Box, Icon, useTheme, useMediaQuery } from '@mui/material';

interface Props {
    title: string;
    closeModal: () => void;
}

const NewLevelModalHeader: React.FC<Props> = ({ closeModal, title }) => { 
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));
    
    return (
        <Box 
            className="modal-header" 
            sx={{
                margin: {
                    xs: 0.5,
                    sm: 1
                },
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between"
            }}
        >
            <Box width="auto"></Box>
            <Box 
                className="modal-title" 
                component="h3"
                sx={{
                    fontSize: {
                        xs: "1rem",
                        sm: "1.25rem",
                        md: "1.5rem"
                    },
                    fontWeight: "bold",
                    textAlign: "center"
                }}
            >
                {title}
            </Box>
            <Icon 
                component={CloseIcon} 
                onClick={closeModal} 
                sx={{ 
                    cursor: "pointer", 
                    color: "red",
                    fontSize: {
                        xs: "1.25rem",
                        sm: "1.5rem",
                        md: "1.75rem"
                    }
                }}
            />
        </Box>
    );
}

export default NewLevelModalHeader
