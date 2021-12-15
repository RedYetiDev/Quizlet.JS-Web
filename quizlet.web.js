WebSocket.prototype.once = function(event, cb) {
    if (event == 'open') {
        this.onopen = function() {
            cb()
            this.onopen = undefined;
        }
    } else if (event == 'message') {
        this.onmessage = function(e) {
            console.log
            cb(e.data)
            this.onmessage = undefined;
        }
    }
}

WebSocket.prototype.on = function(event, cb) {
    if (event == 'message') {
        this.onmessage = function(e) {
            cb(e.data)
        }
    }
}

class _EventEmitter {
    constructor(){
        this.callbacks = {}
    }

    on(event, cb){
        if(!this.callbacks[event]) this.callbacks[event] = [];
        this.callbacks[event].push(cb)
    }

    emit(...args){
        let cbs = this.callbacks[args.shift()]
        if(cbs){
            cbs.forEach(cb => cb(...args))
        }
    }
}
function _got(url) {
    var newUrl = `https://cors.eu.org/${url}`
    var data = fetch(newUrl)
    
    return {
        json: async function() {
            var d;
            await data.then((r => r.text())).then(r => d = r);
            return JSON.parse(d)
        },
        text: async function() {
            var d;
            await data.then((r => r.text())).then(r => d = r);
            return d
        }
    }
};

_got.post = function(url, data) {
    var newUrl = `https://cors.eu.org/${url}`
    var data = fetch(newUrl, {
        method: "POST",
        body: data.body
    })
    
    return {
        json: async function() {
            var d;
            await data.then((r => r.text())).then(r => d = r);
            console.log(d)
            if (d.match('<html lang="auto">')) {
                d = d.split('<pre>')[1].split('</pre>')[0]
            }
            return JSON.parse(d)
        },
        text: async function() {
            var d;
            await data.then((r => r.text())).then(r => d = r);
            if (d.match('<html lang="auto"')) {
                d = d.split('<pre>')[1].split('</pre>')[0]
            }
            return d
        }
    }
}

function _ws(url, options) {
    return new WebSocket(url)
}

class _Live extends _EventEmitter {
    constructor(pin, name, opt = {}) {
        if (!pin) throw new Error("No PIN Provided")
        super()
        this.pin = pin.toString().replace('-', '');
        if (!name && !opt.accountName) console.warn('No name provided, defaulting to "Quizlet.JS Bot"')
        this.name = name || "Quizlet.JS Bot";
        this.round = 0;
        this.streak = 0;
        this.userImage = opt.userImage || "https://quizlet.com/favicon.ico"
        this.accountName = opt.accountName || undefined
    }

    async getTokenAndId() {

        var headers = {
            'User-Agent': 'Quizlet.JS'
        }

        if (this.accountName) {
            var data = await _got(`https://quizlet.com/webapi/3.2/users?filters={"username":"${this.accountName}"}`, { headers }).json();
            this.accountInfo = data.responses[0].models.user[0]
            if (!this.accountInfo) this.emit('error','Invalid Account Username');
            headers.Cookie = `ab.storage.userId.6f8c2b67-8bd5-42f6-9c5f-571d9701f693={"g":"${this.accountInfo.id}"}`
            this.name = this.accountInfo.firstName
            this.userImage = this.accountInfo._imageUrl
        }

        var data = await _got("https://quizlet.com/live", {
            headers: headers
        }).text();

        return {
            token: data.split(`"multiplayerToken":"`)[1].split(`",`)[0],
            playerId: data.split('uid')[1].split(`"`)[2],
            cpToken: data.split(`"checkpointToken":"`)[1].split(`",`)[0],
            uid: data.split(`"uid":"`)[1].split(`",`)[0]
        }
    }

    async leave() {
        await this.socket.close();
        this.emit('disconnect');
    }
}

function require(req) {
    if (req == "events") {
        return _EventEmitter
    } else if (req == "got") {
        return _got
    } else if (req == "ws") {
        return _ws
    } else if (req == "./live") {
        return _Live
    }
}

var module = {
    exports: {}
}