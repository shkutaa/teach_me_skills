function isMobile()
{return jQuery('html').hasClass('mobile-yes');}
function getUrlParam(url,paramName){paramName=paramName.replace(/[\[]/,"\\[").replace(/[\]]/,"\\]");var regex=new RegExp("[\\?&]"+paramName+"=([^&#]*)"),results=regex.exec(url);return results===null?"":decodeURIComponent(results[1].replace(/\+/g," "));}
function beforePrepare(){globalAjaxOptions.AJAX_REQUEST_HTTP_HOST='/';globalAjaxOptions.AJAX_RETURN_XML_ONLY=true;}
function showOverlay()
{var overlay='<div style="display: block;" class="pp-window-user-overlay"></div>';jQuery('body').append(overlay);}
function hideOverlay()
{jQuery('.pp-window-user-overlay').remove();}
function fstr(count,names){var index=0;if(count%10==1&&count%100!=11){index=0;}else{if((count%10>=2)&&(count%10<=4)&&(count%100<10||count%100>=20)){index=1;}else{index=2;}}
return names[index];}
function number_format(number,decimals,dec_point,thousands_sep){number=(number+'').replace(/[^0-9+\-Ee.]/g,'');var n=!isFinite(+number)?0:+number,prec=!isFinite(+decimals)?0:Math.abs(decimals),sep=(typeof thousands_sep==='undefined')?',':thousands_sep,dec=(typeof dec_point==='undefined')?'.':dec_point,s='',toFixedFix=function(n,prec){var k=Math.pow(10,prec);return''+Math.round(n*k)/k;};s=(prec?toFixedFix(n,prec):''+Math.round(n)).split('.');if(s[0].length>3){s[0]=s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g,sep);}
if((s[1]||'').length<prec){s[1]=s[1]||'';s[1]+=new Array(prec-s[1].length+1).join('0');}
return s.join(dec);}
function context_help(l)
{s=window.open('/help/assistant.phtml?l='+l,'assistant','scrollbars=yes,resizable=yes,width=853,height=683,top=157,left=209');s.focus();}
function scrollToElement(selector)
{var _top=jQuery(selector).eq(0).data('pageInitScrollTop')||0;jQuery('html, body').animate({scrollTop:jQuery(selector).eq(0).offset().top+_top},50);}
jQuery(document).ready(function(){try
{if(jQuery('html').hasClass('mobile-yes')&&!jQuery('html').hasClass('mobile-navcatalog')&&jQuery('.page-init-scroll').length){var _top=jQuery('.page-init-scroll').last().data('pageInitScrollTop')||0;jQuery('html, body').animate({scrollTop:jQuery('.page-init-scroll').last().offset().top+_top},50);}}catch(e){}});;