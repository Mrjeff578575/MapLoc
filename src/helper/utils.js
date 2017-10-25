import html2canvas from 'html2canvas'
import _ from 'lodash'

let utils = {
    createCanvasBg(dialog, parentNode, imageClass) {
        let imageMask = document.querySelector('.' + imageClass);
        if (imageMask) {
            imageMask.remove();
        }
        html2canvas(document.querySelector('#allmap')).then((canvas) => {
            const src = canvas.toDataURL('image/png')
            const imageMask = document.createElement('div')
            imageMask.className += imageClass
            imageMask.setAttribute('style', 'position: absolute;top: 15%;left: 5%;filter: blur(3px);background-position: 5% 30%;')
            imageMask.style.backgroundImage = 'url('+src+')'
            imageMask.style.width = dialog.clientWidth + 'px'
            imageMask.style.height = dialog.clientHeight + 'px'
            dialog.style.zIndex = '99'
            //imageMask.style.background = 'inherit'
            parentNode.appendChild(imageMask)
        })
    },

    parseDom(arg) {
        let objE = document.createElement("div");
        objE.innerHTML = arg;
        return objE.childNodes;
    },

    setLocalStorage(attr, value) {
        let localstorage = window.localStorage
        return localStorage ? localstorage.setItem(attr, value) : 'no localStorage'
    },

    getLocalStorage(attr) {
        let localstorage = window.localStorage
        return localStorage ? localstorage.getItem(attr) : 'no localStorage'
    },
    
    clearLocalStorage(attr) {
        let localstorage = window.localStorage
        return localStorage ? localstorage.removeItem(attr) : 'no localStorage'
    },

    setSessionStorage(attr, value) {
        let sessionStorage = window.sessionStorage
        sessionStorage.setItem(attr, value)
    },

    getSessionStorage(attr) {
        let sessionStorage = window.sessionStorage
        sessionStorage.getItem(attr)
    },

    compareArray(arr1, arr2) {
        let resultArr = []
        _.each(arr1, (val1) => {
            _.each(arr2, (val2) => {
                if (val2 == val1) {
                    resultArr.push(val2)
                }
            })
        })
        return resultArr
    },

    devidePath(paths) {
        let prePath = {lng:0, lat: 0}
        let result = []
        let singlePath = [];
        _.each(paths, (path) => {
            let lng = path[0]
            let lat = path[1]
            let lngDiff = Math.abs(lng - prePath.lng)
            let latDiff = Math.abs(lat - prePath.lat)
            // console.log(`lngDiff: ${lngDiff}`, `latDiff: ${latDiff}`)
            if((lngDiff > 0.01 && prePath.lng != 0) || (latDiff > 0.01 && prePath.lat != 0)) {
                if (singlePath.length > 1) {
                    result.push(singlePath)
                    singlePath = []
                }
            } else {
                if (!singlePath.length) {
                    singlePath.push([lng, lat])
                }
                singlePath.push(path)
            }

            prePath.lng = lng
            prePath.lat = lat
        })
        if (singlePath.length) {
            result.push(singlePath)
            singlePath = []
        }
        return result
    }

}


export default utils