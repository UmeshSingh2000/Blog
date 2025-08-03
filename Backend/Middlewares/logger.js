const fs = require('fs')
const path = require('path')

const logFilePath = path.join(__dirname, '../Logs', 'deleteLog.txt')
const deleteLogger = (req, res, next) => {
    try {
        if (req.method !== 'DELETE') return next();

        const logMessage = `[${new Date().toISOString()}] DELETE ${req.originalUrl} from ${req.ip} | UA: ${req.headers['user-agent']}\n`;
        fs.appendFile(logFilePath, logMessage, (err) => {
            if (err) console.log(err)
        })

        next()
    } catch (error) {
        console.error('Delete logger error:', error.message);
        next();
    }
}

module.exports = deleteLogger