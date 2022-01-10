mistplayers.hlsjs={name:"HLS.js player",mimes:["html5/application/vnd.apple.mpegurl","html5/application/vnd.apple.mpegurl;version=7"],priority:MistUtil.object.keys(mistplayers).length+1,isMimeSupported:function(e){return this.mimes.indexOf(e)==-1?false:true},isBrowserSupported:function(e,t,s){if(location.protocol!=MistUtil.http.url.split(t.url).protocol){s.log("HTTP/HTTPS mismatch for this source");return false}return true},player:function(){},scriptsrc:function(e){return e+"/hlsjs.js"}};var p=mistplayers.hlsjs.player;p.prototype=new MistPlayer;p.prototype.build=function(e,t){var s=this;var l=document.createElement("video");l.setAttribute("playsinline","");var r=["autoplay","loop","poster"];for(var i in r){var o=r[i];if(e.options[o]){l.setAttribute(o,e.options[o]===true?"":e.options[o])}}if(e.options.muted){l.muted=true}if(e.info.type=="live"){l.loop=false}if(e.options.controls=="stock"){l.setAttribute("controls","")}l.setAttribute("crossorigin","anonymous");this.setSize=function(e){l.style.width=e.width+"px";l.style.height=e.height+"px"};this.api=l;e.player.api.unload=function(){if(e.player.hls){e.player.hls.destroy();e.player.hls=false;e.log("hls.js instance disposed")}};function n(t){e.player.hls=new Hls({maxBufferLength:15,maxMaxBufferLength:60});e.player.hls.attachMedia(l);e.player.hls.on(Hls.Events.MEDIA_ATTACHED,function(){console.log("video and hls.js are now bound together !");e.player.hls.loadSource(t);e.player.hls.on(Hls.Events.MANIFEST_PARSED,function(e,t){console.log("manifest loaded, found "+t.levels.length+" quality level")})})}e.player.api.setSource=function(t){if(!e.player.hls){return}if(e.player.hls.url!=t){e.player.hls.destroy();n(t)}};e.player.api.setSubtitle=function(e){var t=l.getElementsByTagName("track");for(var s=t.length-1;s>=0;s--){l.removeChild(t[s])}if(e){var r=document.createElement("track");l.appendChild(r);r.kind="subtitles";r.label=e.label;r.srclang=e.lang;r.src=e.src;r.setAttribute("default","")}};function a(){n(e.source.url)}if("Hls"in window){a()}else{var p=e.urlappend(mistplayers.hlsjs.scriptsrc(e.options.host));MistUtil.scripts.insert(p,{onerror:function(t){var s="Failed to load hlsjs.js";if(t.message){s+=": "+t.message}e.showError(s)},onload:a},e)}t(l)};