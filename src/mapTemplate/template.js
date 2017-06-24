import handlebars from 'handlebars'

function template(tempName, callback) {
    const staticPath = './static/template/'
    const templateCollection = {
        'marker': staticPath + 'marker.html',
        'infoWindow': staticPath + 'infoWindow.html'
    }
    getHtml(templateCollection[tempName], function(res){
        callback(handlebars.compile(res))
    })
}
function createXhr() {
    let xhr, i, progId;
    if (typeof XMLHttpRequest !== "undefined") {
        return new XMLHttpRequest();
    } else if (typeof ActiveXObject !== "undefined") {
        for (i = 0; i < 3; i += 1) {
            progId = progIds[i];
            try {
                xhr = new ActiveXObject(progId);
            } catch (e) {}

            if (xhr) {
                progIds = [progId];  // so faster next time
                break;
            }
        }
    }

    return xhr;
}

function getHtml(url, callback, errback, headers) {
    const xhr = createXhr()
    let header;
    xhr.open('GET', url, true);

    //Allow plugins direct access to xhr headers
    if (headers) {
        for (header in headers) {
            if (headers.hasOwnProperty(header)) {
                xhr.setRequestHeader(header.toLowerCase(), headers[header]);
            }
        }
    }
    xhr.onreadystatechange = function (evt) {
        let status
        let err;
        //Do not explicitly handle errors, those should be
        //visible via console output in the browser.
        if (xhr.readyState === 4) {
            status = xhr.status;
            if (status > 399 && status < 600) {
                //An http 4xx or 5xx error. Signal an error.
                err = new Error(url + ' HTTP status: ' + status);
                err.xhr = xhr;
                if (errback) {
                    errback(err);
                }
            } else {
                callback(xhr.responseText);
            }
        }
    };
    xhr.send(null);
};
        
export default template