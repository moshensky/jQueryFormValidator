!function(i){var g="[data-toggle=dropdown]",h=function(a){var b=i(a).on("click.dropdown.data-api",this.toggle);i("html").on("click.dropdown.data-api",function(){b.parent().removeClass("open")})};h.prototype={constructor:h,toggle:function(a){var b=i(this),c,d;if(b.is(".disabled, :disabled")){return}c=j(b);d=c.hasClass("open");k();if(!d){c.toggleClass("open")}b.focus();return false},keydown:function(b){var c,a,n,d,e,f;if(!/(38|40|27)/.test(b.keyCode)){return}c=i(this);b.preventDefault();b.stopPropagation();if(c.is(".disabled, :disabled")){return}d=j(c);e=d.hasClass("open");if(!e||(e&&b.keyCode==27)){if(b.which==27){d.find(g).focus()}return c.click()}a=i("[role=menu] li:not(.divider):visible a",d);if(!a.length){return}f=a.index(a.filter(":focus"));if(b.keyCode==38&&f>0){f--}if(b.keyCode==40&&f<a.length-1){f++}if(!~f){f=0}a.eq(f).focus()}};function k(){i(g).each(function(){j(i(this)).removeClass("open")})}function j(a){var c=a.attr("data-target"),b;if(!c){c=a.attr("href");c=c&&/#/.test(c)&&c.replace(/.*(?=#[^\s]*$)/,"")}b=c&&i(c);if(!b||!b.length){b=a.parent()}return b}var l=i.fn.dropdown;i.fn.dropdown=function(a){return this.each(function(){var b=i(this),c=b.data("dropdown");if(!c){b.data("dropdown",(c=new h(this)))}if(typeof a=="string"){c[a].call(b)}})};i.fn.dropdown.Constructor=h;i.fn.dropdown.noConflict=function(){i.fn.dropdown=l;return this};i(document).on("click.dropdown.data-api",k).on("click.dropdown.data-api",".dropdown form",function(a){a.stopPropagation()}).on(".dropdown-menu",function(a){a.stopPropagation()}).on("click.dropdown.data-api",g,h.prototype.toggle).on("keydown.dropdown.data-api",g+", [role=menu]",h.prototype.keydown)}(window.jQuery);