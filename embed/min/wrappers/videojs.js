mistplayers.videojs={name:"VideoJS player",mimes:["html5/application/vnd.apple.mpegurl","html5/application/vnd.apple.mpegurl;version=7"],priority:MistUtil.object.keys(mistplayers).length+1,isMimeSupported:function(e){return this.mimes.indexOf(e)==-1?false:true},isBrowserSupported:function(e,t,i){if(location.protocol!=MistUtil.http.url.split(t.url).protocol){i.log("HTTP/HTTPS mismatch for this source");return false}if(location.protocol=="file:"&&e=="html5/application/vnd.apple"){i.log("This source ("+e+") won't load if the page is run via file://");return false}return"MediaSource"in window},player:function(){},scriptsrc:function(e){return e+"/videojs.js"}};var p=mistplayers.videojs.player;p.prototype=new MistPlayer;p.prototype.build=function(e,t){var i=this;var r;function o(){if(e.destroyed){return}e.log("Building VideoJS player..");r=document.createElement("video");if(e.source.type!="html5/video/ogg"){r.crossOrigin="anonymous"}var o=e.source.type.split("/");if(o[0]=="html5"){o.shift()}var s=document.createElement("source");s.setAttribute("src",e.source.url);i.source=s;r.appendChild(s);s.type=o.join("/");e.log("Adding "+s.type+" source @ "+e.source.url);MistUtil.class.add(r,"video-js");var n={};if(e.options.autoplay){n.autoplay=true}if(e.options.loop&&e.info.type!="live"){n.loop=true;r.loop=true}if(e.options.muted){n.muted=true;r.muted=true}if(e.options.poster){n.poster=e.options.poster}if(e.options.controls=="stock"){r.setAttribute("controls","");if(!document.getElementById("videojs-css")){var a=document.createElement("link");a.rel="stylesheet";a.href=e.options.host+"/skins/videojs.css";a.id="videojs-css";document.head.appendChild(a)}}else{n.controls=false}i.onready(function(){e.log("Building videojs");i.videojs=videojs(r,n,function(){e.log("Videojs initialized")});i.api.unload=function(){if(i.videojs){videojs(r).dispose();i.videojs=false;e.log("Videojs instance disposed")}};MistUtil.event.addListener(e.options.target,"error",function(t){var r=false;switch(t.message){case"Stream is shutting down":{t.preventDefault();break}case"Stream is offline":{e.clearError();t.preventDefault();if(e.video){r=MistUtil.event.addListener(e.video,"waiting",function(){i.api.pause();e.showError("Stream is offline ",{polling:true});if(r){MistUtil.event.removeListener(r)}})}break}case"Stream is waiting for data":{if(r){MistUtil.event.removeListener(r)}i.api.pause();e.reload();break}}},e.video)});e.log("Built html");if("Proxy"in window&&"Reflect"in window){var l={get:{},set:{}};e.player.api=new Proxy(r,{get:function(e,t,i){if(t in l.get){return l.get[t].apply(e,arguments)}var r=e[t];if(typeof r==="function"){return function(){return r.apply(e,arguments)}}return r},set:function(e,t,i){if(t in l.set){return l.set[t].call(e,i)}return e[t]=i}});if(e.info.type=="live"){function p(e){var t=0;if(e.buffered.length){t=e.buffered.end(e.buffered.length-1)}return t}var u=0;l.get.duration=function(){if(e.info){var t=(e.info.lastms+(new Date).getTime()-e.info.updated.getTime())*.001;return t}return 0};e.player.api.lastProgress=new Date;e.player.api.liveOffset=0;MistUtil.event.addListener(r,"progress",function(){e.player.api.lastProgress=new Date});l.set.currentTime=function(t){var i=e.player.api.currentTime-t;var r=t-e.player.api.duration;e.log("Seeking to "+MistUtil.format.time(t)+" ("+Math.round(r*-10)/10+"s from live)");e.video.currentTime-=i};var d=0;l.get.currentTime=function(){if(e.info){d=e.info.lastms*.001}var t=this.currentTime+d-e.player.api.liveOffset-u;if(isNaN(t)){return 0}return t}}}else{i.api=r}e.player.setSize=function(t){if("videojs"in e.player){e.player.videojs.dimensions(t.width,t.height);r.parentNode.style.width=t.width+"px";r.parentNode.style.height=t.height+"px"}this.api.style.width=t.width+"px";this.api.style.height=t.height+"px"};e.player.api.setSource=function(t){if(!e.player.videojs){return}if(e.player.videojs.src()!=t){e.player.videojs.src({type:e.player.videojs.currentSource().type,src:t})}};e.player.api.setSubtitle=function(e){var t=r.getElementsByTagName("track");for(var i=t.length-1;i>=0;i--){r.removeChild(t[i])}if(e){var o=document.createElement("track");r.appendChild(o);o.kind="subtitles";o.label=e.label;o.srclang=e.lang;o.src=e.src;o.setAttribute("default","")}};t(r)}if("videojs"in window){o()}else{var s=e.urlappend(mistplayers.videojs.scriptsrc(e.options.host));var n;window.onerror=function(t,i,o,s,a){if(i==n.src){r.pause();e.showError("Error in videojs player");e.reload()}return false};n=MistUtil.scripts.insert(s,{onerror:function(t){var i="Failed to load videojs.js";if(t.message){i+=": "+t.message}e.showError(i)},onload:o},e)}};