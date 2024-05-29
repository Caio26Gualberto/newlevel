import { Avatar, Box, Button, CircularProgress, Divider, Grid, Paper, TextField } from "@mui/material";
import NewLevelModal from "../../../../components/NewLevelModal"
import NewLevelModalHeader from "../../../../components/NewLevelModalHeader"
import React, { useEffect } from "react";
import { CommentApi, CommentsPhotoResponseDto, ReceiveCommentDto } from "../../../../gen/api/src";
import ApiConfiguration from "../../../../apiConfig";
import * as toastr from 'toastr';

interface ICommentsModal {
    open: boolean;
    onClose: () => void;
    photoId?: number;
    mediaId?: number;
}

const CommentsModal: React.FC<ICommentsModal> = ({ open, photoId, mediaId, onClose }) => {
    const commentService = new CommentApi(ApiConfiguration)
    const [loading, setLoading] = React.useState(false)
    const [comments, setComments] = React.useState<CommentsPhotoResponseDto>({ comments: [], title: "" })
    const [comment, setComment] = React.useState("")
    const [pagination, setPagination] = React.useState({
        page: 1,
        pageCount: 10,
        pageSize: 10,
        search: ""
    })

    const getPhotoComments = async () => {
        setLoading(true);
        const result = await commentService.apiCommentGetCommentsByPhotoIdPost({
            photoId: photoId,
            pagination: pagination
        });

        if (result.isSuccess) {
            setComments(result.data!);
        } else {
            toastr.error(result.message!, 'Erro!', { timeOut: 3000, progressBar: true, positionClass: "toast-bottom-right" });
        }

        setLoading(false);
    };

    const getMediaComments = async () => {
        setLoading(true);
        const result = await commentService.apiCommentGetCommentsByMediaIdPost({
            mediaId: mediaId,
            pagination: pagination
        });

        if (result.isSuccess) {
            setComments(result.data!);
        } else {
            toastr.error(result.message!, 'Erro!', { timeOut: 3000, progressBar: true, positionClass: "toast-bottom-right" });
        }

        setLoading(false);
    };

    const addComment = async () => {
        setLoading(true);

        let payload = {}
        if (photoId) {
            payload = {
                photoId: photoId,
                text: comment
            } as ReceiveCommentDto
        } else {
            payload = {
                mediaId: mediaId,
                text: comment
            } as ReceiveCommentDto
        }

        const result = await commentService.apiCommentSaveCommentPost({
            receiveCommentDto: payload
        })

        if (result.isSuccess) {
            setComment("");
            toastr.success('Comentário adicionado com sucesso!', 'Sucesso!', { timeOut: 3000, progressBar: true, positionClass: "toast-bottom-right" });
            photoId ? await getPhotoComments() : await getMediaComments()
        } else {
            toastr.error(result.message!, 'Erro!', { timeOut: 3000, progressBar: true, positionClass: "toast-bottom-right" });
        }

        setLoading(false);
    }

    useEffect(() => {
        const fetchComments = async () => {
            if (photoId) {
                await getPhotoComments()
            } else {
                await getMediaComments()
            }
        }

        fetchComments()
    }, [pagination.page, pagination.pageSize])


    return (
        <NewLevelModal height="800px" open={open} width={900}>
            <Box display="flex" flexDirection="column" height="100%">
                <NewLevelModalHeader title="Comentários" closeModal={onClose} />
                <Divider />
                <div style={{ flex: 1, overflowY: "auto", padding: 14 }} className="App">
                    <h2>{comments.title}</h2>
                    {loading ? (
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '90%' }}>
                            <CircularProgress size={40} color="error" />
                        </div>
                    ) : (
                        comments.comments!.length > 0 ? (
                            comments.comments!.map((comment, index) => (
                                <Paper elevation={6} key={index} style={{ padding: "40px 20px", marginTop: 20 }}>
                                    <Grid container wrap="nowrap" spacing={2}>
                                        <Grid item>
                                            <Avatar src={comment.userAvatarSrc} alt="User Avatar" />
                                        </Grid>
                                        <Grid justifyContent="left" item xs zeroMinWidth>
                                            <h4 style={{ marginBottom: 8, textAlign: "left" }}>{comment.userName}</h4>
                                            <p style={{ textAlign: "left" }}>
                                                {comment.comment}
                                            </p>
                                            <p style={{ textAlign: "left", color: "gray", marginTop: "24px" }}>
                                                {comment.dateOfComment!.toLocaleDateString()}
                                            </p>
                                        </Grid>
                                    </Grid>
                                </Paper>
                            ))
                        ) : (
                            <p style={{ textAlign: "center", color: "gray", marginTop: "24px" }}>
                                Nenhum comentário disponível.
                            </p>
                        )
                    )}
                </div>
                <Divider />
                <Box p={2} display="flex" alignItems="center">
                    <TextField
                        id="outlined-multiline-static"
                        label="Comentar"
                        multiline
                        rows={2}
                        defaultValue=""
                        variant="outlined"
                        disabled={loading}
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        sx={{ flexGrow: 1, marginRight: 2 }}
                    />
                    <Button onClick={addComment} disabled={loading} variant="contained" color="primary">
                        Publicar
                    </Button>
                </Box>
            </Box>
        </NewLevelModal>
    )
}

export default CommentsModal
