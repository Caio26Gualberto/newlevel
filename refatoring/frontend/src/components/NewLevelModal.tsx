import { Modal, Box, ModalProps, useTheme, useMediaQuery } from '@mui/material'
import React from 'react'


interface AdditionalModalProps {
    width: number | string;
    height: string;
}

type NewModalProps = ModalProps & AdditionalModalProps;

const NewLevelModal: React.FC<NewModalProps> = ({ width, height, ...props }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));
    
    return (
        <Modal {...props} disableScrollLock>
            <Box 
                className="hub-modal modal-dialog" 
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: {
                        xs: '95%',
                        sm: typeof width === 'number' ? Math.min(width, 500) : width,
                        md: width
                    },
                    height: height,
                    bgcolor: 'white',
                    boxShadow: "0 8px 18px rgba(0,0,0,.18), 0 6px 6px rgba(0,0,0,.23)",
                    borderRadius: "4px",
                    maxWidth: {
                        xs: '400px',
                        sm: '600px',
                        md: '800px'
                    },
                    maxHeight: {
                        xs: '80vh',
                        sm: '90vh'
                    },
                    overflow: 'auto'
                }}
            >
                {props.children}
            </Box>
        </Modal>
    )
}

export default NewLevelModal
