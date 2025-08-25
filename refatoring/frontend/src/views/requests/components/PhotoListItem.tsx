import React, { useState } from 'react';
import { Box, IconButton, Paper, Typography, useTheme, useMediaQuery } from '@mui/material';
import { Block as BlockIcon, CheckCircle as CheckCircleIcon } from '@mui/icons-material'
import PhotoDetailsRequestModal from './modal/PhotoDetailsRequestModal';
import { PhotoApi, PhotoResponseDto } from '../../../gen/api/src';
import ApiConfiguration from '../../../apiConfig';
import * as toastr from 'toastr';
import { set } from 'date-fns';

interface PhotoListItemProps {
  item: PhotoResponseDto;
  triggerUpdate: () => void;
}

const PhotoListItem: React.FC<PhotoListItemProps> = ({ item, triggerUpdate }) => {
  const photoService = new PhotoApi(ApiConfiguration);
  const [loading, setLoading] = useState(false);
  const [isOpenModal, setIsOpenModal] = useState(false);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleCloseModal = () => {
    setIsOpenModal(false);
  };

  const approvePhoto = async () => { 
    setLoading(true)
    const result = await photoService.apiPhotoApprovePhotoGet({photoId: item.id, isApprove: true})
    setLoading(false)

    if (result.isSuccess) {
      toastr.success(result.message!, 'OK', { timeOut: 3000, progressBar: true, positionClass: "toast-bottom-right" });
      triggerUpdate()
    } else {
      toastr.error(result.message!, 'Erro', { timeOut: 3000, progressBar: true, positionClass: "toast-bottom-right" });
    }
  }

  return (
    <>
      <PhotoDetailsRequestModal onClose={handleCloseModal} open={isOpenModal} photoData={item} />
      <Paper
        elevation={3}
        sx={{
          height: 'auto',
          padding: {
            xs: '12px',
            sm: '16px'
          },
          margin: {
            xs: '8px',
            sm: '16px'
          },
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <Box
          component="img"
          src={item.src}
          onClick={() => setIsOpenModal(true)}
          sx={{
            display: 'block',
            borderRadius: '4px',
            height: {
              xs: '180px',
              sm: '220px',
              md: '250px'
            },
            objectFit: 'cover',
            width: '100%',
            cursor: 'pointer',
          }}
        />
        <Box 
          sx={{
            mt: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column"
          }}
        >
          <Typography 
            fontWeight="bold" 
            textAlign="center"
            sx={{
              fontSize: {
                xs: "0.875rem",
                sm: "1rem"
              }
            }}
          >
            {item.title}
          </Typography>
          <Typography 
            textAlign="center"
            sx={{
              fontSize: {
                xs: "0.75rem",
                sm: "0.875rem"
              }
            }}
          >
            {item.subtitle}
          </Typography>
        </Box>
        <Box 
          sx={{
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
            mt: 2
          }}
        >
          <IconButton
            sx={{
              width: {
                xs: "40px",
                sm: "48px"
              },
              height: {
                xs: "40px",
                sm: "48px"
              }
            }}
          >
            <BlockIcon 
              color="error" 
              fontSize="large"
              sx={{
                fontSize: {
                    xs: "1.5rem",
                    sm: "2rem"
                }
            }}
            />
          </IconButton>
          <IconButton 
            onClick={approvePhoto}
            sx={{
                width: {
                    xs: "40px",
                    sm: "48px"
                },
                height: {
                    xs: "40px",
                    sm: "48px"
                }
            }}
          >
            <CheckCircleIcon 
              color="success" 
              fontSize="large"
              sx={{
                fontSize: {
                    xs: "1.5rem",
                    sm: "2rem"
                }
            }}
            />
          </IconButton>
        </Box>
      </Paper>
    </>
  );
};

export default PhotoListItem;
