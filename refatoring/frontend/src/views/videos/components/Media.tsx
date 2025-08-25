import { Box, Button, IconButton, Skeleton, Typography, useTheme, useMediaQuery } from "@mui/material"
import { useState } from "react"
import SimpleDialog from "./SimpleDialog"
import ForumIcon from '@mui/icons-material/Forum';
import CommentsModal from "../../../views/photos/components/modal/CommentsModal";

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
    
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));

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
                width: "100%",
                display: "flex",
                flexDirection: "column",
                gap: 1
            }}
        >
            {showComments && (
                <CommentsModal open={true} onClose={handleCloseComments} mediaId={id} />
            )}

            {!loading ? (
                <Box
                    sx={{
                        width: "100%",
                        position: "relative",
                        paddingTop: "56.25%", // 16:9 aspect ratio
                        borderRadius: "10px",
                        overflow: "hidden"
                    }}
                >
                    <iframe
                        src={src}
                        title={title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen
                        style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            border: "0px",
                            borderRadius: "10px",
                        }}
                    />
                </Box>
            ) : (
                <Skeleton 
                    variant="rectangular" 
                    sx={{
                        width: "100%",
                        paddingTop: "56.25%",
                        borderRadius: "10px"
                    }}
                />
            )}

            {!loading ? (
                <Box 
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 1,
                        p: 1
                    }}
                >
                    <Typography 
                        gutterBottom 
                        fontWeight="bold" 
                        variant="body2"
                        sx={{
                            fontSize: {
                                xs: "0.875rem",
                                sm: "1rem"
                            },
                            lineHeight: 1.2
                        }}
                    >
                        {title}
                    </Typography>
                    
                    <Box 
                        sx={{
                            display: "flex",
                            flexDirection: {
                                xs: "column",
                                sm: "row"
                            },
                            justifyContent: "space-between",
                            alignItems: {
                                xs: "stretch",
                                sm: "center"
                            },
                            gap: 1
                        }}
                    >
                        <Button
                            variant="outlined"
                            color="primary"
                            size="small"
                            onClick={handleClickOpen}
                            sx={{
                                color: 'white',
                                backgroundColor: 'red',
                                border: 'none',
                                fontSize: {
                                    xs: "0.75rem",
                                    sm: "0.875rem"
                                },
                                '&:hover': {
                                    backgroundColor: '#F3F3F3',
                                    color: 'black',
                                    border: 'none',
                                },
                            }}
                        >
                            Ver descrição
                        </Button>
                        <IconButton 
                            onClick={handleOpenComments} 
                            aria-label="add to favorites"
                            sx={{
                                alignSelf: {
                                    xs: "flex-end",
                                    sm: "center"
                                }
                            }}
                        >
                            <ForumIcon color="error" />
                        </IconButton>
                    </Box>
                    
                    <SimpleDialog
                        open={showDescription}
                        onClose={handleClose}
                        title="Descrição"
                        displayData={description}
                    />
                    
                    <Typography 
                        variant="caption" 
                        color="text.secondary" 
                        sx={{
                            fontSize: {
                                xs: "0.75rem",
                                sm: "0.875rem"
                            },
                            lineHeight: 1.2
                        }}
                    >
                        {`${formatCreationTime(createdAt)} por ${nickname}`}
                    </Typography>
                </Box>
            ) : (
                <Box sx={{ p: 1 }}>
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
