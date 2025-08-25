import { Avatar, Box, Divider, Typography } from "@mui/material";
import NewLevelModal from "../../../../components/NewLevelModal"
import NewLevelModalHeader from "../../../../components/NewLevelModalHeader";

interface IProfileModalProps {
  avatarUrl: string;
  nickname: string;
  open: boolean;
  onClose: () => void;
}

const PictureProfileModal: React.FC<IProfileModalProps> = ({ avatarUrl, nickname, open, onClose }) => {
  return (
    <NewLevelModal height="auto" open={open} width={500}>
      <>
        <NewLevelModalHeader closeModal={onClose} title={nickname} />
        <Divider />
        <Box display="flex" justifyContent="center" alignItems="center">
          <Box mt={2} mb={2}>
            <Avatar src={avatarUrl} sx={{ width: 200, height: 200 }} />
          </Box>
        </Box>
      </>
    </NewLevelModal>
  )
}

export default PictureProfileModal
