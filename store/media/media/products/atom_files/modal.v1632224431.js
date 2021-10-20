var Modal=(function($){var modal={params:{selectorToggleModal:'[data-modal]',selectorModal:'.modal',selectorCloseButton:'.modal__close',classNameOpenedModal:'modal-open',classNameOverlay:'i-overlay',classNameHidden:'i-overlay_hidden',isShown:false,},show:function(relatedTarget){var $overlayEl=$('#'+relatedTarget)
this.params.isShown=true
$overlayEl.removeClass(this.params.classNameHidden)
$('body, html').addClass(this.params.classNameOpenedModal)},hide:function(relatedTarget){var $overlayEl
if(typeof relatedTarget=='string'){$overlayEl=$('#'+relatedTarget)}else{$overlayEl=$(relatedTarget)}
this.params.isShown=false
$overlayEl.addClass(this.params.classNameHidden)
$('body, html').removeClass(this.params.classNameOpenedModal)},handleClickCloseButton:function(event){var $closeEl=$(event.currentTarget)
var $overlayEl=$closeEl.closest('.'+this.params.classNameOverlay)
if($overlayEl.length){this.hide($overlayEl)}},handleKeyUp:function(event){if(this.params.isShown&&event.key==='Escape'){var $overlayEl=$('.'+this.params.classNameOverlay)
this.hide($overlayEl)}},handleClickOuter:function(event){var $modalEl=event.currentTarget
var $target=event.target
var $overlayEl=$modalEl.closest('.'+this.params.classNameOverlay)
if($modalEl==$target){this.hide($overlayEl)}},handleClickToggleModal:function(event){var idModal=event.currentTarget.dataset.modal
this.show(idModal)},listenClickCloseButton:function(){$(this.params.selectorCloseButton).on('click',this.handleClickCloseButton.bind(this))},listenHandleKeyUp:function(){$(document).keyup(this.handleKeyUp.bind(this))},listenHandleClickOuter:function(){$(this.params.selectorModal).on('click',this.handleClickOuter.bind(this))},listenToggleModal:function(){$(this.params.selectorToggleModal).on('click',this.handleClickToggleModal.bind(this))},listenEvents:function(){this.listenToggleModal()
this.listenHandleClickOuter()
this.listenClickCloseButton()
this.listenHandleKeyUp()},init:function(){this.listenEvents()},}
modal.init()
return modal})(jQuery);