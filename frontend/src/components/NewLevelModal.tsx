import { Modal, Box, ModalProps } from '@mui/material'
import React from 'react'


interface AdditionalModalProps {
    width: number;
    height: string;
}

type NewModalProps = ModalProps & AdditionalModalProps;

const NewLevelModal: React.FC<NewModalProps> = ({ width, height, ...props }) => {
    return (
        <Modal {...props} disableScrollLock>
            <Box className="hub-modal modal-dialog" sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: width,
                height: height,
                bgcolor: 'white',
                boxShadow: "0 8px 18px rgba(0,0,0,.18), 0 6px 6px rgba(0,0,0,.23)",
                borderRadius: "4px"
            }}>
                {props.children}
            </Box>
        </Modal>
    )
}

export default NewLevelModal
