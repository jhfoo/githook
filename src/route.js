const fs = require('fs'),
    path = require('path'),
    {
        spawn
    } = require('child_process'),
    process = require('process'),
    Router = require('restify-router').Router,
    router = new Router(),
    Config = require('./config')

const EVENTTYPE_COMMIT = 'commit'

const RequestFname = path.resolve(Config.path.data, '../data', 'hookrequest.json')
console.log('RequestFname: %s', RequestFname)

function parseJson(js) {
    let ret = {}
    if (js['head_commit']) {
        ret.EventType = EVENTTYPE_COMMIT
        if (js['head_commit'].url) {
            let match = js['head_commit'].url.match(/\/\/[^\/]+\/([^\/]+\/[^\/]+)/)
            if (match) {
                ret.domain = match[1]
            }
            console.log(ret.domain)
        }
    }
    return ret
}

router.get('/', (req, res, next) => {
    console.log('GET /')
    res.header('content-type', 'text/plain')
    if (fs.existsSync(RequestFname)) {
        let json = fs.readFileSync(RequestFname)
        let meta = parseJson(JSON.parse(json))
        res.send(JSON.stringify(meta, null, 2) + '\n' + json)
    } else {
        res.send('')
    }
    next()
})

router.post('/', (req, res, next) => {
    console.log(req.body)
    fs.writeFileSync(RequestFname, JSON.stringify(req.body, null, 2))
    let meta = parseJson(req.body)
    if (meta.EventType === EVENTTYPE_COMMIT) {
        console.log('COMMIT received')
        try {
            let domain = meta.domain.replace('/', '.')
            let filename = domain + '.commit.sh'
            let ScriptFname = path.resolve(process.cwd() + '/bin/' + filename)
            if (fs.existsSync(ScriptFname)) {
                let proc = spawn(ScriptFname, [], {
                    detached: true,
                    stdio: 'ignore'
                }).unref()
                res.send({
                    status: 'OK',
                    message: 'COMMIT: ' + filename + ' executed'
                })
            } else {
                res.send({
                    status: 'WARNING',
                    message: 'COMMIT: ' + filename + ' not found'
                })
                console.log('Unable to find %s', ScriptFname)
            }
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

module.exports = router