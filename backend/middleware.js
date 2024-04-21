const jwtMiddleware = require('./middlewares/jwtMiddleware');
const adminMiddleware = require('./middlewares/adminMiddleware');
const moderatorMiddleware = require('./middlewares/moderatorMiddleware');
const spamMiddleware = require('./middlewares/spamMiddleware');
const ipBlacklistMiddleware = require('./middlewares/ipBlacklistMiddleware');
const logMiddleware = require('./middlewares/logMiddleware');

module.exports = { jwtMiddleware, adminMiddleware, moderatorMiddleware, spamMiddleware, ipBlacklistMiddleware, logMiddleware };
