import { Button } from "@mui/material"

interface ButtonProps {
    title: string
    maxWidth?: boolean
    onClick?: () => void;
}

const NewLevelButton: React.FC<ButtonProps> = ({ title, maxWidth, onClick }) => {
    return (
        <Button fullWidth={maxWidth} onClick={onClick} sx={{ backgroundColor: "#b81414", "&:hover": { backgroundColor: "white" }, color: "black" }}>{title}</Button>
    )
}

export default NewLevelButton
