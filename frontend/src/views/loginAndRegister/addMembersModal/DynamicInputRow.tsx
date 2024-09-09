import React, { useState } from 'react';
import { Box, FormControl, InputLabel, Input, Button, TextField } from '@mui/material';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';

interface MemberAndInstrument {
    [key: string]: string;
}
interface DynamicInputRowProps {
    addMembers?: (id: string, memberAndInstrument: MemberAndInstrument) => void;
}

const DynamicInputRow: React.FC<DynamicInputRowProps> = ({ addMembers }) => {
    const [member, setMember] = useState<string>('')
    const [instrument, setInstrument] = useState<string>('')

    const handleSave = () => {
        const memberAndInstrument: MemberAndInstrument = {};
        memberAndInstrument[member] = instrument;

        setMember('');
        setInstrument('');

        addMembers?.(uuidv4(), memberAndInstrument);
    };

    return (
        <Box display="flex" width="100%" flexDirection="row" gap={2} mt={1}>
            <TextField
                label="Integrante"
                value={member}
                onChange={(e) => setMember(e.target.value)}
                color="success"
                fullWidth
                variant="outlined"
            />
            <TextField
                label="Instrumento"
                value={instrument}
                onChange={(e) => setInstrument(e.target.value)}
                color="success"
                fullWidth
                variant="outlined"
            />
            <Button onClick={handleSave}>
                <CheckCircleRoundedIcon color='success' />
            </Button>
        </Box>
    );
};

const uuidv4 = (): string => {
    // Gera um UUID v4 no formato: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
    // Onde x é um hexadecimal aleatório e y é um hexadecimal aleatório, mas com o primeiro dígito sendo 8, 9, A ou B

    const randomValues = new Uint8Array(16);
    crypto.getRandomValues(randomValues);

    // Ajusta os bits para a versão 4 e a variante DCE 1.1 (RFC 4122)
    randomValues[6] = (randomValues[6] & 0x0f) | 0x40; // Versão 4
    randomValues[8] = (randomValues[8] & 0x3f) | 0x80; // Variante DCE 1.1

    // Converte os bytes para um UUID string
    const bytesToHex = (bytes: Uint8Array) => {
        return Array.from(bytes).map(byte => byte.toString(16).padStart(2, '0')).join('');
    };

    const hex = bytesToHex(randomValues);

    return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
};

export default DynamicInputRow;
