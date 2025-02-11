import { ImageListItem, Tooltip, ImageListItemBar, Typography, Box } from '@mui/material'
import React from 'react'

interface MediaListProfileProps {
    src: string;
    title: string;
    isVideo: boolean;
}

const MediaListProfile: React.FC<MediaListProfileProps> = ({ src, title, isVideo }) => {
    const [showTooltip, setShowTooltip] = React.useState(false);
    let timer: NodeJS.Timeout;

    const handleMouseEnter = () => {
        timer = setTimeout(() => {
            setShowTooltip(true);
        }, 500);
    };

    const handleMouseLeave = () => {
        clearTimeout(timer);
        setShowTooltip(false);
    };
    return (
        <ImageListItem
            key={src}
            sx={{ borderRadius: '8px', overflow: 'hidden' }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <Tooltip
                title={title}
                open={showTooltip}
                placement="top"
                disableFocusListener
                disableHoverListener
                disableTouchListener
            >
                <>
                    {isVideo ? (
                        <Box sx={{ position: "relative", width: "100%", height: "164px" }}>
                            <iframe
                                src={src}
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                    borderRadius: "8px",
                                    border: "2px solid #E0E0E0",
                                }}
                            />
                            <Box
                                sx={{
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    width: "100%",
                                    height: "100%",
                                    cursor: "pointer",
                                }}
                                onClick={() => window.open(src, "_blank")}
                            />
                        </Box>
                    ) : (
                        <img
                            srcSet={src}
                            src={src}
                            alt={title}
                            loading="lazy"
                            style={{
                                width: '100%',
                                height: '164px',
                                objectFit: 'cover',
                                borderRadius: '8px',
                                border: '2px solid #E0E0E0',
                                transition: 'transform 0.3s ease-in-out',
                                cursor: 'pointer',
                            }}
                            onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                            onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                        />
                    )}
                </>
            </Tooltip>

            <ImageListItemBar
                sx={{
                    background:
                        'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, ' +
                        'rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
                }}
                title={<Typography variant="subtitle2">{title}</Typography>}
                position="top"
                actionPosition="left"
            />
        </ImageListItem>
    );

}

export default MediaListProfile