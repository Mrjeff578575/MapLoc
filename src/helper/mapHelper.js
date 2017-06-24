import template from '../mapTemplate/template'
import _ from 'lodash'

export default class mapHelper {
    constructor(option) {
        this.mapStyle = option.mapStyle
        this.mapMarkerList = [];
        console.log(option)
    }
    drawMap() {
        this.map = new AMap.Map('allmap',{
            resizeEnable: true,
            zoom: 17,
            center: [116.480983, 39.989628],
            mapStyle: this.mapStyle
        })
        // 給地图添加缩放工具条,默认显示在右下角
        const toolBar = new AMap.ToolBar({
            locate: true,
            autoPosition: false
        })
        this.map.addControl(toolBar)
        AMap.event.addListener(toolBar, 'location', this._onLocComplete);
        document.addEventListener('click', function(e) {
            const classList = Array.prototype.slice.call(e.target.classList)
            if (classList.indexOf('amap-geo') > -1) {
                toolBar.doLocation()
            }
        })
        this.map.addControl(new AMap.Scale())
        return this
    }
    _onLocComplete(data) {
        this.map.setZoomAndCenter({
            zoomLevel: 17,
            center: data.LngLat
        })
        this._getMarkerByLngLat(data.LngLat)
    }

    _getMarkerByLngLat(LngLat) {
        console.log(LngLat)
    }

    onGetLocError(data) {
        console.log(data)
    }
    /*
    * @param {Array} pos the pos of the marker
    * 
    */
    addMarker(markerObj, cb) {
        const me = this;
        const createCustomMarker = new Promise(this.createCustomMarker.bind(this))
        createCustomMarker.then((res) => {
            const marker = new AMap.Marker({
                position: markerObj.pos,
                content: res
            });
            marker.setExtData(markerObj)
            marker.setMap(me.map)
            me.mapMarkerList.push(marker)
            cb(marker)
        }).catch((err) => {
            console.log(err)
        })
    }

    getMapMakerById(id) {
        return _.find(this.mapMarkerList, (marker) => {
            return marker.getExtData().id == id
        })
    }

    bindMarkerEvent(marker, eventName, handleEventFunc) {
        AMap.event.addListener(marker, eventName, handleEventFunc);
    }

    handleMarkerClick() {
        console.log('1')
    }

    createCustomMarker(resolve, reject) {
        const imgSrc = 'static/img/logo.png'
        template('marker', function(compileTemp) {
            const context = {
                imgSrc
            }
            const html = compileTemp(context)
            resolve(html)
        }, function(err) {
            reject(err)
        })
    }

    addInfoWindow(marker, markerData, options) {
        const me = this
        const createInfoWindow = new Promise(this.createCustomInfoWindow.bind(this, markerData))
        createInfoWindow.then((res) => {
            const infoWindow = new AMap.InfoWindow({
                isCustom: true,
                autoMove: true,
                content: res,
                closeWhenClickMap: true,
                offset: new AMap.Pixel(16, -55)
            })
            infoWindow.open(me.map, marker.getPosition());
            AMap.event.addListener(infoWindow, 'open', options.afterOpen.call(null));
        }).catch((err) => {
            console.log(err)
        })
    }

    createCustomInfoWindow(markerData, resolve, reject) {
        const image = 'static/img/logo.png'
        const title = 'this is a custom info window'
        const content = 'This is a custom info window text'
        console.log(markerData)
        template('infoWindow', function(compileTemp) {
            const context = {
                image,
                title,
                content
            }
            const html = compileTemp(context)
            resolve(html)
        }, function(err) {
            reject(err)
        })
    }

    destroy() {
        this.mapStyle.destroy()
    }
}