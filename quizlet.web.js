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

function require(req) {
    if (req == "events") {
        return _EventEmitter
    } else if (req == "got") {
        return _got
    } else if (req == "ws") {
        return _ws
    }
}

var module = {
    exports: this
}
