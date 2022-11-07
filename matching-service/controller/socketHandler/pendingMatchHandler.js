import pendingMatchController from '../pendingMatchController.js';
import axios from 'axios';

const pendingMatchHandler = (io) => {
    io.on('connection', (socket) => {
        console.log(`socket id is ${socket.id}`);
        console.log(socket.rooms);

        socket.on('match-easy', async (data) => {
            const user = await pendingMatchController.getAvailableMatch('easy');

            // if no match --> add to db
            if (user === null) {
                pendingMatchController.addPendingMatchEasy(socket.id, data);
            } else {
                const currentSocketId = user.dataValues.socketid;

                let question; 

                //retrive easy question by sending a GET API to question-service
                axios.get('http://localhost:8002/api/questions/?level=easy')
                    .then(response => {
                        question = response.data;
                        // emit succcess event to the matched users
                        io.to(socket.id).emit('match-success', currentSocketId, socket.id, question);
                        io.to(currentSocketId).emit('match-success', currentSocketId, socket.id, question);

                        // else --> match and delete
                        pendingMatchController.deleteMatchByDifficulty('easy');

                    })
                    .catch(error => {
                        console.log(error);
                    });                
            }
        });

        // join room based on socketid
        socket.on('join-room', async (socketid) => {
            socket.join(socketid);
            console.log('joined');
        });

        socket.on('match-medium', async (data) => {
            const user = await pendingMatchController.getAvailableMatch('medium');
            if (user === null) {
                pendingMatchController.addPendingMatchMedium(socket.id, data);
            } else {
                const currentSocketId = user.dataValues.socketid;

                let question;

                //retrive medium question by sending a GET API to question-service
                axios.get('http://localhost:8002/api/questions/?level=medium')
                    .then(response => {
                        question = response.data;
                        io.to(socket.id).emit('match-success', currentSocketId, socket.id, question);
                        io.to(currentSocketId).emit('match-success', currentSocketId, socket.id, question);
        
                        pendingMatchController.deleteMatchByDifficulty('medium');
                    })
                    .catch(error => {
                        console.log(error);
                    });
            }
        });

        socket.on('match-hard', async (data) => {
            socket.join('hard-waiting-room');
            const user = await pendingMatchController.getAvailableMatch('hard');
            if (user === null) {
                pendingMatchController.addPendingMatchHard(socket.id, data);
            } else {
                const currentSocketId = user.dataValues.socketid;

                let question;

                //retrive hard question by sending a GET API to question-service
                axios.get('http://localhost:8002/api/questions/?level=hard')
                    .then(response => {
                        question = response.data;
                        io.to(socket.id).emit('match-success', currentSocketId, socket.id, question);
                        io.to(currentSocketId).emit('match-success', currentSocketId, socket.id, question);
                        pendingMatchController.deleteMatchByDifficulty('hard');
                    })
                    .catch(error => {
                        console.log(error);
                    });
            }
        });

        // no match found after 30s ends
        socket.on('no-match-found', () => {
            pendingMatchController.deletePendingMatchById(socket.id);
        });

        // pending match is cancelled before 30s ends
        socket.on('match-cancel', () => {
            pendingMatchController.deletePendingMatchById(socket.id);
        });

        // leaves room after matched and already in the same room
        socket.on('leave-room', async (socketRoomId) => {
            socket.leave(socketRoomId);
        });

        // refresh question 
        socket.on('refresh-question', async (socketRoomId, questionDifficulty, questionTitle) => {
            console.log(questionDifficulty);
            console.log(questionTitle);
            let question; 

            if (questionDifficulty == 'easy') {
                axios.get('http://localhost:8002/api/questions/generateNew/?level=easy', {
                    data: {
                        currQuestionTitle : questionTitle
                    }
                }).then(response => {
                    question = response.data;
                    io.to(socketRoomId).emit('update-question', question);
                })
                .catch(error => {
                    console.log(error);
                });
            } else if (questionDifficulty == 'medium') {
                axios.get('http://localhost:8002/api/questions/generateNew/?level=medium', {
                    data: {
                        currQuestionTitle : questionTitle
                    }
                }).then(response => {
                    question = response.data;
                    io.to(socketRoomId).emit('update-question', question);
                })
                .catch(error => {
                    console.log(error);
                });
            } else {
                axios.get('http://localhost:8002/api/questions/generateNew/?level=hard', {
                    data: {
                        currQuestionTitle : questionTitle
                    }
                }).then(response => {
                    question = response.data;
                    io.to(socketRoomId).emit('update-question', question);
                })
                .catch(error => {
                    console.log(error);
                });
            }
           
        })
    });
};

export default pendingMatchHandler;