const activeSessions = new Map();

function addSession(userId, socket) {
  activeSessions.set(userId, socket);
}

function removeSession(userId) {
  activeSessions.delete(userId);
}

function getSession(userId) {
  return activeSessions.get(userId);
}

module.exports = {
  addSession,
  removeSession,
  getSession,
};
