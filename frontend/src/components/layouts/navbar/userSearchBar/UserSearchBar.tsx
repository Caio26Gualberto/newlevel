import { Box, Autocomplete, TextField, CircularProgress, Avatar } from "@mui/material";
import { SearchBarUserDetailDto, UserApi } from "../../../../gen/api/src";
import React from "react";
import ApiConfiguration from "../../../../apiConfig";
import { useNavigate } from "react-router-dom";

const UserSearchBar = () => {
    const userService = new UserApi(ApiConfiguration);
    const navigate = useNavigate()
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
        <Box width="100%" sx={{ maxWidth: 300 }}>
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
                            input: { color: "white" },
                            label: { color: "rgba(255, 255, 255, 0.7)" },
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
                                    {loading ? <CircularProgress color="primary" sx={{ marginBottom: "10px" }} size={24} /> : null}
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
                        display="flex"
                        alignItems="center"
                        sx={{
                            backgroundColor: "#1e1e1e",
                            color: "#fff",
                            "&:hover": {
                                backgroundColor: "#333",
                            },
                        }}
                    >
                        <Avatar src={option.avatarUrl} alt={option.nickName} />
                        <Box ml={1}>{option.nickName}</Box>
                    </Box>
                )}
                isOptionEqualToValue={(option, value) => option.userId === value.userId}
                componentsProps={{
                    paper: {
                        sx: {
                            backgroundColor: "#1e1e1e",
                            color: "#fff",
                            borderRadius: "8px",
                        },
                    },
                }}
            />
        </Box>

    )
}

export default UserSearchBar