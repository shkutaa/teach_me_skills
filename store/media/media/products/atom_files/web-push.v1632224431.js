firebase.initializeApp(firebaseConfig);var messaging=firebase.messaging();jQuery(document).ready(function(){navigator.serviceWorker.register('/js/sw.js').then(function(registration){if(authenticatedClient&&canAskPermission){messaging.useServiceWorker(registration);if(Notification.permission==="default"){sendLog('asked');}
if(Notification.permission==="default"||Notification.permission==='granted'){messaging.requestPermission().then(function(){return messaging.getToken();}).then(function(currentToken){sendTokenToServer(currentToken);}).catch(function(err){console.log(err);});}}});});messaging.onMessage(function(payload){navigator.serviceWorker.register('/js/sw.js').then(function(registration){options={data:payload.data,body:payload.data.body,icon:payload.data.icon,tag:payload.data.id_message};if(payload.data.image){options.image=payload.data.image;}
if(payload.data.actions){options.actions=JSON.parse(payload.data.actions);}
sendMessageLog(payload.data.id_message,'show');registration.showNotification(payload.data.title,options);}).catch(function(err){console.log(err);});});navigator.permissions.query({name:'notifications'}).then(function(permission){permission.onchange=function(){if(permission.state==="granted"){sendLog('granted');}
if(permission.state==="denied"){sendLog('declined');}};});messaging.onTokenRefresh(function(){messaging.getToken().then(function(refreshedToken){sendTokenToServer(refreshedToken);}).catch(function(err){console.log(err);});});function sendTokenToServer(token){if(!isTokenSentToServer(token)){jQuery.ajax({url:'/personal/ajax/push/token.php',type:'post',dataType:'json',data:{token:token,action:'token'},success:function(response){}});setTokenSentToServer(token);}}
function isTokenSentToServer(currentToken){return window.localStorage.getItem('pushToken')==currentToken;}
function setTokenSentToServer(currentToken){window.localStorage.setItem('pushToken',currentToken?currentToken:'');}
function sendLog(action){jQuery.ajax({url:'/personal/ajax/push/log.php',type:'post',dataType:'json',data:{action:action,'userAgent':navigator.userAgent},success:function(response){}});}
function sendMessageLog(messageId,action){jQuery.ajax({url:'/personal/ajax/push/messageLog.php',type:'post',dataType:'json',data:{messageId:messageId,action:action},success:function(response){}});};