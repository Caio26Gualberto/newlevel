import { SvgIconComponent } from "@mui/icons-material"
import { Button } from "@mui/material"

interface ButtonProps {
    title: string
    maxWidth?: boolean
    width?: string
    isDisabled?: boolean
    variant?: "contained" | "outlined" | "text" 
    color?: "error" | "info" | "inherit" | "primary" | "secondary" | "success" | "warning" 
    icon?: SvgIconComponent
    onClick?: (e?: any) => void;
}

const NewLevelButton: React.FC<ButtonProps> = ({ title, maxWidth, width, isDisabled, variant, color, icon: Icon, onClick }) => {
    return (
        <Button variant={variant} disabled={isDisabled} fullWidth={maxWidth} onClick={onClick}
            sx={{ backgroundColor: "#b81414", "&:hover": { backgroundColor: "transparent" }, color: "black", width: width }}>
            {title}
            {Icon && <Icon sx={{marginLeft: "5px"}}/>}
        </Button>
    )
}

export default NewLevelButton
