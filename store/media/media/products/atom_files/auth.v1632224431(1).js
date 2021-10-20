(function($,window,document,undefined){var AuthPlugin=function(){var $self=this;var params={external:0,popup:undefined,fieldSwitchers:undefined,popupClass:'i-popup',procClass:'i-popup_processing',hiddenStateClass:'i-popup__line_excluded',hiddenStateClass2:'i-popup__group_excluded',hiddenStateClass2Fading:'i-popup__group_hidden',tabContainerClass:'i-popup__tab-container',states:undefined,remindStates:undefined,smsLinkEnabled:false,smsLinkPinger:'',pingHash:'',pingTimeout:5000,pingTimer:null,successCallback:null,errorCallback:null,};var messages={emptyEmail:'Введите адрес электронной почты',emptyPassword:'Введите пароль',emptyPhone:'Введите номер мобильного телефона',emptyCode:'Введите код',incorrectEmail:'Введите корректный адрес электронной почты',incorrectPhone:'Введите корректный номер мобильного телефона',differentPasswords:'Введите одинаковый пароль',}
var autofillTimer=null;function init(){$(document).ready(function(){initUI();observeExternalProviders();observeForms();if(params.root){showfocus();}});}
function open(state){if(params.root.appendTo($(document).find('body')));if(!state||state=='login'){params.root.data('popup').open(params.root);}else if(state=='register'){params.root.data('popup').open(params.root);params.root.find('.i-popup__group[data-popup-state="first"]').addClass('i-popup__group_hidden i-popup__group_excluded');params.root.find('.i-popup__group[data-popup-state="second"]').removeClass('i-popup__group_hidden i-popup__group_excluded');params.root.find('.i-popup').addClass('i-popup_rotated1');}
hideErrors();var _timeout=params.root.closest('.i-layout').length?10:300;setTimeout(function(){showfocus();},_timeout);formAutofillHandler($('FORM.authozby'));}
function caretToEnd(el){$(el).focus();}
function inputFocus(inp)
{var isMobile=$(document).find('html').hasClass('mobile-yes');if(isMobile){return;}
if(params.root.hasClass('i-overlay_hidden')){return;}
var $inp=$(inp);if(inp&&($inp.attr('type')=='email'||$inp.attr('type')=='tel')){try{caretToEnd(inp);setTimeout(function(){try{caretToEnd(inp);}catch(e){}},10);}catch(e){}}
if(inp&&$inp.attr('type')=='password'){try{$inp.select();}catch(e){}}}
function isAutofill($inp){try{if($inp.is(':-webkit-autofill')){return true;}}catch(e){}
return false;}
function inputValidate(inp,settings){var $inp=$(inp);var isError=false;if($inp.attr('disabled')){return false;}
if(!$.trim($inp.val()).length){isError=true;if($inp.attr('type')=='password'&&isAutofill($inp)){isError=false;}else{if(settings.indexOf('showInputEmptyError')!==-1){$inp.addClass('i-input_error');}
if(settings.indexOf('showErrorMessage')!==-1){if($inp.attr('type')=='email'){onErrorCallback({errorMessage:messages.emptyEmail});}else if($inp.attr('type')=='password'){onErrorCallback({errorMessage:messages.emptyPassword});}}}}
if($inp.attr('type')=='email'&&$.trim($inp.val()).length&&(!isCorrectEmail($inp.val()))){isError=true;if(settings.indexOf('showInputEmailError')!==-1){$inp.addClass('i-input_error');}
if(settings.indexOf('showErrorMessage')!==-1){onErrorCallback({errorMessage:messages.incorrectEmail});}}
if($inp.attr('type')=='tel'&&$inp.hasClass('phonenumber')&&($.trim($inp.val()).length&&$.trim($inp.val())!=='375')&&(!isCorrectPhone($inp.val()))){isError=true;if(settings.indexOf('showInputPhoneError')!==-1){$inp.addClass('i-input_error');}
if(settings.indexOf('showErrorMessage')!==-1){onErrorCallback({errorMessage:messages.incorrectPhone});}}
if($inp.attr('type')=='password'&&$.trim($inp.val()).length){if(settings.indexOf('hideInputError')!==-1){$inp.removeClass('i-input_error');}
if(settings.indexOf('hideErrorMessage')!==-1){hideErrors();}}
if($inp.attr('type')=='password'&&isAutofill($inp)){if(settings.indexOf('hideInputError')!==-1){$inp.removeClass('i-input_error');}
if(settings.indexOf('hideErrorMessage')!==-1){hideErrors();}}
if($inp.attr('type')=='email'&&(!$.trim($inp.val()).length||isCorrectEmail($inp.val()))){if(settings.indexOf('hideInputError')!==-1){$inp.removeClass('i-input_error');}
if(settings.indexOf('hideErrorMessage')!==-1){hideErrors();}}
if($inp.attr('type')=='tel'&&$inp.hasClass('phonenumber')&&(!$.trim($inp.val()).length||isCorrectPhone($inp.val()))||$.trim($inp.val())=='375'){if(settings.indexOf('hideInputError')!==-1){$inp.removeClass('i-input_error');}
if(settings.indexOf('hideErrorMessage')!==-1){hideErrors();}}
return isError;}
function formValidate(inp,settings){var $inp=$(inp);if($inp.attr('type')=='email'||$inp.attr('type')=='password'||$inp.attr('type')=='tel'){var $form=$inp.closest('FORM');}else if($inp.is('FORM')){var $form=$inp;}
var isError=false;$form.find('INPUT[type=email], INPUT[type=tel], INPUT[type=password]').each(function(){if(isError){return false;}
var $this=$(this);isError=isError||inputValidate($this,settings);});if(settings.indexOf('stateButton')!==-1){var $button=$form.find('.i-button');if(isError){$button.addClass('i-button_disabled');$button.closest('FORM').data('inpDisabled',1).attr('data-inp-disabled',1);}else{$button.removeClass('i-button_disabled');$button.closest('FORM').data('inpDisabled',false).attr('data-inp-disabled',false);}}
return isError;}
function isCorrectEmail(email){var emailRe=/\S+@\S+\.\S+/;email=$.trim(email);return email.length&&emailRe.test(email);}
function isCorrectPhone(phone){var byPhoneRe=/^\+?375/;var byPhoneReFull=/^\+?375([\d]{9})$/;phone=$.trim(phone);if(phone.length&&byPhoneRe.test(phone)&&!byPhoneReFull.test(phone)){return false;}
if(phone.length<7){return false;}
return true;}
function inputObserve(inp){var $inp=$(inp);$inp.off('invalid.auth').on('invalid.auth',function(e){return false;}).off('blur.auth').on('blur.auth',function(e){inputValidate($inp,['showInputEmailError','showInputPhoneError']);}).off('keyup.auth').on('keyup.auth',function(e){var oldVal=$inp.data('oldVal');if($inp.val()!=oldVal){inputValidate($inp,['hideInputError']);formValidate($inp,['stateButton']);}
$inp.data('oldVal',$inp.val());});}
function showfocus()
{var isMobile=$(document).find('html').hasClass('mobile-yes');if(isMobile){return;}
if(params.root.hasClass('i-overlay_hidden')){return;}
var lastFocused=null;var lastElement=null;params.root.find('FORM.authozby:visible input[type=email], FORM.authozby:visible input[type=password], FORM.authozby:visible input[type=tel]').each(function(){try{var $this=$(this);lastElement=$this;if(inputValidate($this,[])){inputFocus($this);lastFocused=$(this);return false;}else{if($this.hasClass('phonenumber')&&($this.val()==''||$this.val()=='375')){inputFocus($this);lastFocused=$(this);return false;}}}catch(e){}});if(lastElement){setTimeout(function(){try{inputFocus(lastElement);}catch(e){}},10);}}
function close(){params.root.data('popup').hideOverlay();stopAutofill();}
function setInfoText(text)
{$('#loginPopupIntro').html(text);}
function setSuccessCallback(callback){params.successCallback=callback;}
function setErrorCallback(callback){params.errorCallback=callback;}
function setBackUri(backUri){params.root.find('input[type=hidden][name=onSuccess]').val(escape(backUri));}
function frameCreate(frame_name,src)
{if(!document.getElementById(frame_name))
{$('<iframe id="'+frame_name+'" name="'+frame_name+'" style="display:none"></iframe>').appendTo(document.body);}
if(src)document.getElementById(frame_name).src=src;}
function redirectToFrame(url)
{frameCreate('auth_fr',url);}
function initUI()
{$root=$('#auth-overlay, #auth-layout').eq(0);params.root=$root;params.states=$root.find('[data-login-state]');params.remindStates=$root.find('[data-remind-state]');$root.find('#loginFormRemindLink').on('click.auth',function(){switchRemindState('remind');});$root.on('click.auth','#loginFormRemindLink',function(){switchRemindState('remind');});$root.on('click.auth','#loginFormRemindSuccess',function(e){if($(this).data('site')){e.preventDefault();location.href=$(this).data('site');}else{if(params.root.closest('.i-layout').length){e.preventDefault();location.href=params.root.find('.i-popup__close').attr('href');}else{close();}}});$root.find('input.phonenumber').each(function(){enableInputMask($(this));});}
function copyEmailToAllForms()
{var emailField=$('FORM.authozby:visible input[type=email]').eq(0);if(emailField.length&&isCorrectEmail(emailField.val())){$('FORM.authozby input[type=email]').each(function(){var $this=$(this);$this.val(emailField.val());formValidate($this,['stateButton']);});}}
function copyPhoneToAllForms()
{var phoneField=$('FORM.authozby:visible input.phonenumber').eq(0);if(phoneField.length&&isCorrectPhone(phoneField.val())){$('FORM.authozby input.phonenumber').each(function(){var $this=$(this);$this.val(phoneField.val());formValidate($this,['stateButton']);});}}
function switchRemindState(state)
{copyEmailToAllForms();copyPhoneToAllForms();params.root.find('[type=password]').val('');var newState=params.remindStates.addClass(params.hiddenStateClass).filter('[data-remind-state="'+state+'"]');newState.removeClass(params.hiddenStateClass);showfocus();}
function switchLoginState(state)
{copyEmailToAllForms();copyPhoneToAllForms();params.root.find('[type=password]').val('');var newState=params.states.addClass(params.hiddenStateClass).filter('[data-login-state="'+state+'"]');newState.removeClass(params.hiddenStateClass);showfocus();}
function formAutofillHandler($forms){autofillTimer=setTimeout(function(){$forms.each(function(){formValidate($(this),['stateButton']);});formAutofillHandler($forms);},200);}
function stopAutofill(){if(autofillTimer){clearTimeout(autofillTimer);}}
function observeForms(){$('FORM.authozby input[type=email], FORM.authozby input[type=password], FORM.authozby input:enabled[type=tel]',params.root).each(function(){inputObserve($(this));});$('FORM.authozby').each(function(){formValidate($(this),['stateButton']);});setTimeout(function(){$('FORM.authozby').each(function(){formValidate($(this),['stateButton']);});},500);$('FORM.authozby[name=restore]',params.root).on('submit.auth',submitRemindPassword);$('FORM.authozby[name=login]',params.root).on('submit.auth',submitLogin);$('FORM.authozby[name=register]',params.root).on('submit.auth',submitRegister);$('FORM.authozby[name=newpass]',params.root).on('submit.auth',submitPassword);$('#phoneFormSmsResendLink').on('click',function(e){resendPhone();});$('BUTTON[form]',params.root).on('click.auth',function(e){e.preventDefault();appendHiddenInput(['cl_pid','hpid']);$('#'+$(this).attr('form')).trigger('submit.auth');});if($('#phoneForm').data('smsLink')){params.smsLinkEnabled=true;params.smsLinkPinger=$('#phoneForm').data('smsPinger');}}
function appendHiddenInput(cookieNameArr){cookieNameArr.forEach(function(elem){nameInput='oldclient['+elem+']';val=getCookie(elem);if(val){var selectors=['#loginForm','#phoneForm'];selectors.forEach(function(elem){selector=" input[name='"+nameInput+"']";if(!$(elem+selector).length){$(elem).append('<input type="hidden" name="'+nameInput+'" value="'+val+'">');}});}});}
function getCookie(name){var matches=document.cookie.match(new RegExp("(?:^|; )"+name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g,'\\$1')+"=([^;]*)"));return matches?decodeURIComponent(matches[1]):undefined;}
function submitRemindPassword(e)
{e.preventDefault();$form=$(this);if(validateForm($form)){var $rootPopup=params.root.find('.i-popup');$rootPopup.addClass(params.procClass);$.ajax({url:$form.attr('action'),data:$form.serializeArray(),method:"post",dataType:"jsonp",success:function(data){$rootPopup.removeClass(params.procClass);if(data.status=='success'){$('#restoreSuccess').find('.i-popup__remind_email').html(data.email);$rootPopup.find('form[name=login]').find('input[type=email]').val(data.email);switchRemindState('remindsuccess');if(data.emailSite){var dom=data.emailSite.replace('http://','').replace('https://','');$('#loginFormRemindSuccess').replaceWith('<a href="'+data.emailSite+'" class="i-button i-button_full-width i-button_large i-button_primary i-popup__form-button" target="_blank">Проверить почту '+dom+'</a>');}else{$('#loginFormRemindSuccess').html('Всё понятно, спасибо').data('site','').attr('data-site','').addClass('i-popup__close');}}else{onErrorCallback(data);}}});}}
function submitPassword(e)
{e.preventDefault();$form=$(this);if(validateForm($form)){var $rootPopup=params.root.find('.i-popup');$rootPopup.addClass(params.procClass);appendHiddenInput(['cl_pid','hpid']);$.ajax({url:$form.attr('action'),data:$form.serializeArray(),method:"post",dataType:"json",success:function(data){$rootPopup.removeClass(params.procClass);if(data.status=='success'){var _state=params.root.find('.i-popup__group').first().data('popupState');params.root.data('popup').changeState(_state,$form);}else{onErrorCallback(data);}}});}}
function submitLogin(e)
{frameCreate('auth_fr');$('FORM.authozby').find('.i-input-group__popover').hide();e.preventDefault();hideErrors();var isDisabled=$(this).data('inpDisabled');var isValid=!formValidate($(this),['stateButton','showInputEmptyError','showInputEmailError','showInputPhoneError','showErrorMessage']);if(!isDisabled&&isValid){$(this).closest('.'+params.popupClass).addClass(params.procClass);try{appendHiddenInput(['cl_pid','hpid']);this.submit();}catch(ex){}}else{e.stopImmediatePropagation();}}
function submitRegister(e)
{frameCreate('auth_fr');$('FORM.authozby').find('.i-input-group__popover').hide();e.preventDefault();hideErrors();var isDisabled=$(this).data('inpDisabled');var isValid=!formValidate($(this),['stateButton','showInputEmptyError','showInputEmailError','showInputPhoneError','showErrorMessage']);if(!isDisabled&&isValid){$(this).closest('.'+params.popupClass).addClass(params.procClass);try{appendHiddenInput(['cl_pid','hpid']);this.submit();}catch(ex){}}else{e.stopImmediatePropagation();}}
function validateForm($form)
{if($form.find('[name=cl_email]').length&&$.trim($form.find('[name=cl_email]').val())==''){$form.find('[name=cl_email]').addClass('i-input_error');onErrorCallback({errorMessage:messages.emptyEmail});return false;}
if($form.find('[name=cl_email]').length&&$form.find('[name=cl_email]').val().indexOf('@')==-1){$form.find('[name=cl_email]').addClass('i-input_error');onErrorCallback({errorMessage:messages.incorrectEmail});return false;}
if($form.find('[name=cl_psw]').length&&$.trim($form.find('[name=cl_psw]').val())==''){$form.find('[name=cl_psw]').addClass('i-input_error');onErrorCallback({errorMessage:messages.emptyPassword});return false;}
if($form.find('[name=new_psw1]').length&&$form.find('[name=new_psw2]').length&&$form.find('[name=new_psw1]').val()!=$form.find('[name=new_psw2]').val()){onErrorCallback({errorMessage:messages.differentPasswords});return false;}
return true;}
function observeExternalProviders(){$('.authozby').each(function(el){if(this.tagName=='FORM'&&$(this).hasClass('authorize'))
{getAuthFormParams(this);}});$('.authozby').each(function(el){if(this.tagName=='A')
{$(this).click(function(e){e.preventDefault();appendHiddenInput(['cl_pid','hpid']);getAuthFormParams($('FORM.authozby'));params.external=1;popup=window.open(this.href+'&'+getAuthParamsString(),'parwin','width=800px,height=600px,status=0,toolbar=0,menubar=0,resizable=1,scrollbars=1');});}});}
function getAuthFormParams(form){var need_arr=['onProceed','onSuccess','onError','onSend','partner_id','oldclient[cl_pid]','oldclient[hpid]'];var data=$(form).serializeArray();if(data)
{for(i in data)
{if(data[i].name=='onSend')
{var tmp=data[i].value.split(',');for(j in tmp)
{need_arr.push(tmp[j]);}}}
for(i in data)
{if($.inArray(data[i].name,need_arr)>-1)
{params[data[i].name]=data[i].value;}}}};function enableInputMask($input){if($input.phonenumber){var inputMaskPhoneGroups=$input.data('phoneGroups').split('|');setTimeout(function(){var phonenumberAttrs={autoUnmask:true,showMaskOnHover:false,positionCaretOnTab:true,};if($.inArray('belarus_mobile_only',inputMaskPhoneGroups)>-1){phonenumberAttrs.onBeforeMask=function(value){if(value.indexOf('375')==0){return value.replace('375','');}
return value;};phonenumberAttrs.onUnMask=function(maskedValue,unmaskedValue){if(unmaskedValue.length&&unmaskedValue.substr(0,3)!='375'){return'375'+unmaskedValue;}
return unmaskedValue;};}
$input.phonenumber({disableLandlineBelarus:$.inArray('disable_landline',inputMaskPhoneGroups)>-1,useOnlyBelarus:$.inArray('belarus_mobile_only',inputMaskPhoneGroups)>-1},phonenumberAttrs);$input.on('focus.auth',function(){var self=this;setTimeout(function(){try{var e=jQuery.Event('keydown.inputmask');e.keyCode=35;$(self).trigger(e);}catch(ex){}},100);});},100);}}
function onSuccessCallback(data){stopPingAuth();if(data.redirect){window.location.href=data.redirect;return;}
params.root.find('.'+params.popupClass).removeClass(params.procClass);}
params.successCallback=onSuccessCallback;function showPhoneEnterCode(){var $input=$('FORM.authozby:visible').find('input.phonenumber[type=tel]');var $phoneForm=$('FORM.authozby:visible');$input.attr('readonly',true);$('#formInputSend').attr('disabled','disabled');$phoneForm.parents('.i-popup__tab-item').addClass('code-sent-state-visible').find('button[type=submit]').text('Подтвердить и войти');$('#formInputLoginCode').attr('disabled',false).focus();}
function resendPhone(){stopPingAuth();var $input=$('FORM.authozby:visible').find('input.phonenumber[type=tel]');var $phoneForm=$('FORM.authozby:visible');$input.attr('readonly',false);$('#formInputSend').attr('disabled',false);$('#formInputLoginCode').attr('disabled','disabled');$phoneForm.data('inpDisabled',false);$phoneForm.parents('.i-popup__tab-item').removeClass('code-sent-state-visible').find('button[type=submit]').text('Отправить SMS с кодом');$phoneForm.submit();}
function hideErrors(){params.root.find('.i-input-group__popover').hide().removeClass('i-input-group__popover_visible');params.root.find('.i-input_error').removeClass('i-input_error');}
function onErrorCallback(data){stopPingAuth();params.root.find('.'+params.popupClass).removeClass(params.procClass);if(data.errorCode&&data.errorCode==12){$('FORM.authozby:visible').find('input[type=email]').addClass('i-input_error');$('FORM.authozby:visible').find('input[type=tel]').addClass('i-input_error');$('FORM.authozby:visible').find('input[type=password]').addClass('i-input_error');}
if(data.errorCode&&data.errorCode==170){showPhoneEnterCode();if(params.smsLinkEnabled&&data.errorMessage){stopPingAuth();startPingAuth(data.errorMessage);}
return;}
if(data.errorMessage){var err=$('FORM.authozby:visible').find('.i-input-group__popover').eq(0);err.find('.i-popover__line').html(data.errorMessage);err.show().addClass('i-input-group__popover_visible');if(data.errorField){var field=$('FORM.authozby:visible').find('input[name='+data.errorField+']').eq(0);field.addClass('i-input_error');inputFocus(field);}else{showfocus();}}else if(data.redirect){window.location.href=data.redirect;}}
function startPingAuth(hash)
{params.pingHash=hash;params.pingTimer=setTimeout(pingAuth,params.pingTimeout);}
function stopPingAuth()
{if(params.pingTimer){clearTimeout(params.pingTimer);}}
function pingAuth()
{var self=this;$.ajax({url:params.smsLinkPinger,data:{hash:params.pingHash,},method:"post",dataType:"jsonp",success:function(data){if(data.status&&data.code){$('#formInputLoginCode').val(data.code);formValidate($('#phoneForm'),['stateButton']);setTimeout(function(){$('#phoneForm').submit();},100);}else{params.pingTimer=setTimeout(pingAuth,params.pingTimeout);}},error:function(){params.pingTimer=setTimeout(pingAuth,params.pingTimeout);}});}
params.errorCallback=onErrorCallback;function getAuthParamsString(){str=new Array();for(i in params)
{str.push(i+'='+escape(params[i]));}
return str.join('&')+'&state=request';};init();function runSuccessCallback(data){return params.successCallback(data);}
function runErrorCallback(data){return params.errorCallback(data);}
return{open:open,openRemind:function(){open('remind');},close:close,onErrorCallback:runErrorCallback,onSuccessCallback:runSuccessCallback,setSuccessCallback:setSuccessCallback,setErrorCallback:setErrorCallback,validateForm:validateForm,setInfoText:setInfoText,setBackUri:setBackUri,showFocus:showfocus,copyEmails:copyEmailToAllForms,copyPhones:copyPhoneToAllForms,stopAutofill:stopAutofill,hideErrors:hideErrors,}};Auth=new AuthPlugin();})(jQuery,window,document);;