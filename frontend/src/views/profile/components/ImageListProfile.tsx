import { ImageListItem, Tooltip, ImageListItemBar, Typography } from '@mui/material'
import { ProfileInfoPhotoDto } from '../../../gen/api/src'
import React from 'react'

interface ImageListProfileProps {
    photoData: ProfileInfoPhotoDto;
}

const ImageListProfile: React.FC<ImageListProfileProps> = ({ photoData }) => {
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
            key={photoData.photoSrc}
            sx={{ borderRadius: '8px', overflow: 'hidden' }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <Tooltip
                title={photoData.title}
                open={showTooltip}
                placement='top'
                disableFocusListener
                disableHoverListener
                disableTouchListener
            >
                <img
                    srcSet={`${photoData.photoSrc}`}
                    src={`${photoData.photoSrc}`}
                    alt={photoData.title}
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
            </Tooltip>
            <ImageListItemBar
                sx={{
                    background:
                        'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, ' +
                        'rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
                }}
                title={<Typography variant="subtitle2">{photoData.title}</Typography>}
                position="top"
                actionPosition="left"
            />
        </ImageListItem>
    )
}

export default ImageListProfile