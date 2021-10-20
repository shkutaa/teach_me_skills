;(function(factory){if(typeof define==='function'&&define.amd){define(['jquery'],factory);}else{factory(jQuery);}}
(function($){var d=[],doc=$(document),ieQuirks=null,wndw=$(window),w=[];$.modalbox=function(data,options){return $.modalbox.impl.open(data,options);};$.modalbox.init=function(){$.modalbox.impl.init();};$.modalbox.close=function(){$.modalbox.impl.close();};$.modalbox.ajax=function(url,data,onSuccess,onError,onStart){$.modalbox.impl.ajaxInternalRequest(url,data,onSuccess,onError,onStart);};$.modalbox.stopAjax=function(){$.modalbox.impl.stopAjax();};$.modalbox.ajaxRepeat=function(){$.modalbox.impl.ajaxRepeat();};$.modalbox.getContent=function(){return $.modalbox.impl.getContent();};$.modalbox.setContainerDimensions=function(){$.modalbox.impl.setContainerDimensions();};$.modalbox.setPosition=function(){$.modalbox.impl.setPosition();};$.modalbox.setOptions=function(options){$.modalbox.impl.setOptions(options);};$.modalbox.addWrapClass=function(number,classname){$.modalbox.impl.addWrapClass(number,classname);};$.modalbox.removeWrapClass=function(number,classname){$.modalbox.impl.removeWrapClass(number,classname);};$.fn.modalbox=function(options){return $.modalbox.impl.init();};$.modalbox.defaults={overlayId:'modalbox-overlay',overlayClass:'overlay',overlayCss:{},containerId:'modalbox-container',containerClass:'pp-panel',containerCss:{},containerBottomHTML:'',containerBlocks:null,dataId:'modalbox-content',dataClass:'',dataCss:{},spinnerId:'modalbox-spinner',spinnerText:'Загрузка...',spinnerInnerId:'modalbox-spinner-inner',spinnerInnerText:'Загрузка...',overlayInnerId:'modalbox-overlay-inner',overlayInnerClass:'pp-panel-loading-overlay',offsetTop:0,errorMessagePrefix:'Ошибка',ajaxRequestErrorMessage:'Произошла ошибка на сайте',position:'scroll',zIndex:9999,insideAjaxOverlay:true,close:true,overlayClose:true,crossClose:true,escClose:true,onOpen:null,onShow:null,onClose:null,onError:null};$.modalbox.impl={d:{},ajax:{},init:function(){var s=this;if(s.d.data){return s;}
ieQuirks=!jQuery.support.boxModel&&!$.boxModel;if(!s.o)
s.o=$.modalbox.defaults;s.create('');data=null;return s;},create:function(data){var s=this;s.getDimensions();s.d.overlay=$('<div></div>').attr('id',s.o.overlayId).addClass(s.o.overlayClass).css({display:'none'}).appendTo('body');s.d.spinner=$('<div class="pp-panel-loading"><div class="pp-panel-loading-i" id="'+s.o.spinnerId+'"><i class="pp-panel-loading-info"></i></div></div>').css({display:'none'}).appendTo(s.d.overlay);s.d.spinnerText=$('<span>'+s.o.spinnerText+'</span>').css({display:'none'}).appendTo($('#'+s.o.spinnerId));s.d.cross=$('<a href="#" class="b-ico ico-close"></a>');s.d.container=$('<div></div>').attr('id',s.o.containerId).addClass(s.o.containerClass).css({display:'none',zIndex:s.o.zIndex}).appendTo('body');if(s.o.containerBlocks)
{lst_cont=s.d.container;for(cl=0;cl<s.o.containerBlocks.length;cl++)
{s.d['wrap'+cl]=$('<div></div>').attr('tabIndex',-1).addClass(s.o.containerBlocks[cl]).appendTo(lst_cont);lst_cont=s.d['wrap'+cl];}
s.d.wrap=lst_cont;s.d.wrap.append(s.d.cross);}
else
{s.d.wrap3=$('<div></div>').attr('tabIndex',-1).addClass('pp-panel-block').appendTo(s.d.container);s.d.wrap2=$('<div></div>').addClass('pp-panel-i').appendTo(s.d.wrap3);s.d.wrap1=$('<div></div>').appendTo(s.d.wrap2);s.d.wrap=$('<div></div>').attr('tabIndex',-1).addClass('modalbox-wrap').append(s.d.cross).appendTo(s.d.wrap1);}
if(s.o.containerBottomHTML)
s.d.container.append(s.o.containerBottomHTML);s.d.data=$('<div></div>').attr('id',s.o.dataId).addClass(s.o.dataClass).css(s.o.dataCss);data=null;s.d.data.appendTo(s.d.wrap);s.setContainerDimensions();s.bindEvents(['overlay','cross']);},getContent:function(){var s=this;return s.d.data||null;},addWrapClass:function(number,classname){var s=this;if(number==0)number='';if(!s.d['wrap'+number])return false;s.d['wrap'+number].addClass(classname);},removeWrapClass:function(number,classname){var s=this;if(number==0)number='';if(!s.d['wrap'+number])return false;s.d['wrap'+number].removeClass(classname);},bindEvents:function(options){var s=this;if(options&&($.inArray('overlay',options)>-1||$.inArray('all',options)>-1))
{s.d.overlay.bind('click.modalbox',function(e){if(s.o.close&&s.o.overlayClose){e.preventDefault();s.close();}});}
if(options&&($.inArray('cross',options)>-1||$.inArray('all',options)>-1))
{s.d.cross.bind('click.modalbox',function(e){if(s.o.close&&s.o.crossClose){e.preventDefault();s.close();}});}
if(options&&($.inArray('esc',options)>-1||$.inArray('all',options)>-1))
{doc.bind('keydown.modalbox',function(e){if((s.o.close&&s.o.escClose)&&e.keyCode===27){e.preventDefault();s.close();}});}},unbindEvents:function(options){if(options&&($.inArray('esc',options)>-1||$.inArray('all',options)>-1))
{doc.unbind('keydown.modalbox');}},setOptions:function(options)
{var s=this;if(!s.o)
s.o=$.modalbox.defaults;s.o=$.extend(s.o,options);if(options.spinnerText&&s.d.spinnerText)
{s.d.spinnerText.html(options.spinnerText);}
if(options.dataClass&&s.d.data)
{s.d.data.addClass(options.dataClass);}
if(options.containerClass&&s.d.container)
{s.d.container.addClass(options.containerClass);}
return s;},getDimensions:function(){var s=this,h=wndw.height();d=[doc.height(),doc.width()];w=[h,wndw.width()];},getVal:function(v,d){return v?(typeof v==='number'?v:v==='auto'?0:v.indexOf('%')>0?((parseInt(v.replace(/%/,''))/100)*(d==='h'?w[0]:w[1])):parseInt(v.replace(/px/,''))):null;},setContainerDimensions:function(){var s=this;s.setPosition();},setPosition:function(){var s=this;if(s.o.position=='scroll')
s.d.container.css('margin-top',-s.d.container.outerHeight()/2-50);s.d.container.css('margin-left',-s.d.container.outerWidth()/2);},open:function(obj,options){var s=this;s.setOptions(options).init().setOptions(options);var ajaxmode=false;if(typeof obj==='object'&&typeof obj.ajax==='string'){ajaxmode=true;data=$('<div></div>');}
else if(typeof obj==='object'&&obj.innerHTML){data=$('<div></div>').html(obj.innerHTML);}
else if(typeof obj==='string'||typeof obj==='number'){data=$('<div></div>').html(obj);}
else{alert('Error: Unsupported data type: '+typeof obj);return s;}
s.d.data.html(data);if($.isFunction(s.o.onOpen)){s.o.onOpen.apply(s,[s.d]);}
s.d.overlay.show();s.d.spinner.show();s.d.spinnerText.show();jQuery('IFRAME').addClass('iframe-dis').hide();if(ajaxmode)
{s.o.close=false;s.ajaxRequest(obj.ajax,obj.data,obj.onSuccess||s.onAjaxSuccess,obj.onError||s.onAjaxError);}
else
{s.d.data.html(data);s.onLoad();}
return s;},ajaxInternalRequest:function(url,data,onSuccess,onError,onStart)
{var s=this;s.ajaxInternalShowOverlay();if(!onSuccess)
onSuccess=function(data){this.d.data.html(data);};if(!onError)
onError=function(error_message){this.d.data.prepend(error_message);};if(!onStart)
onStart=function(){};s.ajaxRequest(url,data,function(data,responce){this.ajaxInternalHideOverlay();onSuccess.apply(s,[data,responce,s]);},function(data,responce){this.ajaxInternalHideOverlay();onError.apply(s,[data,responce,s]);},onStart);},ajaxInternalShowOverlay:function()
{var s=this;if(s.o.insideAjaxOverlay)
{s.d.inside={};s.d.inside.overlay=$('<div></div>').attr('id',s.o.overlayInnerId).addClass(s.o.overlayInnerClass).appendTo(s.d.data.parent());s.d.inside.spinner=$('<div class="pp-panel-loading"><div class="pp-panel-loading-i" id="'+s.o.spinnerInnerId+'"><i class="pp-panel-loading-info"></i></div></div>').appendTo(s.d.inside.overlay);s.d.inside.spinnerText=$('<span>'+s.o.spinnerInnerText+'</span>').appendTo($('#'+s.o.spinnerInnerId));}},ajaxInternalHideOverlay:function()
{var s=this;if(s.o.insideAjaxOverlay&&s.d.inside)
{s.d.inside.overlay.remove();s.d.inside.spinner.remove();s.d.inside={};}},onAjaxSuccessInside:function(responce)
{var s=this;s.d.data.html(responce);s.reposition();s.ajaxInternalHideOverlay();},onAjaxErrorInside:function(error_message)
{var s=this;s.d.data.prepend(error_message);s.reposition();s.ajaxInternalHideOverlay();},stopAjax:function()
{var s=this;if(s.ajax.xhr)
{s.ajax.xhr.abort();s.ajax.xhr=null;s.bindEvents(['esc']);s.o.close=true;}},ajaxRepeat:function()
{var s=this;if(!s.ajax.xhr&&s.ajax.url)
{return this.ajaxRequest(s.ajax.url,s.ajax.data,s.ajax.onSuccess,s.ajax.onError,s.ajax.onStart);}
return false;},ajaxRequest:function(url,data,onSuccess,onError,onStart)
{var s=this;s.ajax.timer=setTimeout(function(){jQuery.modalbox.impl.onTimeout5sec();},5000);s.unbindEvents(['esc']);s.o.close=false;s.ajax.url=url;s.ajax.data=data;if(onSuccess)
s.ajax.onSuccess=onSuccess;else s.ajax.onSuccess=s.onAjaxSuccess;if(onError)
s.ajax.onError=onError;else s.ajax.onError=s.onAjaxError;if(onStart)
s.ajax.onStart=onStart;else s.ajax.onStart=s.onAjaxStart;s.ajax.onStart.apply(s,[s]);s.ajax.xhr=$.ajax({type:'POST',url:s.ajax.url,data:s.ajax.data,success:function(responce){clearTimeout(s.ajax.timer);s.ajax.xhr=null;s.bindEvents(['esc']);s.o.close=true;resp='';try
{resp=$.parseJSON(responce);}
catch(e){}
if(typeof resp=='object'&&resp)
{if(resp.error_message)
{s.ajax.onError.apply(s,[resp.error_message,resp,s]);}
else
{s.ajax.onSuccess.apply(s,[resp.data,resp,s]);}}
else
{s.ajax.onSuccess.apply(s,[responce,responce,s]);}},error:function(responce){if(responce.status){s.ajax.onError.apply(s,[s.o.ajaxRequestErrorMessage,responce,s]);}}});},onTimeout5sec:function()
{var s=this;if(s.ajax.xhr)
{s.o.close=true;s.bindEvents(['esc']);s.ajax.timer=setTimeout(function(){jQuery.modalbox.impl.onTimeoutResponce();},25000);}},onTimeoutResponce:function()
{var s=this;if(s.ajax.xhr)
{s.ajax.xhr.abort();s.ajax.xhr=null;s.close('Произошла ошибка при загрузке данных');}},onAjaxSuccess:function(responce)
{var s=this;s.d.data.html(responce);s.onLoad(responce);},onAjaxError:function(error_message)
{this.close(error_message);},onAjaxStart:function(s)
{},onLoad:function(data)
{var s=this;s.d.spinner.hide();s.d.spinnerText.hide();s.reposition();s.d.container.show();s.d.data.show();s.o.close=true;s.bindEvents(['esc']);if($.isFunction(s.o.onShow)){s.o.onShow.apply(s,[s.d]);}
return s;},reposition:function()
{var s=this;if(s.d.container.css('position')!=='fixed'&&s.o.position=='scroll')
{if(s.o.offsetTop)
{s.d.container.css({top:s.o.offsetTop+wndw.scrollTop(),marginTop:'0px'});}
else
{hc=(w[0]/2);s.d.container.css({top:hc+wndw.scrollTop()});s.d.container.css('margin-top',-s.d.container.outerHeight()/2);}}
s.d.container.css('margin-left',-s.d.container.outerWidth()/2);},setData:function(data)
{var s=this;s.d.data.html(data);return s;},error:function(error_message){var s=this;if(error_message)
{if($.isFunction(s.o.onError)){s.o.onError.apply(s,[error_message,s.d]);}
else if($.isFunction($.message))
{$.message('error',s.o.errorMessagePrefix,error_message);}
else alert(s.o.errorMessagePrefix+' '+error_message);}},close:function(error_message){var s=this;if(!s.d.data){return false;}
if(s.ajax.xhr)
{s.ajax.xhr.abort();if(s.ajax.timer)
{clearTimeout(s.ajax.timer);}}
s.unbindEvents(['esc']);s.d.data.hide().html('');s.d.container.hide();s.d.spinner.hide();s.d.spinnerText.hide();s.d.overlay.hide();jQuery('IFRAME.iframe-dis').removeClass('iframe-dis').show();if($.isFunction(s.o.onClose)){s.o.onClose.apply(s,[s.d]);}
s.error(error_message);}};}));;