import { Box } from "@mui/material"
import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"

const Navbar = () => {
    const location = useLocation()
    const [showNavbar, setShowNavbar] = useState<boolean>(false)

    useEffect(() => {
        if (location.pathname === "/") {
            setShowNavbar(false)
        } else {
            setShowNavbar(true)
        }
    }
        , [location])

    return (
        <>{showNavbar &&
            <Box display="flex">Caio</Box>
        }
        </>
    )
}

export default Navbar
