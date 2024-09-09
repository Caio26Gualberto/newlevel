import { Divider, Box, Typography, FormControlLabel, Checkbox, Input, InputLabel, FormControl, IconButton, Button } from '@mui/material'
import NewLevelModal from '../../../components/NewLevelModal'
import NewLevelModalHeader from '../../../components/NewLevelModalHeader'
import React, { useState } from 'react'
import { IMember, IModalProps, MemberAndInstrument } from '../../../interfaces/newLevelInterfaces'
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import DynamicInputRow from './DynamicInputRow'
import DynamicRow from './DynamicRow'



interface AddMembersModalProps extends IModalProps {
    onSaveMembers: (members: IMember[]) => void;
}

const AddMembersModal: React.FC<AddMembersModalProps> = ({ open, onClose, onSaveMembers }) => {
    const [members, setMembers] = useState<IMember[]>([]);

    const handleAddMember = (newId: string, memberAndInstrument: MemberAndInstrument) => {
        const newMember: IMember = {
            id: newId,
            data: memberAndInstrument
        };

        setMembers([...members, newMember]);
    }

    const handleDeleteMember = (idToDelete: string) => {
        const updatedMembers = members.filter(member => member.id !== idToDelete);
        setMembers(updatedMembers);
    };

    React.useEffect(() => {
        onSaveMembers(members)
    }, [members])

    return (
        <NewLevelModal
            open={open}
            onClose={onClose}
            width="40%"
            height={'auto'}
        >
            <>
                <NewLevelModalHeader title="Integrantes" closeModal={onClose} />
                <Divider variant='fullWidth' sx={{ backgroundColor: "black" }} />
                <Box height="100%" width="100%" display="flex" flexDirection="column" justifyContent="center" alignItems="center" p={2}>
                    <Box display="flex" flexDirection="column" justifyContent="space-around" width="100%">
                        {members.map((member, index) => (
                            <DynamicRow key={index} id={member.id} data={member.data} deleteMember={handleDeleteMember} />
                        ))}
                        <DynamicInputRow addMembers={handleAddMember} />
                    </Box>
                    <Box display="flex" justifyContent="center" alignItems="center" mt={2}>
                        <Button variant='contained' color='success' onClick={onClose}>Pronto</Button>
                    </Box>
                </Box>
            </>
        </NewLevelModal>
    )
}

export default AddMembersModal