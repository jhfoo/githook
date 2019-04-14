const fs = require('fs'),
	restify = require('restify'),
	router = require('./route')

let server = restify.createServer({
})

// auto create data folder
if (!fs.existsSync('../data')) {
	fs.mkdirSync('../data')
}


server.use(restify.plugins.bodyParser())

router.applyRoutes(server)
server.listen(8080, () => {
	console.log('%s listening at %s', server.name, server.url)
})

