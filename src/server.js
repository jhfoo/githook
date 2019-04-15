const fs = require('fs'),
	path = require('path'),
	process = require('process'),
	log4js = require('log4js'),
	logger = log4js.getLogger(),
	Config = require('./config')

logger.level = Config.log4js.level

const restify = require('restify'),
	router = require('./route')

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
	logger.info('%s listening at %s', server.name, server.url)
})

