import { Box, Autocomplete, TextField, CircularProgress, Avatar, useTheme, useMediaQuery } from "@mui/material";
import { SearchBarUserDetailDto, UserApi } from "../../../../gen/api/src";
import React from "react";
import ApiConfiguration from "../../../../apiConfig";
import { useNavigate } from "react-router-dom";

const UserSearchBar = () => {
    const userService = new UserApi(ApiConfiguration);
    const navigate = useNavigate()
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));
    
    const [member, setMember] = React.useState<SearchBarUserDetailDto[]>([]);
    const [selectedMember, setSelectedMember] = React.useState<SearchBarUserDetailDto>({ avatarUrl: "", nickName: "", userId: "" });
    const [loading, setLoading] = React.useState<boolean>(false);
    const [searchTerm, setSearchTerm] = React.useState('');

    async function fetchUsers(searchTerm: string): Promise<SearchBarUserDetailDto[]> {
        const response = await userService.apiUserGetUsersForSearchBarGet({ searchTerm: searchTerm });
        return response.data!;
    }

    function GoToProfile(user: SearchBarUserDetailDto): void {
        setSelectedMember(user)
        navigate(`/profile/${user.nickName}/${user.userId}`)
        setSearchTerm('')
        setSelectedMember({ avatarUrl: "", nickName: "", userId: "" })
    }

    React.useEffect(() => {
        if (searchTerm) {
            setLoading(true);
            fetchUsers(searchTerm).then(users => {
                setMember(users);
                setLoading(false);
            });
        } else {
            setMember([]);
        }
    }, [searchTerm]);

    return (
        <Box 
            sx={{
                width: "100%",
                maxWidth: {
                    xs: "200px",
                    sm: "250px",
                    md: "300px"
                }
            }}
        >
            <Autocomplete
                id="user-autocomplete"
                options={member}
                value={selectedMember}
                getOptionLabel={(option) => option.nickName!}
                loading={loading}
                noOptionsText="Pesquise por um usuário"
                onInputChange={(e, newInputValue) => setSearchTerm(newInputValue)}
                onChange={(e, newValue) => {
                    if (newValue) {
                        GoToProfile(newValue);
                    }
                }}
                sx={{
                    "& .MuiOutlinedInput-root": {
                        backgroundColor: "#121212",
                        borderRadius: "8px",
                        color: "#fff",
                        "& fieldset": {
                            borderColor: "#666",
                        },
                        "&:hover fieldset": {
                            borderColor: "#aaa",
                        },
                        "&.Mui-focused fieldset": {
                            borderColor: "#fff",
                        },
                    },
                    "& .MuiInputLabel-root": {
                        color: "#aaa",
                        fontSize: {
                            xs: "0.75rem",
                            sm: "0.875rem"
                        }
                    },
                    "& .MuiInputLabel-root.Mui-focused": {
                        color: "#fff",
                    },
                    "& .MuiAutocomplete-popupIndicator": {
                        color: "#fff",
                    },
                }}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        variant="filled"
                        label="Pesquisar usuário"
                        sx={{
                            input: { 
                                color: "white",
                                fontSize: {
                                    xs: "0.75rem",
                                    sm: "0.875rem"
                                }
                            },
                            label: { 
                                color: "rgba(255, 255, 255, 0.7)",
                                fontSize: {
                                    xs: "0.75rem",
                                    sm: "0.875rem"
                                }
                            },
                            "& .MuiFilledInput-root": {
                                backgroundColor: "#1e1e1e",
                                "&:hover": { backgroundColor: "#333" },
                                "&.Mui-focused": { backgroundColor: "#222" },
                            },
                        }}
                        InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                                <>
                                    {loading ? (
                                        <CircularProgress 
                                            color="primary" 
                                            sx={{ 
                                                marginBottom: "10px",
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
                            alignItems: "center",
                            backgroundColor: "#1e1e1e",
                            color: "#fff",
                            "&:hover": {
                                backgroundColor: "#333",
                            },
                            fontSize: {
                                xs: "0.75rem",
                                sm: "0.875rem"
                            }
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
                componentsProps={{
                    paper: {
                        sx: {
                            backgroundColor: "#1e1e1e",
                            color: "#fff",
                            borderRadius: "8px",
                            maxHeight: {
                                xs: "200px",
                                sm: "300px"
                            }
                        },
                    },
                }}
            />
        </Box>

    )
}

export default UserSearchBar