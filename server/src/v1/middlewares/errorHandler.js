const errorHandler = (req, res, err, next) => {
    let error = { ...err };

    console.log(err);

    // Mongoose bad ObjectId
    if (err.name === 'CastError') {
        const message = 'Resource not found';
        error = {message, statusCode: 404};
    }

    // Mongoose duplicate key
    if (err.code === 11000) {
        const message = 'Field value cannot be duplicate';
        error = {message, statusCode: 400};
    }

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map(val => val.message).join(', ');
        error = { message, statusCode: 400 };
    }

    res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Server Error'
    });
};