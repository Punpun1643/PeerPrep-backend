import pendingMatchOrm from '../model/pendingMatchOrm.js';

const pendingMatchController = {
    addPendingMatchEasy: addPendingMatchEasy,
    addPendingMatchMedium: addPendingMatchMedium,
    addPendingMatchHard: addPendingMatchHard,
    deletePendingMatchById: deletePendingMatchById,
};

function addPendingMatchEasy(username) {
    pendingMatchOrm.addPendingMatchEasy(username);
}

function addPendingMatchMedium(username) {
    pendingMatchOrm.addPendingMatchMedium(username);
}

function addPendingMatchHard(username) {
    pendingMatchOrm.addPendingMatchHard(username);
}

function deletePendingMatchById(params) {
    pendingMatchOrm.deletePendingMatchById(params);
}

export default pendingMatchController;
