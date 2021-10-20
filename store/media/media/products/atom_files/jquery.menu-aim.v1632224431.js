;(function($,window,document,notDefined){var pluginName="aim",activeRow,MOUSE_LOCS_TRACKED=3,mouseLocs=[],lastDelayLoc=null,activeMouse=false,outsideOverlay,DELAY=300,defaults={closestItem:'',activeClass:'active',itemsSelector:'> li',dropPosition:'right',delayShow:0,delayHide:0,tolerance:75,setHeight:false,click:false,containerDropNav:'',outside:false};function Plugin(element,options){this.element=element;this.outsideOverlayInit=false;this.options=$.extend({},defaults,options);this.init();}
Plugin.prototype={constructor:Plugin,init:function(){var element=$(this.element),_this=this;if(_this.options.click){element.on('click',_this.options.itemsSelector,function(){var $t=$(this),elemRow=(_this.options.closestItem)?$(this).closest(_this.options.closestItem):$(this);if(elemRow.hasClass(_this.options.activeClass)){_this._hideNav();}
else{if($(document).data("imaimopened")&&($(document).data("imaimopened")[0]!==$(_this.element)[0])){$($(document).data("imaimopened")).aim('hideNav');}
clearTimeout(element.data('delayHide'));clearTimeout(element.data('delayActivate'));_this._activeRow(elemRow,$t);$(document).on('click.aim touchend.aim',{elem:elemRow,activeElem:$t},$.proxy(_this._hideClick,_this));}
return false;});}
else{element.on('mouseenter touchend',_this.options.itemsSelector,function(ev){var $t=$(this),elemRow=(_this.options.closestItem)?$(this).closest(_this.options.closestItem):$(this);clearTimeout(element.data('delayHide'));clearTimeout(element.data('delayActivate'));_this._checkActivate(elemRow,$t);if(ev.type==='touchend'){$(document).on('click.aim touchend.aim',{elem:elemRow,activeElem:$t},$.proxy(_this._hideClick,_this));}});element.on('mouseleave',_this.options.itemsSelector,function(){var elemRow=(_this.options.closestItem)?$(this).closest(_this.options.closestItem):$(this);clearTimeout(element.data('delayHide'));clearTimeout(element.data('delayActivate'));element.data('delayHide',setTimeout(function(){_this._hideNav();},_this.options.delayHide));});element.on({mouseenter:function(){if(!activeMouse){activeMouse=true;$(document).on('mousemove.aim',_this._mouseMove);}},mouseleave:function(){if(activeMouse){activeMouse=false;$(document).off('mousemove.aim');}}});}},hideNav:function(){this._hideNav();},_hideClick:function(event){var _this=this,elemRow=event.data.elem,el=event.data.activeElem,activeEl=$(el.data('aimnav-id'));if(_this.options.outside||(el.data('aimnav-backdrop')==='modal')){var checkTarget=(event.target===elemRow[0])||$(event.target).closest(elemRow).length||(event.target===activeEl[0])||$(event.target).closest(activeEl).length||event.target===outsideOverlay[0];}
else{var checkTarget=(event.target===elemRow[0])||$(event.target).closest(elemRow).length;}
if(!checkTarget){this._hideNav()}},_hideNav:function(){var element=$(this.element),_this=this;_this._removeOldActive();clearTimeout(element.data('delayHide'));clearTimeout(element.data('delayActivate'));element.trigger('hidenav');$(document).removeData("imaimopened");$(document).off('click.aim touchend.aim');},_mouseMove:function(e){mouseLocs.push({x:e.pageX,y:e.pageY});if(mouseLocs.length>MOUSE_LOCS_TRACKED){mouseLocs.shift();}},_checkActivate:function(row){var _this=this,delay=_this._checkMove();if(delay){$(_this.element).data('delayActivate',setTimeout(function(){_this._checkActivate(row);},delay));}else{_this._activeRow(row,_this.element);}},_activeRow:function(row,el){var _this=this,elemRow=row,activeEl=el;if(!elemRow.hasClass(_this.options.activeClass)){if($(document).data("imaimopened")&&($(document).data("imaimopened")[0]!==$(_this.element)[0])){$($(document).data("imaimopened")).aim('hideNav');}
clearTimeout($(_this.element).data('delayHide'));clearTimeout($(_this.element).data('delayActivate'));$(document).off('click.aim touchend.aim');$(_this.element).data('delayActivate',setTimeout(function(){_this._removeOldActive();elemRow.addClass(_this.options.activeClass);activeRow=elemRow;if(_this.options.outside||($(el).data('aimnav-backdrop')==='modal')){var $elemDrop=$(activeEl.data('aimnav-id'));$elemDrop.addClass('ppnav-outside');if(!$elemDrop.parent().is('body')){$elemDrop.appendTo('body');}
$elemDrop.addClass('ppnav-outside--active');var getPos=activeEl.data('aimnav-position').split('-'),getOffset=activeEl.data('aimnav-offset').split(','),getElOffset=activeEl.offset();if(activeEl.data('aimnav-backdrop')==='modal'){if($('.ppnav-backdrop').length===0){$('body').append('<div class="ppnav-backdrop"></div>');outsideOverlay=$('.ppnav-backdrop');outsideOverlay.on('click',function(){_this._hideNav();})}
outsideOverlay.show();}
if(activeEl.data('aimnav-setclass')){$elemDrop.data('custom-class',activeEl.data('aimnav-setclass'))
$elemDrop.addClass(activeEl.data('aimnav-setclass'));}
if(!$.isArray(getOffset)){getOffset=[0,0]}
if(getPos[0]==='element'){switch(getPos[1]){case'bottom_center':$elemDrop.css({left:parseInt(getOffset[0])+getElOffset.left+(activeEl.innerWidth()/2)-($elemDrop.width()/2)+'px',top:getElOffset.top+activeEl.innerHeight()+parseInt(getOffset[1])+'px'})
break
case'bottom_left':$elemDrop.css({left:parseInt(getOffset[0])+getElOffset.left+'px',top:getElOffset.top+activeEl.innerHeight()+parseInt(getOffset[1])+'px'})
break
case'bottom_right':$elemDrop.css({left:getElOffset.left+activeEl.innerWidth()-$elemDrop.width()-parseInt(getOffset[0])+'px',top:getElOffset.top+activeEl.innerHeight()+parseInt(getOffset[1])+'px'})
break
case'top_left':$elemDrop.css({left:parseInt(getOffset[0])+getElOffset.left+'px',top:getElOffset.top-$elemDrop.innerHeight()+parseInt(getOffset[1])+'px'})
break
default:break}}else{switch(getPos[1]){case'bottom_center':$elemDrop.css({left:'50%',marginLeft:($elemDrop.width()/2+parseInt(getOffset[0]))*(-1)+'px',top:getElOffset.top+activeEl.innerHeight()+parseInt(getOffset[1])+'px'})
break
case'bottom_right':$elemDrop.css({right:parseInt(getOffset[0])+'px',top:getElOffset.top+activeEl.innerHeight()+parseInt(getOffset[1])+'px'})
break
case'bottom_left':$elemDrop.css({left:parseInt(getOffset[0])+'px',top:getElOffset.top+activeEl.innerHeight()+parseInt(getOffset[1])+'px'})
break
case'top_right':$elemDrop.css({right:parseInt(getOffset[0])+'px',top:getElOffset.top-$elemDrop.innerHeight()+parseInt(getOffset[1])+'px'})
break
case'top_center':$elemDrop.css({left:'50%',marginLeft:($elemDrop.width()/2+parseInt(getOffset[0]))*(-1)+'px',top:getElOffset.top-$elemDrop.innerHeight()+parseInt(getOffset[1])+'px'})
break
default:break}}}
$(_this.element).trigger('shownav',[elemRow,activeEl]);$(document).data('imaimopened',$(_this.element));},_this.options.delayShow));}},_removeOldActive:function(){var _this=this;clearTimeout($(_this.element).data('delayHide'));var elemItem=(_this.options.closestItem)?$(_this.options.itemsSelector,_this.element).closest(_this.options.closestItem):_this.options.itemsSelector;if(elemItem!==''){$(_this.element).find(elemItem).removeClass(_this.options.activeClass);}
else{$(_this.element).removeClass(_this.options.activeClass);}
if(this.options.outside||$('.ppnav-backdrop').length){$('.ppnav-outside--active').each(function(index,el){var $old=$(this);$old.removeClass('ppnav-outside--active').removeAttr('style');if($old.data('custom-class')){$old.removeClass($old.data('custom-class'));$old.removeData('custom-class');}});if($('.ppnav-backdrop').length){outsideOverlay.hide();}}
activeRow=null;},_checkMove:function(){var _this=this,element=$(this.element);if(!activeRow){return 0;}
var offset=element.offset(),upperLeft={x:offset.left,y:offset.top-_this.options.tolerance},upperRight={x:offset.left+element.outerWidth(),y:upperLeft.y},lowerLeft={x:offset.left,y:offset.top+element.outerHeight()+_this.options.tolerance},lowerRight={x:offset.left+element.outerWidth(),y:lowerLeft.y},loc=mouseLocs[mouseLocs.length-1],prevLoc=mouseLocs[0];if(!loc){return 0;}
if(!prevLoc){prevLoc=loc;}
if(prevLoc.x<offset.left||prevLoc.x>lowerRight.x||prevLoc.y<offset.top||prevLoc.y>lowerRight.y){return 0;}
if(lastDelayLoc&&loc.x==lastDelayLoc.x&&loc.y==lastDelayLoc.y){return 0;}
function slope(a,b){return(b.y-a.y)/(b.x-a.x);}
var decreasingCorner=upperRight,increasingCorner=lowerRight;if(_this.options.dropPosition=="left"){decreasingCorner=lowerLeft;increasingCorner=upperLeft;}else if(_this.options.dropPosition=="below"){decreasingCorner=lowerRight;increasingCorner=lowerLeft;}else if(_this.options.dropPosition=="above"){decreasingCorner=upperLeft;increasingCorner=upperRight;}
var decreasingSlope=slope(loc,decreasingCorner),increasingSlope=slope(loc,increasingCorner),prevDecreasingSlope=slope(prevLoc,decreasingCorner),prevIncreasingSlope=slope(prevLoc,increasingCorner);if(decreasingSlope<prevDecreasingSlope&&increasingSlope>prevIncreasingSlope){lastDelayLoc=loc;return DELAY;}
lastDelayLoc=null;return 0;}};$.fn[pluginName]=function(options){var args=arguments,_return;if(options===notDefined||typeof options==='object'){_return=this.each(function(){if(!$.data(this,'plugin_'+pluginName)){$.data(this,'plugin_'+pluginName,new Plugin(this,options));}});}else if(typeof options==='string'&&options[0]!=='_'&&options!=='init'){_return=this.each(function(){var instance=$.data(this,'plugin_'+pluginName);if(instance instanceof Plugin&&typeof instance[options]==='function'){instance[options].apply(instance,Array.prototype.slice.call(args,1));}});}
return _return;};}(jQuery,window,document));;