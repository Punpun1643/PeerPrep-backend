import React, { useContext, useEffect, useState } from 'react';
import { SocketContext } from './SocketContext'
import { useNavigate, useLocation } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from "@mui/material/Typography";
import LogoutIcon from '@mui/icons-material/Logout';
import { ensureLoggedIn } from '../../Util';
import { io } from "socket.io-client";
import QuestionDisplay from '../QuestionService/QuestionDisplay';

// collaboration service
import CodeEditor from '../CollaborationService/CodeEditor';


export default function RoomPage() {

    //styling for leave room modal
    const modal = {
        position: 'fixed',
        left: '0',
        top: '0',
        right: '0',
        bottom: '0',
        backgroundColor: 'rgba(0,0,0,0.75)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: '1'
    }

    const center = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '25vh',
        width: '50vw',
        fontSize: '20px',
        backgroundColor: '#ffffff',
        textAlign: 'center'
      };

    //getting socket
    const { getSocket } = useContext(SocketContext);
    let socket = getSocket();

    const location = useLocation();
    const navigate = useNavigate();

    useEffect( () => {
        ensureLoggedIn(navigate);
    });

    console.log(location);
  
    const roomId = location.state  
                   ? location.state.roomId 
                   : "";
    
    const secondClientSocketId = location.state
                   ? location.state.secondClientSocketId
                   : "";

    //breaking question down
    let questionData = location.state.questionData;
    let questionDifficulty = questionData.question.QuestionDifficulty;
    let questionTitle = questionData.question.QuestionTitle;
    let questionBody = questionData.question.QuestionBody;

    console.log("roomId" + roomId);
    console.log("socketID " + socket.id);

    const [showLeaveModal, setShowLeaveModal] = useState(false);

    useEffect( () => {

        socket.on("connect", () => {
            console.log(socket.connected); // true
          });
        socket.emit("join-room", roomId);

        return () => {
            socket.disconnect();
            socket.connect();
        } 

    }, []);

    const handleoOpenModal = (e) => {
        setShowLeaveModal(true);
    }

    const handleCloseModal = (e) => {
        setShowLeaveModal(false);
    }
    
    const onLeaveHandler = (e) => {
        console.log("leaving " + socket.id);
        socket.emit("leave-room", roomId);
        navigate('/selectquestiondifficulty');
    }


    return (
          
            <Grid container spacing={0.5} sx={{backgroundColor:'white', width:'100vw', height:'100vh', margin: '0px'}}>
                {showLeaveModal ? 
                    <div style={modal}>
                        <div style={center}>
                            <Typography variant="body1" sx={{padding: '20px'}}> Are you sure you want to leave the session? </Typography>
                            <Box>
                                <Button variant="outlined" onClick={onLeaveHandler} sx={{margin: '5px'}}> Yes </Button>
                                <Button variant="outlined" onClick={handleCloseModal} sx={{margin: '5px', borderColor: 'red', color: 'red'}}> Cancel </Button>
                            </Box>
                        </div>
                    </div>
                    : <></>} 
                {/* left panel */}
                <Grid item xs={5} md={5}>
                    <Stack spacing={0.5}>
                        {/* room number and leave room button */}
                        <Box sx={{height: "9.5vh", display:'flex', justifyContent:'flex-start', alignItems:'center', backgroundColor: 'white'}}>
                            {/* room number  */}
                            <Typography variant="body1" sx={{margin: 2}}> Room {roomId.slice(0,8)}  </Typography> 
                            {/* leave room button */}
                            <Button variant="outlined" endIcon={<LogoutIcon />} size="small" sx={{fontSize: '15px', textTransform: 'none'}} onClick={handleoOpenModal}>
                              Leave  
                            </Button>    
                        </Box>
                        {/* question box */}
                        <Box sx={{height: "58vh", display:'flex', flexDirection: 'column', justifyContent:'flex-start', alignItems:'center', 
                                  backgroundColor: 'white', border: 1.5, borderColor: 'green', borderRadius: 4, overflow: "scroll"}}>
                            <QuestionDisplay title={questionTitle} body={questionBody}/> 
                        </Box>
                        {/*chat box */}
                        <Box sx={{height: "30vh", display:'flex', justifyContent:'flex-start', alignItems:'center', 
                                  backgroundColor: 'white', border: 1.5, borderColor: 'orange', borderRadius: 4}}>
                            <Typography variant="body1" sx={{margin: 2}}> Placeholder chat box </Typography> 
                        </Box>
                    </Stack>
                </Grid>
                
                {/* right panel */}
                <Grid item xs={6.98} md={6.98} sx={{height: "100vh"}}>
                    <Stack spacing={0}>
                        {/* code box */}
                        <CodeEditor roomId={roomId} socketIds={[roomId, secondClientSocketId]}/>
                    </Stack>
                </Grid>
            </Grid>
    )
}