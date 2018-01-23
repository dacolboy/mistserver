mistplayers.dashjs={name:"Dash.js player",mimes:["dash/video/mp4"],priority:MistUtil.object.keys(mistplayers).length+1,isMimeSupported:function(t){return MistUtil.array.indexOf(this.mimes,t)==-1?false:true},isBrowserSupported:function(t,e,i){if(location.protocol!=MistUtil.http.url.split(e.url).protocol){i.log("HTTP/HTTPS mismatch for this source");return false}if(location.protocol=="file:"){i.log("This source ("+t+") won't load if the page is run via file://");return false}return"MediaSource"in window},player:function(){this.onreadylist=[]},scriptsrc:function(t){return t+"/dashjs.js"}};var p=mistplayers.dashjs.player;p.prototype=new MistPlayer;p.prototype.build=function(t,e){var i=this;this.onDashLoad=function(){if(t.destroyed){return}t.log("Building DashJS player..");var r=document.createElement("video");if("Proxy"in window){var a={get:{},set:{}};t.player.api=new Proxy(r,{get:function(t,e,i){if(e in a.get){return a.get[e].apply(t,arguments)}var r=t[e];if(typeof r==="function"){return function(){return r.apply(t,arguments)}}return r},set:function(t,e,i){if(e in a.set){return a.set[e].call(t,i)}return t[e]=i}});if(t.info.type=="live"){a.get.duration=function(){var e=0;if(this.buffered.length){e=this.buffered.end(this.buffered.length-1)}var i=((new Date).getTime()-t.player.api.lastProgress.getTime())*.001;return e+i+-1*t.player.api.liveOffset+45};a.set.currentTime=function(e){var i=e-t.player.api.duration;t.log("Seeking to "+MistUtil.format.time(e)+" ("+Math.round(i*-10)/10+"s from live)");t.video.currentTime=e};MistUtil.event.addListener(r,"progress",function(){t.player.api.lastProgress=new Date});t.player.api.lastProgress=new Date;t.player.api.liveOffset=0}}else{i.api=r}if(t.options.autoplay){r.setAttribute("autoplay","")}if(t.options.loop&&t.info.type!="live"){r.setAttribute("loop","")}if(t.options.poster){r.setAttribute("poster",t.options.poster)}if(t.options.controls=="stock"){r.setAttribute("controls","")}var s=dashjs.MediaPlayer().create();s.initialize(r,t.source.url,t.options.autoplay);i.dash=s;var o=["METRIC_ADDED","METRIC_CHANGED","METRICS_CHANGED","FRAGMENT_LOADING_STARTED","FRAGMENT_LOADING_COMPLETED","LOG","PLAYBACK_TIME_UPDATED","PLAYBACK_PROGRESS"];for(var n in dashjs.MediaPlayer.events){if(o.indexOf(n)<0){i.dash.on(dashjs.MediaPlayer.events[n],function(e){t.log("Player event fired: "+e.type)})}}t.player.setSize=function(t){this.api.style.width=t.width+"px";this.api.style.height=t.height+"px"};t.player.api.setSource=function(e){t.player.dash.attachSource(e)};t.player.api.setTrack=function(e,r){var a=MistUtil.tracks.parse(t.info.meta.tracks);if(!(e in a)||!(r in a[e])&&r!=0){t.log("Skipping trackselection of "+e+" track "+r+" because it does not exist");return}var s=i.dash.getBitrateInfoListFor("video").length-1;for(var o in t.info.meta.tracks){var n=t.info.meta.tracks[o];if(n.type==e){if(n.trackid==r){break}s--}}i.dash.setAutoSwitchQualityFor(e,false);i.dash.setFastSwitchEnabled(true);i.dash.setQualityFor(e,s)};i.dash.on("qualityChangeRendered",function(e){var r=i.dash.getBitrateInfoListFor("video").length-1;var a;for(var s in t.info.meta.tracks){var o=t.info.meta.tracks[s];if(o.type==e.mediaType){if(e.newQuality==r){a=o.trackid;break}r--}}MistUtil.event.send("playerUpdate_trackChanged",{type:e.mediaType,trackid:a},t.video)});MistUtil.event.addListener(r,"progress",function(e){if(t.container.getAttribute("data-loading")=="stalled"){t.container.removeAttribute("data-loading")}});i.api.unload=function(){i.dash.reset()};t.log("Built html");e(r)};if("dashjs"in window){this.onDashLoad()}else{var r=MistUtil.scripts.insert(t.urlappend(mistplayers.dashjs.scriptsrc(t.options.host)),{onerror:function(e){var i="Failed to load dashjs.js";if(e.message){i+=": "+e.message}t.showError(i)},onload:i.onDashLoad},t)}};