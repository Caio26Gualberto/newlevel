import { SvgIconComponent } from "@mui/icons-material"
import { Button, useTheme, useMediaQuery } from "@mui/material"

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
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));
    
    return (
        <Button 
            variant={variant} 
            disabled={isDisabled} 
            fullWidth={maxWidth} 
            onClick={onClick}
            sx={{ 
                backgroundColor: "#b81414", 
                "&:hover": { backgroundColor: "transparent" }, 
                color: "black", 
                width: width,
                fontSize: {
                    xs: "0.75rem",
                    sm: "0.875rem",
                    md: "1rem"
                },
                py: {
                    xs: 0.75,
                    sm: 1
                },
                px: {
                    xs: 1,
                    sm: 2
                }
            }}
        >
            {title}
            {Icon && (
                <Icon 
                    sx={{
                        marginLeft: "5px",
                        fontSize: {
                            xs: "1rem",
                            sm: "1.25rem"
                        }
                    }}
                />
            )}
        </Button>
    )
}

export default NewLevelButton
