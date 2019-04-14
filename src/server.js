const fs = require('fs'),
	{spawn} = require('child_process'),
	process = require('process'),
	restify = require('restify')

const server = restify.createServer({
})

var LastPost = '';

server.use(restify.plugins.bodyParser())

server.get('/', (req, res, next) => {
	console.log ('GET /')
	res.header('content-type','text/plain')
	res.send(fs.readFileSync('hookrequest.json'))
	next()
})

server.post('/', (req, res, next) => {
	console.log(req.body)
	fs.writeFileSync('hookrequest.json', JSON.stringify(req.body, null, 2))
	LastPost = req.body
	if (req.body.commits) {
		console.log('COMMIT received')
		try {
		let proc = spawn(process.cwd() + '/commit.sh',[], {
			detached: true,
			stdio: 'ignore'
		}).unref()
		// proc.stdout.on('data', (data) => {
		// 	console.log(data.toString())
		// })
		// proc.stderr.on('data', (data) => {
		// 	console.log('ERROR: ' + data.toString())
		// })
		// proc.on('close', (code) => {
		// 	console.log('Exited with code ' + code)

		// })
		// proc.on('error', (err) => {
		// 	console.log('SPAWN EXCEPTION')
		// 	console.log(process.cwd())
		// 	console.log(err)
		// })
		res.send({
			status:'OK',
			message: 'COMMIT received'
		})
		} catch (err) {
			console.log('EXCEPTION')
			console.log(err)
		}
	} else {
		res.send({
			status: 'OK'
		})
	}
	next()
})

server.listen(8080, () => {
	console.log('%s listening at %s', server.name, server.url)
})

