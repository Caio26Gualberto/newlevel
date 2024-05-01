import { Alert, AlertTitle, Box } from "@mui/material"
import { IAlertNewLevel } from "../interfaces/newLevelInterfaces";
import { useState, useEffect } from "react";

const AlertNewLevel: React.FC<IAlertNewLevel> = ({ severity, title, message }) => {
    const [show, setShow] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShow(false);
        }, 3000);

        return () => clearTimeout(timer);
    }, []);
    
    return (
        <Box>
            {show && (
                <Alert severity={severity} sx={{ animation: "slide-in 0.5s forwards" }}>
                    <AlertTitle>{title}</AlertTitle>
                    {message}
                </Alert>
            )}

            <style>
                {`
                    @keyframes slide-in {
                        from {
                            transform: translateX(100%);
                        }
                        to {
                            transform: translateX(50%);
                        }
                    }

                    @keyframes slide-out {
                        from {
                            transform: translateX(50%);
                        }
                        to {
                            transform: translateX(100%);
                        }
                    }

                    .slide-out {
                        animation: slide-out 0.5s forwards;
                    }
                `}
            </style>

            {!show && (
                <Alert severity={severity} sx={{ animation: "slide-out 0.5s forwards" }}>
                <AlertTitle>{title}</AlertTitle>
                {message}
            </Alert>
            )}
        </Box>
    );
};

export default AlertNewLevel

