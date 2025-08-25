import { Box, Autocomplete, TextField, CircularProgress, Avatar, useTheme, useMediaQuery } from "@mui/material";
import { SearchBarUserDetailDto, UserApi } from "../../gen/api/src";
import React, { useMemo, useCallback, useRef } from "react";
import ApiConfiguration from "../../config/apiConfig";
import { useNavigate } from "react-router-dom";

const UserSearchBar = React.memo(() => {
    const userService = useMemo(() => new UserApi(ApiConfiguration), []);
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    
    const [member, setMember] = React.useState<SearchBarUserDetailDto[]>([]);
    const [loading, setLoading] = React.useState<boolean>(false);
    const [searchTerm, setSearchTerm] = React.useState('');
    const debounceRef = useRef<NodeJS.Timeout>();

    const fetchUsers = useCallback(async (searchTerm: string): Promise<SearchBarUserDetailDto[]> => {
        const response = await userService.apiUserGetUsersForSearchBarGet({ searchTerm: searchTerm });
        return response.data!;
    }, [userService]);

    const goToProfile = useCallback((user: SearchBarUserDetailDto): void => {
        navigate(`/profile/${user.nickName}/${user.userId}`);
        setSearchTerm('');
        setMember([]);
    }, [navigate]);

    const handleInputChange = useCallback((event: any, newInputValue: string) => {
        setSearchTerm(newInputValue);
        
        // Clear previous debounce
        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }

        if (newInputValue.trim()) {
            setLoading(true);
            // Debounce API call by 300ms
            debounceRef.current = setTimeout(async () => {
                try {
                    const users = await fetchUsers(newInputValue.trim());
                    setMember(users);
                } catch (error) {
                    setMember([]);
                } finally {
                    setLoading(false);
                }
            }, 300);
        } else {
            setMember([]);
            setLoading(false);
        }
    }, [fetchUsers]);

    // Cleanup debounce on unmount
    React.useEffect(() => {
        return () => {
            if (debounceRef.current) {
                clearTimeout(debounceRef.current);
            }
        };
    }, []);

    return (
        <Box 
            sx={{
                width: "100%",
                maxWidth: {
                    xs: "250px",
                    sm: "350px",
                    md: "400px"
                }
            }}
        >
            <Autocomplete
                id="user-autocomplete"
                options={member}
                value={null}
                getOptionLabel={(option) => option.nickName!}
                loading={loading}
                noOptionsText="Pesquise por um usuário"
                onInputChange={handleInputChange}
                onChange={(e, newValue) => {
                    if (newValue) {
                        goToProfile(newValue);
                    }
                }}
                inputValue={searchTerm}
                sx={{
                    "& .MuiOutlinedInput-root": {
                        backgroundColor: theme.palette.background.paper,
                        borderRadius: 2,
                        color: theme.palette.text.primary,
                        "& fieldset": {
                            borderColor: theme.palette.divider,
                        },
                        "&:hover fieldset": {
                            borderColor: theme.palette.text.secondary,
                        },
                        "&.Mui-focused fieldset": {
                            borderColor: theme.palette.primary.main,
                        },
                    },
                    "& .MuiInputLabel-root": {
                        color: theme.palette.text.secondary,
                        fontSize: {
                            xs: "0.75rem",
                            sm: "0.875rem"
                        }
                    },
                    "& .MuiInputLabel-root.Mui-focused": {
                        color: theme.palette.primary.main,
                    },
                    "& .MuiAutocomplete-popupIndicator": {
                        color: theme.palette.text.primary,
                    },
                }}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        variant="filled"
                        label="Pesquisar usuário"
                        sx={{
                            input: { 
                                color: theme.palette.text.primary,
                                fontSize: {
                                    xs: "0.75rem",
                                    sm: "0.875rem"
                                }
                            },
                            label: { 
                                color: theme.palette.text.secondary,
                                fontSize: {
                                    xs: "0.75rem",
                                    sm: "0.875rem"
                                }
                            },
                            "& .MuiFilledInput-root": {
                                backgroundColor: theme.palette.background.paper,
                                "&:hover": { backgroundColor: theme.palette.action.hover },
                                "&.Mui-focused": { backgroundColor: theme.palette.background.paper },
                            },
                        }}
                        InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                                <>
                                    {loading ? (
                                        <CircularProgress 
                                            color="primary" 
                                            size={16}
                                            sx={{ 
                                                mr: 1
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
                        component="li"
                        {...props}
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            backgroundColor: theme.palette.background.paper,
                            color: theme.palette.text.primary,
                            "&:hover": {
                                backgroundColor: theme.palette.action.hover,
                            },
                            fontSize: {
                                xs: "0.75rem",
                                sm: "0.875rem"
                            }
                        }}
                    >
                        <Avatar 
                            src={option.avatarUrl!} 
                            alt={option.nickName!}
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
                isOptionEqualToValue={(option, value) => option.userId === value?.userId}
                componentsProps={{
                    paper: {
                        sx: {
                            backgroundColor: theme.palette.background.paper,
                            color: theme.palette.text.primary,
                            borderRadius: 2,
                            maxHeight: {
                                xs: "200px",
                                sm: "300px"
                            }
                        },
                    },
                }}
            />
        </Box>
    );
});

export default UserSearchBar;
