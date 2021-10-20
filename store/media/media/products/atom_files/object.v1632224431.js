var userAgent=navigator.userAgent.toLowerCase();browser={version:(userAgent.match(/.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/)||[])[1],safari:/webkit/.test(userAgent),opera:/opera/.test(userAgent),msie:/msie/.test(userAgent)&&!/opera/.test(userAgent),mozilla:/mozilla/.test(userAgent)&&!/(compatible|webkit)/.test(userAgent)};if(/trident\/7/.test(userAgent)){browser.msie=true;}
var ScreenHeight=0;var ScreenWidth=0;if(self.screen){ScreenWidth=screen.width;ScreenHeight=screen.height;}
else if(self.java){var jToolKit=java.awt.Toolkit.getDefaultToolkit();var scrsize=jToolKit.getScreenSize();ScreenWidth=scrsize.width;ScreenHeight=scrsize.height;}
if(document.cookie.indexOf('screen')==-1){HostName=window.location.hostname.replace('www','');if(HostName.indexOf(':')!=-1){HostName=HostName.substring(0,HostName.indexOf(':'));}
Screen=escape('a:2:{s:5:"width";s:'+ScreenWidth.toString().length+':"'+ScreenWidth+'";s:6:"height";s:'+ScreenHeight.toString().length+':"'+ScreenHeight+'";}');expires=new Date();expires.setTime(expires.getTime()+(1000*7*24*60*60));cookStr="screen="+Screen+";expires="+expires.toUTCString()+";path=/";if(browser.msie==false)cookStr=cookStr+';domain='+HostName;document.cookie=cookStr;}
Object.Event={extend:function(object){object._objectEventSetup=function(event_name){this._observers=this._observers||{};this._observers[event_name]=this._observers[event_name]||[];};object.observe=function(event_name,observer){if(typeof(event_name)=='string'&&typeof(observer)!='undefined'){this._objectEventSetup(event_name);if(!this._observers[event_name].include(observer))
this._observers[event_name].push(observer);}else
for(var e in event_name)
this.observe(e,event_name[e]);};object.stopObserving=function(event_name,observer){this._objectEventSetup(event_name);this._observers[event_name]=this._observers[event_name].without(observer);};object.notify=function(event_name){this._objectEventSetup(event_name);var collected_return_values=[];var args=$A(arguments).slice(1);try{for(var i=0;i<this._observers[event_name].length;++i)
collected_return_values.push(this._observers[event_name][i].apply(this._observers[event_name][i],args)||null);}catch(e){if(e==$break)
return false;else
throw e;}
return collected_return_values;};if(object.prototype){object.prototype._objectEventSetup=object._objectEventSetup;object.prototype.observe=object.observe;object.prototype.stopObserving=object.stopObserving;object.prototype.notify=function(event_name){if(object.notify){var args=$A(arguments).slice(1);args.unshift(this);args.unshift(event_name);object.notify.apply(object,args);}
this._objectEventSetup(event_name);var args=$A(arguments).slice(1);var collected_return_values=[];try{if(this.options&&this.options[event_name]&&typeof(this.options[event_name])=='function')
collected_return_values.push(this.options[event_name].apply(this,args)||null);for(var i=0;i<this._observers[event_name].length;++i)
collected_return_values.push(this._observers[event_name][i].apply(this._observers[event_name][i],args)||null);}catch(e){if(e==$break)
return false;else
throw e;}
return collected_return_values;};;}}};;