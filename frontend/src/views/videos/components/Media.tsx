import { Box, Skeleton, Typography } from "@mui/material"
import { useState } from "react"

interface MediaProps {
    src: string
    title: string
    createdAt: string
    loading: boolean   
}

const Media = ({ src, title, createdAt, loading }: MediaProps) => {

    return (
        <Box sx={{ width: 460, marginRight: 1, my: 5 }}>
            {!loading ? (
                <iframe width="460" height="300" src={src} title={title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin" allowFullScreen style={{ border: "0px", borderRadius: "10px" }}></iframe>
            ) : (
                <Skeleton variant="rectangular" width={460} height={300} />
            )}
            {!loading ? (
                <Box sx={{ pr: 2 }}>
                    <Typography gutterBottom fontWeight="bold" variant="body2">
                        {title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        {`${createdAt}`}
                    </Typography>
                </Box>
            ) : (
                <Box sx={{ pt: 0.5 }}>
                    <Skeleton />
                    <Skeleton width="60%" />
                </Box>
            )}
        </Box>
    )
}

export default Media
