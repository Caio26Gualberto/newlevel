import { Box, IconButton, ImageList, ImageListItem, Paper, TablePagination, Typography } from "@mui/material"
import NewLevelLoading from "../../../components/NewLevelLoading"
import { useEffect, useState } from "react"
import { PhotoApi, PhotoResponseDtoGenericList } from "../../../gen/api/src"
import ApiConfiguration from "../../../apiConfig"
import * as toastr from 'toastr';
import PhotoListItem from "./PhotoListItem"

const PhotoRequest = () => {
  const photoService = new PhotoApi(ApiConfiguration)
  const [loading, setLoading] = useState<boolean>(false)
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false)
  const [photosData, setPhotosData] = useState<PhotoResponseDtoGenericList>({ items: [], totalCount: 0 })
  const [pagination, setPagination] = useState({ page: 0, pageSize: 6, pageCount: 0, search: "" });

  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newPageSize = parseInt(event.target.value, 10);
    setPagination(prev => ({
      ...prev,
      pageSize: newPageSize,
      page: 0
    }));
  };

  const getPhotosToApprove = async () => {
    setLoading(true)
    const photos = await photoService.apiPhotoGetPhotoToApprovePost({
      pagination: {
        page: pagination.page + 1,
        pageSize: pagination.pageSize,
        pageCount: pagination.pageCount,
        search: pagination.search,
      }
    })
    if (photos.isSuccess) {
      setPhotosData(photos.data!)
    } else {
      toastr.error(photos.message!, 'Erro', { timeOut: 3000, progressBar: true, positionClass: "toast-bottom-right" });
    }
    setLoading(false)
  }

  useEffect(() => {
    const fetchData = async () => {
      await getPhotosToApprove()
    }

    fetchData()
  }, [pagination.page, pagination.pageSize])

  return (
    <>
      <NewLevelLoading isLoading={loading} />
      <Box display="flex" flexDirection="column" justifyContent="center">
        {photosData.totalCount! > 0 && <>
          <ImageList sx={{ height: "65vh", overflow: "auto" }} cols={3} rowHeight="auto">
            {photosData.items!.map((item, index) => (
              <PhotoListItem key={index} item={item} triggerUpdate={getPhotosToApprove} />
            ))}
          </ImageList>
          <TablePagination
            sx={{ display: 'flex', justifyContent: 'center' }}
            rowsPerPageOptions={[6, 12, 18]}
            component="div"
            labelRowsPerPage="Fotos por página"
            count={photosData.totalCount!}
            rowsPerPage={pagination.pageSize}
            page={pagination.page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </>
        }
        {photosData.totalCount! <= 0 && <Typography variant="h6" textAlign="center">Nenhuma foto para aprovar</Typography>}
      </Box>
    </>

  )
}

export default PhotoRequest
