!function(f){var d=function(a,b){this.$element=f(a);this.options=f.extend({},f.fn.button.defaults,b)};d.prototype.setState=function(c){var a="disabled",k=this.$element,j=k.data(),b=k.is("input")?"val":"html";c=c+"Text";j.resetText||k.data("resetText",k[b]());k[b](j[c]||this.options[c]);setTimeout(function(){c=="loadingText"?k.addClass(a).attr(a,a):k.removeClass(a).removeAttr(a)},0)};d.prototype.toggle=function(){var a=this.$element.closest('[data-toggle="buttons-radio"]');a&&a.find(".active").removeClass("active");this.$element.toggleClass("active")};var e=f.fn.button;f.fn.button=function(a){return this.each(function(){var b=f(this),c=b.data("button"),h=typeof a=="object"&&a;if(!c){b.data("button",(c=new d(this,h)))}if(a=="toggle"){c.toggle()}else{if(a){c.setState(a)}}})};f.fn.button.defaults={loadingText:"loading..."};f.fn.button.Constructor=d;f.fn.button.noConflict=function(){f.fn.button=e;return this};f(document).on("click.button.data-api","[data-toggle^=button]",function(a){var b=f(a.target);if(!b.hasClass("btn")){b=b.closest(".btn")}b.button("toggle")})}(window.jQuery);