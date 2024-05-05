import { Modal, Box, ModalProps } from '@mui/material'
import React from 'react'

const NewLevelModal: React.FC<ModalProps> = (props) => {
    return (
        <Modal {...props} disableScrollLock>
            <Box className="hub-modal modal-dialog" sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 900,
                height: "93%",
                bgcolor: 'background.paper',
                boxShadow: "0 8px 18px rgba(0,0,0,.18), 0 6px 6px rgba(0,0,0,.23)",
                borderRadius: "4px"
            }}>
                {props.children}
            </Box>
        </Modal>
    )
}

export default NewLevelModal
