import { Box, IconButton, Typography } from "@mui/material";
import Grid2 from '@mui/material/Unstable_Grid2'; // Grid version 2
import AutorenewIcon from '@mui/icons-material/Autorenew';

function QuestionDisplay({title, body, image, handleOpenRefreshModal, handleCloseRefreshModal}) {

const refreshHandler = () => {
    console.log('refresh-button clicked');
    handleOpenRefreshModal();
}

    return (
        <Box sx={{whiteSpace: 'pre-line'}}>
            <Box sx={{ display: 'flex',
                       flexDirection: 'row',
                       alignItems: 'center', 
                       padding: 2, 
                       gap: 1}}>           
                <Typography variant="h6"> {title} </Typography> 
                <IconButton onClick={refreshHandler} sx={{backgroundColor: '#F0F0F0',
                                                          "&:hover": {
                                                            backgroundColor: '#D0D0D0'
                                                          }}}>
                    <AutorenewIcon></AutorenewIcon>
                </IconButton>
            </Box>
                {image !== "" &&
                    <Grid2 xs={12} padding={2}>
                        <img src={image} alt={title} style={{ width: "100%", height: "100%", objectFit: 'contain' }} />
                    </Grid2>
                }
                <Typography variant="body1" display="block" sx={{margin: 2}}> {body} </Typography> 
        </Box>
    )
}

export default QuestionDisplay;