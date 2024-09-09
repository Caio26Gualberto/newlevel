import { Box, FormControl, InputLabel, Input, Button, TextField } from '@mui/material'
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import React from 'react'

interface MemberAndInstrument {
    [key: string]: string;
}

interface Member {
    id: string;
    data: MemberAndInstrument;
    deleteMember: (id: string) => void;
}

const DynamicRow: React.FC<Member> = ({ id, data, deleteMember }) => {
    return (
        <Box display="flex" width="100%" flexDirection="row" mt={1} gap={2}>
            {Object.entries(data).map(([key, value]) => (
                <TextField
                    key={value}
                    label="Integrante"
                    value={key}
                    color="success"
                    fullWidth
                    variant="outlined"
                />
            ))}
            {Object.entries(data).map(([key, value]) => (
                <TextField
                    key={key}
                    label="Instrumento"
                    value={value}
                    color="success"
                    fullWidth
                    variant="outlined"
                />
            ))}
            <Button onClick={() => deleteMember(id)}><DeleteRoundedIcon color='error' /></Button>
        </Box>
    )
}

export default DynamicRow