function disableButtons()
{var btnLogin=jQuery('#btn-submit-l');var btnRegister=jQuery('#btn-submit-r');if(btnLogin.length){if(btnLogin.hasClass('button-verybig')){btnLogin.addClass('button-verybig-dis');}else{btnLogin.addClass('button-big-dis');}
btnLogin.attr('disabled','disabled');}
if(btnRegister.length){if(btnRegister.hasClass('button-verybig')){btnRegister.addClass('button-verybig-dis');}else{btnRegister.addClass('button-big-dis');}
btnRegister.attr('disabled','disabled');}
return true;}
function enableButtons()
{var btnLogin=jQuery('#btn-submit-l');var btnRegister=jQuery('#btn-submit-r');if(btnLogin.length){if(btnLogin.hasClass('button-verybig')){btnLogin.removeClass('button-verybig-dis');}else{btnLogin.removeClass('button-big-dis');}
btnLogin.removeAttr('disabled');}
if(btnRegister.length){if(btnRegister.hasClass('button-verybig')){btnRegister.removeClass('button-verybig-dis');}else{btnRegister.removeClass('button-big-dis');}
btnRegister.removeAttr('disabled');}
return true;}
function CheckForm(type){disableButtons();if(type=='login'){l=jQuery('#log-1');if(!l.length){l=jQuery('#login-en-1');}
p=jQuery('#log-2');if(!p.length){p=jQuery('#login-en-2');}
if(l.val().length==0){enableButtons();alert('Введите адрес электронной почты!');l.focus();return false;}
if(l.val().indexOf('@')==-1){enableButtons();alert('Введите корректный адрес электронной почты!');l.focus();return false;}
if(!window.INTELLECT_CLIENT_SHOP&&p.val().length==0){enableButtons();alert('Введите пароль!');p.focus();return false;}}
if(type=='auth'){e=jQuery('#reg-1');if(!e.length){e=jQuery('#login-registr');}
if(e.val().length==0){enableButtons();alert('Введите адрес электронной почты!');e.focus();return false;}
if(e.val().indexOf('@')==-1){enableButtons();alert('Введите корректный адрес электронной почты!');e.focus();return false;}}
return true;}
function m(tab,backUri){if(backUri!=null){var backUriInput=document.getElementById("back_uri");if(backUriInput!=null){backUriInput.value=backUri;}}
jQuery('#modal_form_contents, #overlay-login').show();document.onkeyup=function(e){if(e==null){keycode=event.keyCode;}else{keycode=e.which;}
if(keycode==27){m_remove();}}
showtab(tab);}
function m_remove(){jQuery('#modal_form_contents, #overlay-login').hide();document.onkeyup=""}
function showtab(tab){if(tab=='1'){Auth.open('login');}else{Auth.open('register');}
return;};