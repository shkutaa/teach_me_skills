jQuery(function($){var galleryScroll={params:{contentClass:'b-gallery__content',scrollerClass:'b-gallery__scroller',shadowTopClass:'b-gallery_shadow-top',shadowBottomClass:'b-gallery_shadow-bottom',cnt:0},init:function($el){var params=this.params;params.$el=$el;params.$content=$el.find('.'+params.contentClass);params.$scroller=$el.find('.'+params.scrollerClass);params.$thumbs=params.$content.find('img');this.checkImageLoad();params.$scroller.on('scroll',params.innerScroll=function(){if(params.$scroller.scrollTop()){$el.addClass(params.shadowTopClass);}else{$el.removeClass(params.shadowTopClass);}
if(params.$scroller.scrollTop()>=params.$content.outerHeight()-params.$scroller.outerHeight()){$el.removeClass(params.shadowBottomClass);}else{$el.addClass(params.shadowBottomClass);}});},checkImageLoad:function(){var params=this.params;params.cnt=0;params.$thumbs.each(function(){if(this.complete){params.cnt++;}});if(params.cnt===params.$thumbs.length){galleryScroll.initScrollbars();if(params.$content.outerHeight()>params.$el.outerHeight()||params.$thumbs.length>9){params.$el.addClass(params.shadowBottomClass);}}else{setTimeout(function(){galleryScroll.checkImageLoad();},200);}},initScrollbars:function(){this.params.$scroller.perfectScrollbar({wheelPropagation:false,useKeyboard:false});}};galleryScroll.init($('.b-product__media .b-gallery'));});;