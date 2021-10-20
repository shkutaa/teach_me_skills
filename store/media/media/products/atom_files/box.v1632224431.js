function AjaxBox(context)
{this.ajaxRequestsInProgress=[];this.totalTries=[];this.totalTriesLimit=3;this.context=context;this.formClass='addtocartform';this.linkType='image_box';this.isSmallButton=true;this.successAddToCartCallbacks=[];this.failAddToCartCallbacks=[];this.initialize=function()
{this.initializeForms();this.initializeLinks();}
this.initializeForms=function()
{var elements=jQuery('.'+this.formClass,this.context);if(elements.length){var obj=this;jQuery(elements).each(function(){var idGoods=0;if(jQuery('input[name="id"]',this).length){idGoods=jQuery('input[name="id"]',this).val();}
if(!isNaN(parseInt(idGoods))){jQuery(this).submit(function(){obj.showLoader(this);obj.addToCart(idGoods,this);return false;});}});}}
this.initializeLinks=function()
{var obj=this;jQuery(document).on('click.addToCart','a[type="'+this.linkType+'"]',function(e){var link=this;e.preventDefault();var idGoods=parseInt(jQuery(this).attr('id').replace('a_',''));if(!isNaN(idGoods)){obj.showLoader(this);obj.addToCart(idGoods,this);jQuery(link).attr('type','');}});}
this.unbind=function(element)
{if(jQuery(element).is('form')){jQuery(element).attr('action','/checkout/').attr('method','GET').unbind('submit').submit(function(){window.location.href='/checkout/';return false;});jQuery('input',element).each(function(){jQuery(this).remove();});}
if(jQuery(element).is('a')){jQuery(element).unbind('click');}}
this._loaderForm=function(element,action,context)
{element=jQuery('button',element);if(jQuery(element).length){if(action=='show'){if(!jQuery('.addtocart-btn').hasClass('i-button_processing')){jQuery('.addtocart-btn').addClass('i-button_processing');}}else{if(jQuery('.addtocart-btn').hasClass('i-button_processing')){jQuery('.addtocart-btn').removeClass('i-button_processing');}
if((context!=null)&&(context!=undefined)&&context.length){jQuery(element).replaceWith(context);}}}}
this._loaderLink=function(element,action,context)
{var origElement=element;if(jQuery(element).length){if(action=='show'){jQuery(element).addClass('item-type-card__btn--loader');}else{if((context!=null)&&(context!=undefined)&&context.length){jQuery(origElement).replaceWith(context);}else{jQuery(element).removeClass('item-type-card__btn--loader');jQuery(element).attr('href','/checkout/').addClass('item-type-card__cost__link--active').find('.item-type-card__btn__ico--cart').removeClass('item-type-card__btn__ico--cart').addClass('item-type-card__btn__ico--check');}}}}
this.addToCart=function(idGoods,element)
{this._ajaxCall(idGoods,element);}
this.addSuccessAddToCartCallback=function(callback)
{this.successAddToCartCallbacks.push(callback);}
this.addFailAddToCartCallback=function(callback)
{this.failAddToCartCallbacks.push(callback);}
this._ajaxCall=function(idGoods,element)
{if(this.isAjaxRequestInProgress(idGoods)){return;}
this.onStartAjaxRequest(idGoods);var obj=this;var type='html';var searchToken='';if(jQuery(element).is('a')){type='image';try{searchToken=jQuery(element).attr('href').match(/sbtoken=([^&]+)/)[1];}catch(e){}}else{searchToken=jQuery('input[name="sbtoken"]').val();}
var secondGoodsFromSet;try{secondGoodsFromSet=jQuery("#goods-set-form").find("input[name=id]").val();secondGoodsFromSet=secondGoodsFromSet.split(',');secondGoodsFromSet=parseInt(secondGoodsFromSet[1]);}catch(e){secondGoodsFromSet=0;}
this.incrementAjaxRequestsTries(idGoods);jQuery.ajax({url:'/goods/ajax/html_box.php',data:{idGoods:idGoods,type:type,sm:this.isSmallButton,searchToken:searchToken,secondGoodsFromSet:secondGoodsFromSet},dataType:'json',success:function(response){obj.onFinishAjaxRequest(idGoods);if(response.status){obj.unbind(element);if(jQuery(element).data('rel')=='grid'||(type=='html')){response.context='';}
obj.hideLoader(element,response.context);if(type=='html'){jQuery('.goods-items-popup').removeClass('goods-items-popup_visible');var $goodsPopup=jQuery(element).closest('.b-product-control__row').find('.goods-items-popup');if($goodsPopup.length){$goodsPopup.addClass('goods-items-popup_visible');$goodsPopup.find('.goods-items-popup__close').on('click',function(){$goodsPopup.removeClass('goods-items-popup_visible');});}
jQuery('.first-button').addClass('b-product-control__button_hidden').remove();jQuery('.second-button').removeClass('b-product-control__button_hidden').removeClass('b-product-control__state-button');}
if(response.sgfs_in_cart){var setFb=jQuery(".add-set-to-cart");var setSb=jQuery(".added-set-to-cart");if(setFb.length){setFb.addClass('b-product-control__button_hidden').remove();}
if(setSb.length){setSb.removeClass("b-product-control__button_hidden").removeClass("b-product-control__state-button");}}
var inCart=isNaN(parseInt(response.in_cart))?0:parseInt(response.in_cart);jQuery('.top-panel__userbar__cart__item span.top-panel__userbar__cart__count').html(response.in_cart).css('display','inline-block');if(jQuery('.footer-full .cartCounter').length){jQuery('.footer-full .cartCounter').html(response.in_cart);}
try{yaCounter1067243.reachGoal('cart_add_goods');}catch(e){}
if(typeof VK==="undefined"){jQuery(document).on('vk_retargeting_init',function(){try{VK.Retargeting.Event('AddToCart');}catch(e){}});}else{try{VK.Retargeting.Event('AddToCart');}catch(e){}}
try{fbq('track','AddToCart');}catch(e){}
try{dataLayer.push({'event':'gaEvent','eventCategory':'cart','eventAction':'add_goods'});}catch(e){}
try{dataLayer.push({'event':'addToCart','ecommerce':{'add':{'products':[response.goodsJSON]}}});}catch(e){}
if(obj.successAddToCartCallbacks.length){jQuery(obj.successAddToCartCallbacks).each(function(){this(idGoods,element);});}
try{__AtmUrls=window.__AtmUrls||[];__AtmUrls.push('https://oz.by/add-to-cart');}catch(e){}
if(response.clpid&&response.hpid){try{var loginBlock=jQuery('form#loginForm #auth-login-hidden'),phoneBlock=jQuery('form#phoneForm #auth-login-hidden'),registerBlock=jQuery('form#registerForm #auth-login-hidden');var setClpid=function(block){var inputClpid=block.find('input[name="oldclient[cl_pid]"]');if(jQuery(inputClpid).length){jQuery(inputClpid).val(response.clpid);}else{block.append('<input type="hidden" name="oldclient[cl_pid]" value="'+response.clpid+'">');}};var setHpid=function(block){var inputHpid=block.find('input[name="oldclient[hpid]"]');if(jQuery(inputHpid).length){jQuery(inputHpid).val(response.hpid);}else{block.append('<input type="hidden" name="oldclient[hpid]" value="'+response.hpid+'">');}};setClpid(loginBlock);setHpid(loginBlock);setClpid(phoneBlock);setHpid(phoneBlock);setClpid(registerBlock);setHpid(registerBlock);}catch(e){}}}else{obj.hideLoader(element);if(obj.getTotalTries(idGoods)>=obj.totalTriesLimit){var backUri=window.location.href;window.location.href='/checkout/add.phtml?id='+idGoods+'&back_uri='+backUri;}else{obj.addToCart(idGoods,element);}
if(obj.failAddToCartCallbacks.length){jQuery(obj.failAddToCartCallbacks).each(function(){this(idGoods,element);});}}},error:function(response){obj.onFinishAjaxRequest(idGoods);obj.hideLoader(element);if(obj.getTotalTries(idGoods)>=obj.totalTriesLimit){var backUri=window.location.href;window.location.href='/checkout/add.phtml?id='+idGoods+'&back_uri='+backUri;}else{obj.addToCart(idGoods,element);}}});}
this.isAjaxRequestInProgress=function(idGoods)
{var inProgress=false;jQuery(this.ajaxRequestsInProgress).each(function(){if((this.idGoods==idGoods)&&(this.inProgress==true)){inProgress=true;return true;}});return inProgress;}
this.onStartAjaxRequest=function(idGoods)
{var processed=false;jQuery(this.ajaxRequestsInProgress).each(function(){if(this.idGoods==idGoods){this.inProgress=true;processed=true;return;}});if(!processed){this.ajaxRequestsInProgress.push({idGoods:idGoods,inProgress:true});}}
this.onFinishAjaxRequest=function(idGoods)
{var processed=false;jQuery(this.ajaxRequestsInProgress).each(function(){if(this.idGoods==idGoods){this.inProgress=false;processed=true;return;}});if(!processed){this.ajaxRequestsInProgress.push({idGoods:idGoods,inProgress:false});}}
this.showLoader=function(element)
{if(jQuery(element).is('form')){this._loaderForm(element,'show');}
if(jQuery(element).is('a')){this._loaderLink(element,'show');}}
this.hideLoader=function(element,context)
{if(jQuery(element).is('form')){this._loaderForm(element,'hide',context);}
if(jQuery(element).is('a')){this._loaderLink(element,'hide',context);}}
this.getTotalTries=function(idGoods)
{var totalTries=0;jQuery(this.totalTries).each(function(){if(this.idGoods==idGoods){totalTries=this.totalTries;return;}});return totalTries;}
this.incrementAjaxRequestsTries=function(idGoods)
{var processed=false;jQuery(this.totalTries).each(function(){if(this.idGoods==idGoods){this.totalTries++;processed=true;return;}});if(!processed){this.totalTries.push({idGoods:idGoods,totalTries:1});}}}
var AjaxBoxInstance=new AjaxBox();jQuery(document).ready(function(){AjaxBoxInstance.initialize();});;