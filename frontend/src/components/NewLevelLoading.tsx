import { Backdrop, CircularProgress } from "@mui/material"

type Props = {
    isLoading: boolean;
};

const NewLevelLoading: React.FC<Props> = (props) => {
    return (
        <Backdrop sx={{
                zIndex: theme => theme.zIndex.drawer + 1,
                backgroundColor: "#eeeeee70"
            }}
            open={props.isLoading}>
            <CircularProgress sx={{color: "red"}} size={50} thickness={4} />
        </Backdrop>
    );
};

export default NewLevelLoading
