/*!
 * 
 *                     SpiceCRM
 *
 *                     release: 2024.01.001
 *
 *                     date: 2024-06-07 18:53:45
 *
 *                     build: 2024.01.001.1717779225604
 *
 */
"use strict";(self.webpackChunkcore=self.webpackChunkcore||[]).push([["default-node_modules_underscore_modules_index-all_js"],{41068:(n,r,t)=>{t.d(r,{Ay:()=>Ct,yr:()=>X});var e={};t.r(e),t.d(e,{VERSION:()=>u,after:()=>Rr,all:()=>rt,allKeys:()=>dn,any:()=>tt,assign:()=>Rn,before:()=>Fr,bind:()=>Ar,bindAll:()=>Or,chain:()=>mr,chunk:()=>Pt,clone:()=>qn,collect:()=>Hr,compact:()=>Mt,compose:()=>Dr,constant:()=>Y,contains:()=>et,countBy:()=>dt,create:()=>Pn,debounce:()=>Nr,default:()=>Wt,defaults:()=>Fn,defer:()=>Br,delay:()=>Er,detect:()=>Kr,difference:()=>Bt,drop:()=>St,each:()=>Gr,escape:()=>ar,every:()=>rt,extend:()=>Dn,extendOwn:()=>Rn,filter:()=>Zr,find:()=>Kr,findIndex:()=>Ur,findKey:()=>Pr,findLastIndex:()=>Wr,findWhere:()=>Jr,first:()=>xt,flatten:()=>Et,foldl:()=>Xr,foldr:()=>Yr,forEach:()=>Gr,functions:()=>In,get:()=>Ln,groupBy:()=>yt,has:()=>$n,head:()=>xt,identity:()=>Kn,include:()=>et,includes:()=>et,indexBy:()=>gt,indexOf:()=>Lr,initial:()=>At,inject:()=>Xr,intersection:()=>Tt,invert:()=>Nn,invoke:()=>ut,isArguments:()=>H,isArray:()=>K,isArrayBuffer:()=>V,isBoolean:()=>E,isDataView:()=>$,isDate:()=>T,isElement:()=>B,isEmpty:()=>fn,isEqual:()=>gn,isError:()=>R,isFinite:()=>Q,isFunction:()=>U,isMap:()=>Sn,isMatch:()=>ln,isNaN:()=>X,isNull:()=>O,isNumber:()=>I,isObject:()=>S,isRegExp:()=>D,isSet:()=>Mn,isString:()=>N,isSymbol:()=>F,isTypedArray:()=>un,isUndefined:()=>M,isWeakMap:()=>On,isWeakSet:()=>En,iteratee:()=>Xn,keys:()=>cn,last:()=>Ot,lastIndexOf:()=>$r,map:()=>Hr,mapObject:()=>Zn,matcher:()=>Jn,matches:()=>Jn,max:()=>at,memoize:()=>Mr,methods:()=>In,min:()=>ct,mixin:()=>Ut,negate:()=>Tr,noop:()=>nr,now:()=>ur,object:()=>Ft,omit:()=>_t,once:()=>Vr,pairs:()=>kn,partial:()=>_r,partition:()=>bt,pick:()=>wt,pluck:()=>ot,property:()=>Gn,propertyOf:()=>rr,random:()=>er,range:()=>Vt,reduce:()=>Xr,reduceRight:()=>Yr,reject:()=>nt,rest:()=>St,restArguments:()=>x,result:()=>gr,sample:()=>st,select:()=>Zr,shuffle:()=>pt,size:()=>mt,some:()=>tt,sortBy:()=>ht,sortedIndex:()=>zr,tail:()=>St,take:()=>xt,tap:()=>Un,template:()=>yr,templateSettings:()=>fr,throttle:()=>kr,times:()=>tr,toArray:()=>lt,toPath:()=>Wn,transpose:()=>Dt,unescape:()=>cr,union:()=>It,uniq:()=>Nt,unique:()=>Nt,uniqueId:()=>br,unzip:()=>Dt,values:()=>Bn,where:()=>it,without:()=>kt,wrap:()=>Ir,zip:()=>Rt});var u="1.13.6",o="object"==typeof self&&self.self===self&&self||"object"==typeof global&&global.global===global&&global||Function("return this")()||{},i=Array.prototype,a=Object.prototype,c="undefined"!=typeof Symbol?Symbol.prototype:null,f=i.push,l=i.slice,s=a.toString,p=a.hasOwnProperty,h="undefined"!=typeof ArrayBuffer,v="undefined"!=typeof DataView,y=Array.isArray,g=Object.keys,d=Object.create,b=h&&ArrayBuffer.isView,m=isNaN,j=isFinite,w=!{toString:null}.propertyIsEnumerable("toString"),_=["valueOf","isPrototypeOf","toString","propertyIsEnumerable","hasOwnProperty","toLocaleString"],A=Math.pow(2,53)-1;function x(n,r){return r=null==r?n.length-1:+r,function(){for(var t=Math.max(arguments.length-r,0),e=Array(t),u=0;u<t;u++)e[u]=arguments[u+r];switch(r){case 0:return n.call(this,e);case 1:return n.call(this,arguments[0],e);case 2:return n.call(this,arguments[0],arguments[1],e)}var o=Array(r+1);for(u=0;u<r;u++)o[u]=arguments[u];return o[r]=e,n.apply(this,o)}}function S(n){var r=typeof n;return"function"===r||"object"===r&&!!n}function O(n){return null===n}function M(n){return void 0===n}function E(n){return!0===n||!1===n||"[object Boolean]"===s.call(n)}function B(n){return!(!n||1!==n.nodeType)}function k(n){var r="[object "+n+"]";return function(n){return s.call(n)===r}}const N=k("String"),I=k("Number"),T=k("Date"),D=k("RegExp"),R=k("Error"),F=k("Symbol"),V=k("ArrayBuffer");var P=k("Function"),q=o.document&&o.document.childNodes;"object"!=typeof Int8Array&&"function"!=typeof q&&(P=function(n){return"function"==typeof n||!1});const U=P,W=k("Object");var z=v&&W(new DataView(new ArrayBuffer(8))),C="undefined"!=typeof Map&&W(new Map),L=k("DataView");const $=z?function(n){return null!=n&&U(n.getInt8)&&V(n.buffer)}:L,K=y||k("Array");function J(n,r){return null!=n&&p.call(n,r)}var G=k("Arguments");!function(){G(arguments)||(G=function(n){return J(n,"callee")})}();const H=G;function Q(n){return!F(n)&&j(n)&&!isNaN(parseFloat(n))}function X(n){return I(n)&&m(n)}function Y(n){return function(){return n}}function Z(n){return function(r){var t=n(r);return"number"==typeof t&&t>=0&&t<=A}}function nn(n){return function(r){return null==r?void 0:r[n]}}const rn=nn("byteLength"),tn=Z(rn);var en=/\[object ((I|Ui)nt(8|16|32)|Float(32|64)|Uint8Clamped|Big(I|Ui)nt64)Array\]/;const un=h?function(n){return b?b(n)&&!$(n):tn(n)&&en.test(s.call(n))}:Y(!1),on=nn("length");function an(n,r){r=function(n){for(var r={},t=n.length,e=0;e<t;++e)r[n[e]]=!0;return{contains:function(n){return!0===r[n]},push:function(t){return r[t]=!0,n.push(t)}}}(r);var t=_.length,e=n.constructor,u=U(e)&&e.prototype||a,o="constructor";for(J(n,o)&&!r.contains(o)&&r.push(o);t--;)(o=_[t])in n&&n[o]!==u[o]&&!r.contains(o)&&r.push(o)}function cn(n){if(!S(n))return[];if(g)return g(n);var r=[];for(var t in n)J(n,t)&&r.push(t);return w&&an(n,r),r}function fn(n){if(null==n)return!0;var r=on(n);return"number"==typeof r&&(K(n)||N(n)||H(n))?0===r:0===on(cn(n))}function ln(n,r){var t=cn(r),e=t.length;if(null==n)return!e;for(var u=Object(n),o=0;o<e;o++){var i=t[o];if(r[i]!==u[i]||!(i in u))return!1}return!0}function sn(n){return n instanceof sn?n:this instanceof sn?void(this._wrapped=n):new sn(n)}function pn(n){return new Uint8Array(n.buffer||n,n.byteOffset||0,rn(n))}sn.VERSION=u,sn.prototype.value=function(){return this._wrapped},sn.prototype.valueOf=sn.prototype.toJSON=sn.prototype.value,sn.prototype.toString=function(){return String(this._wrapped)};var hn="[object DataView]";function vn(n,r,t,e){if(n===r)return 0!==n||1/n==1/r;if(null==n||null==r)return!1;if(n!=n)return r!=r;var u=typeof n;return("function"===u||"object"===u||"object"==typeof r)&&yn(n,r,t,e)}function yn(n,r,t,e){n instanceof sn&&(n=n._wrapped),r instanceof sn&&(r=r._wrapped);var u=s.call(n);if(u!==s.call(r))return!1;if(z&&"[object Object]"==u&&$(n)){if(!$(r))return!1;u=hn}switch(u){case"[object RegExp]":case"[object String]":return""+n==""+r;case"[object Number]":return+n!=+n?+r!=+r:0==+n?1/+n==1/r:+n==+r;case"[object Date]":case"[object Boolean]":return+n==+r;case"[object Symbol]":return c.valueOf.call(n)===c.valueOf.call(r);case"[object ArrayBuffer]":case hn:return yn(pn(n),pn(r),t,e)}var o="[object Array]"===u;if(!o&&un(n)){if(rn(n)!==rn(r))return!1;if(n.buffer===r.buffer&&n.byteOffset===r.byteOffset)return!0;o=!0}if(!o){if("object"!=typeof n||"object"!=typeof r)return!1;var i=n.constructor,a=r.constructor;if(i!==a&&!(U(i)&&i instanceof i&&U(a)&&a instanceof a)&&"constructor"in n&&"constructor"in r)return!1}e=e||[];for(var f=(t=t||[]).length;f--;)if(t[f]===n)return e[f]===r;if(t.push(n),e.push(r),o){if((f=n.length)!==r.length)return!1;for(;f--;)if(!vn(n[f],r[f],t,e))return!1}else{var l,p=cn(n);if(f=p.length,cn(r).length!==f)return!1;for(;f--;)if(!J(r,l=p[f])||!vn(n[l],r[l],t,e))return!1}return t.pop(),e.pop(),!0}function gn(n,r){return vn(n,r)}function dn(n){if(!S(n))return[];var r=[];for(var t in n)r.push(t);return w&&an(n,r),r}function bn(n){var r=on(n);return function(t){if(null==t)return!1;var e=dn(t);if(on(e))return!1;for(var u=0;u<r;u++)if(!U(t[n[u]]))return!1;return n!==An||!U(t[mn])}}var mn="forEach",jn=["clear","delete"],wn=["get","has","set"],_n=jn.concat(mn,wn),An=jn.concat(wn),xn=["add"].concat(jn,mn,"has");const Sn=C?bn(_n):k("Map"),On=C?bn(An):k("WeakMap"),Mn=C?bn(xn):k("Set"),En=k("WeakSet");function Bn(n){for(var r=cn(n),t=r.length,e=Array(t),u=0;u<t;u++)e[u]=n[r[u]];return e}function kn(n){for(var r=cn(n),t=r.length,e=Array(t),u=0;u<t;u++)e[u]=[r[u],n[r[u]]];return e}function Nn(n){for(var r={},t=cn(n),e=0,u=t.length;e<u;e++)r[n[t[e]]]=t[e];return r}function In(n){var r=[];for(var t in n)U(n[t])&&r.push(t);return r.sort()}function Tn(n,r){return function(t){var e=arguments.length;if(r&&(t=Object(t)),e<2||null==t)return t;for(var u=1;u<e;u++)for(var o=arguments[u],i=n(o),a=i.length,c=0;c<a;c++){var f=i[c];r&&void 0!==t[f]||(t[f]=o[f])}return t}}const Dn=Tn(dn),Rn=Tn(cn),Fn=Tn(dn,!0);function Vn(n){if(!S(n))return{};if(d)return d(n);var r=function(){};r.prototype=n;var t=new r;return r.prototype=null,t}function Pn(n,r){var t=Vn(n);return r&&Rn(t,r),t}function qn(n){return S(n)?K(n)?n.slice():Dn({},n):n}function Un(n,r){return r(n),n}function Wn(n){return K(n)?n:[n]}function zn(n){return sn.toPath(n)}function Cn(n,r){for(var t=r.length,e=0;e<t;e++){if(null==n)return;n=n[r[e]]}return t?n:void 0}function Ln(n,r,t){var e=Cn(n,zn(r));return M(e)?t:e}function $n(n,r){for(var t=(r=zn(r)).length,e=0;e<t;e++){var u=r[e];if(!J(n,u))return!1;n=n[u]}return!!t}function Kn(n){return n}function Jn(n){return n=Rn({},n),function(r){return ln(r,n)}}function Gn(n){return n=zn(n),function(r){return Cn(r,n)}}function Hn(n,r,t){if(void 0===r)return n;switch(null==t?3:t){case 1:return function(t){return n.call(r,t)};case 3:return function(t,e,u){return n.call(r,t,e,u)};case 4:return function(t,e,u,o){return n.call(r,t,e,u,o)}}return function(){return n.apply(r,arguments)}}function Qn(n,r,t){return null==n?Kn:U(n)?Hn(n,r,t):S(n)&&!K(n)?Jn(n):Gn(n)}function Xn(n,r){return Qn(n,r,1/0)}function Yn(n,r,t){return sn.iteratee!==Xn?sn.iteratee(n,r):Qn(n,r,t)}function Zn(n,r,t){r=Yn(r,t);for(var e=cn(n),u=e.length,o={},i=0;i<u;i++){var a=e[i];o[a]=r(n[a],a,n)}return o}function nr(){}function rr(n){return null==n?nr:function(r){return Ln(n,r)}}function tr(n,r,t){var e=Array(Math.max(0,n));r=Hn(r,t,1);for(var u=0;u<n;u++)e[u]=r(u);return e}function er(n,r){return null==r&&(r=n,n=0),n+Math.floor(Math.random()*(r-n+1))}sn.toPath=Wn,sn.iteratee=Xn;const ur=Date.now||function(){return(new Date).getTime()};function or(n){var r=function(r){return n[r]},t="(?:"+cn(n).join("|")+")",e=RegExp(t),u=RegExp(t,"g");return function(n){return n=null==n?"":""+n,e.test(n)?n.replace(u,r):n}}const ir={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#x27;","`":"&#x60;"},ar=or(ir),cr=or(Nn(ir)),fr=sn.templateSettings={evaluate:/<%([\s\S]+?)%>/g,interpolate:/<%=([\s\S]+?)%>/g,escape:/<%-([\s\S]+?)%>/g};var lr=/(.)^/,sr={"'":"'","\\":"\\","\r":"r","\n":"n","\u2028":"u2028","\u2029":"u2029"},pr=/\\|'|\r|\n|\u2028|\u2029/g;function hr(n){return"\\"+sr[n]}var vr=/^\s*(\w|\$)+\s*$/;function yr(n,r,t){!r&&t&&(r=t),r=Fn({},r,sn.templateSettings);var e=RegExp([(r.escape||lr).source,(r.interpolate||lr).source,(r.evaluate||lr).source].join("|")+"|$","g"),u=0,o="__p+='";n.replace(e,(function(r,t,e,i,a){return o+=n.slice(u,a).replace(pr,hr),u=a+r.length,t?o+="'+\n((__t=("+t+"))==null?'':_.escape(__t))+\n'":e?o+="'+\n((__t=("+e+"))==null?'':__t)+\n'":i&&(o+="';\n"+i+"\n__p+='"),r})),o+="';\n";var i,a=r.variable;if(a){if(!vr.test(a))throw new Error("variable is not a bare identifier: "+a)}else o="with(obj||{}){\n"+o+"}\n",a="obj";o="var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};\n"+o+"return __p;\n";try{i=new Function(a,"_",o)}catch(n){throw n.source=o,n}var c=function(n){return i.call(this,n,sn)};return c.source="function("+a+"){\n"+o+"}",c}function gr(n,r,t){var e=(r=zn(r)).length;if(!e)return U(t)?t.call(n):t;for(var u=0;u<e;u++){var o=null==n?void 0:n[r[u]];void 0===o&&(o=t,u=e),n=U(o)?o.call(n):o}return n}var dr=0;function br(n){var r=++dr+"";return n?n+r:r}function mr(n){var r=sn(n);return r._chain=!0,r}function jr(n,r,t,e,u){if(!(e instanceof r))return n.apply(t,u);var o=Vn(n.prototype),i=n.apply(o,u);return S(i)?i:o}var wr=x((function(n,r){var t=wr.placeholder,e=function(){for(var u=0,o=r.length,i=Array(o),a=0;a<o;a++)i[a]=r[a]===t?arguments[u++]:r[a];for(;u<arguments.length;)i.push(arguments[u++]);return jr(n,e,this,this,i)};return e}));wr.placeholder=sn;const _r=wr,Ar=x((function(n,r,t){if(!U(n))throw new TypeError("Bind must be called on a function");var e=x((function(u){return jr(n,e,r,this,t.concat(u))}));return e})),xr=Z(on);function Sr(n,r,t,e){if(e=e||[],r||0===r){if(r<=0)return e.concat(n)}else r=1/0;for(var u=e.length,o=0,i=on(n);o<i;o++){var a=n[o];if(xr(a)&&(K(a)||H(a)))if(r>1)Sr(a,r-1,t,e),u=e.length;else for(var c=0,f=a.length;c<f;)e[u++]=a[c++];else t||(e[u++]=a)}return e}const Or=x((function(n,r){var t=(r=Sr(r,!1,!1)).length;if(t<1)throw new Error("bindAll must be passed function names");for(;t--;){var e=r[t];n[e]=Ar(n[e],n)}return n}));function Mr(n,r){var t=function(e){var u=t.cache,o=""+(r?r.apply(this,arguments):e);return J(u,o)||(u[o]=n.apply(this,arguments)),u[o]};return t.cache={},t}const Er=x((function(n,r,t){return setTimeout((function(){return n.apply(null,t)}),r)})),Br=_r(Er,sn,1);function kr(n,r,t){var e,u,o,i,a=0;t||(t={});var c=function(){a=!1===t.leading?0:ur(),e=null,i=n.apply(u,o),e||(u=o=null)},f=function(){var f=ur();a||!1!==t.leading||(a=f);var l=r-(f-a);return u=this,o=arguments,l<=0||l>r?(e&&(clearTimeout(e),e=null),a=f,i=n.apply(u,o),e||(u=o=null)):e||!1===t.trailing||(e=setTimeout(c,l)),i};return f.cancel=function(){clearTimeout(e),a=0,e=u=o=null},f}function Nr(n,r,t){var e,u,o,i,a,c=function(){var f=ur()-u;r>f?e=setTimeout(c,r-f):(e=null,t||(i=n.apply(a,o)),e||(o=a=null))},f=x((function(f){return a=this,o=f,u=ur(),e||(e=setTimeout(c,r),t&&(i=n.apply(a,o))),i}));return f.cancel=function(){clearTimeout(e),e=o=a=null},f}function Ir(n,r){return _r(r,n)}function Tr(n){return function(){return!n.apply(this,arguments)}}function Dr(){var n=arguments,r=n.length-1;return function(){for(var t=r,e=n[r].apply(this,arguments);t--;)e=n[t].call(this,e);return e}}function Rr(n,r){return function(){if(--n<1)return r.apply(this,arguments)}}function Fr(n,r){var t;return function(){return--n>0&&(t=r.apply(this,arguments)),n<=1&&(r=null),t}}const Vr=_r(Fr,2);function Pr(n,r,t){r=Yn(r,t);for(var e,u=cn(n),o=0,i=u.length;o<i;o++)if(r(n[e=u[o]],e,n))return e}function qr(n){return function(r,t,e){t=Yn(t,e);for(var u=on(r),o=n>0?0:u-1;o>=0&&o<u;o+=n)if(t(r[o],o,r))return o;return-1}}const Ur=qr(1),Wr=qr(-1);function zr(n,r,t,e){for(var u=(t=Yn(t,e,1))(r),o=0,i=on(n);o<i;){var a=Math.floor((o+i)/2);t(n[a])<u?o=a+1:i=a}return o}function Cr(n,r,t){return function(e,u,o){var i=0,a=on(e);if("number"==typeof o)n>0?i=o>=0?o:Math.max(o+a,i):a=o>=0?Math.min(o+1,a):o+a+1;else if(t&&o&&a)return e[o=t(e,u)]===u?o:-1;if(u!=u)return(o=r(l.call(e,i,a),X))>=0?o+i:-1;for(o=n>0?i:a-1;o>=0&&o<a;o+=n)if(e[o]===u)return o;return-1}}const Lr=Cr(1,Ur,zr),$r=Cr(-1,Wr);function Kr(n,r,t){var e=(xr(n)?Ur:Pr)(n,r,t);if(void 0!==e&&-1!==e)return n[e]}function Jr(n,r){return Kr(n,Jn(r))}function Gr(n,r,t){var e,u;if(r=Hn(r,t),xr(n))for(e=0,u=n.length;e<u;e++)r(n[e],e,n);else{var o=cn(n);for(e=0,u=o.length;e<u;e++)r(n[o[e]],o[e],n)}return n}function Hr(n,r,t){r=Yn(r,t);for(var e=!xr(n)&&cn(n),u=(e||n).length,o=Array(u),i=0;i<u;i++){var a=e?e[i]:i;o[i]=r(n[a],a,n)}return o}function Qr(n){return function(r,t,e,u){var o=arguments.length>=3;return function(r,t,e,u){var o=!xr(r)&&cn(r),i=(o||r).length,a=n>0?0:i-1;for(u||(e=r[o?o[a]:a],a+=n);a>=0&&a<i;a+=n){var c=o?o[a]:a;e=t(e,r[c],c,r)}return e}(r,Hn(t,u,4),e,o)}}const Xr=Qr(1),Yr=Qr(-1);function Zr(n,r,t){var e=[];return r=Yn(r,t),Gr(n,(function(n,t,u){r(n,t,u)&&e.push(n)})),e}function nt(n,r,t){return Zr(n,Tr(Yn(r)),t)}function rt(n,r,t){r=Yn(r,t);for(var e=!xr(n)&&cn(n),u=(e||n).length,o=0;o<u;o++){var i=e?e[o]:o;if(!r(n[i],i,n))return!1}return!0}function tt(n,r,t){r=Yn(r,t);for(var e=!xr(n)&&cn(n),u=(e||n).length,o=0;o<u;o++){var i=e?e[o]:o;if(r(n[i],i,n))return!0}return!1}function et(n,r,t,e){return xr(n)||(n=Bn(n)),("number"!=typeof t||e)&&(t=0),Lr(n,r,t)>=0}const ut=x((function(n,r,t){var e,u;return U(r)?u=r:(r=zn(r),e=r.slice(0,-1),r=r[r.length-1]),Hr(n,(function(n){var o=u;if(!o){if(e&&e.length&&(n=Cn(n,e)),null==n)return;o=n[r]}return null==o?o:o.apply(n,t)}))}));function ot(n,r){return Hr(n,Gn(r))}function it(n,r){return Zr(n,Jn(r))}function at(n,r,t){var e,u,o=-1/0,i=-1/0;if(null==r||"number"==typeof r&&"object"!=typeof n[0]&&null!=n)for(var a=0,c=(n=xr(n)?n:Bn(n)).length;a<c;a++)null!=(e=n[a])&&e>o&&(o=e);else r=Yn(r,t),Gr(n,(function(n,t,e){((u=r(n,t,e))>i||u===-1/0&&o===-1/0)&&(o=n,i=u)}));return o}function ct(n,r,t){var e,u,o=1/0,i=1/0;if(null==r||"number"==typeof r&&"object"!=typeof n[0]&&null!=n)for(var a=0,c=(n=xr(n)?n:Bn(n)).length;a<c;a++)null!=(e=n[a])&&e<o&&(o=e);else r=Yn(r,t),Gr(n,(function(n,t,e){((u=r(n,t,e))<i||u===1/0&&o===1/0)&&(o=n,i=u)}));return o}var ft=/[^\ud800-\udfff]|[\ud800-\udbff][\udc00-\udfff]|[\ud800-\udfff]/g;function lt(n){return n?K(n)?l.call(n):N(n)?n.match(ft):xr(n)?Hr(n,Kn):Bn(n):[]}function st(n,r,t){if(null==r||t)return xr(n)||(n=Bn(n)),n[er(n.length-1)];var e=lt(n),u=on(e);r=Math.max(Math.min(r,u),0);for(var o=u-1,i=0;i<r;i++){var a=er(i,o),c=e[i];e[i]=e[a],e[a]=c}return e.slice(0,r)}function pt(n){return st(n,1/0)}function ht(n,r,t){var e=0;return r=Yn(r,t),ot(Hr(n,(function(n,t,u){return{value:n,index:e++,criteria:r(n,t,u)}})).sort((function(n,r){var t=n.criteria,e=r.criteria;if(t!==e){if(t>e||void 0===t)return 1;if(t<e||void 0===e)return-1}return n.index-r.index})),"value")}function vt(n,r){return function(t,e,u){var o=r?[[],[]]:{};return e=Yn(e,u),Gr(t,(function(r,u){var i=e(r,u,t);n(o,r,i)})),o}}const yt=vt((function(n,r,t){J(n,t)?n[t].push(r):n[t]=[r]})),gt=vt((function(n,r,t){n[t]=r})),dt=vt((function(n,r,t){J(n,t)?n[t]++:n[t]=1})),bt=vt((function(n,r,t){n[t?0:1].push(r)}),!0);function mt(n){return null==n?0:xr(n)?n.length:cn(n).length}function jt(n,r,t){return r in t}const wt=x((function(n,r){var t={},e=r[0];if(null==n)return t;U(e)?(r.length>1&&(e=Hn(e,r[1])),r=dn(n)):(e=jt,r=Sr(r,!1,!1),n=Object(n));for(var u=0,o=r.length;u<o;u++){var i=r[u],a=n[i];e(a,i,n)&&(t[i]=a)}return t})),_t=x((function(n,r){var t,e=r[0];return U(e)?(e=Tr(e),r.length>1&&(t=r[1])):(r=Hr(Sr(r,!1,!1),String),e=function(n,t){return!et(r,t)}),wt(n,e,t)}));function At(n,r,t){return l.call(n,0,Math.max(0,n.length-(null==r||t?1:r)))}function xt(n,r,t){return null==n||n.length<1?null==r||t?void 0:[]:null==r||t?n[0]:At(n,n.length-r)}function St(n,r,t){return l.call(n,null==r||t?1:r)}function Ot(n,r,t){return null==n||n.length<1?null==r||t?void 0:[]:null==r||t?n[n.length-1]:St(n,Math.max(0,n.length-r))}function Mt(n){return Zr(n,Boolean)}function Et(n,r){return Sr(n,r,!1)}const Bt=x((function(n,r){return r=Sr(r,!0,!0),Zr(n,(function(n){return!et(r,n)}))})),kt=x((function(n,r){return Bt(n,r)}));function Nt(n,r,t,e){E(r)||(e=t,t=r,r=!1),null!=t&&(t=Yn(t,e));for(var u=[],o=[],i=0,a=on(n);i<a;i++){var c=n[i],f=t?t(c,i,n):c;r&&!t?(i&&o===f||u.push(c),o=f):t?et(o,f)||(o.push(f),u.push(c)):et(u,c)||u.push(c)}return u}const It=x((function(n){return Nt(Sr(n,!0,!0))}));function Tt(n){for(var r=[],t=arguments.length,e=0,u=on(n);e<u;e++){var o=n[e];if(!et(r,o)){var i;for(i=1;i<t&&et(arguments[i],o);i++);i===t&&r.push(o)}}return r}function Dt(n){for(var r=n&&at(n,on).length||0,t=Array(r),e=0;e<r;e++)t[e]=ot(n,e);return t}const Rt=x(Dt);function Ft(n,r){for(var t={},e=0,u=on(n);e<u;e++)r?t[n[e]]=r[e]:t[n[e][0]]=n[e][1];return t}function Vt(n,r,t){null==r&&(r=n||0,n=0),t||(t=r<n?-1:1);for(var e=Math.max(Math.ceil((r-n)/t),0),u=Array(e),o=0;o<e;o++,n+=t)u[o]=n;return u}function Pt(n,r){if(null==r||r<1)return[];for(var t=[],e=0,u=n.length;e<u;)t.push(l.call(n,e,e+=r));return t}function qt(n,r){return n._chain?sn(r).chain():r}function Ut(n){return Gr(In(n),(function(r){var t=sn[r]=n[r];sn.prototype[r]=function(){var n=[this._wrapped];return f.apply(n,arguments),qt(this,t.apply(sn,n))}})),sn}Gr(["pop","push","reverse","shift","sort","splice","unshift"],(function(n){var r=i[n];sn.prototype[n]=function(){var t=this._wrapped;return null!=t&&(r.apply(t,arguments),"shift"!==n&&"splice"!==n||0!==t.length||delete t[0]),qt(this,t)}})),Gr(["concat","join","slice"],(function(n){var r=i[n];sn.prototype[n]=function(){var n=this._wrapped;return null!=n&&(n=r.apply(n,arguments)),qt(this,n)}}));const Wt=sn;var zt=Ut(e);zt._=zt;const Ct=zt}}]);