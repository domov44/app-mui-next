const logModel = require('../models/log');

exports.getLogs = async (req, res) => {
    try {
        const logsArray = logModel.getLogs();
        res.json(logsArray);
    } catch (error) {
        console.error('Error reading log file:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.deleteLog = async (req, res) => {
    try {
        const timestampToDelete = req.params.timestamp;
        logModel.deleteLog(timestampToDelete);
        res.json({ success: true });
    } catch (error) {
        console.error('Erreur lors de la suppression du log:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
