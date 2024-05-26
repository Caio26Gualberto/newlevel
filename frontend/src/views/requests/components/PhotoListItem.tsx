import React, { useState } from 'react';
import { Box, IconButton, Paper, Typography } from '@mui/material';
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
          padding: '16px',
          margin: '16px',
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
            height: '250px',
            objectFit: 'cover',
            width: '100%',
            cursor: 'pointer',
          }}
        />
        <Box mt={1} display="flex" justifyContent="center" alignItems="center" flexDirection="column">
          <Typography fontWeight="bold" textAlign="center">{item.title}</Typography>
          <Typography textAlign="center">{item.subtitle}</Typography>
        </Box>
        <Box display="flex" justifyContent="space-around" alignItems="center" mt={2}>
          <IconButton>
            <BlockIcon color="error" fontSize="large" />
          </IconButton>
          <IconButton onClick={approvePhoto}>
            <CheckCircleIcon color="success" fontSize="large" />
          </IconButton>
        </Box>
      </Paper>
    </>
  );
};

export default PhotoListItem;
