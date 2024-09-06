import { Box, Button, IconButton, Skeleton, Typography } from "@mui/material"
import { useState } from "react"
import SimpleDialog from "./SimpleDialog"
import ForumIcon from '@mui/icons-material/Forum';
import CommentsModal from "../../../views/photos/components/modal/CommentsModal";
import { useMobile } from "../../../MobileContext";

interface MediaProps {
    id: number
    src: string
    title: string
    createdAt: Date
    nickname: string
    description: string
    loading: boolean
}

const Media = ({ id, src, title, description, nickname, createdAt, loading }: MediaProps) => {
    const [showDescription, setShowDescription] = useState(false);
    const [showComments, setShowComments] = useState(false);
    const { isMobile } = useMobile()

    const handleClickOpen = () => {
        setShowDescription(true);
    };
    const handleClose = () => {
        setShowDescription(false);
    };

    const handleOpenComments = () => {
        setShowComments(true);
    }

    const handleCloseComments = () => {
        setShowComments(false);
    }

    return (
        <Box
            sx={{
                width: isMobile ? '100%' : 460,
                marginRight: isMobile ? 0 : 1, 
                my: 2,
            }}
        >
            {showComments && (
                <CommentsModal open={true} onClose={handleCloseComments} mediaId={id} />
            )}

            {!loading ? (
                <iframe
                    width={isMobile ? '100%' : 460}
                    height={isMobile ? 200 : 300}  
                    src={src}
                    title={title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                    style={{
                        border: '0px',
                        borderRadius: '10px',
                    }}
                ></iframe>
            ) : (
                <Skeleton variant="rectangular" width={isMobile ? '100%' : 460} height={isMobile ? 200 : 300} />
            )}

            {!loading ? (
                <Box sx={{ pr: 2 }}>
                    <Typography gutterBottom fontWeight="bold" variant="body2">
                        {title}
                    </Typography>
                    <Typography>
                        <Box display="flex" justifyContent="space-between">
                            <Button
                                variant="outlined"
                                color="primary"
                                size="small"
                                onClick={handleClickOpen}
                                sx={{
                                    mb: 1,
                                    color: 'white',
                                    backgroundColor: 'red',
                                    border: 'none',
                                    '&:hover': {
                                        backgroundColor: '#F3F3F3',
                                        color: 'black',
                                        border: 'none',
                                    },
                                }}
                            >
                                Ver descrição
                            </Button>
                            <IconButton onClick={handleOpenComments} aria-label="add to favorites">
                                <ForumIcon color="error" />
                            </IconButton>
                        </Box>
                        <SimpleDialog
                            open={showDescription}
                            onClose={handleClose}
                            title="Descrição"
                            displayData={description}
                        />
                    </Typography>
                    <Typography variant="caption" color="text.secondary" fontSize={17}>
                        {`${formatCreationTime(createdAt)} por ${nickname}`}
                    </Typography>
                </Box>
            ) : (
                <Box sx={{ pt: 0.5 }}>
                    <Skeleton />
                    <Skeleton width="60%" />
                </Box>
            )}
        </Box>
    );
}

function formatCreationTime(creationTime: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - creationTime.getTime();
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);
    const diffMonths = Math.floor(diffDays / 30);

    if (diffMonths > 0) {
        return `${diffMonths} mês${diffMonths > 1 ? 'es' : ''} atrás`;
    } else if (diffDays > 0) {
        return `${diffDays} dia${diffDays > 1 ? 's' : ''} atrás`;
    } else if (diffHours > 0) {
        return `${diffHours} hora${diffHours > 1 ? 's' : ''} atrás`;
    } else if (diffMinutes > 0) {
        return `${diffMinutes} minuto${diffMinutes > 1 ? 's' : ''} atrás`;
    } else {
        return `Alguns segundos atrás`;
    }
}

export default Media
