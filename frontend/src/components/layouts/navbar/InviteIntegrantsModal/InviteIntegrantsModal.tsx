import { Autocomplete, Avatar, Box, Button, CircularProgress, Dialog, DialogTitle, Icon, IconButton, ListItemText, MenuItem, Select, TextField, Typography } from "@mui/material";
import GroupAddTwoToneIcon from '@mui/icons-material/GroupAddTwoTone';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import React from "react";
import ApiConfiguration from "../../../../apiConfig";
import { SearchBarUserDetailDto, UserApi } from "../../../../gen/api/src";


interface SimpleDialogProps {
    open: boolean;
    title: string;
    onClose: (value: string) => void;
}

const InviteIntegrantsModal: React.FC<SimpleDialogProps> = ({ open, title, onClose }) => {
    const userService = new UserApi(ApiConfiguration);
    const [noMemberToggle, setNoMemberToggle] = React.useState<boolean>(false);
    const [isFieldFilled, setIsFiledFilled] = React.useState<boolean>(false);
    const [loading, setLoading] = React.useState<boolean>(false);
    const [members, setMembers] = React.useState<SearchBarUserDetailDto[]>([]);
    const [selectedMember, setSelectedMember] = React.useState<SearchBarUserDetailDto>({});
    const [searchTerm, setSearchTerm] = React.useState('');

    const handleClose = () => {
        onClose('');
    };

    async function fetchUsers(searchTerm: string): Promise<SearchBarUserDetailDto[]> {
        const response = await userService.apiUserGetUsersForSearchBarGet({ searchTerm: searchTerm });
        return response.data!;
    }

    React.useEffect(() => {
        if (searchTerm) {
            setLoading(true);
            fetchUsers(searchTerm).then(users => {
                setMembers(users);
                setLoading(false);
            });
        } else {
            setMembers([]);
        }
    }, [searchTerm]);

    return (
        <Dialog maxWidth="md" fullWidth onClose={handleClose} open={open}>
            <Box m={1} mb={3}>
                <Box display="flex" justifyContent="center" alignItems="center">
                    <DialogTitle>{title}</DialogTitle>
                </Box>
                <Box display="flex" justifyContent="center" alignItems="center" width="100%">
                    {
                        members.length <= 0 && !noMemberToggle &&
                        (
                            <Typography variant="subtitle1">Ainda não há integrantes
                                <Icon onClick={() => setNoMemberToggle(true)} color="success" sx={{ cursor: "pointer", ml: 1 }}>
                                    <GroupAddTwoToneIcon />
                                </Icon>
                            </Typography>
                        )
                    }
                    {
                        selectedMember && noMemberToggle &&
                        (
                            <Box display="flex" alignItems="center" justifyContent="space-evenly" width="100%" gap={2}>
                                <Box width="100%">
                                    <Autocomplete
                                        id="user-autocomplete"
                                        options={members}
                                        getOptionLabel={(option) => option.nickName!}
                                        loading={loading}
                                        onInputChange={(e, newInputValue) => setSearchTerm(newInputValue)}
                                        onChange={(e, newValue) => {
                                            if (newValue) {
                                                setSelectedMember(newValue);
                                            }
                                        }}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                variant="outlined"
                                                label="Pesquisar usuário"
                                                InputProps={{
                                                    ...params.InputProps,
                                                    endAdornment: (
                                                        <>
                                                            {loading ? <CircularProgress color="inherit" size={24} /> : null}
                                                            {params.InputProps.endAdornment}
                                                        </>
                                                    ),
                                                }}
                                            />
                                        )}
                                        renderOption={(props, option) => (
                                            <Box key={option.userId} component="li" {...props} display="flex" alignItems="center">
                                                <Avatar src={option.avatarUrl} alt={option.nickName} />
                                                <Box ml={1}>{option.nickName}</Box>
                                            </Box>
                                        )}
                                        isOptionEqualToValue={(option, value) => option.userId === value.userId}
                                    />
                                </Box>
                                <Box width="100%" display="flex">
                                    <TextField
                                        sx={{ width: "70%" }} />
                                    <IconButton
                                        color="success"
                                        disableRipple
                                        disabled={!isFieldFilled}
                                    >
                                        <AddCircleOutlineOutlinedIcon />
                                    </IconButton>
                                </Box>
                            </Box>
                        )
                    }
                </Box>
            </Box>
        </Dialog>
    )
}

export default InviteIntegrantsModal
