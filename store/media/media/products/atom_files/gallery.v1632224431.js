;
/*! PhotoSwipe - v4.0.7 - 2015-03-18
 * http://photoswipe.com
 * Copyright (c) 2015 Dmitry Semenov; */
(function(root,factory){if(typeof define==='function'&&define.amd){define(factory)}else if(typeof exports==='object'){module.exports=factory()}else{root.PhotoSwipe=factory()}})(this,function(){'use strict'
var PhotoSwipe=function(template,UiClass,items,options){var framework={features:null,bind:function(target,type,listener,unbind){var methodName=(unbind?'remove':'add')+'EventListener'
type=type.split(' ')
for(var i=0;i<type.length;i++){if(type[i]){target[methodName](type[i],listener,false)}}},isArray:function(obj){return obj instanceof Array},createEl:function(classes,tag){var el=document.createElement(tag||'div')
if(classes){el.className=classes}
return el},getScrollY:function(){var yOffset=window.pageYOffset
return yOffset!==undefined?yOffset:document.documentElement.scrollTop},unbind:function(target,type,listener){framework.bind(target,type,listener,true)},removeClass:function(el,className){var reg=new RegExp('(\\s|^)'+className+'(\\s|$)')
el.className=el.className.replace(reg,' ').replace(/^\s\s*/,'').replace(/\s\s*$/,'')},addClass:function(el,className){if(!framework.hasClass(el,className)){el.className+=(el.className?' ':'')+className}},hasClass:function(el,className){return el.className&&new RegExp('(^|\\s)'+className+'(\\s|$)').test(el.className)},getChildByClass:function(parentEl,childClassName){var node=parentEl.firstChild
while(node){if(framework.hasClass(node,childClassName)){return node}
node=node.nextSibling}},arraySearch:function(array,value,key){var i=array.length
while(i--){if(array[i][key]===value){return i}}
return-1},extend:function(o1,o2,preventOverwrite){for(var prop in o2){if(o2.hasOwnProperty(prop)){if(preventOverwrite&&o1.hasOwnProperty(prop)){continue}
o1[prop]=o2[prop]}}},easing:{sine:{out:function(k){return Math.sin(k*(Math.PI/2))},inOut:function(k){return-(Math.cos(Math.PI*k)-1)/2},},cubic:{out:function(k){return--k*k*k+1},},},detectFeatures:function(){if(framework.features){return framework.features}
var helperEl=framework.createEl(),helperStyle=helperEl.style,vendor='',features={}
features.oldIE=document.all&&!document.addEventListener
features.touch='ontouchstart'in window
if(window.requestAnimationFrame){features.raf=window.requestAnimationFrame
features.caf=window.cancelAnimationFrame}
features.pointerEvent=navigator.pointerEnabled||navigator.msPointerEnabled
if(!features.pointerEvent){var ua=navigator.userAgent
if(/iP(hone|od)/.test(navigator.platform)){var v=navigator.appVersion.match(/OS (\d+)_(\d+)_?(\d+)?/)
if(v&&v.length>0){v=parseInt(v[1],10)
if(v>=1&&v<8){features.isOldIOSPhone=true}}}
var match=ua.match(/Android\s([0-9\.]*)/)
var androidversion=match?match[1]:0
androidversion=parseFloat(androidversion)
if(androidversion>=1){if(androidversion<4.4){features.isOldAndroid=true}
features.androidVersion=androidversion}
features.isMobileOpera=/opera mini|opera mobi/i.test(ua)}
var styleChecks=['transform','perspective','animationName'],vendors=['','webkit','Moz','ms','O'],styleCheckItem,styleName
for(var i=0;i<4;i++){vendor=vendors[i]
for(var a=0;a<3;a++){styleCheckItem=styleChecks[a]
styleName=vendor+
(vendor?styleCheckItem.charAt(0).toUpperCase()+styleCheckItem.slice(1):styleCheckItem)
if(!features[styleCheckItem]&&styleName in helperStyle){features[styleCheckItem]=styleName}}
if(vendor&&!features.raf){vendor=vendor.toLowerCase()
features.raf=window[vendor+'RequestAnimationFrame']
if(features.raf){features.caf=window[vendor+'CancelAnimationFrame']||window[vendor+'CancelRequestAnimationFrame']}}}
if(!features.raf){var lastTime=0
features.raf=function(fn){var currTime=new Date().getTime()
var timeToCall=Math.max(0,16-(currTime-lastTime))
var id=window.setTimeout(function(){fn(currTime+timeToCall)},timeToCall)
lastTime=currTime+timeToCall
return id}
features.caf=function(id){clearTimeout(id)}}
features.svg=!!document.createElementNS&&!!document.createElementNS('http://www.w3.org/2000/svg','svg').createSVGRect
framework.features=features
return features},}
framework.detectFeatures()
if(framework.features.oldIE){framework.bind=function(target,type,listener,unbind){type=type.split(' ')
var methodName=(unbind?'detach':'attach')+'Event',evName,_handleEv=function(){listener.handleEvent.call(listener)}
for(var i=0;i<type.length;i++){evName=type[i]
if(evName){if(typeof listener==='object'&&listener.handleEvent){if(!unbind){listener['oldIE'+evName]=_handleEv}else{if(!listener['oldIE'+evName]){return false}}
target[methodName]('on'+evName,listener['oldIE'+evName])}else{target[methodName]('on'+evName,listener)}}}}}
var self=this
var DOUBLE_TAP_RADIUS=25,NUM_HOLDERS=3
var _options={allowPanToNext:true,spacing:0.12,bgOpacity:1,mouseUsed:false,loop:true,pinchToClose:true,closeOnScroll:true,closeOnVerticalDrag:true,hideAnimationDuration:333,showAnimationDuration:333,showHideOpacity:false,focus:true,escKey:true,arrowKeys:true,mainScrollEndFriction:0.35,panEndFriction:0.35,isClickableElement:function(el){return el.tagName==='A'},getDoubleTapZoom:function(isMouseClick,item){if(isMouseClick){return 1}else{return item.initialZoomLevel<0.7?1:1.5}},maxSpreadZoom:2,scaleMode:'fit',modal:true,alwaysFadeIn:false,}
framework.extend(_options,options)
var _getEmptyPoint=function(){return{x:0,y:0}}
var _isOpen,_isDestroying,_closedByScroll,_currentItemIndex,_containerStyle,_containerShiftIndex,_currPanDist=_getEmptyPoint(),_startPanOffset=_getEmptyPoint(),_panOffset=_getEmptyPoint(),_upMoveEvents,_downEvents,_globalEventHandlers,_viewportSize={},_currZoomLevel,_startZoomLevel,_translatePrefix,_translateSufix,_updateSizeInterval,_itemsNeedUpdate,_currPositionIndex=0,_offset,_slideSize=_getEmptyPoint(),_itemHolders,_prevItemIndex,_indexDiff=0,_dragStartEvent,_dragMoveEvent,_dragEndEvent,_dragCancelEvent,_transformKey,_pointerEventEnabled,_isFixedPosition=true,_likelyTouchDevice,_modules=[],_requestAF,_cancelAF,_initalClassName,_initalWindowScrollY,_oldIE,_currentWindowScrollY,_features,_windowVisibleSize={},_registerModule=function(name,module){framework.extend(self,module.publicMethods)
_modules.push(name)},_getLoopedId=function(index){var numSlides=_getNumItems()
if(index>numSlides-1){return index-numSlides}else if(index<0){return numSlides+index}
return index},_listeners={},_listen=function(name,fn){if(!_listeners[name]){_listeners[name]=[]}
return _listeners[name].push(fn)},_shout=function(name){var listeners=_listeners[name]
if(listeners){var args=Array.prototype.slice.call(arguments)
args.shift()
for(var i=0;i<listeners.length;i++){listeners[i].apply(self,args)}}},_getCurrentTime=function(){return new Date().getTime()},_applyBgOpacity=function(opacity){_bgOpacity=opacity
self.bg.style.opacity=opacity*_options.bgOpacity},_applyZoomTransform=function(styleObj,x,y,zoom){styleObj[_transformKey]=_translatePrefix+x+'px, '+y+'px'+_translateSufix+' scale('+zoom+')'},_applyCurrentZoomPan=function(){if(_currZoomElementStyle){_applyZoomTransform(_currZoomElementStyle,_panOffset.x,_panOffset.y,_currZoomLevel)}},_applyZoomPanToItem=function(item){if(item.container){_applyZoomTransform(item.container.style,item.initialPosition.x,item.initialPosition.y,item.initialZoomLevel)}},_setTranslateX=function(x,elStyle){elStyle[_transformKey]=_translatePrefix+x+'px, 0px'+_translateSufix},_moveMainScroll=function(x,dragging){if(!_options.loop&&dragging){var newSlideIndexOffset=_currentItemIndex+(_slideSize.x*_currPositionIndex-x)/_slideSize.x
var delta=Math.round(x-_mainScrollPos.x)
if((newSlideIndexOffset<0&&delta>0)||(newSlideIndexOffset>=_getNumItems()-1&&delta<0)){x=_mainScrollPos.x+delta*_options.mainScrollEndFriction}}
_mainScrollPos.x=x
_setTranslateX(x,_containerStyle)},_calculatePanOffset=function(axis,zoomLevel){var m=_midZoomPoint[axis]-_offset[axis]
return _startPanOffset[axis]+_currPanDist[axis]+m-m*(zoomLevel/_startZoomLevel)},_equalizePoints=function(p1,p2){p1.x=p2.x
p1.y=p2.y
if(p2.id){p1.id=p2.id}},_roundPoint=function(p){p.x=Math.round(p.x)
p.y=Math.round(p.y)},_mouseMoveTimeout=null,_onFirstMouseMove=function(){if(_mouseMoveTimeout){framework.unbind(document,'mousemove',_onFirstMouseMove)
framework.addClass(template,'pswp--has_mouse')
_options.mouseUsed=true
_shout('mouseUsed')}
_mouseMoveTimeout=setTimeout(function(){_mouseMoveTimeout=null},100)},_bindEvents=function(){framework.bind(document,'keydown',self)
if(_features.transform){framework.bind(self.scrollWrap,'click',self)}
if(!_options.mouseUsed){framework.bind(document,'mousemove',_onFirstMouseMove)}
framework.bind(window,'resize scroll',self)
_shout('bindEvents')},_unbindEvents=function(){framework.unbind(window,'resize',self)
framework.unbind(window,'scroll',_globalEventHandlers.scroll)
framework.unbind(document,'keydown',self)
framework.unbind(document,'mousemove',_onFirstMouseMove)
if(_features.transform){framework.unbind(self.scrollWrap,'click',self)}
if(_isDragging){framework.unbind(window,_upMoveEvents,self)}
_shout('unbindEvents')},_calculatePanBounds=function(zoomLevel,update){var bounds=_calculateItemSize(self.currItem,_viewportSize,zoomLevel)
if(update){_currPanBounds=bounds}
return bounds},_getMinZoomLevel=function(item){if(!item){item=self.currItem}
return item.initialZoomLevel},_getMaxZoomLevel=function(item){if(!item){item=self.currItem}
return item.w>0?_options.maxSpreadZoom:1},_modifyDestPanOffset=function(axis,destPanBounds,destPanOffset,destZoomLevel){if(destZoomLevel===self.currItem.initialZoomLevel){destPanOffset[axis]=self.currItem.initialPosition[axis]
return true}else{destPanOffset[axis]=_calculatePanOffset(axis,destZoomLevel)
if(destPanOffset[axis]>destPanBounds.min[axis]){destPanOffset[axis]=destPanBounds.min[axis]
return true}else if(destPanOffset[axis]<destPanBounds.max[axis]){destPanOffset[axis]=destPanBounds.max[axis]
return true}}
return false},_setupTransforms=function(){if(_transformKey){var allow3dTransform=_features.perspective&&!_likelyTouchDevice
_translatePrefix='translate'+(allow3dTransform?'3d(':'(')
_translateSufix=_features.perspective?', 0px)':')'
return}
_transformKey='left'
framework.addClass(template,'pswp--ie')
_setTranslateX=function(x,elStyle){elStyle.left=x+'px'}
_applyZoomPanToItem=function(item){var zoomRatio=item.fitRatio>1?1:item.fitRatio,s=item.container.style,w=zoomRatio*item.w,h=zoomRatio*item.h
s.width=w+'px'
s.height=h+'px'
s.left=item.initialPosition.x+'px'
s.top=item.initialPosition.y+'px'}
_applyCurrentZoomPan=function(){if(_currZoomElementStyle){var s=_currZoomElementStyle,item=self.currItem,zoomRatio=item.fitRatio>1?1:item.fitRatio,w=zoomRatio*item.w,h=zoomRatio*item.h
s.width=w+'px'
s.height=h+'px'
s.left=_panOffset.x+'px'
s.top=_panOffset.y+'px'}}},_onKeyDown=function(e){var keydownAction=''
if(_options.escKey&&e.keyCode===27){keydownAction='close'}else if(_options.arrowKeys){if(e.keyCode===37){keydownAction='prev'}else if(e.keyCode===39){keydownAction='next'}}
if(keydownAction){if(!e.ctrlKey&&!e.altKey&&!e.shiftKey&&!e.metaKey){if(e.preventDefault){e.preventDefault()}else{e.returnValue=false}
self[keydownAction]()}}},_onGlobalClick=function(e){if(!e){return}
if(_moved||_zoomStarted||_mainScrollAnimating||_verticalDragInitiated){e.preventDefault()
e.stopPropagation()}},_onPageScroll=function(){self.setScrollOffset(0,framework.getScrollY())}
var _animations={},_numAnimations=0,_stopAnimation=function(name){if(_animations[name]){if(_animations[name].raf){_cancelAF(_animations[name].raf)}
_numAnimations--
delete _animations[name]}},_registerStartAnimation=function(name){if(_animations[name]){_stopAnimation(name)}
if(!_animations[name]){_numAnimations++
_animations[name]={}}},_stopAllAnimations=function(){for(var prop in _animations){if(_animations.hasOwnProperty(prop)){_stopAnimation(prop)}}},_animateProp=function(name,b,endProp,d,easingFn,onUpdate,onComplete){var startAnimTime=_getCurrentTime(),t
_registerStartAnimation(name)
var animloop=function(){if(_animations[name]){t=_getCurrentTime()-startAnimTime
if(t>=d){_stopAnimation(name)
onUpdate(endProp)
if(onComplete){onComplete()}
return}
onUpdate((endProp-b)*easingFn(t/d)+b)
_animations[name].raf=_requestAF(animloop)}}
animloop()}
var publicMethods={shout:_shout,listen:_listen,viewportSize:_viewportSize,options:_options,isMainScrollAnimating:function(){return _mainScrollAnimating},getZoomLevel:function(){return _currZoomLevel},getCurrentIndex:function(){return _currentItemIndex},isDragging:function(){return _isDragging},isZooming:function(){return _isZooming},setScrollOffset:function(x,y){_offset.x=x
_currentWindowScrollY=_offset.y=y},applyZoomPan:function(zoomLevel,panX,panY){_panOffset.x=panX
_panOffset.y=panY
_currZoomLevel=zoomLevel
_applyCurrentZoomPan()},init:function(){if(_isOpen||_isDestroying){return}
var i
self.framework=framework
self.template=template
self.bg=framework.getChildByClass(template,'pswp__bg')
_initalClassName=template.className
_isOpen=true
_features=framework.detectFeatures()
_requestAF=_features.raf
_cancelAF=_features.caf
_transformKey=_features.transform
_oldIE=_features.oldIE
self.scrollWrap=framework.getChildByClass(template,'pswp__scroll-wrap')
self.container=framework.getChildByClass(self.scrollWrap,'pswp__container')
_containerStyle=self.container.style
self.itemHolders=_itemHolders=[{el:self.container.children[0],wrap:0,index:-1},{el:self.container.children[1],wrap:0,index:-1},{el:self.container.children[2],wrap:0,index:-1},]
_itemHolders[0].el.style.display=_itemHolders[2].el.style.display='none'
_setupTransforms()
_globalEventHandlers={resize:self.updateSize,scroll:_onPageScroll,keydown:_onKeyDown,click:_onGlobalClick,}
var oldPhone=_features.isOldIOSPhone||_features.isOldAndroid||_features.isMobileOpera
if(!_features.animationName||!_features.transform||oldPhone){_options.showAnimationDuration=_options.hideAnimationDuration=0}
for(i=0;i<_modules.length;i++){self['init'+_modules[i]]()}
if(UiClass){var ui=(self.ui=new UiClass(self,framework))
ui.init()}
_shout('firstUpdate')
_currentItemIndex=_currentItemIndex||_options.index||0
if(isNaN(_currentItemIndex)||_currentItemIndex<0||_currentItemIndex>=_getNumItems()){_currentItemIndex=0}
self.currItem=_getItemAt(_currentItemIndex)
if(_features.isOldIOSPhone||_features.isOldAndroid){_isFixedPosition=false}
if(_options.modal){template.setAttribute('aria-hidden','false')
if(!_isFixedPosition){template.style.position='absolute'
template.style.top=framework.getScrollY()+'px'}else{template.style.position='fixed'}}
if(_currentWindowScrollY===undefined){_shout('initialLayout')
_currentWindowScrollY=_initalWindowScrollY=framework.getScrollY()}
var rootClasses='pswp--open '
if(_options.mainClass){rootClasses+=_options.mainClass+' '}
if(_options.showHideOpacity){rootClasses+='pswp--animate_opacity '}
rootClasses+=_likelyTouchDevice?'pswp--touch':'pswp--notouch'
rootClasses+=_features.animationName?' pswp--css_animation':''
rootClasses+=_features.svg?' pswp--svg':''
framework.addClass(template,rootClasses)
self.updateSize()
_containerShiftIndex=-1
_indexDiff=null
for(i=0;i<NUM_HOLDERS;i++){_setTranslateX((i+_containerShiftIndex)*_slideSize.x,_itemHolders[i].el.style)}
if(!_oldIE){framework.bind(self.scrollWrap,_downEvents,self)}
_listen('initialZoomInEnd',function(){self.setContent(_itemHolders[0],_currentItemIndex-1)
self.setContent(_itemHolders[2],_currentItemIndex+1)
_itemHolders[0].el.style.display=_itemHolders[2].el.style.display='block'
if(_options.focus){template.focus()}
_bindEvents()})
self.setContent(_itemHolders[1],_currentItemIndex)
self.updateCurrItem()
_shout('afterInit')
if(!_isFixedPosition){_updateSizeInterval=setInterval(function(){if(!_numAnimations&&!_isDragging&&!_isZooming&&_currZoomLevel===self.currItem.initialZoomLevel){self.updateSize()}},1000)}
framework.addClass(template,'pswp--visible')},close:function(){if(!_isOpen){return}
_isOpen=false
_isDestroying=true
_shout('close')
_unbindEvents()
_showOrHide(self.currItem,null,true,self.destroy)},destroy:function(){_shout('destroy')
if(_showOrHideTimeout){clearTimeout(_showOrHideTimeout)}
if(_options.modal){template.setAttribute('aria-hidden','true')
template.className=_initalClassName}
if(_updateSizeInterval){clearInterval(_updateSizeInterval)}
framework.unbind(self.scrollWrap,_downEvents,self)
framework.unbind(window,'scroll',self)
_stopDragUpdateLoop()
_stopAllAnimations()
_listeners=null},panTo:function(x,y,force){if(!force){if(x>_currPanBounds.min.x){x=_currPanBounds.min.x}else if(x<_currPanBounds.max.x){x=_currPanBounds.max.x}
if(y>_currPanBounds.min.y){y=_currPanBounds.min.y}else if(y<_currPanBounds.max.y){y=_currPanBounds.max.y}}
_panOffset.x=x
_panOffset.y=y
_applyCurrentZoomPan()},handleEvent:function(e){e=e||window.event
if(_globalEventHandlers[e.type]){_globalEventHandlers[e.type](e)}},goTo:function(index){index=_getLoopedId(index)
var diff=index-_currentItemIndex
_indexDiff=diff
_currentItemIndex=index
self.currItem=_getItemAt(_currentItemIndex)
_currPositionIndex-=diff
_moveMainScroll(_slideSize.x*_currPositionIndex)
_stopAllAnimations()
_mainScrollAnimating=false
self.updateCurrItem()},next:function(){self.goTo(_currentItemIndex+1)},prev:function(){self.goTo(_currentItemIndex-1)},updateCurrZoomItem:function(emulateSetContent){if(emulateSetContent){_shout('beforeChange',0)}
if(_itemHolders[1].el.children.length){var zoomElement=_itemHolders[1].el.children[0]
if(framework.hasClass(zoomElement,'pswp__zoom-wrap')){_currZoomElementStyle=zoomElement.style}else{_currZoomElementStyle=null}}else{_currZoomElementStyle=null}
_currPanBounds=self.currItem.bounds
_startZoomLevel=_currZoomLevel=self.currItem.initialZoomLevel
_panOffset.x=_currPanBounds.center.x
_panOffset.y=_currPanBounds.center.y
if(emulateSetContent){_shout('afterChange')}},invalidateCurrItems:function(){_itemsNeedUpdate=true
for(var i=0;i<NUM_HOLDERS;i++){if(_itemHolders[i].item){_itemHolders[i].item.needsUpdate=true}}},updateCurrItem:function(beforeAnimation){if(_indexDiff===0){return}
var diffAbs=Math.abs(_indexDiff),tempHolder
if(beforeAnimation&&diffAbs<2){return}
self.currItem=_getItemAt(_currentItemIndex)
_shout('beforeChange',_indexDiff)
if(diffAbs>=NUM_HOLDERS){_containerShiftIndex+=_indexDiff+(_indexDiff>0?-NUM_HOLDERS:NUM_HOLDERS)
diffAbs=NUM_HOLDERS}
for(var i=0;i<diffAbs;i++){if(_indexDiff>0){tempHolder=_itemHolders.shift()
_itemHolders[NUM_HOLDERS-1]=tempHolder
_containerShiftIndex++
_setTranslateX((_containerShiftIndex+2)*_slideSize.x,tempHolder.el.style)
self.setContent(tempHolder,_currentItemIndex-diffAbs+i+1+1)}else{tempHolder=_itemHolders.pop()
_itemHolders.unshift(tempHolder)
_containerShiftIndex--
_setTranslateX(_containerShiftIndex*_slideSize.x,tempHolder.el.style)
self.setContent(tempHolder,_currentItemIndex+diffAbs-i-1-1)}}
if(_currZoomElementStyle&&Math.abs(_indexDiff)===1){var prevItem=_getItemAt(_prevItemIndex)
if(prevItem.initialZoomLevel!==_currZoomLevel){_calculateItemSize(prevItem,_viewportSize)
_applyZoomPanToItem(prevItem)}}
_indexDiff=0
self.updateCurrZoomItem()
_prevItemIndex=_currentItemIndex
_shout('afterChange')},updateSize:function(force){if(!_isFixedPosition){var windowScrollY=framework.getScrollY()
if(_currentWindowScrollY!==windowScrollY){template.style.top=windowScrollY+'px'
_currentWindowScrollY=windowScrollY}
if(!force&&_windowVisibleSize.x===window.innerWidth&&_windowVisibleSize.y===window.innerHeight){return}
_windowVisibleSize.x=window.innerWidth
_windowVisibleSize.y=window.innerHeight
template.style.height=_windowVisibleSize.y+'px'}
_viewportSize.x=self.scrollWrap.clientWidth
_viewportSize.y=self.scrollWrap.clientHeight
_offset={x:0,y:_currentWindowScrollY}
_slideSize.x=_viewportSize.x+Math.round(_viewportSize.x*_options.spacing)
_slideSize.y=_viewportSize.y
_moveMainScroll(_slideSize.x*_currPositionIndex)
_shout('beforeResize')
if(_containerShiftIndex!==undefined){var holder,item,hIndex
for(var i=0;i<NUM_HOLDERS;i++){holder=_itemHolders[i]
_setTranslateX((i+_containerShiftIndex)*_slideSize.x,holder.el.style)
hIndex=_currentItemIndex+i-1
if(_options.loop&&_getNumItems()>2){hIndex=_getLoopedId(hIndex)}
item=_getItemAt(hIndex)
if(item&&(_itemsNeedUpdate||item.needsUpdate||!item.bounds)){self.cleanSlide(item)
self.setContent(holder,hIndex)
if(i===1){self.currItem=item
self.updateCurrZoomItem(true)}
item.needsUpdate=false}else if(holder.index===-1&&hIndex>=0){self.setContent(holder,hIndex)}
if(item&&item.container){_calculateItemSize(item,_viewportSize)
_applyZoomPanToItem(item)}}
_itemsNeedUpdate=false}
_startZoomLevel=_currZoomLevel=self.currItem.initialZoomLevel
_currPanBounds=self.currItem.bounds
if(_currPanBounds){_panOffset.x=_currPanBounds.center.x
_panOffset.y=_currPanBounds.center.y
_applyCurrentZoomPan()}
_shout('resize')},zoomTo:function(destZoomLevel,centerPoint,speed,easingFn,updateFn){if(centerPoint){_startZoomLevel=_currZoomLevel
_midZoomPoint.x=Math.abs(centerPoint.x)-_panOffset.x
_midZoomPoint.y=Math.abs(centerPoint.y)-_panOffset.y
_equalizePoints(_startPanOffset,_panOffset)}
var destPanBounds=_calculatePanBounds(destZoomLevel,false),destPanOffset={}
_modifyDestPanOffset('x',destPanBounds,destPanOffset,destZoomLevel)
_modifyDestPanOffset('y',destPanBounds,destPanOffset,destZoomLevel)
var initialZoomLevel=_currZoomLevel
var initialPanOffset={x:_panOffset.x,y:_panOffset.y,}
_roundPoint(destPanOffset)
var onUpdate=function(now){if(now===1){_currZoomLevel=destZoomLevel
_panOffset.x=destPanOffset.x
_panOffset.y=destPanOffset.y}else{_currZoomLevel=(destZoomLevel-initialZoomLevel)*now+initialZoomLevel
_panOffset.x=(destPanOffset.x-initialPanOffset.x)*now+initialPanOffset.x
_panOffset.y=(destPanOffset.y-initialPanOffset.y)*now+initialPanOffset.y}
if(updateFn){updateFn(now)}
_applyCurrentZoomPan()}
if(speed){_animateProp('customZoomTo',0,1,speed,easingFn||framework.easing.sine.inOut,onUpdate)}else{onUpdate(1)}},}
var MIN_SWIPE_DISTANCE=30,DIRECTION_CHECK_OFFSET=10
var _gestureStartTime,_gestureCheckSpeedTime,p={},p2={},delta={},_currPoint={},_startPoint={},_currPointers=[],_startMainScrollPos={},_releaseAnimData,_posPoints=[],_tempPoint={},_isZoomingIn,_verticalDragInitiated,_oldAndroidTouchEndTimeout,_currZoomedItemIndex=0,_centerPoint=_getEmptyPoint(),_lastReleaseTime=0,_isDragging,_isMultitouch,_zoomStarted,_moved,_dragAnimFrame,_mainScrollShifted,_currentPoints,_isZooming,_currPointsDistance,_startPointsDistance,_currPanBounds,_mainScrollPos=_getEmptyPoint(),_currZoomElementStyle,_mainScrollAnimating,_midZoomPoint=_getEmptyPoint(),_currCenterPoint=_getEmptyPoint(),_direction,_isFirstMove,_opacityChanged,_bgOpacity,_wasOverInitialZoom,_isEqualPoints=function(p1,p2){return p1.x===p2.x&&p1.y===p2.y},_isNearbyPoints=function(touch0,touch1){return(Math.abs(touch0.x-touch1.x)<DOUBLE_TAP_RADIUS&&Math.abs(touch0.y-touch1.y)<DOUBLE_TAP_RADIUS)},_calculatePointsDistance=function(p1,p2){_tempPoint.x=Math.abs(p1.x-p2.x)
_tempPoint.y=Math.abs(p1.y-p2.y)
return Math.sqrt(_tempPoint.x*_tempPoint.x+_tempPoint.y*_tempPoint.y)},_stopDragUpdateLoop=function(){if(_dragAnimFrame){_cancelAF(_dragAnimFrame)
_dragAnimFrame=null}},_dragUpdateLoop=function(){if(_isDragging){_dragAnimFrame=_requestAF(_dragUpdateLoop)
_renderMovement()}},_canPan=function(){return!(_options.scaleMode==='fit'&&_currZoomLevel===self.currItem.initialZoomLevel)},_closestElement=function(el,fn){if(!el){return false}
if(el.className&&el.className.indexOf('pswp__scroll-wrap')>-1){return false}
if(fn(el)){return el}
return _closestElement(el.parentNode,fn)},_preventObj={},_preventDefaultEventBehaviour=function(e,isDown){_preventObj.prevent=!_closestElement(e.target,_options.isClickableElement)
_shout('preventDragEvent',e,isDown,_preventObj)
return _preventObj.prevent},_convertTouchToPoint=function(touch,p){p.x=touch.pageX
p.y=touch.pageY
p.id=touch.identifier
return p},_findCenterOfPoints=function(p1,p2,pCenter){pCenter.x=(p1.x+p2.x)*0.5
pCenter.y=(p1.y+p2.y)*0.5},_pushPosPoint=function(time,x,y){if(time-_gestureCheckSpeedTime>50){var o=_posPoints.length>2?_posPoints.shift():{}
o.x=x
o.y=y
_posPoints.push(o)
_gestureCheckSpeedTime=time}},_calculateVerticalDragOpacityRatio=function(){var yOffset=_panOffset.y-self.currItem.initialPosition.y
return 1-Math.abs(yOffset/(_viewportSize.y/2))},_ePoint1={},_ePoint2={},_tempPointsArr=[],_tempCounter,_getTouchPoints=function(e){while(_tempPointsArr.length>0){_tempPointsArr.pop()}
if(!_pointerEventEnabled){if(e.type.indexOf('touch')>-1){if(e.touches&&e.touches.length>0){_tempPointsArr[0]=_convertTouchToPoint(e.touches[0],_ePoint1)
if(e.touches.length>1){_tempPointsArr[1]=_convertTouchToPoint(e.touches[1],_ePoint2)}}}else{_ePoint1.x=e.pageX
_ePoint1.y=e.pageY
_ePoint1.id=''
_tempPointsArr[0]=_ePoint1}}else{_tempCounter=0
_currPointers.forEach(function(p){if(_tempCounter===0){_tempPointsArr[0]=p}else if(_tempCounter===1){_tempPointsArr[1]=p}
_tempCounter++})}
return _tempPointsArr},_panOrMoveMainScroll=function(axis,delta){var panFriction,overDiff=0,newOffset=_panOffset[axis]+delta[axis],startOverDiff,dir=delta[axis]>0,newMainScrollPosition=_mainScrollPos.x+delta.x,mainScrollDiff=_mainScrollPos.x-_startMainScrollPos.x,newPanPos,newMainScrollPos
if(newOffset>_currPanBounds.min[axis]||newOffset<_currPanBounds.max[axis]){panFriction=_options.panEndFriction}else{panFriction=1}
newOffset=_panOffset[axis]+delta[axis]*panFriction
if(_options.allowPanToNext||_currZoomLevel===self.currItem.initialZoomLevel){if(!_currZoomElementStyle){newMainScrollPos=newMainScrollPosition}else if(_direction==='h'&&axis==='x'&&!_zoomStarted){if(dir){if(newOffset>_currPanBounds.min[axis]){panFriction=_options.panEndFriction
overDiff=_currPanBounds.min[axis]-newOffset
startOverDiff=_currPanBounds.min[axis]-_startPanOffset[axis]}
if((startOverDiff<=0||mainScrollDiff<0)&&_getNumItems()>1){newMainScrollPos=newMainScrollPosition
if(mainScrollDiff<0&&newMainScrollPosition>_startMainScrollPos.x){newMainScrollPos=_startMainScrollPos.x}}else{if(_currPanBounds.min.x!==_currPanBounds.max.x){newPanPos=newOffset}}}else{if(newOffset<_currPanBounds.max[axis]){panFriction=_options.panEndFriction
overDiff=newOffset-_currPanBounds.max[axis]
startOverDiff=_startPanOffset[axis]-_currPanBounds.max[axis]}
if((startOverDiff<=0||mainScrollDiff>0)&&_getNumItems()>1){newMainScrollPos=newMainScrollPosition
if(mainScrollDiff>0&&newMainScrollPosition<_startMainScrollPos.x){newMainScrollPos=_startMainScrollPos.x}}else{if(_currPanBounds.min.x!==_currPanBounds.max.x){newPanPos=newOffset}}}}
if(axis==='x'){if(newMainScrollPos!==undefined){_moveMainScroll(newMainScrollPos,true)
if(newMainScrollPos===_startMainScrollPos.x){_mainScrollShifted=false}else{_mainScrollShifted=true}}
if(_currPanBounds.min.x!==_currPanBounds.max.x){if(newPanPos!==undefined){_panOffset.x=newPanPos}else if(!_mainScrollShifted){_panOffset.x+=delta.x*panFriction}}
return newMainScrollPos!==undefined}}
if(!_mainScrollAnimating){if(!_mainScrollShifted){if(_currZoomLevel>self.currItem.fitRatio){_panOffset[axis]+=delta[axis]*panFriction}}}},_onDragStart=function(e){if(e.type==='mousedown'&&e.button>0){return}
if(_initialZoomRunning){e.preventDefault()
return}
if(_oldAndroidTouchEndTimeout&&e.type==='mousedown'){return}
if(_preventDefaultEventBehaviour(e,true)){e.preventDefault()}
_shout('pointerDown')
if(_pointerEventEnabled){var pointerIndex=framework.arraySearch(_currPointers,e.pointerId,'id')
if(pointerIndex<0){pointerIndex=_currPointers.length}
_currPointers[pointerIndex]={x:e.pageX,y:e.pageY,id:e.pointerId}}
var startPointsList=_getTouchPoints(e),numPoints=startPointsList.length
_currentPoints=null
_stopAllAnimations()
if(!_isDragging||numPoints===1){_isDragging=_isFirstMove=true
framework.bind(window,_upMoveEvents,self)
_isZoomingIn=_wasOverInitialZoom=_opacityChanged=_verticalDragInitiated=_mainScrollShifted=_moved=_isMultitouch=_zoomStarted=false
_direction=null
_shout('firstTouchStart',startPointsList)
_equalizePoints(_startPanOffset,_panOffset)
_currPanDist.x=_currPanDist.y=0
_equalizePoints(_currPoint,startPointsList[0])
_equalizePoints(_startPoint,_currPoint)
_startMainScrollPos.x=_slideSize.x*_currPositionIndex
_posPoints=[{x:_currPoint.x,y:_currPoint.y,},]
_gestureCheckSpeedTime=_gestureStartTime=_getCurrentTime()
_calculatePanBounds(_currZoomLevel,true)
_stopDragUpdateLoop()
_dragUpdateLoop()}
if(!_isZooming&&numPoints>1&&!_mainScrollAnimating&&!_mainScrollShifted){_startZoomLevel=_currZoomLevel
_zoomStarted=false
_isZooming=_isMultitouch=true
_currPanDist.y=_currPanDist.x=0
_equalizePoints(_startPanOffset,_panOffset)
_equalizePoints(p,startPointsList[0])
_equalizePoints(p2,startPointsList[1])
_findCenterOfPoints(p,p2,_currCenterPoint)
_midZoomPoint.x=Math.abs(_currCenterPoint.x)-_panOffset.x
_midZoomPoint.y=Math.abs(_currCenterPoint.y)-_panOffset.y
_currPointsDistance=_startPointsDistance=_calculatePointsDistance(p,p2)}},_onDragMove=function(e){e.preventDefault()
if(_pointerEventEnabled){var pointerIndex=framework.arraySearch(_currPointers,e.pointerId,'id')
if(pointerIndex>-1){var p=_currPointers[pointerIndex]
p.x=e.pageX
p.y=e.pageY}}
if(_isDragging){var touchesList=_getTouchPoints(e)
if(!_direction&&!_moved&&!_isZooming){var diff=Math.abs(touchesList[0].x-_currPoint.x)-Math.abs(touchesList[0].y-_currPoint.y)
if(Math.abs(diff)>=DIRECTION_CHECK_OFFSET){_direction=diff>0?'h':'v'
_currentPoints=touchesList}}else{_currentPoints=touchesList}}},_renderMovement=function(){if(!_currentPoints){return}
var numPoints=_currentPoints.length
if(numPoints===0){return}
_equalizePoints(p,_currentPoints[0])
delta.x=p.x-_currPoint.x
delta.y=p.y-_currPoint.y
if(_isZooming&&numPoints>1){_currPoint.x=p.x
_currPoint.y=p.y
if(!delta.x&&!delta.y&&_isEqualPoints(_currentPoints[1],p2)){return}
_equalizePoints(p2,_currentPoints[1])
if(!_zoomStarted){_zoomStarted=true
_shout('zoomGestureStarted')}
var pointsDistance=_calculatePointsDistance(p,p2)
var zoomLevel=_calculateZoomLevel(pointsDistance)
if(zoomLevel>self.currItem.initialZoomLevel+self.currItem.initialZoomLevel/15){_wasOverInitialZoom=true}
var zoomFriction=1,minZoomLevel=_getMinZoomLevel(),maxZoomLevel=_getMaxZoomLevel()
if(zoomLevel<minZoomLevel){if(_options.pinchToClose&&!_wasOverInitialZoom&&_startZoomLevel<=self.currItem.initialZoomLevel){var minusDiff=minZoomLevel-zoomLevel
var percent=1-minusDiff/(minZoomLevel/1.2)
_applyBgOpacity(percent)
_shout('onPinchClose',percent)
_opacityChanged=true}else{zoomFriction=(minZoomLevel-zoomLevel)/minZoomLevel
if(zoomFriction>1){zoomFriction=1}
zoomLevel=minZoomLevel-zoomFriction*(minZoomLevel/3)}}else if(zoomLevel>maxZoomLevel){zoomFriction=(zoomLevel-maxZoomLevel)/(minZoomLevel*6)
if(zoomFriction>1){zoomFriction=1}
zoomLevel=maxZoomLevel+zoomFriction*minZoomLevel}
if(zoomFriction<0){zoomFriction=0}
_currPointsDistance=pointsDistance
_findCenterOfPoints(p,p2,_centerPoint)
_currPanDist.x+=_centerPoint.x-_currCenterPoint.x
_currPanDist.y+=_centerPoint.y-_currCenterPoint.y
_equalizePoints(_currCenterPoint,_centerPoint)
_panOffset.x=_calculatePanOffset('x',zoomLevel)
_panOffset.y=_calculatePanOffset('y',zoomLevel)
_isZoomingIn=zoomLevel>_currZoomLevel
_currZoomLevel=zoomLevel
_applyCurrentZoomPan()}else{if(!_direction){return}
if(_isFirstMove){_isFirstMove=false
if(Math.abs(delta.x)>=DIRECTION_CHECK_OFFSET){delta.x-=_currentPoints[0].x-_startPoint.x}
if(Math.abs(delta.y)>=DIRECTION_CHECK_OFFSET){delta.y-=_currentPoints[0].y-_startPoint.y}}
_currPoint.x=p.x
_currPoint.y=p.y
if(delta.x===0&&delta.y===0){return}
if(_direction==='v'&&_options.closeOnVerticalDrag){if(!_canPan()){_currPanDist.y+=delta.y
_panOffset.y+=delta.y
var opacityRatio=_calculateVerticalDragOpacityRatio()
_verticalDragInitiated=true
_shout('onVerticalDrag',opacityRatio)
_applyBgOpacity(opacityRatio)
_applyCurrentZoomPan()
return}}
_pushPosPoint(_getCurrentTime(),p.x,p.y)
_moved=true
_currPanBounds=self.currItem.bounds
var mainScrollChanged=_panOrMoveMainScroll('x',delta)
if(!mainScrollChanged){_panOrMoveMainScroll('y',delta)
_roundPoint(_panOffset)
_applyCurrentZoomPan()}}},_onDragRelease=function(e){if(_features.isOldAndroid){if(_oldAndroidTouchEndTimeout&&e.type==='mouseup'){return}
if(e.type.indexOf('touch')>-1){clearTimeout(_oldAndroidTouchEndTimeout)
_oldAndroidTouchEndTimeout=setTimeout(function(){_oldAndroidTouchEndTimeout=0},600)}}
_shout('pointerUp')
if(_preventDefaultEventBehaviour(e,false)){e.preventDefault()}
var releasePoint
if(_pointerEventEnabled){var pointerIndex=framework.arraySearch(_currPointers,e.pointerId,'id')
if(pointerIndex>-1){releasePoint=_currPointers.splice(pointerIndex,1)[0]
if(navigator.pointerEnabled){releasePoint.type=e.pointerType||'mouse'}else{var MSPOINTER_TYPES={4:'mouse',2:'touch',3:'pen',}
releasePoint.type=MSPOINTER_TYPES[e.pointerType]
if(!releasePoint.type){releasePoint.type=e.pointerType||'mouse'}}}}
var touchList=_getTouchPoints(e),gestureType,numPoints=touchList.length
if(e.type==='mouseup'){numPoints=0}
if(numPoints===2){_currentPoints=null
return true}
if(numPoints===1){_equalizePoints(_startPoint,touchList[0])}
if(numPoints===0&&!_direction&&!_mainScrollAnimating){if(!releasePoint){if(e.type==='mouseup'){releasePoint={x:e.pageX,y:e.pageY,type:'mouse'}}else if(e.changedTouches&&e.changedTouches[0]){releasePoint={x:e.changedTouches[0].pageX,y:e.changedTouches[0].pageY,type:'touch',}}}
_shout('touchRelease',e,releasePoint)}
var releaseTimeDiff=-1
if(numPoints===0){_isDragging=false
framework.unbind(window,_upMoveEvents,self)
_stopDragUpdateLoop()
if(_isZooming){releaseTimeDiff=0}else if(_lastReleaseTime!==-1){releaseTimeDiff=_getCurrentTime()-_lastReleaseTime}}
_lastReleaseTime=numPoints===1?_getCurrentTime():-1
if(releaseTimeDiff!==-1&&releaseTimeDiff<150){gestureType='zoom'}else{gestureType='swipe'}
if(_isZooming&&numPoints<2){_isZooming=false
if(numPoints===1){gestureType='zoomPointerUp'}
_shout('zoomGestureEnded')}
_currentPoints=null
if(!_moved&&!_zoomStarted&&!_mainScrollAnimating&&!_verticalDragInitiated){return}
_stopAllAnimations()
if(!_releaseAnimData){_releaseAnimData=_initDragReleaseAnimationData()}
_releaseAnimData.calculateSwipeSpeed('x')
if(_verticalDragInitiated){var opacityRatio=_calculateVerticalDragOpacityRatio()
if(opacityRatio<0.6){self.close()}else{var initalPanY=_panOffset.y,initialBgOpacity=_bgOpacity
_animateProp('verticalDrag',0,1,300,framework.easing.cubic.out,function(now){_panOffset.y=(self.currItem.initialPosition.y-initalPanY)*now+initalPanY
_applyBgOpacity((1-initialBgOpacity)*now+initialBgOpacity)
_applyCurrentZoomPan()})
_shout('onVerticalDrag',1)}
return}
if((_mainScrollShifted||_mainScrollAnimating)&&numPoints===0){var itemChanged=_finishSwipeMainScrollGesture(gestureType,_releaseAnimData)
if(itemChanged){return}
gestureType='zoomPointerUp'}
if(_mainScrollAnimating){return}
if(gestureType!=='swipe'){_completeZoomGesture()
return}
if(!_mainScrollShifted&&_currZoomLevel>self.currItem.fitRatio){_completePanGesture(_releaseAnimData)}},_initDragReleaseAnimationData=function(){var lastFlickDuration,tempReleasePos
var s={lastFlickOffset:{},lastFlickDist:{},lastFlickSpeed:{},slowDownRatio:{},slowDownRatioReverse:{},speedDecelerationRatio:{},speedDecelerationRatioAbs:{},distanceOffset:{},backAnimDestination:{},backAnimStarted:{},calculateSwipeSpeed:function(axis){if(_posPoints.length>1){lastFlickDuration=_getCurrentTime()-_gestureCheckSpeedTime+50
tempReleasePos=_posPoints[_posPoints.length-2][axis]}else{lastFlickDuration=_getCurrentTime()-_gestureStartTime
tempReleasePos=_startPoint[axis]}
s.lastFlickOffset[axis]=_currPoint[axis]-tempReleasePos
s.lastFlickDist[axis]=Math.abs(s.lastFlickOffset[axis])
if(s.lastFlickDist[axis]>20){s.lastFlickSpeed[axis]=s.lastFlickOffset[axis]/lastFlickDuration}else{s.lastFlickSpeed[axis]=0}
if(Math.abs(s.lastFlickSpeed[axis])<0.1){s.lastFlickSpeed[axis]=0}
s.slowDownRatio[axis]=0.95
s.slowDownRatioReverse[axis]=1-s.slowDownRatio[axis]
s.speedDecelerationRatio[axis]=1},calculateOverBoundsAnimOffset:function(axis,speed){if(!s.backAnimStarted[axis]){if(_panOffset[axis]>_currPanBounds.min[axis]){s.backAnimDestination[axis]=_currPanBounds.min[axis]}else if(_panOffset[axis]<_currPanBounds.max[axis]){s.backAnimDestination[axis]=_currPanBounds.max[axis]}
if(s.backAnimDestination[axis]!==undefined){s.slowDownRatio[axis]=0.7
s.slowDownRatioReverse[axis]=1-s.slowDownRatio[axis]
if(s.speedDecelerationRatioAbs[axis]<0.05){s.lastFlickSpeed[axis]=0
s.backAnimStarted[axis]=true
_animateProp('bounceZoomPan'+axis,_panOffset[axis],s.backAnimDestination[axis],speed||300,framework.easing.sine.out,function(pos){_panOffset[axis]=pos
_applyCurrentZoomPan()})}}}},calculateAnimOffset:function(axis){if(!s.backAnimStarted[axis]){s.speedDecelerationRatio[axis]=s.speedDecelerationRatio[axis]*(s.slowDownRatio[axis]+
s.slowDownRatioReverse[axis]-
(s.slowDownRatioReverse[axis]*s.timeDiff)/10)
s.speedDecelerationRatioAbs[axis]=Math.abs(s.lastFlickSpeed[axis]*s.speedDecelerationRatio[axis])
s.distanceOffset[axis]=s.lastFlickSpeed[axis]*s.speedDecelerationRatio[axis]*s.timeDiff
_panOffset[axis]+=s.distanceOffset[axis]}},panAnimLoop:function(){if(_animations.zoomPan){_animations.zoomPan.raf=_requestAF(s.panAnimLoop)
s.now=_getCurrentTime()
s.timeDiff=s.now-s.lastNow
s.lastNow=s.now
s.calculateAnimOffset('x')
s.calculateAnimOffset('y')
_applyCurrentZoomPan()
s.calculateOverBoundsAnimOffset('x')
s.calculateOverBoundsAnimOffset('y')
if(s.speedDecelerationRatioAbs.x<0.05&&s.speedDecelerationRatioAbs.y<0.05){_panOffset.x=Math.round(_panOffset.x)
_panOffset.y=Math.round(_panOffset.y)
_applyCurrentZoomPan()
_stopAnimation('zoomPan')
return}}},}
return s},_completePanGesture=function(animData){animData.calculateSwipeSpeed('y')
_currPanBounds=self.currItem.bounds
animData.backAnimDestination={}
animData.backAnimStarted={}
if(Math.abs(animData.lastFlickSpeed.x)<=0.05&&Math.abs(animData.lastFlickSpeed.y)<=0.05){animData.speedDecelerationRatioAbs.x=animData.speedDecelerationRatioAbs.y=0
animData.calculateOverBoundsAnimOffset('x')
animData.calculateOverBoundsAnimOffset('y')
return true}
_registerStartAnimation('zoomPan')
animData.lastNow=_getCurrentTime()
animData.panAnimLoop()},_finishSwipeMainScrollGesture=function(gestureType,_releaseAnimData){var itemChanged
if(!_mainScrollAnimating){_currZoomedItemIndex=_currentItemIndex}
var itemsDiff
if(gestureType==='swipe'){var totalShiftDist=_currPoint.x-_startPoint.x,isFastLastFlick=_releaseAnimData.lastFlickDist.x<10
if(totalShiftDist>MIN_SWIPE_DISTANCE&&(isFastLastFlick||_releaseAnimData.lastFlickOffset.x>20)){itemsDiff=-1}else if(totalShiftDist<-MIN_SWIPE_DISTANCE&&(isFastLastFlick||_releaseAnimData.lastFlickOffset.x<-20)){itemsDiff=1}}
var nextCircle
if(itemsDiff){_currentItemIndex+=itemsDiff
if(_currentItemIndex<0){_currentItemIndex=_options.loop?_getNumItems()-1:0
nextCircle=true}else if(_currentItemIndex>=_getNumItems()){_currentItemIndex=_options.loop?0:_getNumItems()-1
nextCircle=true}
if(!nextCircle||_options.loop){_indexDiff+=itemsDiff
_currPositionIndex-=itemsDiff
itemChanged=true}}
var animateToX=_slideSize.x*_currPositionIndex
var animateToDist=Math.abs(animateToX-_mainScrollPos.x)
var finishAnimDuration
if(!itemChanged&&animateToX>_mainScrollPos.x!==_releaseAnimData.lastFlickSpeed.x>0){finishAnimDuration=333}else{finishAnimDuration=Math.abs(_releaseAnimData.lastFlickSpeed.x)>0?animateToDist/Math.abs(_releaseAnimData.lastFlickSpeed.x):333
finishAnimDuration=Math.min(finishAnimDuration,400)
finishAnimDuration=Math.max(finishAnimDuration,250)}
if(_currZoomedItemIndex===_currentItemIndex){itemChanged=false}
_mainScrollAnimating=true
_shout('mainScrollAnimStart')
_animateProp('mainScroll',_mainScrollPos.x,animateToX,finishAnimDuration,framework.easing.cubic.out,_moveMainScroll,function(){_stopAllAnimations()
_mainScrollAnimating=false
_currZoomedItemIndex=-1
if(itemChanged||_currZoomedItemIndex!==_currentItemIndex){self.updateCurrItem()}
_shout('mainScrollAnimComplete')})
if(itemChanged){self.updateCurrItem(true)}
return itemChanged},_calculateZoomLevel=function(touchesDistance){return(1/_startPointsDistance)*touchesDistance*_startZoomLevel},_completeZoomGesture=function(){var destZoomLevel=_currZoomLevel,minZoomLevel=_getMinZoomLevel(),maxZoomLevel=_getMaxZoomLevel()
if(_currZoomLevel<minZoomLevel){destZoomLevel=minZoomLevel}else if(_currZoomLevel>maxZoomLevel){destZoomLevel=maxZoomLevel}
var destOpacity=1,onUpdate,initialOpacity=_bgOpacity
if(_opacityChanged&&!_isZoomingIn&&!_wasOverInitialZoom&&_currZoomLevel<minZoomLevel){self.close()
return true}
if(_opacityChanged){onUpdate=function(now){_applyBgOpacity((destOpacity-initialOpacity)*now+initialOpacity)}}
self.zoomTo(destZoomLevel,0,300,framework.easing.cubic.out,onUpdate)
return true}
_registerModule('Gestures',{publicMethods:{initGestures:function(){var addEventNames=function(pref,down,move,up,cancel){_dragStartEvent=pref+down
_dragMoveEvent=pref+move
_dragEndEvent=pref+up
if(cancel){_dragCancelEvent=pref+cancel}else{_dragCancelEvent=''}}
_pointerEventEnabled=_features.pointerEvent
if(_pointerEventEnabled&&_features.touch){_features.touch=false}
if(_pointerEventEnabled){if(navigator.pointerEnabled){addEventNames('pointer','down','move','up','cancel')}else{addEventNames('MSPointer','Down','Move','Up','Cancel')}}else if(_features.touch){addEventNames('touch','start','move','end','cancel')
_likelyTouchDevice=true}else{addEventNames('mouse','down','move','up')}
_upMoveEvents=_dragMoveEvent+' '+_dragEndEvent+' '+_dragCancelEvent
_downEvents=_dragStartEvent
if(_pointerEventEnabled&&!_likelyTouchDevice){_likelyTouchDevice=navigator.maxTouchPoints>1||navigator.msMaxTouchPoints>1}
self.likelyTouchDevice=_likelyTouchDevice
_globalEventHandlers[_dragStartEvent]=_onDragStart
_globalEventHandlers[_dragMoveEvent]=_onDragMove
_globalEventHandlers[_dragEndEvent]=_onDragRelease
if(_dragCancelEvent){_globalEventHandlers[_dragCancelEvent]=_globalEventHandlers[_dragEndEvent]}
if(_features.touch){_downEvents+=' mousedown'
_upMoveEvents+=' mousemove mouseup'
_globalEventHandlers.mousedown=_globalEventHandlers[_dragStartEvent]
_globalEventHandlers.mousemove=_globalEventHandlers[_dragMoveEvent]
_globalEventHandlers.mouseup=_globalEventHandlers[_dragEndEvent]}
if(!_likelyTouchDevice){_options.allowPanToNext=false}},},})
var _showOrHideTimeout,_showOrHide=function(item,img,out,completeFn){if(_showOrHideTimeout){clearTimeout(_showOrHideTimeout)}
_initialZoomRunning=true
_initialContentSet=true
var thumbBounds
if(item.initialLayout){thumbBounds=item.initialLayout
item.initialLayout=null}else{thumbBounds=_options.getThumbBoundsFn&&_options.getThumbBoundsFn(_currentItemIndex)}
var duration=out?_options.hideAnimationDuration:_options.showAnimationDuration
var onComplete=function(){_stopAnimation('initialZoom')
if(!out){_applyBgOpacity(1)
if(img){img.style.display='block'}
framework.addClass(template,'pswp--animated-in')
_shout('initialZoom'+(out?'OutEnd':'InEnd'))}else{self.template.removeAttribute('style')
self.bg.removeAttribute('style')}
if(completeFn){completeFn()}
_initialZoomRunning=false}
if(!duration||!thumbBounds||thumbBounds.x===undefined){var finishWithoutAnimation=function(){_shout('initialZoom'+(out?'Out':'In'))
_currZoomLevel=item.initialZoomLevel
_equalizePoints(_panOffset,item.initialPosition)
_applyCurrentZoomPan()
template.style.opacity=out?0:1
_applyBgOpacity(1)
onComplete()}
finishWithoutAnimation()
return}
var startAnimation=function(){var closeWithRaf=_closedByScroll,fadeEverything=!self.currItem.src||self.currItem.loadError||_options.showHideOpacity
if(item.miniImg){item.miniImg.style.webkitBackfaceVisibility='hidden'}
if(!out){_currZoomLevel=thumbBounds.w/item.w
_panOffset.x=thumbBounds.x
_panOffset.y=thumbBounds.y-_initalWindowScrollY
self[fadeEverything?'template':'bg'].style.opacity=0.001
_applyCurrentZoomPan()}
_registerStartAnimation('initialZoom')
if(out&&!closeWithRaf){framework.removeClass(template,'pswp--animated-in')}
if(fadeEverything){if(out){framework[(closeWithRaf?'remove':'add')+'Class'](template,'pswp--animate_opacity')}else{setTimeout(function(){framework.addClass(template,'pswp--animate_opacity')},30)}}
_showOrHideTimeout=setTimeout(function(){_shout('initialZoom'+(out?'Out':'In'))
if(!out){_currZoomLevel=item.initialZoomLevel
_equalizePoints(_panOffset,item.initialPosition)
_applyCurrentZoomPan()
_applyBgOpacity(1)
if(fadeEverything){template.style.opacity=1}else{_applyBgOpacity(1)}
_showOrHideTimeout=setTimeout(onComplete,duration+20)}else{var destZoomLevel=thumbBounds.w/item.w,initialPanOffset={x:_panOffset.x,y:_panOffset.y,},initialZoomLevel=_currZoomLevel,initalBgOpacity=_bgOpacity,onUpdate=function(now){if(now===1){_currZoomLevel=destZoomLevel
_panOffset.x=thumbBounds.x
_panOffset.y=thumbBounds.y-_currentWindowScrollY}else{_currZoomLevel=(destZoomLevel-initialZoomLevel)*now+initialZoomLevel
_panOffset.x=(thumbBounds.x-initialPanOffset.x)*now+initialPanOffset.x
_panOffset.y=(thumbBounds.y-_currentWindowScrollY-initialPanOffset.y)*now+
initialPanOffset.y}
_applyCurrentZoomPan()
if(fadeEverything){template.style.opacity=1-now}else{_applyBgOpacity(initalBgOpacity-now*initalBgOpacity)}}
if(closeWithRaf){_animateProp('initialZoom',0,1,duration,framework.easing.cubic.out,onUpdate,onComplete)}else{onUpdate(1)
_showOrHideTimeout=setTimeout(onComplete,duration+20)}}},out?25:90)}
startAnimation()}
var _items,_tempPanAreaSize={},_imagesToAppendPool=[],_initialContentSet,_initialZoomRunning,_controllerDefaultOptions={index:0,errorMsg:'<div class="pswp__error-msg"><a href="%url%" target="_blank">The image</a> could not be loaded.</div>',forceProgressiveLoading:false,preload:[1,1],getNumItemsFn:function(){return _items.length},}
var _getItemAt,_getNumItems,_initialIsLoop,_getZeroBounds=function(){return{center:{x:0,y:0},max:{x:0,y:0},min:{x:0,y:0},}},_calculateSingleItemPanBounds=function(item,realPanElementW,realPanElementH){var bounds=item.bounds
bounds.center.x=Math.round((_tempPanAreaSize.x-realPanElementW)/2)
bounds.center.y=Math.round((_tempPanAreaSize.y-realPanElementH)/2)+item.vGap.top
bounds.max.x=realPanElementW>_tempPanAreaSize.x?Math.round(_tempPanAreaSize.x-realPanElementW):bounds.center.x
bounds.max.y=realPanElementH>_tempPanAreaSize.y?Math.round(_tempPanAreaSize.y-realPanElementH)+item.vGap.top:bounds.center.y
bounds.min.x=realPanElementW>_tempPanAreaSize.x?0:bounds.center.x
bounds.min.y=realPanElementH>_tempPanAreaSize.y?item.vGap.top:bounds.center.y},_calculateItemSize=function(item,viewportSize,zoomLevel){if(item.src&&!item.loadError){var isInitial=!zoomLevel
if(isInitial){if(!item.vGap){item.vGap={top:0,bottom:0}}
_shout('parseVerticalMargin',item)}
_tempPanAreaSize.x=viewportSize.x
_tempPanAreaSize.y=viewportSize.y-item.vGap.top-item.vGap.bottom
if(isInitial){var hRatio=_tempPanAreaSize.x/item.w
var vRatio=_tempPanAreaSize.y/item.h
item.fitRatio=hRatio<vRatio?hRatio:vRatio
var scaleMode=_options.scaleMode
if(scaleMode==='orig'){zoomLevel=1}else if(scaleMode==='fit'){zoomLevel=item.fitRatio}
if(zoomLevel>1){zoomLevel=1}
item.initialZoomLevel=zoomLevel
if(!item.bounds){item.bounds=_getZeroBounds()}}
if(!zoomLevel){return}
_calculateSingleItemPanBounds(item,item.w*zoomLevel,item.h*zoomLevel)
if(isInitial&&zoomLevel===item.initialZoomLevel){item.initialPosition=item.bounds.center}
return item.bounds}else{item.w=item.h=0
item.initialZoomLevel=item.fitRatio=1
item.bounds=_getZeroBounds()
item.initialPosition=item.bounds.center
return item.bounds}
return false},_appendImage=function(index,item,baseDiv,img,preventAnimation,keepPlaceholder){if(item.loadError){return}
var animate,isSwiping=self.isDragging()&&!self.isZooming(),slideMightBeVisible=index===_currentItemIndex||self.isMainScrollAnimating()||isSwiping
if(!preventAnimation&&(_likelyTouchDevice||_options.alwaysFadeIn)&&slideMightBeVisible){animate=true}
if(img){if(animate){img.style.opacity=0}
item.imageAppended=true
_setImageSize(img,item.w,item.h)
baseDiv.appendChild(img)
if(animate){setTimeout(function(){img.style.opacity=1
if(keepPlaceholder){setTimeout(function(){if(item&&item.loaded&&item.placeholder){item.placeholder.style.display='none'
item.placeholder=null}},500)}},50)}}},_preloadImage=function(item){item.loading=true
item.loaded=false
var img=(item.img=framework.createEl('pswp__img','img'))
var onComplete=function(){item.loading=false
item.loaded=true
if(item.loadComplete){item.loadComplete(item)}else{item.img=null}
img.onload=img.onerror=null
img=null}
img.onload=onComplete
img.onerror=function(){item.loadError=true
onComplete()}
img.src=item.src
return img},_checkForError=function(item,cleanUp){if(item.src&&item.loadError&&item.container){if(cleanUp){item.container.innerHTML=''}
item.container.innerHTML=_options.errorMsg.replace('%url%',item.src)
return true}},_setImageSize=function(img,w,h){img.style.width=w+'px'
img.style.height=h+'px'},_appendImagesPool=function(){if(_imagesToAppendPool.length){var poolItem
for(var i=0;i<_imagesToAppendPool.length;i++){poolItem=_imagesToAppendPool[i]
if(poolItem.holder.index===poolItem.index){_appendImage(poolItem.index,poolItem.item,poolItem.baseDiv,poolItem.img)}}
_imagesToAppendPool=[]}}
_registerModule('Controller',{publicMethods:{lazyLoadItem:function(index){index=_getLoopedId(index)
var item=_getItemAt(index)
if(!item||item.loaded||item.loading){return}
_shout('gettingData',index,item)
if(!item.src){return}
_preloadImage(item)},initController:function(){framework.extend(_options,_controllerDefaultOptions,true)
self.items=_items=items
_getItemAt=self.getItemAt
_getNumItems=_options.getNumItemsFn
_initialIsLoop=_options.loop
if(_getNumItems()<3){_options.loop=false}
_listen('beforeChange',function(diff){var p=_options.preload,isNext=diff===null?true:diff>0,preloadBefore=Math.min(p[0],_getNumItems()),preloadAfter=Math.min(p[1],_getNumItems()),i
for(i=1;i<=(isNext?preloadAfter:preloadBefore);i++){self.lazyLoadItem(_currentItemIndex+i)}
for(i=1;i<=(isNext?preloadBefore:preloadAfter);i++){self.lazyLoadItem(_currentItemIndex-i)}})
_listen('initialLayout',function(){self.currItem.initialLayout=_options.getThumbBoundsFn&&_options.getThumbBoundsFn(_currentItemIndex)})
_listen('mainScrollAnimComplete',_appendImagesPool)
_listen('initialZoomInEnd',_appendImagesPool)
_listen('destroy',function(){var item
for(var i=0;i<_items.length;i++){item=_items[i]
if(item.container){item.container=null}
if(item.placeholder){item.placeholder=null}
if(item.img){item.img=null}
if(item.preloader){item.preloader=null}
if(item.loadError){item.loaded=item.loadError=false}}
_imagesToAppendPool=null})},getItemAt:function(index){if(index>=0){return _items[index]!==undefined?_items[index]:false}
return false},allowProgressiveImg:function(){return(_options.forceProgressiveLoading||!_likelyTouchDevice||_options.mouseUsed||screen.width>1200)},setContent:function(holder,index){if(_options.loop){index=_getLoopedId(index)}
var prevItem=self.getItemAt(holder.index)
if(prevItem){prevItem.container=null}
var item=self.getItemAt(index),img
if(!item){holder.el.innerHTML=''
return}
_shout('gettingData',index,item)
holder.index=index
holder.item=item
var baseDiv=(item.container=framework.createEl('pswp__zoom-wrap'))
if(!item.src&&item.html){if(item.html.tagName){baseDiv.appendChild(item.html)}else{baseDiv.innerHTML=item.html}}
_checkForError(item)
if(item.src&&!item.loadError&&!item.loaded){item.loadComplete=function(item){if(!_isOpen){return}
if(item.img){item.img.style.webkitBackfaceVisibility='hidden'}
if(holder&&holder.index===index){if(_checkForError(item,true)){item.loadComplete=item.img=null
_calculateItemSize(item,_viewportSize)
_applyZoomPanToItem(item)
if(holder.index===_currentItemIndex){self.updateCurrZoomItem()}
return}
if(!item.imageAppended){if(_features.transform&&(_mainScrollAnimating||_initialZoomRunning)){_imagesToAppendPool.push({item:item,baseDiv:baseDiv,img:item.img,index:index,holder:holder,})}else{_appendImage(index,item,baseDiv,item.img,_mainScrollAnimating||_initialZoomRunning)}}else{if(!_initialZoomRunning&&item.placeholder){item.placeholder.style.display='none'
item.placeholder=null}}}
item.loadComplete=null
item.img=null
_shout('imageLoadComplete',index,item)}
if(framework.features.transform){var placeholderClassName='pswp__img pswp__img--placeholder'
placeholderClassName+=item.msrc?'':' pswp__img--placeholder--blank'
var placeholder=framework.createEl(placeholderClassName,item.msrc?'img':'')
if(item.msrc){placeholder.src=item.msrc}
_setImageSize(placeholder,item.w,item.h)
baseDiv.appendChild(placeholder)
item.placeholder=placeholder}
if(!item.loading){_preloadImage(item)}
if(self.allowProgressiveImg()){if(!_initialContentSet&&_features.transform){_imagesToAppendPool.push({item:item,baseDiv:baseDiv,img:item.img,index:index,holder:holder,})}else{_appendImage(index,item,baseDiv,item.img,true,true)}}}else if(item.src&&!item.loadError){img=framework.createEl('pswp__img','img')
img.style.webkitBackfaceVisibility='hidden'
img.style.opacity=1
img.src=item.src
_setImageSize(img,item.w,item.h)
_appendImage(index,item,baseDiv,img,true)}
_calculateItemSize(item,_viewportSize)
if(!_initialContentSet&&index===_currentItemIndex){_currZoomElementStyle=baseDiv.style
_showOrHide(item,img||item.img)}else{_applyZoomPanToItem(item)}
holder.el.innerHTML=''
holder.el.appendChild(baseDiv)},cleanSlide:function(item){if(item.img){item.img.onload=item.img.onerror=null}
item.loaded=item.loading=item.img=item.imageAppended=false},},})
var tapTimer,tapReleasePoint={},_dispatchTapEvent=function(origEvent,releasePoint,pointerType){var e=document.createEvent('CustomEvent'),eDetail={origEvent:origEvent,target:origEvent.target,releasePoint:releasePoint,pointerType:pointerType||'touch',}
e.initCustomEvent('pswpTap',true,true,eDetail)
origEvent.target.dispatchEvent(e)}
_registerModule('Tap',{publicMethods:{initTap:function(){_listen('firstTouchStart',self.onTapStart)
_listen('touchRelease',self.onTapRelease)
_listen('destroy',function(){tapReleasePoint={}
tapTimer=null})},onTapStart:function(touchList){if(touchList.length>1){clearTimeout(tapTimer)
tapTimer=null}},onTapRelease:function(e,releasePoint){if(!releasePoint){return}
if(!_moved&&!_isMultitouch&&!_numAnimations){var p0=releasePoint
if(tapTimer){clearTimeout(tapTimer)
tapTimer=null
if(_isNearbyPoints(p0,tapReleasePoint)){_shout('doubleTap',p0)
return}}
if(releasePoint.type==='mouse'){_dispatchTapEvent(e,releasePoint,'mouse')
return}
var clickedTagName=e.target.tagName.toUpperCase()
if(clickedTagName==='BUTTON'||framework.hasClass(e.target,'pswp__single-tap')){_dispatchTapEvent(e,releasePoint)
return}
_equalizePoints(tapReleasePoint,p0)
tapTimer=setTimeout(function(){_dispatchTapEvent(e,releasePoint)
tapTimer=null},300)}},},})
var _wheelDelta
_registerModule('DesktopZoom',{publicMethods:{initDesktopZoom:function(){if(_oldIE){return}
if(_likelyTouchDevice){_listen('mouseUsed',function(){self.setupDesktopZoom()})}else{self.setupDesktopZoom(true)}},setupDesktopZoom:function(onInit){_wheelDelta={}
var events='wheel mousewheel DOMMouseScroll'
_listen('bindEvents',function(){framework.bind(template,events,self.handleMouseWheel)})
_listen('unbindEvents',function(){if(_wheelDelta){framework.unbind(template,events,self.handleMouseWheel)}})
self.mouseZoomedIn=false
var hasDraggingClass,updateZoomable=function(){if(self.mouseZoomedIn){framework.removeClass(template,'pswp--zoomed-in')
self.mouseZoomedIn=false}
if(_currZoomLevel<1){framework.addClass(template,'pswp--zoom-allowed')}else{framework.removeClass(template,'pswp--zoom-allowed')}
removeDraggingClass()},removeDraggingClass=function(){if(hasDraggingClass){framework.removeClass(template,'pswp--dragging')
hasDraggingClass=false}}
_listen('resize',updateZoomable)
_listen('afterChange',updateZoomable)
_listen('pointerDown',function(){if(self.mouseZoomedIn){hasDraggingClass=true
framework.addClass(template,'pswp--dragging')}})
_listen('pointerUp',removeDraggingClass)
if(!onInit){updateZoomable()}},handleMouseWheel:function(e){if(_currZoomLevel<=self.currItem.fitRatio){if(!_options.closeOnScroll){e.preventDefault()}else{}
return true}
e.preventDefault()
e.stopPropagation()
_wheelDelta.x=0
if('deltaX'in e){if(e.deltaMode===1){_wheelDelta.x=e.deltaX*18
_wheelDelta.y=e.deltaY*18}else{_wheelDelta.x=e.deltaX
_wheelDelta.y=e.deltaY}}else if('wheelDelta'in e){if(e.wheelDeltaX){_wheelDelta.x=-0.16*e.wheelDeltaX}
if(e.wheelDeltaY){_wheelDelta.y=-0.16*e.wheelDeltaY}else{_wheelDelta.y=-0.16*e.wheelDelta}}else if('detail'in e){_wheelDelta.y=e.detail}else{return}
_calculatePanBounds(_currZoomLevel,true)
self.panTo(_panOffset.x-_wheelDelta.x,_panOffset.y-_wheelDelta.y)},toggleDesktopZoom:function(centerPoint){centerPoint=centerPoint||{x:_viewportSize.x/2,y:_viewportSize.y/2+_currentWindowScrollY,}
var doubleTapZoomLevel=_options.getDoubleTapZoom(true,self.currItem)
var zoomOut=_currZoomLevel===doubleTapZoomLevel
self.mouseZoomedIn=!zoomOut
self.zoomTo(zoomOut?self.currItem.initialZoomLevel:doubleTapZoomLevel,centerPoint,333)
framework[(!zoomOut?'add':'remove')+'Class'](template,'pswp--zoomed-in')},},})
var _historyDefaultOptions={history:true,galleryUID:1,}
var _historyUpdateTimeout,_hashChangeTimeout,_hashAnimCheckTimeout,_hashChangedByScript,_hashChangedByHistory,_hashReseted,_initialHash,_historyChanged,_closedFromURL,_urlChangedOnce,_windowLoc,_supportsPushState,_getHash=function(){return _windowLoc.hash.substring(1)},_cleanHistoryTimeouts=function(){if(_historyUpdateTimeout){clearTimeout(_historyUpdateTimeout)}
if(_hashAnimCheckTimeout){clearTimeout(_hashAnimCheckTimeout)}},_parseItemIndexFromURL=function(){var hash=_getHash(),params={}
if(hash.length<5){return params}
var vars=hash.split('&')
for(var i=0;i<vars.length;i++){if(!vars[i]){continue}
var pair=vars[i].split('=')
if(pair.length<2){continue}
params[pair[0]]=pair[1]}
params.pid=parseInt(params.pid,10)-1
if(params.pid<0){params.pid=0}
return params},_updateHash=function(){if(_hashAnimCheckTimeout){clearTimeout(_hashAnimCheckTimeout)}
if(_numAnimations||_isDragging){_hashAnimCheckTimeout=setTimeout(_updateHash,500)
return}
if(_hashChangedByScript){clearTimeout(_hashChangeTimeout)}else{_hashChangedByScript=true}
var newHash=_initialHash+'&'+'gid='+_options.galleryUID+'&'+'pid='+(_currentItemIndex+1)
if(!_historyChanged){if(_windowLoc.hash.indexOf(newHash)===-1){_urlChangedOnce=true}}
var newURL=_windowLoc.href.split('#')[0]+'#'+newHash
if(_supportsPushState){if('#'+newHash!==window.location.hash){history[_historyChanged?'replaceState':'pushState']('',document.title,newURL)}}else{if(_historyChanged){_windowLoc.replace(newURL)}else{_windowLoc.hash=newHash}}
_historyChanged=true
_hashChangeTimeout=setTimeout(function(){_hashChangedByScript=false},60)}
_registerModule('History',{publicMethods:{initHistory:function(){framework.extend(_options,_historyDefaultOptions,true)
if(!_options.history){return}
_windowLoc=window.location
_urlChangedOnce=false
_closedFromURL=false
_historyChanged=false
_initialHash=_getHash()
_supportsPushState='pushState'in history
if(_initialHash.indexOf('gid=')>-1){_initialHash=_initialHash.split('&gid=')[0]
_initialHash=_initialHash.split('?gid=')[0]}
_listen('afterChange',self.updateURL)
_listen('unbindEvents',function(){framework.unbind(window,'hashchange',self.onHashChange)})
var returnToOriginal=function(){_hashReseted=true
if(!_closedFromURL){if(_urlChangedOnce){history.back()}else{if(_initialHash){_windowLoc.hash=_initialHash}else{if(_supportsPushState){history.pushState('',document.title,_windowLoc.pathname+_windowLoc.search)}else{_windowLoc.hash=''}}}}
_cleanHistoryTimeouts()}
_listen('unbindEvents',function(){if(_closedByScroll){returnToOriginal()}})
_listen('destroy',function(){if(!_hashReseted){returnToOriginal()}})
_listen('firstUpdate',function(){_currentItemIndex=_parseItemIndexFromURL().pid})
var index=_initialHash.indexOf('pid=')
if(index>-1){_initialHash=_initialHash.substring(0,index)
if(_initialHash.slice(-1)==='&'){_initialHash=_initialHash.slice(0,-1)}}
setTimeout(function(){if(_isOpen){framework.bind(window,'hashchange',self.onHashChange)}},40)},onHashChange:function(){if(_getHash()===_initialHash){_closedFromURL=true
self.close()
return}
if(!_hashChangedByScript){_hashChangedByHistory=true
self.goTo(_parseItemIndexFromURL().pid)
_hashChangedByHistory=false}},updateURL:function(){_cleanHistoryTimeouts()
if(_hashChangedByHistory){return}
if(!_historyChanged){_updateHash()}else{_historyUpdateTimeout=setTimeout(_updateHash,800)}},},})
framework.extend(self,publicMethods)}
return PhotoSwipe})
jQuery(function($){var hasLabel,$parent,$previewScroller,PhotoSwipeUI_Default=function(pswp,framework){var $timeout,ui=this,_overlayUIUpdated=false,_controlsVisible=true,_fullscrenAPI,_controls,_captionContainer,_fakeCaptionContainer,_indexIndicator,_shareButton,_shareModal,_shareModalHidden=true,_initalCloseOnScrollValue,_isIdle,_listen,_loadingIndicator,_loadingIndicatorHidden,_loadingIndicatorTimeout,_galleryHasOneSlide,_options,_defaultUIOptions={barsSize:{top:44,bottom:'auto',},closeElClasses:['item','caption','zoom-wrap','ui','top-bar'],timeToIdle:4e3,timeToIdleOutside:1e3,loadingIndicatorDelay:1e3,addCaptionHTMLFn:function(item,captionEl){if(!item.title){captionEl.children[0].innerHTML=''
return false}
captionEl.children[0].innerHTML=item.title
return true},closeEl:true,captionEl:true,fullscreenEl:true,zoomEl:true,shareEl:true,counterEl:true,arrowEl:true,preloaderEl:true,tapToClose:false,tapToToggleControls:true,clickToCloseNonZoomable:true,indexIndicatorSep:' / ',},_blockControlsTap,_blockControlsTapTimeout,_onControlsTap=function(e){if(_blockControlsTap)return true
e=e||window.event
if(_options.timeToIdle&&_options.mouseUsed&&!_isIdle)_onIdleMouseMove()
var target=e.target||e.srcElement,uiElement,clickedClass=target.className,found
for(var i=0;i<_uiElements.length;i++){uiElement=_uiElements[i]
if(uiElement.onTap&&clickedClass.indexOf('pswp__'+uiElement.name)>-1){uiElement.onTap()
found=true}}
if(found){if(e.stopPropagation)e.stopPropagation()
_blockControlsTap=true
var tapDelay=framework.features.isOldAndroid?600:30
_blockControlsTapTimeout=setTimeout(function(){_blockControlsTap=false},tapDelay)}},_fitControlsInViewport=function(){return!pswp.likelyTouchDevice||_options.mouseUsed||screen.width>1200},_togglePswpClass=function(el,cName,add){framework[(add?'add':'remove')+'Class'](el,'pswp__'+cName)},_countNumItems=function(){var hasOneSlide=_options.getNumItemsFn()===1
if(hasOneSlide!==_galleryHasOneSlide){_togglePswpClass(_controls,'ui--one-slide',hasOneSlide)
_galleryHasOneSlide=hasOneSlide}},_toggleShareModalClass=function(){_togglePswpClass(_shareModal,'share-modal--hidden',_shareModalHidden)},_toggleShareModal=function(){_shareModalHidden=!_shareModalHidden
if(!_shareModalHidden){_toggleShareModalClass()
setTimeout(function(){if(!_shareModalHidden)framework.addClass(_shareModal,'pswp__share-modal--fade-in')},30)}else{framework.removeClass(_shareModal,'pswp__share-modal--fade-in')
setTimeout(function(){if(_shareModalHidden)_toggleShareModalClass()},300)}
if(!_shareModalHidden)_updateShareURLs()
return false},_openWindowPopup=function(e){e=e||window.event
var target=e.target||e.srcElement
pswp.shout('shareLinkClick',e,target)
if(!target.href)return false
if(target.hasAttribute('download'))return true
window.open(target.href,'pswp_share','scrollbars=yes,resizable=yes,toolbar=no,location=yes,width=550,height=420,top=100,left='+
(window.screen?Math.round(screen.width/2-275):100))
if(!_shareModalHidden)_toggleShareModal()
return false},_updateShareURLs=function(){var shareButtonOut='',shareButtonData,shareURL,image_url,page_url,share_text
for(var i=0;i<_options.shareButtons.length;i++){shareButtonData=_options.shareButtons[i]
image_url=_options.getImageURLForShare(shareButtonData)
page_url=_options.getPageURLForShare(shareButtonData)
share_text=_options.getTextForShare(shareButtonData)
shareURL=shareButtonData.url.replace('{{url}}',encodeURIComponent(page_url)).replace('{{image_url}}',encodeURIComponent(image_url)).replace('{{raw_image_url}}',image_url).replace('{{text}}',encodeURIComponent(share_text))
shareButtonOut+='<a href="'+
shareURL+'" target="_blank" class="pswp__share--'+
shareButtonData.id+'"'+
(shareButtonData.download?'download':'')+'>'+
shareButtonData.label+'</a>'
if(_options.parseShareButtonOut)
shareButtonOut=_options.parseShareButtonOut(shareButtonData,shareButtonOut)}
_shareModal.children[0].innerHTML=shareButtonOut
_shareModal.children[0].onclick=_openWindowPopup},_hasCloseClass=function(target){for(var i=0;i<_options.closeElClasses.length;i++)
if(framework.hasClass(target,'pswp__'+_options.closeElClasses[i]))return true},_idleInterval,_idleTimer,_idleIncrement=0,_onIdleMouseMove=function(){clearTimeout(_idleTimer)
_idleIncrement=0
if(_isIdle)ui.setIdle(false)},_onMouseLeaveWindow=function(e){e=e?e:window.event
var from=e.relatedTarget||e.toElement
if(!from||from.nodeName==='HTML'){clearTimeout(_idleTimer)
_idleTimer=setTimeout(function(){ui.setIdle(true)},_options.timeToIdleOutside)}},_setupFullscreenAPI=function(){if(_options.fullscreenEl){if(!_fullscrenAPI)_fullscrenAPI=ui.getFullscreenAPI()
if(_fullscrenAPI){framework.bind(document,_fullscrenAPI.eventK,ui.updateFullscreen)
ui.updateFullscreen()
framework.addClass(pswp.template,'pswp--supports-fs')}else framework.removeClass(pswp.template,'pswp--supports-fs')}},_setupLoadingIndicator=function(){if(_options.preloaderEl){_toggleLoadingIndicator(true)
_listen('beforeChange',function(){clearTimeout(_loadingIndicatorTimeout)
_loadingIndicatorTimeout=setTimeout(function(){if(pswp.currItem&&pswp.currItem.loading){if(!pswp.allowProgressiveImg()||(pswp.currItem.img&&!pswp.currItem.img.naturalWidth))
_toggleLoadingIndicator(false)}else _toggleLoadingIndicator(true)},_options.loadingIndicatorDelay)})
_listen('imageLoadComplete',function(index,item){if(pswp.currItem===item)_toggleLoadingIndicator(true)})}},_toggleLoadingIndicator=function(hide){if(_loadingIndicatorHidden!==hide){_togglePswpClass(_loadingIndicator,'preloader--active',!hide)
_loadingIndicatorHidden=hide}},_applyNavBarGaps=function(item){var gap=item.vGap
if(_fitControlsInViewport()){var bars=_options.barsSize
if(_options.captionEl&&bars.bottom==='auto'){if(!_fakeCaptionContainer){_fakeCaptionContainer=framework.createEl('pswp__caption pswp__caption--fake')
_fakeCaptionContainer.appendChild(framework.createEl('pswp__caption__center'))
_controls.insertBefore(_fakeCaptionContainer,_captionContainer)
framework.addClass(_controls,'pswp__ui--fit')}
if(_options.addCaptionHTMLFn(item,_fakeCaptionContainer,true)){var captionSize=_fakeCaptionContainer.clientHeight
gap.bottom=parseInt(captionSize,10)||44}else gap.bottom=bars.top}else gap.bottom=bars.bottom==='auto'?0:bars.bottom
gap.top=bars.top}else gap.top=gap.bottom=0},_setupIdle=function(){if(_options.timeToIdle)
_listen('mouseUsed',function(){framework.bind(document,'mousemove',_onIdleMouseMove)
framework.bind(document,'mouseout',_onMouseLeaveWindow)
_idleInterval=setInterval(function(){_idleIncrement++
if(_idleIncrement===2)ui.setIdle(true)},_options.timeToIdle/2)})},_setupHidingControlsDuringGestures=function(){_listen('onVerticalDrag',function(now){if(_controlsVisible&&now<0.95){ui.hideControls()}else if(!_controlsVisible&&now>=0.95)ui.showControls()})
var pinchControlsHidden
_listen('onPinchClose',function(now){if(_controlsVisible&&now<0.9){ui.hideControls()
pinchControlsHidden=true}else if(pinchControlsHidden&&!_controlsVisible&&now>0.9)ui.showControls()})
_listen('zoomGestureEnded',function(){pinchControlsHidden=false
if(pinchControlsHidden&&!_controlsVisible)ui.showControls()})},_uiElements=[{name:'caption',option:'captionEl',onInit:function(el){_captionContainer=el},},{name:'share-modal',option:'shareEl',onInit:function(el){_shareModal=el},onTap:function(){_toggleShareModal()},},{name:'button--share',option:'shareEl',onInit:function(el){_shareButton=el},onTap:function(){_toggleShareModal()},},{name:'button--zoom',option:'zoomEl',onTap:pswp.toggleDesktopZoom,},{name:'counter',option:'counterEl',onInit:function(el){_indexIndicator=el},},{name:'button--close',option:'closeEl',onTap:pswp.close,},{name:'button--arrow--left',option:'arrowEl',onTap:function(){if(pswp.getCurrentIndex()!==0)ui.swipeToPrev()},},{name:'button--arrow--right',option:'arrowEl',onTap:function(){if(pswp.getCurrentIndex()!==pswp.items.length-1){ui.swipeToNext()}else pswp.close()},},{name:'button--fs',option:'fullscreenEl',onTap:function(){if(_fullscrenAPI.isFullscreen()){_fullscrenAPI.exit()}else _fullscrenAPI.enter()},},{name:'preloader',option:'preloaderEl',onInit:function(el){_loadingIndicator=el},},],_setupUIElements=function(){var item,classAttr,uiElement,loopThroughChildElements=function(sChildren){if(!sChildren)return
var l=sChildren.length
for(var i=0;i<l;i++){item=sChildren[i]
classAttr=item.className
for(var a=0;a<_uiElements.length;a++){uiElement=_uiElements[a]
if(classAttr.indexOf('pswp__'+uiElement.name)>-1)
if(_options[uiElement.option]){framework.removeClass(item,'pswp__element--disabled')
if(uiElement.onInit)uiElement.onInit(item)}else framework.addClass(item,'pswp__element--disabled')}}}
loopThroughChildElements(_controls.children)
var topBar=framework.getChildByClass(_controls,'pswp__top-bar')
if(topBar)loopThroughChildElements(topBar.children)}
ui.init=function(){framework.extend(pswp.options,_defaultUIOptions,true)
_options=pswp.options
_controls=framework.getChildByClass(pswp.scrollWrap,'pswp__ui')
_listen=pswp.listen
_setupHidingControlsDuringGestures()
_listen('beforeChange',ui.update)
_listen('doubleTap',function(point){var initialZoomLevel=pswp.currItem.initialZoomLevel
if(pswp.getZoomLevel()!==initialZoomLevel){pswp.zoomTo(initialZoomLevel,point,333)}else pswp.zoomTo(_options.getDoubleTapZoom(false,pswp.currItem),point,333)})
_listen('preventDragEvent',function(e,isDown,preventObj){var t=e.target||e.srcElement
if(t&&t.className&&e.type.indexOf('mouse')>-1&&(t.className.indexOf('__caption')>0||/(SMALL|STRONG|EM)/i.test(t.tagName)))
preventObj.prevent=false})
_listen('bindEvents',function(){framework.bind(_controls,'pswpTap click',_onControlsTap)
framework.bind(pswp.scrollWrap,'pswpTap',ui.onGlobalTap)
if(!pswp.likelyTouchDevice)framework.bind(pswp.scrollWrap,'mouseover',ui.onMouseOver)})
_listen('unbindEvents',function(){if(!_shareModalHidden)_toggleShareModal()
if(_idleInterval)clearInterval(_idleInterval)
framework.unbind(document,'mouseout',_onMouseLeaveWindow)
framework.unbind(document,'mousemove',_onIdleMouseMove)
framework.unbind(_controls,'pswpTap click',_onControlsTap)
framework.unbind(pswp.scrollWrap,'pswpTap',ui.onGlobalTap)
framework.unbind(pswp.scrollWrap,'mouseover',ui.onMouseOver)
if(_fullscrenAPI){framework.unbind(document,_fullscrenAPI.eventK,ui.updateFullscreen)
if(_fullscrenAPI.isFullscreen()){_options.hideAnimationDuration=0
_fullscrenAPI.exit()}
_fullscrenAPI=null}})
_listen('destroy',function(){if(_options.captionEl){if(_fakeCaptionContainer)_controls.removeChild(_fakeCaptionContainer)
framework.removeClass(_captionContainer,'pswp__caption--empty')}
if(_shareModal)_shareModal.children[0].onclick=null
framework.removeClass(_controls,'pswp__ui--over-close')
framework.addClass(_controls,'pswp__ui--hidden')
ui.setIdle(false)})
if(!_options.showAnimationDuration)framework.removeClass(_controls,'pswp__ui--hidden')
_listen('initialZoomIn',function(){if(_options.showAnimationDuration)framework.removeClass(_controls,'pswp__ui--hidden')})
_listen('initialZoomOut',function(){framework.addClass(_controls,'pswp__ui--hidden')})
_listen('parseVerticalMargin',_applyNavBarGaps)
_setupUIElements()
if(_options.shareEl&&_shareButton&&_shareModal)_shareModalHidden=true
_countNumItems()
_setupIdle()
_setupFullscreenAPI()
_setupLoadingIndicator()}
ui.setIdle=function(isIdle){_isIdle=isIdle
_togglePswpClass(_controls,'ui--idle',isIdle)}
ui.update=function(){if(_controlsVisible&&pswp.currItem){ui.updateIndexIndicator()
if(_options.captionEl){_options.addCaptionHTMLFn(pswp.currItem,_captionContainer)
_togglePswpClass(_captionContainer,'caption--empty',!pswp.currItem.title)}
_overlayUIUpdated=true}else _overlayUIUpdated=false
if(!_shareModalHidden)_toggleShareModal()
_countNumItems()}
ui.updateFullscreen=function(e){if(e)
setTimeout(function(){pswp.setScrollOffset(0,framework.getScrollY())},50)
framework[(_fullscrenAPI.isFullscreen()?'add':'remove')+'Class'](pswp.template,'pswp--fs')}
ui.updateIndexIndicator=function(){if(_options.counterEl)
_indexIndicator.innerHTML=pswp.getCurrentIndex()+1+_options.indexIndicatorSep+_options.getNumItemsFn()}
ui.$container=$(pswp.container)
ui.$preloader=$('.pswp__preloader')
ui.$controlBar=ui.$container.siblings('.pswp__ui')
ui.$closeButton=ui.$controlBar.find('.pswp__button--close')
ui.$rightArrow=ui.$controlBar.find('.pswp__button--arrow--right')
function addTransition(){clearTimeout($timeout)
ui.$container.addClass('pswp__container_transition')
$timeout=setTimeout(function(){ui.$container.removeClass('pswp__container_transition')},340)}
function onPlayerReady(e){if(ui.isMobile)ui.$currentContainer.find('.pswp__swiper').addClass('pswp__swiper_hidden')}
function onPlayerStateChange(e){if(e.data===2)
ui.$currentContainer.find('.pswp__swiper').removeClass('pswp__swiper_hidden')}
ui.swipeToPrev=function(){addTransition()
pswp.prev()}
ui.swipeToNext=function(){addTransition()
pswp.next()}
ui.stopVideo=function(){ui.currentPlayer.pauseVideo()}
ui.playVideo=function(){ui.currentPlayer.playVideo()}
ui.insertVideo=function(){ui.$currentContainer=$(pswp.currItem.container)
var $swiper=ui.$currentContainer.find('.pswp__swiper_hidden')
if($swiper.length)$swiper.removeClass('pswp__swiper_hidden')
var $template=$('<div class="yt-player" id="player'+pswp.getCurrentIndex()+'"></div>')
ui.$currentContainer.find('.pswp__video').html($template)
ui.currentPlayer=new YT.Player('player'+pswp.getCurrentIndex(),{height:'640',width:'352',videoId:pswp.currItem.videoSrc,events:{onReady:onPlayerReady,onStateChange:onPlayerStateChange,},})}
ui.toClose=function(){if(pswp.items.length===1||pswp.getCurrentIndex()===pswp.items.length-1){return true}else return false}
for(var i=0,len=pswp.items.length;i<len;i++)
if(pswp.items[i].html)ui.hasVideo=true
var hoverArr=['pswp__item','pswp__zoom-wrap','pswp__img','pswp__button--arrow-right','pswp__top-bar','pswp__video-wrapper',],keyListener,overListener
document.addEventListener('keydown',(keyListener=function(e){if(ui.toClose()&&e.keyCode==39){pswp.close()}else if(e.keyCode==37&&pswp.items.length===1){pswp.close()}else if(e.keyCode==37&&pswp.getCurrentIndex()===0){return false}else if(e.keyCode==37||e.keyCode==39)
if(e.keyCode==37){ui.swipeToPrev()}else ui.swipeToNext()
if(e.keyCode==38||e.keyCode==40)e.preventDefault()}))
if($('html').hasClass('mobile-no')){var isArrowHovered}else if($('html').hasClass('mobile-yes')){ui.isMobile=true
pswp.framework.bind(pswp.container,'pswpTap',function(e){if(ui.currentPlayer&&e.target.className==='pswp__swiper'){e.preventDefault()
e.stopPropagation()
if(ui.currentPlayer.getPlayerState&&ui.currentPlayer.getPlayerState()!==1){ui.playVideo()
ui.$currentContainer.find('.pswp__swiper').addClass('pswp__swiper_hidden')}}
if(!ui.currentPlayer&&e.target.className==='pswp__swiper'){e.preventDefault()
e.stopPropagation()
ui.insertVideo()}})}
pswp.listen('beforeChange',function(){if(pswp.currItem.videoSrc){ui.$preloader.hide()}else ui.$preloader.show()})
ui.zoomInText=function(){var imageW=pswp.currItem.w,windowW=pswp.viewportSize.x,rate=windowW<=imageW?windowW/imageW:1,zoomLevel=pswp.getZoomLevel()
if(zoomLevel<1)
pswp.zoomTo(rate,{x:windowW/2,y:0,},0)}
ui.checkArrowsState=function(discardAll){if(!discardAll){var curIndex=pswp.getCurrentIndex()
if(curIndex===0&&pswp.items.length>1){ui.$closeButton.css('opacity','').css('color','')
ui.$controlBar.removeClass('pswp__ui--last').addClass('pswp__ui--first')}else if(curIndex===pswp.items.length-1&&pswp.items.length>1){ui.$controlBar.removeClass('pswp__ui--first').addClass('pswp__ui--last')
ui.$closeButton.css({opacity:'0.8',color:'#333333',})}else{ui.$closeButton.css('opacity','').css('color','')
ui.$controlBar.removeClass('pswp__ui--first pswp__ui--last')}}else{ui.$controlBar.removeClass('pswp__ui--first pswp__ui--last')
ui.$closeButton.css('opacity','').css('color','')
ui.$rightArrow.css('opacity','')}}
ui.fadeImage=function(){ui.$container.addClass('pswp__container_fade')
setTimeout(function(){ui.$container.removeClass('pswp__container_fade')},500)}
pswp.listen('initialZoomInEnd',function(){ui.checkArrowsState()
if(ui.isMobile&&pswp.currItem.imageType&&pswp.currItem.imageType==='zoom')
setTimeout(function(){ui.zoomInText()},10)
pswp.listen('afterChange',function(){ui.checkArrowsState()
if(ui.isMobile&&pswp.currItem.imageType&&pswp.currItem.imageType==='zoom')
setTimeout(function(){ui.zoomInText()},10)})})
pswp.listen('afterChange',function(){if(ui.hasVideo){if(ui.currentPlayer&&ui.currentPlayer.destroy){if(ui.currentPlayer.destroy&&ui.currentPlayer['f']){ui.currentPlayer.destroy()
ui.currentPlayer=null}else{ui.currentPlayer=null}}
if(pswp.currItem.videoSrc)
if(!ui.isMobile)
setTimeout(function(){ui.insertVideo()},0)}
if(!ui.isMobile&&$previewScroller.length){var scrollerHeight=$previewScroller.height(),scrolled=$previewScroller.get(0).scrollTop,imageOffset=pswp.currItem.el[0].offsetTop,imageHeight=pswp.currItem.el[0].getBoundingClientRect().height,goneTop=imageOffset<scrolled,goneBottom=imageHeight+imageOffset>scrolled+scrollerHeight,isInViewport=!goneTop&&!goneBottom
if(!isInViewport){if(goneTop){$previewScroller.animate({scrollTop:imageOffset},100)
$previewScroller.perfectScrollbar('update')}else{$previewScroller.animate({scrollTop:imageOffset+imageHeight-scrollerHeight},100)
$previewScroller.perfectScrollbar('update')}}}})
pswp.listen('close',function(){ui.checkArrowsState(true)
if(ui.isMobile)ui.fadeImage()
if(ui.hasVideo)
if(ui.currentPlayer){if(ui.currentPlayer.destroy)ui.currentPlayer.destroy()
ui.currentPlayer=null}
if(hasLabel)
setTimeout(function(){$parent.removeClass('b-product-photo__picture_faded')},400)
document.removeEventListener('keydown',keyListener)})
ui.onGlobalTap=function(e){e=e||window.event
var target=e.target||e.srcElement
if(_blockControlsTap)return true
if(e.detail&&e.detail.pointerType==='mouse'){if(_hasCloseClass(target)){pswp.close()
return}
if(framework.hasClass(target,'pswp__img'))
if(ui.toClose()){pswp.close()}else if(pswp.getZoomLevel()===1&&pswp.getZoomLevel()<=pswp.currItem.fitRatio){if(_options.clickToCloseNonZoomable)ui.swipeToNext()}else ui.swipeToNext()
if(framework.hasClass(target,'pswp__preloader'))
if(ui.toClose()){pswp.close()}else ui.swipeToNext()}else{if(_options.tapToToggleControls)
if(_controlsVisible){ui.hideControls()}else ui.showControls()
if(_options.tapToClose&&(framework.hasClass(target,'pswp__img')||_hasCloseClass(target))){pswp.close()
return}}}
ui.onMouseOver=function(e){e=e||window.event
var target=e.target||e.srcElement
_togglePswpClass(_controls,'ui--over-close',_hasCloseClass(target))}
ui.hideControls=function(){framework.addClass(_controls,'pswp__ui--hidden')
_controlsVisible=false}
ui.showControls=function(){_controlsVisible=true
if(!_overlayUIUpdated)ui.update()
framework.removeClass(_controls,'pswp__ui--hidden')}
ui.supportsFullscreen=function(){var d=document
return!!(d.exitFullscreen||d.mozCancelFullScreen||d.webkitExitFullscreen||d.msExitFullscreen)}
ui.getFullscreenAPI=function(){var dE=document.documentElement,api,tF='fullscreenchange'
if(dE.requestFullscreen){api={enterK:'requestFullscreen',exitK:'exitFullscreen',elementK:'fullscreenElement',eventK:tF,}}else if(dE.mozRequestFullScreen){api={enterK:'mozRequestFullScreen',exitK:'mozCancelFullScreen',elementK:'mozFullScreenElement',eventK:'moz'+tF,}}else if(dE.webkitRequestFullscreen){api={enterK:'webkitRequestFullscreen',exitK:'webkitExitFullscreen',elementK:'webkitFullscreenElement',eventK:'webkit'+tF,}}else if(dE.msRequestFullscreen)
api={enterK:'msRequestFullscreen',exitK:'msExitFullscreen',elementK:'msFullscreenElement',eventK:'MSFullscreenChange',}
if(api){api.enter=function(){_initalCloseOnScrollValue=_options.closeOnScroll
_options.closeOnScroll=false
if(this.enterK==='webkitRequestFullscreen'){pswp.template[this.enterK](Element.ALLOW_KEYBOARD_INPUT)}else return pswp.template[this.enterK]()}
api.exit=function(){_options.closeOnScroll=_initalCloseOnScrollValue
return document[this.exitK]()}
api.isFullscreen=function(){return document[this.elementK]}}
return api}}
function PhotoSwipeInit(){}
PhotoSwipeInit.prototype.init=function(options){var self=this
this.items=options.items
for(_i in this.items)
if(this.items[_i]&&this.items[_i].el)self.openSlide(this.items[_i],this.items)}
PhotoSwipeInit.prototype.openSlide=function(_el,items){var self=this,index=0
for(_i in items)
if(items[_i]&&items[_i].el){if(_el.el.attr('data-trigger-element')&&items[_i].idElement==_el.el.attr('data-trigger-element'))
break
if(!_el.el.attr('data-trigger-element')&&items[_i].idElement==_el.idElement)break
index++}
var disAnimation=_el.options.disableAnimation==1||false
_el.el.on('click',function(e){e.preventDefault()
e.stopImmediatePropagation()
self.open(index,_el.idGallery,disAnimation)})
var _triggers=$('.pswipe-gallery-trigger[data-pswp-gallery='+
_el.idGallery+'][data-pswp-element='+
_el.idElement+']')
if(_triggers.length)
_triggers.on('click',function(e){e.preventDefault()
e.stopImmediatePropagation()
var disAnimationTrigger=$(this).attr('data-pswp-option-disable-animation')==1||false
self.open(index,_el.idGallery,disAnimationTrigger)})}
PhotoSwipeInit.prototype.open=function(index,galleryUid,disableAnimation){var pswpElement=document.querySelectorAll('.pswp')[0],options,newGallery,items
items=this.items
options={index:index,barsSize:{top:0,bottom:'auto',},indexIndicatorSep:' из ',timeToIdle:4e6,history:false,preloaderEl:true,captionEl:false,fullscreenEl:false,shareEl:false,arrowKeys:false,loop:false,closeElClasses:['item','caption','zoom-wrap','ui','top-bar','video-wrapper'],galleryUID:galleryUid,getThumbBoundsFn:function(index){var offsetLeft=0
var thumbnail=items[index].el.find('img').get(0),pageYScroll=window.pageYOffset||document.documentElement.scrollTop,rect=thumbnail.getBoundingClientRect()
if(!$('html').hasClass('mobile-yes')){offsetLeft=56}
return{x:rect.left-offsetLeft,y:rect.top+pageYScroll,w:rect.width,}},closeOnScroll:true,closeOnVerticalDrag:false,hideAnimationDuration:300,showAnimationDuration:300,showHideOpacity:true,zoomEl:false,bgOpacity:1,}
if(disableAnimation){options.showAnimationDuration=0
options.hideAnimationDuration=0
options.showHideOpacity=true}
newGallery=new PhotoSwipe(pswpElement,PhotoSwipeUI_Default,items,options)
if(!$('html').hasClass('mobile-yes')){this.photoswipePreviews(newGallery)
$('body, html').addClass('modal-open')}
this.limitingImageSizes(newGallery)
newGallery.init()}
PhotoSwipeInit.prototype.limitingImageSizes=function(gallery){var previewsBarWidth=112
var buttonArrowWidth=72
var topBarHeight=56
var isTouch=$('html').hasClass('mobile-yes')
gallery.listen('gettingData',function(index,item){var windowWidth=document.documentElement.clientWidth
var allowedWidthImage=windowWidth-(previewsBarWidth+buttonArrowWidth*2)
if(!isTouch&&item.w>allowedWidthImage){let imageWidth=allowedWidthImage
let imageHeight=imageWidth*item.h/item.w
item.w=imageWidth
item.h=imageHeight}});gallery.listen('firstUpdate',function(){gallery.listen('parseVerticalMargin',function(item){if(!isTouch)return
item.vGap={top:topBarHeight,bottom:topBarHeight}})})}
PhotoSwipeInit.prototype.photoswipePreviews=function(gallery){var self=this
var added=false
var props={gallery,selector:'.pswp__previews',}
gallery.listen('gettingData',()=>{if(added)return
added=true
self.addPreviews(props)})
gallery.listen('close',()=>{self.removePreviews(props)
$('body, html').removeClass('modal-open')})
gallery.listen('afterChange',()=>{self.setActivePreview(props)})}
PhotoSwipeInit.prototype.addPreviews=function(props){var{scrollWrap,items}=props.gallery
var place=scrollWrap.querySelector(props.selector)
var parentPlace=place.parentNode
for(let item of items){let{msrc:preview}=item
let element=document.createElement('img')
element.setAttribute('src',preview)
element.addEventListener('click',()=>{props.gallery.goTo(items.indexOf(item))})
place.appendChild(element)}
setTimeout(function(){parentPlace.classList.add('pswp__previews-wrap_show')},250)}
PhotoSwipeInit.prototype.removePreviews=function(props){var{scrollWrap}=props.gallery
var place=scrollWrap.querySelector(props.selector)
var parentPlace=place.parentNode
setTimeout(function(){place.innerHTML=''
parentPlace.classList.remove('pswp__previews-wrap_show')},100)}
PhotoSwipeInit.prototype.setActivePreview=function(props){var{scrollWrap,currItem}=props.gallery
var{msrc:preview}=currItem
var place=scrollWrap.querySelector(props.selector)
var previewElements=place.querySelectorAll('img')
for(var element of previewElements){var src=element.getAttribute('src')
var className='is-active'
if(src===preview){element.classList.add(className)
this.scrollInsidePreviews({scrollWrap,element})}else element.classList.remove(className)}}
PhotoSwipeInit.prototype.scrollInsidePreviews=function(props){var{scrollWrap,element}=props
var previewsScrollWrap=scrollWrap.querySelector('.pswp__previews-wrap')
var previewsScrollHeight=previewsScrollWrap.scrollHeight
var previewsClientHeight=previewsScrollWrap.clientHeight
if(previewsScrollHeight>previewsClientHeight){var offsetTopElement=element.offsetTop
var clientHeightElement=element.clientHeight
var top=offsetTopElement-(previewsClientHeight/2-clientHeightElement/2)
$(previewsScrollWrap).animate({scrollTop:top},200)}}
PhotoSwipeInit.prototype.setOnSwipeListener=function(trigger){var self=this,startX,startY,dist,threshold=100,allowedTime=400,elapsedTime,startTime
trigger.on('touchstart',function(e){e=e.originalEvent
var touchobj=e.changedTouches[0]
dist=0
startX=touchobj.pageX
startY=touchobj.pageY
startTime=new Date().getTime()})
trigger.on('touchend',function(e){e=e.originalEvent
var touchobj=e.changedTouches[0]
dist=touchobj.pageX-startX
if(dist<0)dist=Math.abs(dist)
elapsedTime=new Date().getTime()-startTime
var toOpen=elapsedTime<=allowedTime&&dist>=threshold&&Math.abs(touchobj.pageY-startY)<=100
if(toOpen)$(trigger).click()})}
PhotoSwipeInit.prototype.closest=function(el,fn){return el&&(fn(el)?el:this.closest(el.parentNode,fn))}
if($('html').hasClass('mobile-yes'))
$('.b-product-photo__triggers .b-product-photo__trigger').on('click',function(e){e.preventDefault()
e.stopImmediatePropagation()
var index=$(this).index()
var galleryTrigger=$('[data-pswp-element='+index+'] > a').first()
galleryTrigger.trigger('click')})
$(document).ready(function(){$(document).find('body').append('<div aria-hidden="true" role="dialog" tabindex="-1" class="pswp">\
            <div class="pswp__bg"></div>\
            <div class="pswp__scroll-wrap">\
                <div class="pswp__container">\
                    <div class="pswp__item"></div>\
                    <div class="pswp__item"></div>\
                    <div class="pswp__item"></div>\
                </div>\
                <div class="pswp__ui pswp__ui--hidden">\
                    <div class="pswp__button pswp__button--arrow--left"></div>\
                    <div class="pswp__button pswp__button--arrow--right"></div>\
                    <div class="pswp__top-bar">\
                        <div class="pswp__counter"></div>\
                        <div class="pswp__button pswp__button--close"></div>\
                    </div>\
                    <div class="pswp__previews-wrap">\
                        <div class="pswp__previews"></div>\
                    </div>\
                    <div class="pswp__preloader"></div>\
                </div>\
            </div>\
        </div>')})
var galleries={}
function createGalleries(){$gElements=$('.pswipe-gallery-element')
$gGalleryElements=[]
var hasVideo=false
$gElements.each(function(index,item){item=$(item)
var idGallery=parseInt(item.attr('data-pswp-gallery')),idElement=parseInt(item.attr('data-pswp-element')),optionDisableAnimation=item.attr('data-pswp-option-disable-animation'),linkEl=item.find('a').eq(0),elType=linkEl.attr('data-type'),itemData={}
if(elType==='image'){if(linkEl.attr('data-size')){size=linkEl.attr('data-size').split('x')
if(size[0])itemData.w=parseInt(size[0],10)
if(size[1])itemData.h=parseInt(size[1],10)}
itemData.imageType=linkEl.attr('data-image-type')
itemData.src=linkEl.attr('href')}else if(elType==='video'){hasVideo=true
videoLink=linkEl.attr('data-link')
itemData.videoSrc=videoLink
itemData.html='<div class="pswp__video-wrapper"><div class="pswp__video-centering"><div class="pswp__swiper"></div><div class="pswp__video-preview" style="background-image: url('+
linkEl.attr('data-pswp-video-preview')+')"></div><div class="pswp__play"><div class="pswp__play-inner"></div></div><div class="pswp__video-preloader"></div><div class="pswp__video"></div></div></div>'
itemData.src=null}
if(linkEl.find('img').length)
if(linkEl.find('img').attr('data-src')&&linkEl.find('img').attr('data-src').length){itemData.msrc=linkEl.find('img').attr('data-src')}else itemData.msrc=linkEl.find('img').attr('src')
itemData.el=item
itemData.idElement=idElement
itemData.idGallery=idGallery
itemData.options={disableAnimation:optionDisableAnimation,}
if(!$gGalleryElements[idGallery])$gGalleryElements[idGallery]=[]
$gGalleryElements[idGallery].push(itemData)})
if(hasVideo){var g=document.createElement('script'),s=document.getElementsByTagName('script')[0]
g.src='//www.youtube.com/iframe_api'
s.parentNode.insertBefore(g,s)}
function sort_elem_compare(a,b){if(a.idElement<b.idElement)return-1
if(a.idElement>b.idElement)return 1
return 0}
for(_idGallery in $gGalleryElements){if(!isNaN(_idGallery)){var _elements=$gGalleryElements[_idGallery]
if(_elements.sort)_elements.sort(sort_elem_compare)
galleries[_idGallery]=new PhotoSwipeInit()
galleries[_idGallery].init({items:_elements,})}}}
$previewScroller=$('.b-product__media .b-gallery__scroller');createGalleries();document.addEventListener('comments:loaded',function(){createGalleries();})});