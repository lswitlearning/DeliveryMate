function errorHandler(err, req, res, next) {
    if (res.headersSent) {
        return next(err);
    }

    const status = err.status || 500;
    const message = err.message || 'Internal Server Error';

    res.status(status);
    res.json({
        error: {
            status,
            message,
            stack: process.env.NODE_ENV === 'production' ? '🍰' : err.stack,
        },
    });
}

function logErrors(err, req, res, next) {
    console.error(err.stack);
    next(err);
}

module.exports = { errorHandler, logErrors };
