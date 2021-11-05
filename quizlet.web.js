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
    var urlFixed = url.split("https://")
    urlFixed.shift();
    var newUrl = `https://corsanywhere.herokuapp.com/https://translate.google.com/translate?sl=auto&tl=en&u=${encodeURIComponent(urlFixed.join(""))}`
    var data = fetch(newUrl)
    return {
        json: async function() {var d; await data.then((r => d = r.json())); return d},
        text: async function() {var d; await data.then((r => d = r.text())); return d}
    }
};

function require(req) {
    if (req == "events") {
        return _EventEmitter
    } else if (req == "got") {
        return _got
    } else if (req == "ws") {
        return WebSocket
    }
}

var module = {
    exports: this
}
