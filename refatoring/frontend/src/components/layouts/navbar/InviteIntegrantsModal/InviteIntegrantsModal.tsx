import { Autocomplete, Avatar, Box, Button, CircularProgress, Dialog, DialogTitle, Icon, IconButton, ListItemText, MenuItem, Select, TextField, Tooltip, Typography, useTheme, useMediaQuery } from "@mui/material";
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
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));
    
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
                    maxWidth: '800px'
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
                            }
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
                    {
                        existingBandMembers.length > 0 &&
                        (
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
                                            mb: 2
                                        }}
                                    >
                                        <Box 
                                            sx={{
                                                width: "100%"
                                            }}
                                        >
                                            <Autocomplete
                                                disabled
                                                value={member}
                                                id={`user-autocomplete-${index}`}
                                                options={existingBandMembers}
                                                getOptionLabel={(option) => option.name!}
                                                renderOption={(props, option) => (
                                                    <Box 
                                                        key={option.name} 
                                                        component="li" 
                                                        {...props} 
                                                        sx={{
                                                            display: "flex",
                                                            alignItems: "center"
                                                        }}
                                                    >
                                                        <Avatar 
                                                            src={option.avatarURL} 
                                                            alt={option.name}
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
                                                            {option.name}
                                                        </Box>
                                                    </Box>
                                                )}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        variant="outlined"
                                                        disabled
                                                        sx={{
                                                            '& .MuiInputBase-input': {
                                                                fontSize: {
                                                                    xs: '0.75rem',
                                                                    sm: '0.875rem'
                                                                }
                                                            }
                                                        }}
                                                        InputProps={{
                                                            ...params.InputProps,
                                                            startAdornment: (
                                                                <>
                                                                    <Avatar 
                                                                        src={member.avatarURL} 
                                                                        alt={member.name}
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
                                                                    {params.InputProps.startAdornment}
                                                                </>
                                                            ),
                                                            endAdornment: null,
                                                        }}
                                                    />
                                                )}
                                            />
                                        </Box>
                                        <Box 
                                            sx={{
                                                width: "100%",
                                                display: "flex",
                                                alignItems: "center"
                                            }}
                                        >
                                            <TextField
                                                sx={{ 
                                                    width: {
                                                        xs: "80%",
                                                        sm: "70%"
                                                    },
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
                                            />
                                            <IconButton
                                                onClick={() => removeBandMember(member.userId!)}
                                                color="error"
                                                disableRipple
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
                        )
                    }
                    {
                        pendingInvites.length > 0 &&
                        (
                            <Box 
                                sx={{
                                    width: "100%",
                                    mb: 2
                                }}
                            >
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
                                            mb: 2
                                        }}
                                    >
                                        <Box 
                                            sx={{
                                                width: "100%"
                                            }}
                                        >
                                            <Autocomplete
                                                disabled
                                                value={member}
                                                id={`user-autocomplete-${index}`}
                                                options={pendingInvites}
                                                getOptionLabel={(option) => option.name!}
                                                renderOption={(props, option) => (
                                                    <Box 
                                                        key={option.name} 
                                                        component="li" 
                                                        {...props} 
                                                        sx={{
                                                            display: "flex",
                                                            alignItems: "center"
                                                        }}
                                                    >
                                                        <Avatar 
                                                            src={option.avatarURL} 
                                                            alt={option.name}
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
                                                            {option.name}
                                                        </Box>
                                                    </Box>
                                                )}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        variant="outlined"
                                                        disabled
                                                        sx={{
                                                            '& .MuiInputBase-input': {
                                                                fontSize: {
                                                                    xs: '0.75rem',
                                                                    sm: '0.875rem'
                                                                }
                                                            }
                                                        }}
                                                        InputProps={{
                                                            ...params.InputProps,
                                                            startAdornment: (
                                                                <>
                                                                    <Avatar 
                                                                        src={member.avatarURL} 
                                                                        alt={member.name}
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
                                                                    {params.InputProps.startAdornment}
                                                                </>
                                                            ),
                                                            endAdornment: null,
                                                        }}
                                                    />
                                                )}
                                            />
                                        </Box>
                                        <Box 
                                            sx={{
                                                width: "100%",
                                                display: "flex",
                                                alignItems: "center"
                                            }}
                                        >
                                            <TextField
                                                sx={{ 
                                                    width: {
                                                        xs: "80%",
                                                        sm: "70%"
                                                    },
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
                                            />
                                            <IconButton
                                                onClick={() => removePendingInvite(member.name!)}
                                                color="error"
                                                disableRipple
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
                        )
                    }
                    {
                        members.length <= 0 && !noMemberToggle && existingBandMembers.length == 0 &&
                        (
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
                                <Icon 
                                    onClick={() => setNoMemberToggle(true)} 
                                    color="success" 
                                    sx={{ 
                                        cursor: "pointer", 
                                        ml: 1,
                                        fontSize: {
                                            xs: "1.25rem",
                                            sm: "1.5rem"
                                        }
                                    }}
                                >
                                    <GroupAddTwoToneIcon />
                                </Icon>
                            </Typography>
                        )
                    }
                    {
                        selectedMember && noMemberToggle &&
                        (
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
                                    }
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
                                                key={option.userId} 
                                                component="li" 
                                                {...props} 
                                                sx={{
                                                    display: "flex",
                                                    alignItems: "center"
                                                }}
                                            >
                                                <Avatar 
                                                    src={option.avatarUrl} 
                                                    alt={option.nickName}
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
                                        alignItems: "center"
                                    }}
                                >
                                    <TextField
                                        sx={{ 
                                            width: {
                                                xs: "80%",
                                                sm: "70%"
                                            },
                                            '& .MuiInputBase-input': {
                                                fontSize: {
                                                    xs: '0.75rem',
                                                    sm: '0.875rem'
                                                }
                                            }
                                        }}
                                        onChange={(e) => setInstrument(e.target.value)}
                                        placeholder="Instrumento"
                                    />
                                    <IconButton
                                        color="success"
                                        disableRipple
                                        disabled={!isFieldFilled}
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
                                            <AddCircleOutlineOutlinedIcon 
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
                        )
                    }
                    {
                        existingBandMembers.length > 0 && !noMemberToggle &&
                        (
                            <IconButton
                                onClick={() => setNoMemberToggle(true)}
                                color="success"
                                disableRipple
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
                        )
                    }
                </Box>
            </Box>
        </Dialog>
    )
}

export default InviteIntegrantsModal
