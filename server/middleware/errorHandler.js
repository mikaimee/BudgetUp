const errorHandler = (err, req, res, next) => {
    console.error(err.stack)

    let statusCode = 500
    let errorMessage = 'Internal Server Error'

    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        statusCode = 400
        errorMessage = 'Bad request'
    }
    else if (err.status) {
        statusCode = err.status
        errorMessage = err.errorMessage || 'Error'
    }

    res.status(statusCode).json({ error: errorMessage })
}

module.exports = errorHandler