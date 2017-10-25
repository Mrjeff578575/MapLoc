import template from '../mapTemplate/template'
import _ from 'lodash'
import utils from './utils'

export default class mapHelper {
    constructor(option) {
        this.mapStyle = option.mapStyle
        this.mapMarkerList = []
        this.msgInfoWindowList = []
        this.mapClickHandler = option.mapClickHandler || _.noop
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
        // 实例化3D楼块图层
        let buildings = new AMap.Buildings();
        // 在map中添加3D楼块图层
        buildings.setMap(this.map);
        AMap.event.addListener(toolBar, 'location', this._onLocComplete);
        //AMap.event.addListener(this.map, "click", this._onClick.bind(this)); //绑定事件，返回监听对象
        //AMap.event.removeListener(clickListener); //移除事件，以绑定时返回的对象作为参数
        document.addEventListener('click', function(e) {
            const classList = Array.prototype.slice.call(e.target.classList)
            if (classList.indexOf('amap-geo') > -1) {
                toolBar.doLocation()
            }
        })
        this.map.addControl(new AMap.Scale())
        this.geolocation = new AMap.Geolocation({
            enableHighAccuracy: true,//是否使用高精度定位，默认:true
            timeout: 10000,          //超过10秒后停止定位，默认：无穷大
            maximumAge: 0,           //定位结果缓存0毫秒，默认：0
            convert: true,           //自动偏移坐标，偏移后的坐标为高德坐标，默认：true
            showButton: true,        //显示定位按钮，默认：true
            buttonPosition: 'LB',    //定位按钮停靠位置，默认：'LB'，左下角
            buttonOffset: new AMap.Pixel(10, 20),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
            showMarker: true,        //定位成功后在定位到的位置显示点标记，默认：true
            showCircle: true,        //定位成功后用圆圈表示定位精度范围，默认：true
            panToLocation: true,     //定位成功后将定位到的位置作为地图中心点，默认：true
            zoomToAccuracy:true      //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
        });
        this.initTrail()
        return this
    }
    setMapCenter(lng, lat) {
        this.map.setZoomAndCenter(17, [lng, lat]);
    }
    _onClick(e) {
        let LngLat = e.lnglat;
        let Pixel = e.pixel;
        let target = e.target;
        //click blank position means create new point,
        //so we need open a edit info window
        this.mapClickHandler(LngLat, Pixel, target)
    }

    _onLocComplete(data) {
        this.setMapZoomAndCenter(17, data.LngLat)
        this._getMarkerByLngLat(data.LngLat)
    }

    addEventToDom(dom, event, cb) {
        AMap.event.addDomListener(dom, event, (e) => {
            cb(e);
        })
    }

