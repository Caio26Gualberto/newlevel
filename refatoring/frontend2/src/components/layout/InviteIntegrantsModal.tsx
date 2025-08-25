import { 
    Autocomplete, 
    Avatar, 
    Box, 
    Button, 
    CircularProgress, 
    Dialog, 
    DialogTitle, 
    Icon, 
    IconButton, 
    TextField, 
    Tooltip, 
    Typography, 
    useTheme, 
    useMediaQuery 
} from "@mui/material";
import GroupAddTwoToneIcon from '@mui/icons-material/GroupAddTwoTone';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import CancelScheduleSendIcon from '@mui/icons-material/CancelScheduleSend';
import GroupRemoveIcon from '@mui/icons-material/GroupRemove';
import React from "react";
import ApiConfiguration from "../../config/apiConfig";
import { BandApi, MemberInfoDto, PendingInvitesDto, SearchBarUserDetailDto, SystemNotificationApi, UserApi } from "../../gen/api/src";
import * as toastr from 'toastr';

interface InviteIntegrantsModalProps {
    open: boolean;
    title: string;
    onClose: (value: string) => void;
}

const InviteIntegrantsModal: React.FC<InviteIntegrantsModalProps> = ({ open, title, onClose }) => {
    const userService = new UserApi(ApiConfiguration);
    const bandService = new BandApi(ApiConfiguration);
    const systemNotificationService = new SystemNotificationApi(ApiConfiguration);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    
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
        setIsFieldFilled(false);
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
            // Reset form after successful invitation
            setSelectedMember({});
            setInstrument('');
            setSearchTerm('');
            setIsFieldFilled(false);
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

    async function removeBandMember(userId: number) {
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
        try {
            const response = await bandService.apiBandGetAllBandMembersGet();
            const pendingInvites = await systemNotificationService.apiSystemNotificationGetPendingInvitationsGet();
            setExistingBandMembers(response.data || []);
            setPendingInvites(pendingInvites.data || []);
        } catch (error) {
            console.error('Erro ao buscar dados:', error);
            setExistingBandMembers([]);
            setPendingInvites([]);
        }
    }

    React.useEffect(() => {
        (async () => {
            fetchData();
        })();
    }, [])

    React.useEffect(() => {
        if (selectedMember && selectedMember.userId && instrument) {
            setIsFieldFilled(true);
        } else {
            setIsFieldFilled(false);
        }
    }, [selectedMember, instrument]);

    return (
        <Dialog 
            maxWidth="md" 
            fullWidth 
            onClose={handleClose} 
            open={open}
            sx={{
                '& .MuiDialog-paper': {
                    width: {
                        xs: '95%',
                        sm: '90%',
                        md: '80%'
                    },
                    maxWidth: '800px',
                    backgroundColor: theme.palette.background.paper,
                    color: theme.palette.text.primary
                }
            }}
        >
            <Box 
                sx={{
                    m: {
                        xs: 0.5,
                        sm: 1
                    },
                    mb: 3
                }}
            >
                <Box 
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center"
                    }}
                >
                    <DialogTitle
                        sx={{
                            fontSize: {
                                xs: "1.25rem",
                                sm: "1.5rem"
                            },
                            color: theme.palette.text.primary
                        }}
                    >
                        {title}
                    </DialogTitle>
                </Box>
                <Box 
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        flexDirection: "column",
                        alignItems: "center",
                        width: "100%"
                    }}
                >
                    {/* Existing Band Members */}
                    {existingBandMembers && existingBandMembers.length > 0 && (
                        <Box 
                            sx={{
                                width: "100%",
                                mb: 2
                            }}
                        >
                            {existingBandMembers.map((member, index) => (
                                <Box 
                                    key={index} 
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-evenly",
                                        width: "100%",
                                        gap: 2,
                                        flexDirection: {
                                            xs: "column",
                                            sm: "row"
                                        },
                                        mb: 2,
                                        p: 2,
                                        backgroundColor: theme.palette.action.hover,
                                        borderRadius: 2
                                    }}
                                >
                                    <Box 
                                        sx={{
                                            width: "100%",
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 2
                                        }}
                                    >
                                        <Avatar 
                                            src={member.avatarURL || undefined} 
                                            alt={member.name || undefined}
                                            sx={{
                                                width: {
                                                    xs: "32px",
                                                    sm: "40px"
                                                },
                                                height: {
                                                    xs: "32px",
                                                    sm: "40px"
                                                }
                                            }}
                                        />
                                        <Typography
                                            variant="body1"
                                            sx={{
                                                fontSize: {
                                                    xs: '0.875rem',
                                                    sm: '1rem'
                                                },
                                                fontWeight: 500
                                            }}
                                        >
                                            {member.name}
                                        </Typography>
                                    </Box>
                                    <Box 
                                        sx={{
                                            width: "100%",
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 1
                                        }}
                                    >
                                        <TextField
                                            sx={{ 
                                                flex: 1,
                                                '& .MuiInputBase-input': {
                                                    fontSize: {
                                                        xs: '0.75rem',
                                                        sm: '0.875rem'
                                                    }
                                                }
                                            }}
                                            value={member.instrument}
                                            disabled
                                            variant="outlined"
                                            size="small"
                                        />
                                        <IconButton
                                            onClick={() => removeBandMember(member.userId!)}
                                            color="error"
                                            sx={{
                                                width: {
                                                    xs: "32px",
                                                    sm: "40px"
                                                },
                                                height: {
                                                    xs: "32px",
                                                    sm: "40px"
                                                }
                                            }}
                                        >
                                            <Tooltip title="Remover membro" placement="top">
                                                <GroupRemoveIcon 
                                                    sx={{
                                                        fontSize: {
                                                            xs: "1rem",
                                                            sm: "1.25rem"
                                                        }
                                                    }}
                                                />
                                            </Tooltip>
                                        </IconButton>
                                    </Box>
                                </Box>
                            ))}
                        </Box>
                    )}

                    {/* Pending Invites */}
                    {pendingInvites && pendingInvites.length > 0 && (
                        <Box 
                            sx={{
                                width: "100%",
                                mb: 2
                            }}
                        >
                            <Typography 
                                variant="h6" 
                                sx={{ 
                                    mb: 2, 
                                    color: theme.palette.warning.main,
                                    fontSize: {
                                        xs: "1rem",
                                        sm: "1.25rem"
                                    }
                                }}
                            >
                                Convites Pendentes
                            </Typography>
                            {pendingInvites.map((member, index) => (
                                <Box 
                                    key={index} 
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-evenly",
                                        width: "100%",
                                        gap: 2,
                                        flexDirection: {
                                            xs: "column",
                                            sm: "row"
                                        },
                                        mb: 2,
                                        p: 2,
                                        backgroundColor: 'rgba(255, 193, 7, 0.1)',
                                        borderRadius: 2,
                                        border: `1px solid ${theme.palette.warning.main}`
                                    }}
                                >
                                    <Box 
                                        sx={{
                                            width: "100%",
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 2
                                        }}
                                    >
                                        <Avatar 
                                            src={member.avatarURL || undefined} 
                                            alt={member.name || undefined}
                                            sx={{
                                                width: {
                                                    xs: "32px",
                                                    sm: "40px"
                                                },
                                                height: {
                                                    xs: "32px",
                                                    sm: "40px"
                                                }
                                            }}
                                        />
                                        <Typography
                                            variant="body1"
                                            sx={{
                                                fontSize: {
                                                    xs: '0.875rem',
                                                    sm: '1rem'
                                                },
                                                fontWeight: 500
                                            }}
                                        >
                                            {member.name}
                                        </Typography>
                                    </Box>
                                    <Box 
                                        sx={{
                                            width: "100%",
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 1
                                        }}
                                    >
                                        <TextField
                                            sx={{ 
                                                flex: 1,
                                                '& .MuiInputBase-input': {
                                                    fontSize: {
                                                        xs: '0.75rem',
                                                        sm: '0.875rem'
                                                    }
                                                }
                                            }}
                                            value={member.instrument}
                                            disabled
                                            variant="outlined"
                                            size="small"
                                        />
                                        <IconButton
                                            onClick={() => removePendingInvite(member.name!)}
                                            color="error"
                                            sx={{
                                                width: {
                                                    xs: "32px",
                                                    sm: "40px"
                                                },
                                                height: {
                                                    xs: "32px",
                                                    sm: "40px"
                                                }
                                            }}
                                        >
                                            <Tooltip title="Cancelar convite" placement="top">
                                                <CancelScheduleSendIcon 
                                                    sx={{
                                                        fontSize: {
                                                            xs: "1rem",
                                                            sm: "1.25rem"
                                                        }
                                                    }}
                                                />
                                            </Tooltip>
                                        </IconButton>
                                    </Box>
                                </Box>
                            ))}
                        </Box>
                    )}

                    {/* No Members Message */}
                    {(!members || members.length <= 0) && !noMemberToggle && (!existingBandMembers || existingBandMembers.length == 0) && (
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                                justifyContent: "center"
                            }}
                        >
                            <Typography 
                                variant="subtitle1"
                                sx={{
                                    fontSize: {
                                        xs: "0.875rem",
                                        sm: "1rem"
                                    }
                                }}
                            >
                                Ainda não há integrantes
                            </Typography>
                            <IconButton
                                onClick={() => {
                                    console.log('Clicou no botão adicionar membro');
                                    setNoMemberToggle(true);
                                }} 
                                color="success" 
                                sx={{ 
                                    width: {
                                        xs: "40px",
                                        sm: "48px"
                                    },
                                    height: {
                                        xs: "40px",
                                        sm: "48px"
                                    }
                                }}
                            >
                                <Tooltip title="Adicionar primeiro membro" placement="top">
                                    <GroupAddTwoToneIcon 
                                        sx={{
                                            fontSize: {
                                                xs: "1.5rem",
                                                sm: "2rem"
                                            }
                                        }}
                                    />
                                </Tooltip>
                            </IconButton>
                        </Box>
                    )}

                    {/* Add Member Form */}
                    {noMemberToggle && (
                        <Box 
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-evenly",
                                width: "100%",
                                gap: 2,
                                flexDirection: {
                                    xs: "column",
                                    sm: "row"
                                },
                                p: 2,
                                backgroundColor: theme.palette.action.hover,
                                borderRadius: 2
                            }}
                        >
                            <Box 
                                sx={{
                                    width: "100%"
                                }}
                            >
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
                                            size="small"
                                            sx={{
                                                '& .MuiInputBase-input': {
                                                    fontSize: {
                                                        xs: '0.75rem',
                                                        sm: '0.875rem'
                                                    }
                                                },
                                                '& .MuiInputLabel-root': {
                                                    fontSize: {
                                                        xs: '0.75rem',
                                                        sm: '0.875rem'
                                                    }
                                                }
                                            }}
                                            InputProps={{
                                                ...params.InputProps,
                                                endAdornment: (
                                                    <>
                                                        {loading ? (
                                                            <CircularProgress 
                                                                color="inherit" 
                                                                sx={{
                                                                    width: {
                                                                        xs: "20px",
                                                                        sm: "24px"
                                                                    },
                                                                    height: {
                                                                        xs: "20px",
                                                                        sm: "24px"
                                                                    }
                                                                }}
                                                            />
                                                        ) : null}
                                                        {params.InputProps.endAdornment}
                                                    </>
                                                ),
                                            }}
                                        />
                                    )}
                                    renderOption={(props, option) => (
                                        <Box 
                                            component="li" 
                                            {...props} 
                                            sx={{
                                                display: "flex",
                                                alignItems: "center"
                                            }}
                                        >
                                            <Avatar 
                                                src={option.avatarUrl || undefined} 
                                                alt={option.nickName || undefined}
                                                sx={{
                                                    width: {
                                                        xs: "24px",
                                                        sm: "32px"
                                                    },
                                                    height: {
                                                        xs: "24px",
                                                        sm: "32px"
                                                    }
                                                }}
                                            />
                                            <Box 
                                                sx={{
                                                    ml: 1,
                                                    fontSize: {
                                                        xs: "0.75rem",
                                                        sm: "0.875rem"
                                                    }
                                                }}
                                            >
                                                {option.nickName}
                                            </Box>
                                        </Box>
                                    )}
                                    isOptionEqualToValue={(option, value) => option.userId === value.userId}
                                />
                            </Box>
                            <Box 
                                sx={{
                                    width: "100%",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1
                                }}
                            >
                                <TextField
                                    sx={{ 
                                        flex: 1,
                                        '& .MuiInputBase-input': {
                                            fontSize: {
                                                xs: '0.75rem',
                                                sm: '0.875rem'
                                            }
                                        }
                                    }}
                                    value={instrument}
                                    onChange={(e) => setInstrument(e.target.value)}
                                    placeholder="Instrumento"
                                    size="small"
                                    variant="outlined"
                                />
                                <IconButton
                                    color="success"
                                    disabled={!isFieldFilled || loadingRequest}
                                    onClick={addMember}
                                    sx={{
                                        width: {
                                            xs: "32px",
                                            sm: "40px"
                                        },
                                        height: {
                                            xs: "32px",
                                            sm: "40px"
                                        }
                                    }}
                                >
                                    <Tooltip title="Convidar usuário" placement="top">
                                        {loadingRequest ? (
                                            <CircularProgress size={20} />
                                        ) : (
                                            <AddCircleOutlineOutlinedIcon 
                                                sx={{
                                                    fontSize: {
                                                        xs: "1rem",
                                                        sm: "1.25rem"
                                                    }
                                                }}
                                            />
                                        )}
                                    </Tooltip>
                                </IconButton>
                            </Box>
                        </Box>
                    )}

                    {/* Add Member Button */}
                    {existingBandMembers && existingBandMembers.length > 0 && !noMemberToggle && (
                        <IconButton
                            onClick={() => {
                                console.log('Clicou no botão adicionar membro (existem membros)');
                                setNoMemberToggle(true);
                            }}
                            color="success"
                            sx={{
                                width: {
                                    xs: "40px",
                                    sm: "48px"
                                },
                                height: {
                                    xs: "40px",
                                    sm: "48px"
                                }
                            }}
                        >
                            <Tooltip title="Convidar membro" placement="top">
                                <GroupAddTwoToneIcon 
                                    sx={{
                                        fontSize: {
                                            xs: "1.5rem",
                                            sm: "2rem"
                                        }
                                    }}
                                />
                            </Tooltip>
                        </IconButton> 
                    )}
                </Box>
            </Box>
        </Dialog>
    )
}

export default InviteIntegrantsModal
