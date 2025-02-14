import { Autocomplete, Avatar, Box, Button, CircularProgress, Dialog, DialogTitle, Icon, IconButton, ListItemText, MenuItem, Select, TextField, Tooltip, Typography } from "@mui/material";
import GroupAddTwoToneIcon from '@mui/icons-material/GroupAddTwoTone';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import CancelScheduleSendIcon from '@mui/icons-material/CancelScheduleSend';
import GroupRemoveIcon from '@mui/icons-material/GroupRemove';
import React from "react";
import ApiConfiguration from "../../../../apiConfig";
import { BandApi, MemberInfoDto, PendingInvitesDto, SearchBarUserDetailDto, SystemNotificationApi, UserApi } from "../../../../gen/api/src";
import * as toastr from 'toastr';
import { useNavigate } from "react-router-dom";

interface SimpleDialogProps {
    open: boolean;
    title: string;
    onClose: (value: string) => void;
}

const InviteIntegrantsModal: React.FC<SimpleDialogProps> = ({ open, title, onClose }) => {
    const userService = new UserApi(ApiConfiguration);
    const bandService = new BandApi(ApiConfiguration);
    const systemNotificationService = new SystemNotificationApi(ApiConfiguration);
    const navigate = useNavigate();
    const [noMemberToggle, setNoMemberToggle] = React.useState<boolean>(false);
    const [isFieldFilled, setIsFieldFilled] = React.useState<boolean>(false);
    const [instrument, setInstrument] = React.useState<string>('');
    const [loading, setLoading] = React.useState<boolean>(false);
    const [loadingRequest, setLoadingRequest] = React.useState<boolean>(false);
    const [members, setMembers] = React.useState<SearchBarUserDetailDto[]>([]);
    const [existingBandMembers, setExistingBandMembers] = React.useState<MemberInfoDto[]>([]);
    const [pendingInvites, setPendingInvites] = React.useState<PendingInvitesDto[]>([]);
    const [selectedMember, setSelectedMember] = React.useState<SearchBarUserDetailDto>({});
    const [searchTerm, setSearchTerm] = React.useState('');

    const handleClose = () => {
        setMembers([]);
        setInstrument('');
        setSelectedMember({});
        setSearchTerm('');
        setNoMemberToggle(false);
        onClose('');
    };

    async function addMember() {
        setLoadingRequest(true);
        const result = await userService.apiUserInviteMemberBandPost({
            inviteMemberInput: {
                instrument: instrument,
                userInvited: selectedMember
            }
        });

        if (result.isSuccess) {
            toastr.success(result.message!, 'Ok', { timeOut: 3000, progressBar: true, positionClass: "toast-bottom-right" })
            fetchData();
        } else {
            toastr.error(result.message!, 'Erro', { timeOut: 3000, progressBar: true, positionClass: "toast-bottom-right" })
        }

        setLoadingRequest(false);
    }

    async function removePendingInvite(nickName: string) {
        const result = await userService.apiUserDeleteInviteMemberPost({ nickname: nickName });
        if (result.isSuccess) {
            fetchData();
            toastr.info(result.message!, '', { timeOut: 3000, progressBar: true, positionClass: "toast-bottom-right" })
        } else {
            toastr.error(result.message!, 'Erro', { timeOut: 3000, progressBar: true, positionClass: "toast-bottom-right" })
        }
    }

    async function fetchUsers(searchTerm: string): Promise<SearchBarUserDetailDto[]> {
        const response = await userService.apiUserGetUsersForSearchBarGet({ searchTerm: searchTerm });
        return response.data!;
    }

    async function removeBandMember(userId: string) {
        const result = await bandService.apiBandRemoveMemberByUserIdDelete({ userId: userId });
        if (result.isSuccess) {
            fetchData();
            toastr.success(result.message!, '', { timeOut: 3000, progressBar: true, positionClass: "toast-bottom-right" })
        } else {
            toastr.error(result.message!, 'Erro', { timeOut: 3000, progressBar: true, positionClass: "toast-bottom-right" })
        }
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

    const fetchData = async () => {
        const response = await bandService.apiBandGetAllBandMembersGet();
        const pendingInvites = await systemNotificationService.apiSystemNotificationGetPendingInvitationsGet();
        setExistingBandMembers(response.data!);
        setPendingInvites(pendingInvites.data!);
    }

    React.useEffect(() => {
        (async () => {
            fetchData();
        })();
    }, [])

    React.useEffect(() => {
        if (selectedMember && instrument) {
            setIsFieldFilled(true);
        } else {
            setIsFieldFilled(false);
        }
    }, [searchTerm, instrument]);

    return (
        <Dialog maxWidth="md" fullWidth onClose={handleClose} open={open}>
            <Box m={1} mb={3}>
                <Box display="flex" justifyContent="center" alignItems="center">
                    <DialogTitle>{title}</DialogTitle>
                </Box>
                <Box display="flex" justifyContent="center" flexDirection="column" alignItems="center" width="100%">
                    {
                        existingBandMembers.length > 0 &&
                        (
                            <Box width="100%" mb={2}>
                                {existingBandMembers.map((member, index) => (
                                    <Box key={index} display="flex" alignItems="center" justifyContent="space-evenly" width="100%" gap={2}>
                                        <Box width="100%">
                                            <Autocomplete
                                                disabled
                                                value={member}
                                                id={`user-autocomplete-${index}`}
                                                options={existingBandMembers}
                                                getOptionLabel={(option) => option.name!}
                                                renderOption={(props, option) => (
                                                    <Box key={option.name} component="li" {...props} display="flex" alignItems="center">
                                                        <Avatar src={option.avatarURL} alt={option.name} />
                                                        <Box ml={1}>{option.name}</Box>
                                                    </Box>
                                                )}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        variant="outlined"
                                                        disabled
                                                        InputProps={{
                                                            ...params.InputProps,
                                                            startAdornment: (
                                                                <>
                                                                    <Avatar src={member.avatarURL} alt={member.name} />
                                                                    {params.InputProps.startAdornment}
                                                                </>
                                                            ),
                                                            endAdornment: null,
                                                        }}
                                                    />
                                                )}
                                            />
                                        </Box>
                                        <Box width="100%" display="flex">
                                            <TextField
                                                sx={{ width: "70%" }}
                                                value={member.instrument}
                                                disabled
                                                variant="outlined"
                                            />
                                            <IconButton
                                                onClick={() => removeBandMember(member.userId!)}
                                                color="error"
                                                disableRipple
                                            >
                                                <Tooltip title="Remover membro" placement="top">
                                                    <GroupRemoveIcon />
                                                </Tooltip>
                                            </IconButton>
                                        </Box>
                                    </Box>
                                ))}
                            </Box>
                        )
                    }
                    {
                        pendingInvites.length > 0 &&
                        (
                            <Box width="100%" mb={2}>
                                {pendingInvites.map((member, index) => (
                                    <Box key={index} display="flex" alignItems="center" justifyContent="space-evenly" width="100%" gap={2}>
                                        <Box width="100%">
                                            <Autocomplete
                                                disabled
                                                value={member}
                                                id={`user-autocomplete-${index}`}
                                                options={pendingInvites}
                                                getOptionLabel={(option) => option.name!}
                                                renderOption={(props, option) => (
                                                    <Box key={option.name} component="li" {...props} display="flex" alignItems="center">
                                                        <Avatar src={option.avatarURL} alt={option.name} />
                                                        <Box ml={1}>{option.name}</Box>
                                                    </Box>
                                                )}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        variant="outlined"
                                                        disabled
                                                        InputProps={{
                                                            ...params.InputProps,
                                                            startAdornment: (
                                                                <>
                                                                    <Avatar src={member.avatarURL} alt={member.name} />
                                                                    {params.InputProps.startAdornment}
                                                                </>
                                                            ),
                                                            endAdornment: null,
                                                        }}
                                                    />
                                                )}
                                            />
                                        </Box>
                                        <Box width="100%" display="flex">
                                            <TextField
                                                sx={{ width: "70%" }}
                                                value={member.instrument}
                                                disabled
                                                variant="outlined"
                                            />
                                            <IconButton
                                                onClick={() => removePendingInvite(member.name!)}
                                                color="error"
                                                disableRipple
                                            >
                                                <Tooltip title="Cancelar convite" placement="top">
                                                    <CancelScheduleSendIcon />
                                                </Tooltip>
                                            </IconButton>
                                        </Box>
                                    </Box>
                                ))}
                            </Box>
                        )
                    }
                    {
                        members.length <= 0 && !noMemberToggle && existingBandMembers.length == 0 &&
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
                                        sx={{ width: "70%" }}
                                        onChange={(e) => setInstrument(e.target.value)} />
                                    <IconButton
                                        color="success"
                                        disableRipple
                                        disabled={!isFieldFilled}
                                        onClick={addMember}
                                    >
                                        <Tooltip title="Convidar usuário" placement="top">
                                            <AddCircleOutlineOutlinedIcon />
                                        </Tooltip>
                                    </IconButton>
                                </Box>
                            </Box>
                        )
                    }
                    {
                        existingBandMembers.length > 0 && !noMemberToggle &&
                        (
                            <IconButton
                            onClick={() => setNoMemberToggle(true)}
                            color="success"
                            disableRipple
                        >
                            <Tooltip title="Convidar membro" placement="top">
                                <GroupAddTwoToneIcon />
                            </Tooltip>
                        </IconButton> 
                        )
                    }
                </Box>
            </Box>
        </Dialog>
    )
}

export default InviteIntegrantsModal
