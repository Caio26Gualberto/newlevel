import { Backdrop, CircularProgress, useTheme, useMediaQuery } from "@mui/material"

type Props = {
    isLoading: boolean;
};

const NewLevelLoading: React.FC<Props> = (props) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));
    
    return (
        <Backdrop 
            sx={{
                zIndex: theme => theme.zIndex.drawer + 1,
                backgroundColor: "#eeeeee70"
            }}
            open={props.isLoading}
        >
            <CircularProgress 
                sx={{
                    color: "red",
                    width: {
                        xs: "40px",
                        sm: "50px"
                    },
                    height: {
                        xs: "40px",
                        sm: "50px"
                    }
                }} 
                thickness={4} 
            />
        </Backdrop>
    );
};

export default NewLevelLoading
