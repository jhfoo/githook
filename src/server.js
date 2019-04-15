const fs = require('fs'),
	path = require('path'),
	process = require('process'),
	restify = require('restify'),
	router = require('./route'),
	Config = require('./config')

function autoCreateDataFolder() {
	// auto create data folder
	let fullpath = path.resolve(process.cwd(), Config.path.data)
	if (!fs.existsSync(fullpath)) {
		fs.mkdirSync(fullpath)
	}
}

autoCreateDataFolder()

let server = restify.createServer({
})

server.use(restify.plugins.bodyParser())

router.applyRoutes(server)
server.listen(Config.service.port, () => {
	console.log('%s listening at %s', server.name, server.url)
})

