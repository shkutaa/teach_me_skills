var AUTHOZBY={params:{external:0},popup:null};AUTHOZBY.iFrameCreate=function(src){frame_name='auth_fr';if(!document.getElementById(frame_name))
{jQuery('<iframe id="'+frame_name+'" name="'+frame_name+'" style="display:none"></iframe>').appendTo(document.body);}
if(src)document.getElementById('auth_fr').src=src;}
AUTHOZBY.observeExternalProviders=function(){jQuery('.authozby').each(function(el){if(this.tagName=='FORM'&&jQuery(this).hasClass('authorize'))
{AUTHOZBY.getAuthFormParams(this);}});jQuery('.authozby').each(function(el){if(this.tagName=='A')
{jQuery(this).click(function(e){e.preventDefault();AUTHOZBY.getAuthFormParams(jQuery('FORM.authozby'));AUTHOZBY.params.external=1;AUTHOZBY.popup=window.open(this.href+'&'+AUTHOZBY.getAuthParamsString(),'parwin','width=800px,height=600px,status=0,toolbar=0,menubar=0,resizable=1,scrollbars=1');});}});}
AUTHOZBY.closePopop=function(url)
{AUTHOZBY.popup.close();AUTHOZBY.redirectToFrame(url);}
AUTHOZBY.redirectToFrame=function(url)
{AUTHOZBY.iFrameCreate(url);}
AUTHOZBY.getAuthFormParams=function(form){var need_arr=['onProceed','onSuccess','onError','onSend','partner_id','oldclient[cl_pid]','oldclient[hpid]'];var data=jQuery(form).serializeArray();if(data)
{for(i in data)
{if(data[i].name=='onSend')
{var tmp=data[i].value.split(',');for(j in tmp)
{need_arr.push(tmp[j]);}}}
for(i in data)
{if(jQuery.inArray(data[i].name,need_arr)>-1)
{AUTHOZBY.params[data[i].name]=data[i].value;}}}};AUTHOZBY.getAuthParamsString=function(){str=new Array();for(i in AUTHOZBY.params)
{str.push(i+'='+escape(AUTHOZBY.params[i]));}
return str.join('&')+'&state=request';};jQuery(document).ready(function(){AUTHOZBY.observeExternalProviders();});function FrmCreate(frame_name)
{if(!document.getElementById(frame_name))
{jQuery('<iframe id="'+frame_name+'" name="'+frame_name+'" style="display:none"></iframe>').appendTo(document.body);}};