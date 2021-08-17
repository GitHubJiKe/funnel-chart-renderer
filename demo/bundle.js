(()=>{"use strict";var e,t,r={547:()=>{const e={theme1:["#5B8FF9","#61DDAA","#65789B","#F6BD16","#7262fd","#78D3F8","#9661BC","#F6903D","#008685","#F08BB4"],theme2:["#B8E1FF","#CDDDFD","#CDF3E4","#CED4DE","#FCEBB9","#D3CEFD","#D3EEF9","#DECFEA","#FFE0C7","#BBDEDE","#FFE0ED"]},t={400:"传入容器ID有误，无法获取容器节点",401:"数据过少，无法渲染图表"};class r extends Error{message;code;constructor(e){super(),this.code=e,this.message=t[e]}}function n(e){return`${e}px`}function i(e,t){for(const r in t){const n=t[r];e.style[r]=n}}class o{eleId;opts;ctx;canvas;colorIdx=0;itemHeight=80;points=[];colors=[...e.theme1];container;tooltip;canvasEvents=[];curHoverIdx;data;dom;tempData;copiedData;containerOpts={width:400,height:400,padding:8};shapeOpts={maxSize:1,minSize:1};constructor(e,t){this.eleId=e,this.opts={legend:!0,tooltip:!0,xField:"text",yField:"value",...t},t.containerOpts&&(this.containerOpts={...this.containerOpts,...t.containerOpts}),t.shapeOpts&&(this.shapeOpts={...this.shapeOpts,...t.shapeOpts}),this.itemHeight=this.containerOpts.height/this.opts.data.length}setDomStyle(){if(this.dom){const{width:e,height:t,padding:r}=this.containerOpts;this.dom.style.width=n(e),this.dom.style.height=n(t),r&&("auto"===r?this.dom.style.padding="auto":Array.isArray(r)?this.dom.style.padding=r.map((e=>n(e))).join(""):this.dom.style.padding=n(r))}}getData(){const{data:e,xField:t="text",yField:r="value"}=this.opts;return e.map((e=>({text:e[t],value:e[r]}))).sort(((e,t)=>Number(t.value)-Number(e.value)))}onLegendClick(e){const t=e.target.dataset.val;this.hideItem(Number(t))}hideItem(t){const r=this.copiedData.findIndex((e=>e.value===t)),n=document.querySelector(`.legend-item-${t}`),o=[...e.theme1],s=[...e.theme2];n&&(n.style.backgroundColor===function(e){let t=e.match(/([\w\d]{2})/g).map((e=>parseInt(e,16)));return`rgb(${t[0]}, ${t[1]}, ${t[2]})`}(o[r])?(i(n,{backgroundColor:s[r]}),this.colors[r]=s[r],this.tempData=this.data.splice(r,1)[0]):(i(n,{backgroundColor:o[r]}),this.colors[r]=o[r],this.data.splice(r,0,this.tempData))),this.clear(),this.render()}onCanvasHover(e){this.points.forEach(((t,r)=>{const n=t[0],i=t[1],o=t[2];e.layerX>n[0]&&e.layerX<i[0]&&e.layerY>n[1]&&e.layerY<o[1]&&(this.showTooltip(e.layerX,e.layerY,this.data[r]),this.curHoverIdx=r)}));const t=this.points[this.curHoverIdx];if(t){const r=t[0],n=t[1],i=t[2];e.layerX>r[0]&&e.layerX<n[0]&&e.layerY>r[1]&&e.layerY<i[1]?this.showTooltip(e.layerX,e.layerY,this.data[this.curHoverIdx]):this.hideTooltip()}}showTooltip(e,t,r){this.tooltip&&(this.tooltip.innerText=`${r[this.opts.xField]}: ${r[this.opts.yField]}`,this.tooltip.style.visibility="visible",this.tooltip.style.top=`${t}px`,this.tooltip.style.left=`${e+200}px`)}hideTooltip(){this.tooltip&&(this.tooltip.style.visibility="hidden")}createLegend(){const e=document.createElement("div");return i(e,{display:"flex",flexDirection:"row",justifyContent:"center",alignItems:"center",margin:n(12)}),e.addEventListener("click",this.onLegendClick.bind(this),!1),e.innerHTML=this.opts.data.map(((e,t)=>{const r=e[this.opts.xField],n=e[this.opts.yField];let i=t;t===this.colors.length&&(i=0);return`<div class="legend-item-${(o={val:n,text:r,bgColor:this.colors[i]}).val}" data-val=${o.val} style="background-color:${o.bgColor};color:#fff;display:inline-block;margin-right:24px;border-radius:4px;padding:4px 12px;text-align:center;cursor:pointer;font-size:12px;white-space:nowrap;user-select:none;">${o.text}</div>`;var o})).join(""),e}onCanvasClick(e){this.points.forEach(((t,r)=>{const n=t[0],i=t[1],o=t[2];e.layerX>n[0]&&e.layerX<i[0]&&e.layerY>n[1]&&e.layerY<o[1]&&this.canvasEvents.forEach((e=>e(this.data[r])))}))}setCanvasEventListener(){if(this.canvas){const e=this.onCanvasClick.bind(this);this.canvas.addEventListener("click",e,!1);const t=this.onCanvasHover.bind(this);this.canvas.addEventListener("mouseenter",(()=>{this.canvas.addEventListener("mousemove",t,!1)}),!1),this.canvas.addEventListener("mouseleave",(()=>{this.canvas.removeEventListener("mousemove",t,!1)}),!1)}}getTextX(){return(this.opts.containerOpts?.width||400)/2}drawPolygon(e,t,r){const n=t.text,i=e[0],o=e[1],s=e[2],a=e[3],c=s[1];this.colorIdx===this.colors.length&&(this.colorIdx=0),this.ctx.fillStyle=this.colors[this.colorIdx],this.ctx.beginPath(),this.ctx.moveTo(i[0],i[1]),this.ctx.lineTo(o[0],o[1]),this.ctx.lineTo(s[0],c),this.ctx.lineTo(a[0],a[1]),this.ctx.lineTo(i[0],i[1]),this.ctx.fill();const d=this.ctx.measureText(String(n)).width;if(d<=o[0]-i[0]){this.ctx.font="10px 宋体";let e=this.getTextX();e-=d/2,this.ctx.fillStyle="#fff",this.ctx.fillText(String(n),e,c-this.itemHeight/2.4,d)}const l=this.getTransferRate(r+1);l&&(this.ctx.fillStyle="#000000",this.ctx.fillText(l,s[0]+15,s[1])),this.colorIdx+=1}getTransferRate(e){const t=this.data[e],r=this.data[e-1];return t&&r?"转化率"+(Number(t.value)/Number(r.value)).toPrecision(2).replace("0."," ").concat("%"):""}setCanvasStyle(){if(this.canvas){const{width:e,height:t}=this.containerOpts;this.canvas.width=e,this.canvas.height=t,this.canvas.style.cursor="pointer"}}append(){const e=document.getElementById(this.eleId);if(!e)throw new r("400");this.dom=e,this.setDomStyle(),this.canvas=document.createElement("canvas"),this.setCanvasStyle(),this.setCanvasEventListener(),this.ctx=this.canvas.getContext("2d"),this.container=document.createElement("div"),i(this.container,{width:"100%",height:"100%",position:"relative"}),this.container.append(this.canvas),this.opts.tooltip&&(this.tooltip=this.createToolTip(),this.container.append(this.tooltip)),this.opts.legend&&this.container.append(this.createLegend()),this.dom.append(this.container)}doRender(){this.points.forEach(((e,t)=>{this.drawPolygon(e,this.data[t],t)}))}render(){if(this.append(),this.data||(this.data=this.getData(),this.copiedData=this.getData()),this.data.length<2){const e=new r("401");throw this.container.innerHTML=`<div style="color:red;text-align:left;background-color:#eeeeee;padding:12px;">ErrorCode:${e.code}<br/>ErrorMsg:${e.message}</div>`,e}this.points=this.getPoints(),this.doRender()}getPoints(){const e=this.data,t=this.canvas.width,r=[],n=e.reduce(((e,t)=>e+t.value),0),i=e[0].value/n;for(let o=0;o<e.length;o++){const s=[],a=e[o],c=.8*t*(Number(a.value)/n)/i,d=(t-c)/2;0===o?(s.push([d,0]),s.push([d+c,0])):(s.push([d,this.itemHeight*o]),s.push([d+c,this.itemHeight*o])),r.push(s)}return r.map(((e,t)=>{const n=r[t+1],i=r[t-1];return n?e.push(n[1],n[0]):e.push([i[2][0],i[2][1]+this.itemHeight],[i[3][0],i[3][1]+this.itemHeight]),e}))}update(t){if(t){const r=e[t];r&&(this.colors=r)}this.clear(),this.render()}createToolTip(){const e=document.createElement("div");return i(e,{position:"absolute",width:"auto",backgroundColor:"#fff",border:"1px solid #eeeeee",borderRadius:n(4),padding:n(12),whiteSpace:"nowrap",visibility:"hidden"}),e}clear(){this.colorIdx=0,this.dom.removeChild(this.container)}on(e,t){"itemClick"===e&&this.canvasEvents.push(t)}off(e,t){if("itemClick"===e){const e=this.canvasEvents.findIndex((e=>e===t));e>-1&&this.canvasEvents.splice(e,1)}}}!function(){const e=new o("funnel-root",{data:[{text:"投递",value:100},{text:"初筛",value:80},{text:"一面",value:50},{text:"二面",value:20},{text:"三面",value:5},{text:"录用",value:3}]});e.render(),e.on("itemClick",(e=>alert(JSON.stringify(e))))}()}},n={};function i(e){var t=n[e];if(void 0!==t){if(void 0!==t.error)throw t.error;return t.exports}var o=n[e]={exports:{}};try{var s={id:e,module:o,factory:r[e],require:i};i.i.forEach((function(e){e(s)})),o=s.module,s.factory.call(o.exports,o,o.exports,s.require)}catch(e){throw o.error=e,e}return o.exports}i.m=r,i.c=n,i.i=[],i.hu=e=>e+"."+i.h()+".hot-update.js",i.hmrF=()=>"main."+i.h()+".hot-update.json",i.h=()=>"220cc03ee3a1486ee483",i.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"==typeof window)return window}}(),i.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),e={},t="funnel-chart-renderer:",i.l=(r,n,o,s)=>{if(e[r])e[r].push(n);else{var a,c;if(void 0!==o)for(var d=document.getElementsByTagName("script"),l=0;l<d.length;l++){var h=d[l];if(h.getAttribute("src")==r||h.getAttribute("data-webpack")==t+o){a=h;break}}a||(c=!0,(a=document.createElement("script")).charset="utf-8",a.timeout=120,i.nc&&a.setAttribute("nonce",i.nc),a.setAttribute("data-webpack",t+o),a.src=r),e[r]=[n];var p=(t,n)=>{a.onerror=a.onload=null,clearTimeout(u);var i=e[r];if(delete e[r],a.parentNode&&a.parentNode.removeChild(a),i&&i.forEach((e=>e(n))),t)return t(n)},u=setTimeout(p.bind(null,void 0,{type:"timeout",target:a}),12e4);a.onerror=p.bind(null,a.onerror),a.onload=p.bind(null,a.onload),c&&document.head.appendChild(a)}},(()=>{var e,t,r,n,o={},s=i.c,a=[],c=[],d="idle";function l(e){d=e;for(var t=[],r=0;r<c.length;r++)t[r]=c[r].call(null,e);return Promise.all(t)}function h(e){if(0===t.length)return e();var r=t;return t=[],Promise.all(r).then((function(){return h(e)}))}function p(e){if("idle"!==d)throw new Error("check() is only allowed in idle status");return l("check").then(i.hmrM).then((function(n){return n?l("prepare").then((function(){var o=[];return t=[],r=[],Promise.all(Object.keys(i.hmrC).reduce((function(e,t){return i.hmrC[t](n.c,n.r,n.m,e,r,o),e}),[])).then((function(){return h((function(){return e?f(e):l("ready").then((function(){return o}))}))}))})):l(v()?"ready":"idle").then((function(){return null}))}))}function u(e){return"ready"!==d?Promise.resolve().then((function(){throw new Error("apply() is only allowed in ready status")})):f(e)}function f(e){e=e||{},v();var t=r.map((function(t){return t(e)}));r=void 0;var i=t.map((function(e){return e.error})).filter(Boolean);if(i.length>0)return l("abort").then((function(){throw i[0]}));var o=l("dispose");t.forEach((function(e){e.dispose&&e.dispose()}));var s,a=l("apply"),c=function(e){s||(s=e)},d=[];return t.forEach((function(e){if(e.apply){var t=e.apply(c);if(t)for(var r=0;r<t.length;r++)d.push(t[r])}})),Promise.all([o,a]).then((function(){return s?l("fail").then((function(){throw s})):n?f(e).then((function(e){return d.forEach((function(t){e.indexOf(t)<0&&e.push(t)})),e})):l("idle").then((function(){return d}))}))}function v(){if(n)return r||(r=[]),Object.keys(i.hmrI).forEach((function(e){n.forEach((function(t){i.hmrI[e](t,r)}))})),n=void 0,!0}i.hmrD=o,i.i.push((function(f){var v,m,g,y,x=f.module,E=function(r,n){var i=s[n];if(!i)return r;var o=function(t){if(i.hot.active){if(s[t]){var o=s[t].parents;-1===o.indexOf(n)&&o.push(n)}else a=[n],e=t;-1===i.children.indexOf(t)&&i.children.push(t)}else console.warn("[HMR] unexpected require("+t+") from disposed module "+n),a=[];return r(t)},c=function(e){return{configurable:!0,enumerable:!0,get:function(){return r[e]},set:function(t){r[e]=t}}};for(var p in r)Object.prototype.hasOwnProperty.call(r,p)&&"e"!==p&&Object.defineProperty(o,p,c(p));return o.e=function(e){return function(e){switch(d){case"ready":return l("prepare"),t.push(e),h((function(){return l("ready")})),e;case"prepare":return t.push(e),e;default:return e}}(r.e(e))},o}(f.require,f.id);x.hot=(v=f.id,m=x,y={_acceptedDependencies:{},_acceptedErrorHandlers:{},_declinedDependencies:{},_selfAccepted:!1,_selfDeclined:!1,_selfInvalidated:!1,_disposeHandlers:[],_main:g=e!==v,_requireSelf:function(){a=m.parents.slice(),e=g?void 0:v,i(v)},active:!0,accept:function(e,t,r){if(void 0===e)y._selfAccepted=!0;else if("function"==typeof e)y._selfAccepted=e;else if("object"==typeof e&&null!==e)for(var n=0;n<e.length;n++)y._acceptedDependencies[e[n]]=t||function(){},y._acceptedErrorHandlers[e[n]]=r;else y._acceptedDependencies[e]=t||function(){},y._acceptedErrorHandlers[e]=r},decline:function(e){if(void 0===e)y._selfDeclined=!0;else if("object"==typeof e&&null!==e)for(var t=0;t<e.length;t++)y._declinedDependencies[e[t]]=!0;else y._declinedDependencies[e]=!0},dispose:function(e){y._disposeHandlers.push(e)},addDisposeHandler:function(e){y._disposeHandlers.push(e)},removeDisposeHandler:function(e){var t=y._disposeHandlers.indexOf(e);t>=0&&y._disposeHandlers.splice(t,1)},invalidate:function(){switch(this._selfInvalidated=!0,d){case"idle":r=[],Object.keys(i.hmrI).forEach((function(e){i.hmrI[e](v,r)})),l("ready");break;case"ready":Object.keys(i.hmrI).forEach((function(e){i.hmrI[e](v,r)}));break;case"prepare":case"check":case"dispose":case"apply":(n=n||[]).push(v)}},check:p,apply:u,status:function(e){if(!e)return d;c.push(e)},addStatusHandler:function(e){c.push(e)},removeStatusHandler:function(e){var t=c.indexOf(e);t>=0&&c.splice(t,1)},data:o[v]},e=void 0,y),x.parents=a,x.children=[],a=[],f.require=E})),i.hmrC={},i.hmrI={}})(),(()=>{var e;i.g.importScripts&&(e=i.g.location+"");var t=i.g.document;if(!e&&t&&(t.currentScript&&(e=t.currentScript.src),!e)){var r=t.getElementsByTagName("script");r.length&&(e=r[r.length-1].src)}if(!e)throw new Error("Automatic publicPath is not supported in this browser");e=e.replace(/#.*$/,"").replace(/\?.*$/,"").replace(/\/[^\/]+$/,"/"),i.p=e})(),(()=>{var e,t,r,n,o={179:0},s={};function a(e){return new Promise(((t,r)=>{s[e]=t;var n=i.p+i.hu(e),o=new Error;i.l(n,(t=>{if(s[e]){s[e]=void 0;var n=t&&("load"===t.type?"missing":t.type),i=t&&t.target&&t.target.src;o.message="Loading hot update chunk "+e+" failed.\n("+n+": "+i+")",o.name="ChunkLoadError",o.type=n,o.request=i,r(o)}}))}))}function c(s){function a(e){for(var t=[e],r={},n=t.map((function(e){return{chain:[e],id:e}}));n.length>0;){var o=n.pop(),s=o.id,a=o.chain,d=i.c[s];if(d&&(!d.hot._selfAccepted||d.hot._selfInvalidated)){if(d.hot._selfDeclined)return{type:"self-declined",chain:a,moduleId:s};if(d.hot._main)return{type:"unaccepted",chain:a,moduleId:s};for(var l=0;l<d.parents.length;l++){var h=d.parents[l],p=i.c[h];if(p){if(p.hot._declinedDependencies[s])return{type:"declined",chain:a.concat([h]),moduleId:s,parentId:h};-1===t.indexOf(h)&&(p.hot._acceptedDependencies[s]?(r[h]||(r[h]=[]),c(r[h],[s])):(delete r[h],t.push(h),n.push({chain:a.concat([h]),id:h})))}}}}return{type:"accepted",moduleId:e,outdatedModules:t,outdatedDependencies:r}}function c(e,t){for(var r=0;r<t.length;r++){var n=t[r];-1===e.indexOf(n)&&e.push(n)}}i.f&&delete i.f.jsonpHmr,e=void 0;var d={},l=[],h={},p=function(e){console.warn("[HMR] unexpected require("+e.id+") to disposed module")};for(var u in t)if(i.o(t,u)){var f,v=t[u],m=!1,g=!1,y=!1,x="";switch((f=v?a(u):{type:"disposed",moduleId:u}).chain&&(x="\nUpdate propagation: "+f.chain.join(" -> ")),f.type){case"self-declined":s.onDeclined&&s.onDeclined(f),s.ignoreDeclined||(m=new Error("Aborted because of self decline: "+f.moduleId+x));break;case"declined":s.onDeclined&&s.onDeclined(f),s.ignoreDeclined||(m=new Error("Aborted because of declined dependency: "+f.moduleId+" in "+f.parentId+x));break;case"unaccepted":s.onUnaccepted&&s.onUnaccepted(f),s.ignoreUnaccepted||(m=new Error("Aborted because "+u+" is not accepted"+x));break;case"accepted":s.onAccepted&&s.onAccepted(f),g=!0;break;case"disposed":s.onDisposed&&s.onDisposed(f),y=!0;break;default:throw new Error("Unexception type "+f.type)}if(m)return{error:m};if(g)for(u in h[u]=v,c(l,f.outdatedModules),f.outdatedDependencies)i.o(f.outdatedDependencies,u)&&(d[u]||(d[u]=[]),c(d[u],f.outdatedDependencies[u]));y&&(c(l,[f.moduleId]),h[u]=p)}t=void 0;for(var E,b=[],w=0;w<l.length;w++){var D=l[w],I=i.c[D];I&&(I.hot._selfAccepted||I.hot._main)&&h[D]!==p&&!I.hot._selfInvalidated&&b.push({module:D,require:I.hot._requireSelf,errorHandler:I.hot._selfAccepted})}return{dispose:function(){var e;r.forEach((function(e){delete o[e]})),r=void 0;for(var t,n=l.slice();n.length>0;){var s=n.pop(),a=i.c[s];if(a){var c={},h=a.hot._disposeHandlers;for(w=0;w<h.length;w++)h[w].call(null,c);for(i.hmrD[s]=c,a.hot.active=!1,delete i.c[s],delete d[s],w=0;w<a.children.length;w++){var p=i.c[a.children[w]];p&&(e=p.parents.indexOf(s))>=0&&p.parents.splice(e,1)}}}for(var u in d)if(i.o(d,u)&&(a=i.c[u]))for(E=d[u],w=0;w<E.length;w++)t=E[w],(e=a.children.indexOf(t))>=0&&a.children.splice(e,1)},apply:function(e){for(var t in h)i.o(h,t)&&(i.m[t]=h[t]);for(var r=0;r<n.length;r++)n[r](i);for(var o in d)if(i.o(d,o)){var a=i.c[o];if(a){E=d[o];for(var c=[],p=[],u=[],f=0;f<E.length;f++){var v=E[f],m=a.hot._acceptedDependencies[v],g=a.hot._acceptedErrorHandlers[v];if(m){if(-1!==c.indexOf(m))continue;c.push(m),p.push(g),u.push(v)}}for(var y=0;y<c.length;y++)try{c[y].call(null,E)}catch(t){if("function"==typeof p[y])try{p[y](t,{moduleId:o,dependencyId:u[y]})}catch(r){s.onErrored&&s.onErrored({type:"accept-error-handler-errored",moduleId:o,dependencyId:u[y],error:r,originalError:t}),s.ignoreErrored||(e(r),e(t))}else s.onErrored&&s.onErrored({type:"accept-errored",moduleId:o,dependencyId:u[y],error:t}),s.ignoreErrored||e(t)}}}for(var x=0;x<b.length;x++){var w=b[x],D=w.module;try{w.require(D)}catch(t){if("function"==typeof w.errorHandler)try{w.errorHandler(t,{moduleId:D,module:i.c[D]})}catch(r){s.onErrored&&s.onErrored({type:"self-accept-error-handler-errored",moduleId:D,error:r,originalError:t}),s.ignoreErrored||(e(r),e(t))}else s.onErrored&&s.onErrored({type:"self-accept-errored",moduleId:D,error:t}),s.ignoreErrored||e(t)}}return l}}}self.webpackHotUpdatefunnel_chart_renderer=(e,r,o)=>{for(var a in r)i.o(r,a)&&(t[a]=r[a]);o&&n.push(o),s[e]&&(s[e](),s[e]=void 0)},i.hmrI.jsonp=function(e,o){t||(t={},n=[],r=[],o.push(c)),i.o(t,e)||(t[e]=i.m[e])},i.hmrC.jsonp=function(s,d,l,h,p,u){p.push(c),e={},r=d,t=l.reduce((function(e,t){return e[t]=!1,e}),{}),n=[],s.forEach((function(t){i.o(o,t)&&void 0!==o[t]&&(h.push(a(t)),e[t]=!0)})),i.f&&(i.f.jsonpHmr=function(t,r){e&&!i.o(e,t)&&i.o(o,t)&&void 0!==o[t]&&(r.push(a(t)),e[t]=!0)})},i.hmrM=()=>{if("undefined"==typeof fetch)throw new Error("No browser support: need fetch API");return fetch(i.p+i.hmrF()).then((e=>{if(404!==e.status){if(!e.ok)throw new Error("Failed to fetch update manifest "+e.statusText);return e.json()}}))}})(),i(547)})();