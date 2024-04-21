const fs = require('fs');
const path = require('path');

const logFilePath = path.join(__dirname, '../log.json');

const getLogs = () => {
  const logs = fs.readFileSync(logFilePath, 'utf-8');
  return JSON.parse(logs);
};

const deleteLog = (timestampToDelete) => {
  const logs = fs.readFileSync(logFilePath, 'utf-8');
  const logsArray = JSON.parse(logs);
  const updatedLogs = logsArray.filter(log => log.timestamp !== timestampToDelete);
  fs.writeFileSync(logFilePath, JSON.stringify(updatedLogs, null, 2), 'utf-8');
};

module.exports = { getLogs, deleteLog };
