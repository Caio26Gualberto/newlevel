import { SelectOptionDto } from "../gen/api/src"
import { MusicGenres } from "../types/types"

export interface IAlertNewLevel {
    severity: "success" | "info" | "warning" | "error"
    title: string
    message: string
}

export interface IBandRegister {
    bandName: string,
    email: string,
    nickname: string,
    password: string,
    confirmPassword: string,
    createdAt: string,
    description: string,
    city: SelectOptionDto,
    musicGenres: MusicGenres[]
}

export interface IModalProps {
    open: boolean;
    onClose: () => void;
}

export interface MemberAndInstrument {
    [key: string]: string;
}

export interface IMember {
    id: string;
    data: MemberAndInstrument;
}