jQuery(function($){var $input=$('#top-s'),$inputContainer=$input.closest('.top-panel__search__inner'),$resetBtn=$('.top-panel .reset'),openClass='top-panel__search__inner_open',allowBlur=true;if($input.length){$input.on('focus',function(){if(!$inputContainer.hasClass(openClass))$inputContainer.addClass(openClass);});$input.on('blur',function(){setTimeout(function(){if(allowBlur&&$inputContainer.hasClass(openClass))$inputContainer.removeClass(openClass);},100);});$input.on('blockBlur',function(){allowBlur=false;});$resetBtn.on('click',function(e){e.preventDefault();$input.val('');});}});;