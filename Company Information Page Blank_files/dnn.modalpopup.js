(function(k,e){k.dnnModal={load:function(){try{if(void 0!==parent.location.href){var a=parent;if("undefined"!=typeof a.parent.$find)if(-1==location.href.indexOf("popUp")||-1<a.location.href.indexOf("popUp")){var c=a.jQuery("#iPopUp"),d=c.dialog("option","refresh"),e=c.dialog("option","closingUrl"),g=c.dialog("option","minWidth"),h=c.dialog("option","minHeight"),b=c.dialog("option","showReturn");e||(e=location.href);!0===c.dialog("isOpen")&&c.dialog("option",{close:function(a,c){dnnModal.refreshPopup({url:e,
width:g,height:h,showReturn:b,refresh:d})}}).dialog("close")}else a.jQuery("#iPopUp").dialog({autoOpen:!1,title:document.title})}return!0}catch(l){return!1}},show:function(a,c,d,f,g,h){var b=e("#iPopUp");0==b.length?(b=e('<iframe id="iPopUp" src="about:blank" scrolling="auto" frameborder="0"></iframe>'),e(document.body).append(b)):b.attr("src","about:blank");e(document).find("html").css("overflow","hidden");b.dialog({modal:!0,autoOpen:!0,dialogClass:"dnnFormPopup",position:"center",minWidth:f,minHeight:d,
maxWidth:1920,maxHeight:1080,resizable:!0,closeOnEscape:!0,refresh:g,showReturn:c,closingUrl:h,close:function(b,a){dnnModal.closePopUp(g,h)}}).width(f-11).height(d-11);0===b.parent().find(".ui-dialog-title").next("a.dnnModalCtrl").length&&(d=e('<a class="dnnModalCtrl"></a>'),b.parent().find(".ui-dialog-titlebar-close").wrap(d),d=e('<a href="#" class="dnnToggleMax"><span>Max</span></a>'),b.parent().find(".ui-dialog-titlebar-close").before(d),d.click(function(a){a.preventDefault();var c=e(k);b.data("isMaximized")?
(a=b.data("height"),c=b.data("width"),b.data("isMaximized",!1)):(b.data("height",b.dialog("option","minHeight")).data("width",b.dialog("option","minWidth")).data("position",b.dialog("option","position")),a=c.height()-46,c=c.width()-40,b.data("isMaximized",!0));b.dialog({height:a,width:c});b.dialog({position:"center"})}));(function(){var a=e('<div class="dnnLoading"></div>');a.css({width:b.width(),height:b.height()});b.before(a)})();b[0].src=a;b.bind("load",function(){b.prev(".dnnLoading").remove()});
if("true"==c.toString())return!1},closePopUp:function(a,c){var d=parent,f=d.jQuery("#iPopUp");if("undefined"===typeof a||null==a)a=!0;if("true"==a.toString()){if("undefined"===typeof c||""==c)c=d.location.href;d.location.href=c;f.hide()}else f.dialog("option","close",null).dialog("close");e(d.document).find("html").css("overflow","")},refreshPopup:function(a){var c=parent,d=c.parent;c.location.href!==d.location.href&&c.location.href!==a.url?d.dnnModal.show(a.url,a.showReturn,a.height,a.width,a.refresh,
a.closingUrl):dnnModal.closePopUp(a.refresh,a.url)}};k.dnnModal.load()})(window,jQuery);