    setMapZoomAndCenter(zoom = 17, centerPos) {
        if (!centerPos) {
            console.warn('please input center pos')
            return;
        }
        this.map.setZoomAndCenter(zoom, centerPos)
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
        let currentUserId = utils.getLocalStorage('userId')
        let isCurrent = markerObj.id == currentUserId
        let createCustomMarker = new Promise(this.createCustomMarker.bind(this, markerObj.msgNum, markerObj, isCurrent))
        createCustomMarker.then((res) => {
            let marker = new AMap.Marker({
                position: markerObj.pos,
                content: res
            });
            let extData = _.extend(markerObj, {
                refreshMsgNum: (msgNum) => {
                    const maxMsgNum = 10
                    msgNum = msgNum > maxMsgNum ? maxMsgNum + '+'  : msgNum
                    //TODO
                    document.querySelector('.msg-num').innerHTML = msgNum
                }
            })
            marker.setExtData(extData)
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
        
    }

    createCustomMarker(msgNum, markerObj, isCurrent, resolve, reject) {
        const maxMsgNum = 10
        msgNum = msgNum > maxMsgNum ? maxMsgNum + '+'  : msgNum
        let avatar = markerObj.sex == 1 ? 'static/img/boy.png' : 'static/img/girl.png'
        avatar = isCurrent ? 'static/img/me.png' : avatar;
        template('marker', function(compileTemp) {
            const context = {
                msgNum,
                avatar,
                markerId: markerObj.id
            }
            const html = compileTemp(context)
            resolve(html)
        }, function(err) {
            reject(err)
        })
    }

    addInfoWindow(marker, content, options) {
        const me = this
        let createInfoWindow = new Promise(this.createCustomInfoWindow.bind(this, content))
        createInfoWindow.then((res) => {
            let deviceWidth = document.body.clientWidth
            let offset = [];
            switch (deviceWidth) {
                case '375': 
                //Iphone6
                    offset = [190, 200]
                    break
                case '414':
                //Iphone6 Plus
                    offset = [200, 250]
                    break
                default:
                    offset = [190, 200]
                    break
            }
            const infoWindow = new AMap.InfoWindow({
                isCustom: true,
                autoMove: true,
                content: res,
                closeWhenClickMap: true,
                offset: new AMap.Pixel(offset[0], offset[1])
            })
            infoWindow.open(me.map, marker.getPosition());
            //AMap.event.addListener(infoWindow, 'open', options.afterOpen.call(null));
            AMap.event.addListener(infoWindow, 'click', (e) => {
                options.handleMsgClick.call(e)
            });
        }).catch((err) => {
            console.log(err)
        })
    }

    addMsgInfoWindow(marker, content, cb) {
        const me = this
        let markerId = marker.getExtData().id;
        if(_.find(this.msgInfoWindowList, {id: markerId})) {
            return;
        }
        console.log(markerId)
        let offset = [0, -30]
        let infoWindow = new AMap.InfoWindow({
            offset: new AMap.Pixel(offset[0], offset[1]),
            clickable: true,
            content: `<div class="msg-noti" data-markerid=${markerId} style="width: 150px;height: 40px;color: #fff;line-height: 40px;">${content}</div>`
        });
        AMap.event.addListener(infoWindow, 'close', () => {
            _.remove(me.msgInfoWindowList, function(window) {
                return window.id == markerId;
            })
        });
        infoWindow.open(me.map, marker.getPosition());
        this.msgInfoWindowList.push({
            id: markerId,
            infoWindow
        })
        cb(infoWindow)
    }

    createCustomInfoWindow(content, resolve, reject) {
        template('infoWindow', function(compileTemp) {
            const context = {
                content
            }
            const html = compileTemp(context)
            resolve(html)
        }, function(err) {
            reject(err)
        })
    }

    removeAllMarker() {
        _.each(this.mapMarkerList, (marker) => {
            marker.setMap(null)
        })
        this.mapMarkerList = []
    }

    removeMarker(userId) {
        let userMarker = _.remove(this.mapMarkerList, (marker) => {
            let extData = marker.getExtData();
            return extData.id == userId;
        })
        userMarker.length && userMarker[0].setMap(null);
    }

    initTrail() {
        let me = this
        AMapUI.load(['ui/misc/PathSimplifier'], function(PathSimplifier) {
            if (!PathSimplifier.supportCanvas) {
                alert('当前环境不支持 Canvas！');
                return;
            }
            //启动页面
            me.createTrailInstance(PathSimplifier);
        });
    }

    setTrails(trails) {
        //这里构建两条简单的轨迹，仅作示
        const me = this
        if (_.isArray(trails)) {
            me.pathSimplifierIns.setData(trails);
        } else {
            me.pathSimplifierIns.setData([trails]);
        }
        // //创建一个巡航器
        // var navg0 = me.pathSimplifierIns.createPathNavigator(0, //关联第1条轨迹
        //     {
        //         loop: true, //循环播放
        //         speed: 1000000
        //     });
    
        // navg0.start();
    }

    createTrailInstance(PathSimplifier) {
        //创建组件实例
        let me = this;
        this.pathSimplifierIns = new PathSimplifier({
            zIndex: 100,
            map: me.map, //所属的地图实例
            getPath: function(pathData, pathIndex) {
                //返回轨迹数据中的节点坐标信息，[AMap.LngLat, AMap.LngLat...] 或者 [[lng|number,lat|number],...]
                return pathData.path;
            },
            autoSetFitView: false,
            renderOptions: {
                //轨迹线的样式
                pathLineStyle: {
                    strokeStyle: 'red',
                    lineWidth: 6,
                    dirArrowStyle: true
                }
            }
        });
        this.pathSimplifierIns.on('pathClick', function(e, info){
            //info.pathData 即是相关的轨迹数据，如果info.pointIndex >= 0，则表示由轨迹上的节点触发
            console.log(info.pathData)
        });
    }

    destroy() {
        this.map.destroy()
    }
}