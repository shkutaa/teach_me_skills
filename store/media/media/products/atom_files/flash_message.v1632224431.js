var FlashMessageTypes={ERROR:'warning',SUCCESS:'ok',NEUTRAL:'neutral'};function FlashMessage(params)
{var $=jQuery;var identity=Math.round(Math.random()*Math.pow(10,9));params=$.extend({type:FlashMessageTypes.ERROR,caption:'Ошибка',description:'',hasButton:true,buttonLabel:'Все понятно, спасибо',autoCloseTimeout:0,large:false,long:false,onOpen:function(identity){},onClose:function(identity){}},params);this.init=function()
{return this;};this.open=function()
{var self=this;var html=this.getMessage(params);$('body').append(html);params.onOpen(identity);$('.b-alert__control, .i-button','#'+identity).off('click.closePopup').on('click.closePopup',function(e){e.preventDefault();self.close();});if(params.autoCloseTimeout){setTimeout(function(){self.close();},params.autoCloseTimeout);}
return this;};this.close=function()
{params.onClose(identity);$('#'+identity).remove();return this;};this.setType=function(type)
{params.type=type;return this;};this.setCaption=function(value)
{params.caption=value;return this;};this.setDescription=function(value)
{params.description=value;return this;};this.setAutoCloseTimeout=function(value)
{params.autoCloseTimeout=value;return this;};this.setHasButton=function(value)
{params.hasButton=value;return this;};this.setButtonLabel=function(value)
{params.buttonLabel=value;return this;};this.getMessage=function(params)
{var button=!params.hasButton?'':'           <div class="b-alert__footer">'+'               <button class="i-button i-button_small i-button_transparent">'+params.buttonLabel+'</button>'+'           </div>';var html='<div class="b-alert-container">'+'           <div class="b-alert-container__inner">'+'               <div id="'+identity+'" class="b-alert b-alert_'+params.type+(params.large?' b-alert_large':'')+(params.long?' b-alert_long':'')+'">'+'                   <a class="b-alert__control" href="#">'+'                       <span class="i-icon-2 i-icon-2_close" aria-hidden="true"></span>'+'                   </a>'+'                   <p class="b-alert__title">'+params.caption+'</p>'+'                   <div class="b-alert__main">'+params.description+'</div>'+
button+'               </div>'+'           </div>'+'       </div>';return html;};return this.init();};;