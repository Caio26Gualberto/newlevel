import React, { useEffect } from 'react'
import CloseIcon from '@mui/icons-material/Close';
import { Box, Icon } from '@mui/material';

interface Props {
    title: string;
    closeModal: () => void;
}

const NewLevelModalHeader: React.FC<Props> = ({ closeModal, title }) => { 
    return (
        <Box className="modal-header" margin={1} display="flex" alignItems="center" justifyContent="space-between">
            <Box width="auto"></Box>
            <Box className="modal-title" component="h3">{title}</Box>
            <Icon component={CloseIcon} onClick={closeModal} sx={{ cursor: "pointer", color: "red" }}/>
        </Box>
    );
}

export default NewLevelModalHeader
