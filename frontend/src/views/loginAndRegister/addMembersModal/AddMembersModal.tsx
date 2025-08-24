import { Divider, Box, Typography, FormControlLabel, Checkbox, Input, InputLabel, FormControl, IconButton, Button, useTheme, useMediaQuery } from '@mui/material'
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
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));

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
            width={isSmallMobile ? "95%" : isMobile ? "80%" : "40%"}
            height={'auto'}
        >
            <>
                <NewLevelModalHeader title="Integrantes" closeModal={onClose} />
                <Divider variant='fullWidth' sx={{ backgroundColor: "black" }} />
                <Box 
                    sx={{
                        height: "100%",
                        width: "100%",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        p: {
                            xs: 1,
                            sm: 2
                        }
                    }}
                >
                    <Box 
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-around",
                            width: "100%"
                        }}
                    >
                        {members.map((member, index) => (
                            <DynamicRow key={index} id={member.id} data={member.data} deleteMember={handleDeleteMember} />
                        ))}
                        <DynamicInputRow addMembers={handleAddMember} />
                    </Box>
                    <Box 
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            mt: 2
                        }}
                    >
                        <Button 
                            variant='contained' 
                            color='success' 
                            onClick={onClose}
                            sx={{
                                fontSize: {
                                    xs: "0.875rem",
                                    sm: "1rem"
                                },
                                py: {
                                    xs: 0.75,
                                    sm: 1
                                },
                                px: {
                                    xs: 2,
                                    sm: 3
                                }
                            }}
                        >
                            Pronto
                        </Button>
                    </Box>
                </Box>
            </>
        </NewLevelModal>
    )
}

export default AddMembersModal