const fs = require('fs'),
    path = require('path'),
    {spawn} = require('child_process'),
    process = require('process'),
    Router = require('restify-router').Router,
    router = new Router()

const EVENTTYPE_COMMIT = 'commit'

const RequestFname = path.resolve('../data','hookrequest.json')
console.log('RequestFname: %s', RequestFname)

function parseJson(json) {
    let js = JSON.parse(json),
        ret = {}
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
    console.log ('GET /')
    res.header('content-type','text/plain')
    if (fs.existsSync(RequestFname)) {
        let json = fs.readFileSync(RequestFname)
        let meta = parseJson(json)
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
        let domain = meta.domain.replace('/','.')
        console.log('COMMIT received')
        try {
        let proc = spawn(process.cwd() + '/' + domain + '.sh',[], {
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
    
module.exports = router