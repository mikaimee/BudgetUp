const mongoose = require('mongoose')

const dbName = 'BudgetDB'

mongoose.connect(`mongodb://127.0.0.1/${dbName}`, {
    usenewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log(`Connected to ${dbName}`))
    .catch((err) => console.log(err))