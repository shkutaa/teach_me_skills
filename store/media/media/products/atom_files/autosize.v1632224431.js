/*!
 Autosize 3.0.8
 license: MIT
 http://www.jacklmoore.com/autosize
*/
(function(global,factory){if(typeof define==='function'&&define.amd){define(['exports','module'],factory);}else if(typeof exports!=='undefined'&&typeof module!=='undefined'){factory(exports,module);}else{var mod={exports:{}};factory(mod.exports,mod);global.autosize=mod.exports;}})(this,function(exports,module){'use strict';function assign(ta){var isMobile=document.documentElement.className.indexOf('mobile-yes')!==-1;var _ref=arguments[1]===undefined?{}:arguments[1];var _ref$setOverflowX=_ref.setOverflowX;var setOverflowX=_ref$setOverflowX===undefined?true:_ref$setOverflowX;var _ref$setOverflowY=_ref.setOverflowY;var setOverflowY=_ref$setOverflowY===undefined?true:_ref$setOverflowY;if(!ta||!ta.nodeName||ta.nodeName!=='TEXTAREA'||ta.hasAttribute('data-autosize-on'))return;var heightOffset=null;var overflowY='hidden';function init(){var style=window.getComputedStyle(ta,null);if(style.resize==='vertical'){ta.style.resize='none';}else if(style.resize==='both'){ta.style.resize='horizontal';}
if(style.boxSizing==='content-box'){heightOffset=-(parseFloat(style.paddingTop)+parseFloat(style.paddingBottom));}else{heightOffset=parseFloat(style.borderTopWidth)+parseFloat(style.borderBottomWidth);}
update();}
function changeOverflow(value){{var width=ta.style.width;ta.style.width='0px';ta.offsetWidth;ta.style.width=width;}
overflowY=value;if(setOverflowY){ta.style.overflowY=value;}
resize();}
function resize(){var htmlTop=window.pageYOffset;var bodyTop=document.body.scrollTop;var originalHeight=ta.style.height;ta.style.height='auto';var endHeight=ta.scrollHeight+heightOffset;if(ta.scrollHeight===0){ta.style.height=originalHeight;return;}
ta.style.height=endHeight+'px';if(!isMobile){document.documentElement.scrollTop=htmlTop;document.body.scrollTop=bodyTop;}}
function update(){var startHeight=ta.style.height;resize();var style=window.getComputedStyle(ta,null);if(style.height!==ta.style.height){if(overflowY!=='visible'){changeOverflow('visible');}}else{if(overflowY!=='hidden'){changeOverflow('hidden');}}
if(startHeight!==ta.style.height){var evt=document.createEvent('Event');evt.initEvent('autosize:resized',true,false);ta.dispatchEvent(evt);}}
var destroy=(function(style){window.removeEventListener('resize',update);ta.removeEventListener('input',update);ta.removeEventListener('keyup',update);ta.removeAttribute('data-autosize-on');ta.removeEventListener('autosize:destroy',destroy);Object.keys(style).forEach(function(key){ta.style[key]=style[key];});}).bind(ta,{height:ta.style.height,resize:ta.style.resize,overflowY:ta.style.overflowY,overflowX:ta.style.overflowX,wordWrap:ta.style.wordWrap});ta.addEventListener('autosize:destroy',destroy);if('onpropertychange'in ta&&'oninput'in ta){ta.addEventListener('keyup',update);}
window.addEventListener('resize',update);ta.addEventListener('input',update);ta.addEventListener('autosize:update',update);ta.setAttribute('data-autosize-on',true);if(setOverflowY){ta.style.overflowY='hidden';}
if(setOverflowX){ta.style.overflowX='hidden';ta.style.wordWrap='break-word';}
init();}
function destroy(ta){if(!(ta&&ta.nodeName&&ta.nodeName==='TEXTAREA'))return;var evt=document.createEvent('Event');evt.initEvent('autosize:destroy',true,false);ta.dispatchEvent(evt);}
function update(ta){if(!(ta&&ta.nodeName&&ta.nodeName==='TEXTAREA'))return;var evt=document.createEvent('Event');evt.initEvent('autosize:update',true,false);ta.dispatchEvent(evt);}
var autosize=null;if(typeof window==='undefined'||typeof window.getComputedStyle!=='function'){autosize=function(el){return el;};autosize.destroy=function(el){return el;};autosize.update=function(el){return el;};}else{autosize=function(el,options){if(el){Array.prototype.forEach.call(el.length?el:[el],function(x){return assign(x,options);});}
return el;};autosize.destroy=function(el){if(el){Array.prototype.forEach.call(el.length?el:[el],destroy);}
return el;};autosize.update=function(el){if(el){Array.prototype.forEach.call(el.length?el:[el],update);}
return el;};}
module.exports=autosize;});;