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
import QuestionDisplay from '../QuestionService/QuestionDisplay';
import ChatDisplay from '../ChatService/ChatDisplay';
import Split from 'react-split-grid'

// collaboration service
import CodeEditor from '../CollaborationService/CodeEditor';
import './RoomPage.css';

export default function RoomPage() {

    //styling for modal
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
        textAlign: 'center',
        backgroundColor: 'RGBA(19,36,57,0.8)',
        color: "#ffffff",
        borderRadius: '25px'
      };

    //getting socket
    const { getSocket } = useContext(SocketContext);
    let socket = getSocket();

    const location = useLocation();
    const navigate = useNavigate();

    useEffect( () => {
        ensureLoggedIn(navigate);
    });
  
    const roomId = location.state  
                   ? location.state.roomId 
                   : "";
    
    const secondClientSocketId = location.state
                   ? location.state.secondClientSocketId
                   : "";
    
    let isFirstQuestion = (window.sessionStorage.getItem("question") == null)

    const questionDifficulty = location.state.questionData.question.QuestionDifficulty;    
    const [questionTitle, setQuestionTitle] = useState(isFirstQuestion 
                                                        ? location.state.questionData.question.QuestionTitle
                                                        : JSON.parse(window.sessionStorage.getItem("question")).QuestionTitle);
    const [questionBody, setQuestionBody] = useState(isFirstQuestion
                                                     ? location.state.questionData.question.QuestionBody
                                                     : JSON.parse(window.sessionStorage.getItem("question")).QuestionBody);
    const [questionImage, setQuestionImage] = useState(isFirstQuestion
                                                       ? location.state.questionData.question.QuestionImage
                                                       : JSON.parse(window.sessionStorage.getItem("question")).QuestionImage);
        
    console.log("roomId" + roomId);
    console.log("socketID " + socket.id);

    const [showLeaveModal, setShowLeaveModal] = useState(false);
    const [showRefreshModal, setShowRefreshModal] = useState(false);
    

    useEffect( () => {
        socket.on("connect", () => {
            console.log(socket.connected); // true
          });
        socket.emit("join-room", roomId);

        socket.on("update-question", (question) => {            
            window.sessionStorage.setItem("question", JSON.stringify(question.question));
            setQuestionTitle(question.question.QuestionTitle);
            setQuestionBody(question.question.QuestionBody);
            setQuestionImage(question.question.QuestionImage);
            console.log(question.question);
        });

        return () => {
            socket.disconnect();
            window.sessionStorage.clear();
            socket.connect();
        } 
    }, []);

    const handleOpenModal = (e) => {
        setShowLeaveModal(true);
    }

    const handleCloseModal = (e) => {
        setShowLeaveModal(false);
    }

    const handleOpenRefreshModal = (e) => {
        setShowRefreshModal(true);
    }

    const handleCloseRefreshModal = (e) => {
        setShowRefreshModal(false);
    }

    
    const onLeaveHandler = (e) => {
        console.log("leaving " + socket.id);
        socket.emit("leave-room", roomId);
        navigate('/selectquestiondifficulty');
    }

    const refreshHandler = (e) => {
        socket.emit("refresh-question", roomId, questionDifficulty, questionTitle);
        setShowRefreshModal(false);
    }

    return (
        <>
        <Grid container spacing={0.5} sx={{ backgroundColor:'#132439', color: '#ffffff', width:'100vw', height:'92.5vh', margin: '0px' }}>
                {showLeaveModal ? 
                    <div style={modal}>
                        <div style={center}>
                            <Typography variant="body1" sx={{padding: '20px'}}> Are you sure you want to leave the session? </Typography>
                            <Box>
                                <Button variant="contained" onClick={onLeaveHandler} sx={{margin: '5px', borderRadius: '25px'}} style={{ backgroundColor:"#05CE91", width: "80px" }}> Yes </Button>
                                <Button variant="contained" onClick={handleCloseModal} sx={{margin: '5px', borderRadius: '25px'}} style={{ backgroundColor:"#FF3152", width: "80px" }}> Cancel </Button>
                            </Box>
                        </div>
                    </div>
                    : <></>} 
        <Split
            render={({
                getGridProps,
                getGutterProps,
            }) => (
                <div className="grid" {...getGridProps()}>
                    { showRefreshModal ? 
                        <div style={modal}>
                        <div style={center}>
                            <Typography variant="body1" sx={{padding: '20px'}}> Are you sure you want to change to another question? The change will be reflected to all users in the room. </Typography>
                            <Box>
                                <Button variant="contained" onClick={refreshHandler} sx={{margin: '5px', borderRadius: '20px', backgroundColor: '#05CE91', width: "80px"}}> Yes </Button>
                                <Button variant="contained" onClick={handleCloseRefreshModal} sx={{margin: '5px', borderRadius: '20px', backgroundColor: '#FF3152', width: "80px"}}> Cancel </Button>
                            </Box>
                        </div>
                    </div>
                    : <></>}
                    <Stack spacing={0.5}>
                        {/* room number and leave room button */}
                        <Box sx={{height: "9.5vh", display:'flex', justifyContent:'flex-start', alignItems:'center'}}>
                            {/* room number  */}
                            <Typography variant="body1" sx={{margin: 2}}> Room ID: {roomId.slice(0,8)}  </Typography> 
                            {/* leave room button */}
                            <Button variant="contained" endIcon={<LogoutIcon />} size="small" sx={{fontSize: '15px', textTransform: 'none', borderRadius: '25px'}} style={{ backgroundColor:"#FF3152", width:"88px" }} onClick={handleOpenModal}>
                              Leave  
                            </Button>    
                        </Box>
                        {/* question box */}
                        <Box sx={{height: "50vh", display:'flex', flexDirection: 'column', justifyContent:'flex-start', alignItems:'center', 
                                  border: 1.5, borderColor: 'white', borderRadius: 4, overflow: "scroll"}}>
                            <QuestionDisplay title={questionTitle} body={questionBody} image={questionImage} handleOpenRefreshModal={handleOpenRefreshModal} handleCloseRefreshModal={handleCloseRefreshModal}/> 
                        </Box>
                        {/*chat box */}
                        <Box sx={{height: "30vh", display:'flex', flexDirection: 'column'}}>
                            <ChatDisplay roomId={roomId} />
                        </Box>
                    </Stack>
                    <div className="gutter-col gutter-col-1" {...getGutterProps('column', 1)} />
                    {/* <Stack spacing={0}> */}
                        {/* code box */}
                        <CodeEditor roomId={roomId} socketIds={[roomId, secondClientSocketId]}/>
                    {/* </Stack> */}
                </div>
            )}
        />
        </Grid>
        </>
    )
}