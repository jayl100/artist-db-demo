const express = require('express')
const app = express()

app.listen(1000)

const artistsRouter = require('./routes/artists.js')
const channelRouter = require('./routes/songs.js')

app.use("/", artistsRouter)
app.use("/songs", channelRouter)


