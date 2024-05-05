import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button } from "@mui/material";
import NewLevelModal from "../../../../components/NewLevelModal";
import NewLevelModalHeader from "../../../../components/NewLevelModalHeader";
import { useState } from "react";

interface AddVideoModalProps {
    open: boolean;
    onClose: () => void;
}

const AddVideoModal: React.FC<AddVideoModalProps> = ({ open, onClose }) => {

    return (
        <NewLevelModal open={open} onClose={onClose}>
            <>
                <NewLevelModalHeader closeModal={onClose} title="Adicione um vídeo" />
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Título do vídeo"
                        type="text"
                        fullWidth
                    ></TextField>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="URL do vídeo"
                        type="text"
                        fullWidth
                    ></TextField>
                </DialogContent>
            </>
        </NewLevelModal>
    );
}

export default AddVideoModal
