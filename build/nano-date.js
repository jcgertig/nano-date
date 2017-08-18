var NanoDate=function(){"use strict";function e(e,t,n){var r=n.configurable,i=n.enumerable,o=n.initializer,u=n.value;return{configurable:r,enumerable:i,get:function(){if(this!==e){var n=o?o.call(this):u;return G(this,t,{configurable:r,enumerable:i,writable:!0,value:n}),n}},set:l(t)}}function t(){for(var t=arguments.length,n=Array(t),r=0;r<t;r++)n[r]=arguments[r];return s(e,n)}function n(e,t,n,r){n&&Object.defineProperty(e,t,{enumerable:n.enumerable,configurable:n.configurable,writable:n.writable,value:n.initializer?n.initializer.call(r):void 0})}function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function i(e,t,n,r,i){var o={};return Object.keys(r).forEach(function(e){o[e]=r[e]}),o.enumerable=!!o.enumerable,o.configurable=!!o.configurable,("value"in o||o.initializer)&&(o.writable=!0),o=n.slice().reverse().reduce(function(n,r){return r(e,t,n)||n},o),i&&void 0!==o.initializer&&(o.value=o.initializer?o.initializer.call(i):void 0,o.initializer=void 0),void 0===o.initializer&&(Object.defineProperty(e,t,o),o=null),o}function o(e){if(Array.isArray(e)){for(var t=0,n=Array(e.length);t<e.length;t++)n[t]=e[t];return n}return Array.from(e)}function u(e){if(!e||!e.hasOwnProperty)return!1;for(var t=["value","initializer","get","set"],n=0,r=t.length;n<r;n++)if(e.hasOwnProperty(t[n]))return!0;return!1}function s(e,t){return u(t[t.length-1])?e.apply(void 0,o(t).concat([[]])):function(){return e.apply(void 0,Array.prototype.slice.call(arguments).concat([t]))}}function a(e){var t={};return Z(e).forEach(function(n){return t[n]=W(e,n)}),t}function l(e){return function(t){return Object.defineProperty(this,e,{configurable:!0,writable:!0,enumerable:!0,value:t}),t}}function c(e,t){return e.bind?e.bind(t):function(){return e.apply(t,arguments)}}function f(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function h(e,t,n,r){var i=ne(r,2),o=i[0],u=void 0===o?re:o,s=i[1],a=void 0===s?{}:s;if("function"!=typeof n.value)throw new SyntaxError("Only functions can be marked as deprecated");var l=e.constructor.name+"#"+t;return a.url&&(u+="\n\n    See "+a.url+" for more details.\n\n"),te({},n,{value:function(){return J("DEPRECATION "+l+": "+u),n.value.apply(this,arguments)}})}function p(e){if(Array.isArray(e)){for(var t=0,n=Array(e.length);t<e.length;t++)n[t]=e[t];return n}return Array.from(e)}function g(e,t){if("undefined"==typeof WeakMap)throw new Error("Using @autobind on "+t.name+"() requires WeakMap support due to its use of super."+t.name+"()\n      See https://github.com/jayphelps/core-decorators.js/issues/20");ue||(ue=new WeakMap),!1===ue.has(e)&&ue.set(e,new WeakMap);var n=ue.get(e);return!1===n.has(t)&&n.set(t,c(t,e)),n.get(t)}function d(e){for(var t=a(e.prototype),n=Z(t),r=0,i=n.length;r<i;r++){var o=n[r],u=t[o];"function"==typeof u.value&&"constructor"!==o&&ie(e.prototype,o,y(e.prototype,o,u))}}function y(e,t,n){var r=n.value,i=n.configurable,o=n.enumerable;if("function"!=typeof r)throw new SyntaxError("@autobind can only be used on functions, not: "+r);var u=e.constructor;return{configurable:i,enumerable:o,get:function(){if(this===e)return r;if(this.constructor!==u&&oe(this).constructor===u)return r;if(this.constructor!==u&&t in this.constructor.prototype)return g(this,r);var n=c(r,this);return ie(this,t,{configurable:!0,writable:!0,enumerable:!1,value:n}),n},set:l(t)}}function v(e){return 1===e.length?d.apply(void 0,p(e)):y.apply(void 0,p(e))}function m(e){if(Array.isArray(e)){for(var t=0,n=Array(e.length);t<e.length;t++)n[t]=e[t];return n}return Array.from(e)}function b(e){return Array.isArray(e)?e:Array.from(e)}function w(e,t,n,r){var i=b(r),o=i[0],u=i.slice(1),s=n.configurable,a=n.enumerable,c=n.writable,f=n.get,h=n.set,p=n.value,g=!!f;return{configurable:s,enumerable:a,get:function(){var e=g?f.call(this):p,n=o.call.apply(o,[this,e].concat(m(u)));if(g)return n;var r={configurable:s,enumerable:a};return r.value=n,r.writable=c,se(this,t,r),n},set:g?h:l()}}function O(){for(var e=arguments.length,t=Array(e),n=0;n<e;n++)t[n]=arguments[n];return s(w,t)}function S(){return this.list=[],this.lastItem=void 0,this.size=0,this}function _(e,t){var n,r,i,o=e.length,u=t.length;for(r=0;r<o;r++){for(n=!0,i=0;i<u;i++)if(!N(e[r][i].arg,t[i].arg)){n=!1;break}if(n)break}e.push(e.splice(r,1)[0])}function T(e){var t,n,r=e.length,i=e[r-1];for(i.cacheItem.delete(i.arg),n=r-2;n>=0&&(i=e[n],!(t=i.cacheItem.get(i.arg))||!t.size);n--)i.cacheItem.delete(i.arg)}function N(e,t){return e===t||e!==e&&t!==t}function A(e,t,n,r,i){var o={};return Object.keys(r).forEach(function(e){o[e]=r[e]}),o.enumerable=!!o.enumerable,o.configurable=!!o.configurable,("value"in o||o.initializer)&&(o.writable=!0),o=n.slice().reverse().reduce(function(n,r){return r(e,t,n)||n},o),i&&void 0!==o.initializer&&(o.value=o.initializer?o.initializer.call(i):void 0,o.initializer=void 0),void 0===o.initializer&&(Object.defineProperty(e,t,o),o=null),o}function k(e){return M(e,e<100?e<10?2:1:0,!0)}function M(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,n=arguments.length>2&&void 0!==arguments[2]&&arguments[2];return 0===t?e:M((n?"0":"")+e+(n?"":"0"),t-1,n)}function I(e){var t=""+e;return t.length<=Se?t.indexOf(".")>-1?(t=e.toFixed(3),new $(t.replace(".","")+"000")):new $(t):new $(t.slice(0,Se))}function E(e){return/^(-)?\d+$/.test(""+e)}function D(e){var t=e.toNumber();return t%4==0&&t%100!=0||t%400==0}function F(e){return D(e)?366:365}function C(e){return _e[e.toNumber()]}function P(e,t,n){var r=arguments.length>3&&void 0!==arguments[3]?arguments[3]:0,i=e[r],o=n[r];if("number"!=typeof i||!E(i))throw new Error("Parameter "+o+" value for "+t+" has to be an integer.");n.length>r&&x(e[r+1])&&P(e,t,n,r+1)}function x(e){return void 0!==e}function U(e,t,n,r,i){function o(){for(var o=arguments.length,s=Array(o),a=0;a<o;a++)s[a]=arguments[a];P(s,t,n);var l=r();return l!==s[0]&&(l<s[0]?e._full=e._full.plus(e._getValue.call(e,e,i,s[0]-l)).truncated():e._full=e._full.minus(e._getValue.call(e,e,i,l-s[0])).truncated(),(1===s.length||s.length>1&&!x(s[1]))&&e._setupFunctions.call(e)),s.length>1&&x(s[1])&&(s.pop(),u.apply(e,s)),r()}var u=arguments.length>5&&void 0!==arguments[5]?arguments[5]:function(){};return Object.defineProperty(o,"name",{value:t,writable:!1}),o.bind(e)}var z,R,j,L,B,q,V="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{},$=function(e,t){return t={exports:{}},e(t,t.exports),t.exports}(function(e){!function(t){function n(e){function t(e,n){var r,i,o,u,s,a,l=this;if(!(l instanceof t))return V&&E(26,"constructor call without new",e),new t(e,n);if(null!=n&&$(n,2,64,P,"base")){if(n|=0,a=e+"",10==n)return l=new t(e instanceof t?e:a),D(l,z+l.e+1,R);if((u="number"==typeof e)&&0*e!=0||!new RegExp("^-?"+(r="["+b.slice(0,n)+"]+")+"(?:\\."+r+")?$",n<37?"i":"").test(a))return C(l,a,u,n);u?(l.s=1/e<0?(a=a.slice(1),-1):1,V&&a.replace(/^0\.0*|\./,"").length>15&&E(P,m,e),u=!1):l.s=45===a.charCodeAt(0)?(a=a.slice(1),-1):1,a=h(a,10,n,l.s)}else{if(e instanceof t)return l.s=e.s,l.e=e.e,l.c=(e=e.c)?e.slice():e,void(P=0);if((u="number"==typeof e)&&0*e==0){if(l.s=1/e<0?(e=-e,-1):1,e===~~e){for(i=0,o=e;o>=10;o/=10,i++);return l.e=i,l.c=[e],void(P=0)}a=e+""}else{if(!p.test(a=e+""))return C(l,a,u);l.s=45===a.charCodeAt(0)?(a=a.slice(1),-1):1}}for((i=a.indexOf("."))>-1&&(a=a.replace(".","")),(o=a.search(/e/i))>0?(i<0&&(i=o),i+=+a.slice(o+1),a=a.substring(0,o)):i<0&&(i=a.length),o=0;48===a.charCodeAt(o);o++);for(s=a.length;48===a.charCodeAt(--s););if(a=a.slice(o,s+1))if(s=a.length,u&&V&&s>15&&(e>S||e!==d(e))&&E(P,m,l.s*e),(i=i-o-1)>q)l.c=l.e=null;else if(i<B)l.c=[l.e=0];else{if(l.e=i,l.c=[],o=(i+1)%O,i<0&&(o+=O),o<s){for(o&&l.c.push(+a.slice(0,o)),s-=O;o<s;)l.c.push(+a.slice(o,o+=O));a=a.slice(o),o=O-a.length}else o-=s;for(;o--;a+="0");l.c.push(+a)}else l.c=[l.e=0];P=0}function h(e,n,r,o){var u,s,l,f,h,p,g,d=e.indexOf("."),y=z,v=R;for(r<37&&(e=e.toLowerCase()),d>=0&&(l=W,W=0,e=e.replace(".",""),h=(g=new t(r)).pow(e.length-d),W=l,g.c=a(c(i(h.c),h.e),10,n),g.e=g.c.length),s=l=(p=a(e,r,n)).length;0==p[--l];p.pop());if(!p[0])return"0";if(d<0?--s:(h.c=p,h.e=s,h.s=o,p=(h=F(h,g,y,v,n)).c,f=h.r,s=h.e),u=s+y+1,d=p[u],l=n/2,f=f||u<0||null!=p[u+1],f=v<4?(null!=d||f)&&(0==v||v==(h.s<0?3:2)):d>l||d==l&&(4==v||f||6==v&&1&p[u-1]||v==(h.s<0?8:7)),u<1||!p[0])e=f?c("1",-y):"0";else{if(p.length=u,f)for(--n;++p[--u]>n;)p[u]=0,u||(++s,p=[1].concat(p));for(l=p.length;!p[--l];);for(d=0,e="";d<=l;e+=b.charAt(p[d++]));e=c(e,s)}return e}function A(e,n,r,o){var u,s,a,f,h;if(r=null!=r&&$(r,0,8,o,v)?0|r:R,!e.c)return e.toString();if(u=e.c[0],a=e.e,null==n)h=i(e.c),h=19==o||24==o&&a<=j?l(h,a):c(h,a);else if(e=D(new t(e),n,r),s=e.e,h=i(e.c),f=h.length,19==o||24==o&&(n<=s||s<=j)){for(;f<n;h+="0",f++);h=l(h,s)}else if(n-=a,h=c(h,s),s+1>f){if(--n>0)for(h+=".";n--;h+="0");}else if((n+=s-f)>0)for(s+1==f&&(h+=".");n--;h+="0");return e.s<0&&u?"-"+h:h}function k(e,n){var r,i,o=0;for(s(e[0])&&(e=e[0]),r=new t(e[0]);++o<e.length;){if(!(i=new t(e[o])).s){r=i;break}n.call(r,i)&&(r=i)}return r}function M(e,t,n,r,i){return(e<t||e>n||e!=f(e))&&E(r,(i||"decimal places")+(e<t||e>n?" out of range":" not an integer"),e),!0}function I(e,t,n){for(var r=1,i=t.length;!t[--i];t.pop());for(i=t[0];i>=10;i/=10,r++);return(n=r+n*O-1)>q?e.c=e.e=null:n<B?e.c=[e.e=0]:(e.e=n,e.c=t),e}function E(e,t,n){var r=new Error(["new BigNumber","cmp","config","div","divToInt","eq","gt","gte","lt","lte","minus","mod","plus","precision","random","round","shift","times","toDigits","toExponential","toFixed","toFormat","toFraction","pow","toPrecision","toString","BigNumber"][e]+"() "+t+": "+n);throw r.name="BigNumber Error",P=0,r}function D(e,t,n,r){var i,o,u,s,a,l,c,f=e.c,h=_;if(f){e:{for(i=1,s=f[0];s>=10;s/=10,i++);if((o=t-i)<0)o+=O,u=t,c=(a=f[l=0])/h[i-u-1]%10|0;else if((l=g((o+1)/O))>=f.length){if(!r)break e;for(;f.length<=l;f.push(0));a=c=0,i=1,u=(o%=O)-O+1}else{for(a=s=f[l],i=1;s>=10;s/=10,i++);c=(u=(o%=O)-O+i)<0?0:a/h[i-u-1]%10|0}if(r=r||t<0||null!=f[l+1]||(u<0?a:a%h[i-u-1]),r=n<4?(c||r)&&(0==n||n==(e.s<0?3:2)):c>5||5==c&&(4==n||r||6==n&&(o>0?u>0?a/h[i-u]:0:f[l-1])%10&1||n==(e.s<0?8:7)),t<1||!f[0])return f.length=0,r?(t-=e.e+1,f[0]=h[(O-t%O)%O],e.e=-t||0):f[0]=e.e=0,e;if(0==o?(f.length=l,s=1,l--):(f.length=l+1,s=h[O-o],f[l]=u>0?d(a/h[i-u]%h[u])*s:0),r)for(;;){if(0==l){for(o=1,u=f[0];u>=10;u/=10,o++);for(u=f[0]+=s,s=1;u>=10;u/=10,s++);o!=s&&(e.e++,f[0]==w&&(f[0]=1));break}if(f[l]+=s,f[l]!=w)break;f[l--]=0,s=1}for(o=f.length;0===f[--o];f.pop());}e.e>q?e.c=e.e=null:e.e<B&&(e.c=[e.e=0])}return e}var F,C,P=0,x=t.prototype,U=new t(1),z=20,R=4,j=-7,L=21,B=-1e7,q=1e7,V=!0,$=M,G=!1,H=1,W=0,Y={decimalSeparator:".",groupSeparator:",",groupSize:3,secondaryGroupSize:0,fractionGroupSeparator:" ",fractionGroupSize:0};return t.another=n,t.ROUND_UP=0,t.ROUND_DOWN=1,t.ROUND_CEIL=2,t.ROUND_FLOOR=3,t.ROUND_HALF_UP=4,t.ROUND_HALF_DOWN=5,t.ROUND_HALF_EVEN=6,t.ROUND_HALF_CEIL=7,t.ROUND_HALF_FLOOR=8,t.EUCLID=9,t.config=t.set=function(){var e,t,n=0,r={},i=arguments,o=i[0],a=o&&"object"==typeof o?function(){if(o.hasOwnProperty(t))return null!=(e=o[t])}:function(){if(i.length>n)return null!=(e=i[n++])};return a(t="DECIMAL_PLACES")&&$(e,0,N,2,t)&&(z=0|e),r[t]=z,a(t="ROUNDING_MODE")&&$(e,0,8,2,t)&&(R=0|e),r[t]=R,a(t="EXPONENTIAL_AT")&&(s(e)?$(e[0],-N,0,2,t)&&$(e[1],0,N,2,t)&&(j=0|e[0],L=0|e[1]):$(e,-N,N,2,t)&&(j=-(L=0|(e<0?-e:e)))),r[t]=[j,L],a(t="RANGE")&&(s(e)?$(e[0],-N,-1,2,t)&&$(e[1],1,N,2,t)&&(B=0|e[0],q=0|e[1]):$(e,-N,N,2,t)&&(0|e?B=-(q=0|(e<0?-e:e)):V&&E(2,t+" cannot be zero",e))),r[t]=[B,q],a(t="ERRORS")&&(e===!!e||1===e||0===e?(P=0,$=(V=!!e)?M:u):V&&E(2,t+y,e)),r[t]=V,a(t="CRYPTO")&&(!0===e||!1===e||1===e||0===e?e?!(e="undefined"==typeof crypto)&&crypto&&(crypto.getRandomValues||crypto.randomBytes)?G=!0:V?E(2,"crypto unavailable",e?void 0:crypto):G=!1:G=!1:V&&E(2,t+y,e)),r[t]=G,a(t="MODULO_MODE")&&$(e,0,9,2,t)&&(H=0|e),r[t]=H,a(t="POW_PRECISION")&&$(e,0,N,2,t)&&(W=0|e),r[t]=W,a(t="FORMAT")&&("object"==typeof e?Y=e:V&&E(2,t+" not an object",e)),r[t]=Y,r},t.max=function(){return k(arguments,x.lt)},t.min=function(){return k(arguments,x.gt)},t.random=function(){var e=9007199254740992*Math.random()&2097151?function(){return d(9007199254740992*Math.random())}:function(){return 8388608*(1073741824*Math.random()|0)+(8388608*Math.random()|0)};return function(n){var r,i,o,u,s,a=0,l=[],c=new t(U);if(n=null!=n&&$(n,0,N,14)?0|n:z,u=g(n/O),G)if(crypto.getRandomValues){for(r=crypto.getRandomValues(new Uint32Array(u*=2));a<u;)(s=131072*r[a]+(r[a+1]>>>11))>=9e15?(i=crypto.getRandomValues(new Uint32Array(2)),r[a]=i[0],r[a+1]=i[1]):(l.push(s%1e14),a+=2);a=u/2}else if(crypto.randomBytes){for(r=crypto.randomBytes(u*=7);a<u;)(s=281474976710656*(31&r[a])+1099511627776*r[a+1]+4294967296*r[a+2]+16777216*r[a+3]+(r[a+4]<<16)+(r[a+5]<<8)+r[a+6])>=9e15?crypto.randomBytes(7).copy(r,a):(l.push(s%1e14),a+=7);a=u/7}else G=!1,V&&E(14,"crypto unavailable",crypto);if(!G)for(;a<u;)(s=e())<9e15&&(l[a++]=s%1e14);for(u=l[--a],n%=O,u&&n&&(s=_[O-n],l[a]=d(u/s)*s);0===l[a];l.pop(),a--);if(a<0)l=[o=0];else{for(o=-1;0===l[0];l.splice(0,1),o-=O);for(a=1,s=l[0];s>=10;s/=10,a++);a<O&&(o-=O-a)}return c.e=o,c.c=l,c}}(),F=function(){function e(e,t,n){var r,i,o,u,s=0,a=e.length,l=t%T,c=t/T|0;for(e=e.slice();a--;)s=((i=l*(o=e[a]%T)+(r=c*o+(u=e[a]/T|0)*l)%T*T+s)/n|0)+(r/T|0)+c*u,e[a]=i%n;return s&&(e=[s].concat(e)),e}function n(e,t,n,r){var i,o;if(n!=r)o=n>r?1:-1;else for(i=o=0;i<n;i++)if(e[i]!=t[i]){o=e[i]>t[i]?1:-1;break}return o}function i(e,t,n,r){for(var i=0;n--;)e[n]-=i,i=e[n]<t[n]?1:0,e[n]=i*r+e[n]-t[n];for(;!e[0]&&e.length>1;e.splice(0,1));}return function(o,u,s,a,l){var c,f,h,p,g,y,v,m,b,S,_,T,N,A,k,M,I,E=o.s==u.s?1:-1,F=o.c,C=u.c;if(!(F&&F[0]&&C&&C[0]))return new t(o.s&&u.s&&(F?!C||F[0]!=C[0]:C)?F&&0==F[0]||!C?0*E:E/0:NaN);for(b=(m=new t(E)).c=[],E=s+(f=o.e-u.e)+1,l||(l=w,f=r(o.e/O)-r(u.e/O),E=E/O|0),h=0;C[h]==(F[h]||0);h++);if(C[h]>(F[h]||0)&&f--,E<0)b.push(1),p=!0;else{for(A=F.length,M=C.length,h=0,E+=2,(g=d(l/(C[0]+1)))>1&&(C=e(C,g,l),F=e(F,g,l),M=C.length,A=F.length),N=M,_=(S=F.slice(0,M)).length;_<M;S[_++]=0);I=C.slice(),I=[0].concat(I),k=C[0],C[1]>=l/2&&k++;do{if(g=0,(c=n(C,S,M,_))<0){if(T=S[0],M!=_&&(T=T*l+(S[1]||0)),(g=d(T/k))>1)for(g>=l&&(g=l-1),v=(y=e(C,g,l)).length,_=S.length;1==n(y,S,v,_);)g--,i(y,M<v?I:C,v,l),v=y.length,c=1;else 0==g&&(c=g=1),v=(y=C.slice()).length;if(v<_&&(y=[0].concat(y)),i(S,y,_,l),_=S.length,-1==c)for(;n(C,S,M,_)<1;)g++,i(S,M<_?I:C,_,l),_=S.length}else 0===c&&(g++,S=[0]);b[h++]=g,S[0]?S[_++]=F[N]||0:(S=[F[N]],_=1)}while((N++<A||null!=S[0])&&E--);p=null!=S[0],b[0]||b.splice(0,1)}if(l==w){for(h=1,E=b[0];E>=10;E/=10,h++);D(m,s+(m.e=h+f*O-1)+1,a,p)}else m.e=f,m.r=+p;return m}}(),C=function(){var e=/^(-?)0([xbo])(?=\w[\w.]*$)/i,n=/^([^.]+)\.$/,r=/^\.([^.]+)$/,i=/^-?(Infinity|NaN)$/,o=/^\s*\+(?=[\w.])|^\s+|\s+$/g;return function(u,s,a,l){var c,f=a?s:s.replace(o,"");if(i.test(f))u.s=isNaN(f)?null:f<0?-1:1;else{if(!a&&(f=f.replace(e,function(e,t,n){return c="x"==(n=n.toLowerCase())?16:"b"==n?2:8,l&&l!=c?e:t}),l&&(c=l,f=f.replace(n,"$1").replace(r,"0.$1")),s!=f))return new t(f,c);V&&E(P,"not a"+(l?" base "+l:"")+" number",s),u.s=null}u.c=u.e=null,P=0}}(),x.absoluteValue=x.abs=function(){var e=new t(this);return e.s<0&&(e.s=1),e},x.ceil=function(){return D(new t(this),this.e+1,2)},x.comparedTo=x.cmp=function(e,n){return P=1,o(this,new t(e,n))},x.decimalPlaces=x.dp=function(){var e,t,n=this.c;if(!n)return null;if(e=((t=n.length-1)-r(this.e/O))*O,t=n[t])for(;t%10==0;t/=10,e--);return e<0&&(e=0),e},x.dividedBy=x.div=function(e,n){return P=3,F(this,new t(e,n),z,R)},x.dividedToIntegerBy=x.divToInt=function(e,n){return P=4,F(this,new t(e,n),0,1)},x.equals=x.eq=function(e,n){return P=5,0===o(this,new t(e,n))},x.floor=function(){return D(new t(this),this.e+1,3)},x.greaterThan=x.gt=function(e,n){return P=6,o(this,new t(e,n))>0},x.greaterThanOrEqualTo=x.gte=function(e,n){return P=7,1===(n=o(this,new t(e,n)))||0===n},x.isFinite=function(){return!!this.c},x.isInteger=x.isInt=function(){return!!this.c&&r(this.e/O)>this.c.length-2},x.isNaN=function(){return!this.s},x.isNegative=x.isNeg=function(){return this.s<0},x.isZero=function(){return!!this.c&&0==this.c[0]},x.lessThan=x.lt=function(e,n){return P=8,o(this,new t(e,n))<0},x.lessThanOrEqualTo=x.lte=function(e,n){return P=9,-1===(n=o(this,new t(e,n)))||0===n},x.minus=x.sub=function(e,n){var i,o,u,s,a=this,l=a.s;if(P=10,e=new t(e,n),n=e.s,!l||!n)return new t(NaN);if(l!=n)return e.s=-n,a.plus(e);var c=a.e/O,f=e.e/O,h=a.c,p=e.c;if(!c||!f){if(!h||!p)return h?(e.s=-n,e):new t(p?a:NaN);if(!h[0]||!p[0])return p[0]?(e.s=-n,e):new t(h[0]?a:3==R?-0:0)}if(c=r(c),f=r(f),h=h.slice(),l=c-f){for((s=l<0)?(l=-l,u=h):(f=c,u=p),u.reverse(),n=l;n--;u.push(0));u.reverse()}else for(o=(s=(l=h.length)<(n=p.length))?l:n,l=n=0;n<o;n++)if(h[n]!=p[n]){s=h[n]<p[n];break}if(s&&(u=h,h=p,p=u,e.s=-e.s),(n=(o=p.length)-(i=h.length))>0)for(;n--;h[i++]=0);for(n=w-1;o>l;){if(h[--o]<p[o]){for(i=o;i&&!h[--i];h[i]=n);--h[i],h[o]+=w}h[o]-=p[o]}for(;0==h[0];h.splice(0,1),--f);return h[0]?I(e,h,f):(e.s=3==R?-1:1,e.c=[e.e=0],e)},x.modulo=x.mod=function(e,n){var r,i,o=this;return P=11,e=new t(e,n),!o.c||!e.s||e.c&&!e.c[0]?new t(NaN):!e.c||o.c&&!o.c[0]?new t(o):(9==H?(i=e.s,e.s=1,r=F(o,e,0,3),e.s=i,r.s*=i):r=F(o,e,0,H),o.minus(r.times(e)))},x.negated=x.neg=function(){var e=new t(this);return e.s=-e.s||null,e},x.plus=x.add=function(e,n){var i,o=this,u=o.s;if(P=12,e=new t(e,n),n=e.s,!u||!n)return new t(NaN);if(u!=n)return e.s=-n,o.minus(e);var s=o.e/O,a=e.e/O,l=o.c,c=e.c;if(!s||!a){if(!l||!c)return new t(u/0);if(!l[0]||!c[0])return c[0]?e:new t(l[0]?o:0*u)}if(s=r(s),a=r(a),l=l.slice(),u=s-a){for(u>0?(a=s,i=c):(u=-u,i=l),i.reverse();u--;i.push(0));i.reverse()}for((u=l.length)-(n=c.length)<0&&(i=c,c=l,l=i,n=u),u=0;n;)u=(l[--n]=l[n]+c[n]+u)/w|0,l[n]=w===l[n]?0:l[n]%w;return u&&(l=[u].concat(l),++a),I(e,l,a)},x.precision=x.sd=function(e){var t,n,r=this,i=r.c;if(null!=e&&e!==!!e&&1!==e&&0!==e&&(V&&E(13,"argument"+y,e),e!=!!e&&(e=null)),!i)return null;if(n=i.length-1,t=n*O+1,n=i[n]){for(;n%10==0;n/=10,t--);for(n=i[0];n>=10;n/=10,t++);}return e&&r.e+1>t&&(t=r.e+1),t},x.round=function(e,n){var r=new t(this);return(null==e||$(e,0,N,15))&&D(r,~~e+this.e+1,null!=n&&$(n,0,8,15,v)?0|n:R),r},x.shift=function(e){var n=this;return $(e,-S,S,16,"argument")?n.times("1e"+f(e)):new t(n.c&&n.c[0]&&(e<-S||e>S)?n.s*(e<0?0:1/0):n)},x.squareRoot=x.sqrt=function(){var e,n,o,u,s,a=this,l=a.c,c=a.s,f=a.e,h=z+4,p=new t("0.5");if(1!==c||!l||!l[0])return new t(!c||c<0&&(!l||l[0])?NaN:l?a:1/0);if(0==(c=Math.sqrt(+a))||c==1/0?(((n=i(l)).length+f)%2==0&&(n+="0"),c=Math.sqrt(n),f=r((f+1)/2)-(f<0||f%2),o=new t(n=c==1/0?"1e"+f:(n=c.toExponential()).slice(0,n.indexOf("e")+1)+f)):o=new t(c+""),o.c[0])for((c=(f=o.e)+h)<3&&(c=0);;)if(s=o,o=p.times(s.plus(F(a,s,h,1))),i(s.c).slice(0,c)===(n=i(o.c)).slice(0,c)){if(o.e<f&&--c,"9999"!=(n=n.slice(c-3,c+1))&&(u||"4999"!=n)){+n&&(+n.slice(1)||"5"!=n.charAt(0))||(D(o,o.e+z+2,1),e=!o.times(o).eq(a));break}if(!u&&(D(s,s.e+z+2,0),s.times(s).eq(a))){o=s;break}h+=4,c+=4,u=1}return D(o,o.e+z+1,R,e)},x.times=x.mul=function(e,n){var i,o,u,s,a,l,c,f,h,p,g,d,y,v,m,b=this,S=b.c,_=(P=17,e=new t(e,n)).c;if(!(S&&_&&S[0]&&_[0]))return!b.s||!e.s||S&&!S[0]&&!_||_&&!_[0]&&!S?e.c=e.e=e.s=null:(e.s*=b.s,S&&_?(e.c=[0],e.e=0):e.c=e.e=null),e;for(o=r(b.e/O)+r(e.e/O),e.s*=b.s,(c=S.length)<(p=_.length)&&(y=S,S=_,_=y,u=c,c=p,p=u),u=c+p,y=[];u--;y.push(0));for(v=w,m=T,u=p;--u>=0;){for(i=0,g=_[u]%m,d=_[u]/m|0,s=u+(a=c);s>u;)i=((f=g*(f=S[--a]%m)+(l=d*f+(h=S[a]/m|0)*g)%m*m+y[s]+i)/v|0)+(l/m|0)+d*h,y[s--]=f%v;y[s]=i}return i?++o:y.splice(0,1),I(e,y,o)},x.toDigits=function(e,n){var r=new t(this);return e=null!=e&&$(e,1,N,18,"precision")?0|e:null,n=null!=n&&$(n,0,8,18,v)?0|n:R,e?D(r,e,n):r},x.toExponential=function(e,t){return A(this,null!=e&&$(e,0,N,19)?1+~~e:null,t,19)},x.toFixed=function(e,t){return A(this,null!=e&&$(e,0,N,20)?~~e+this.e+1:null,t,20)},x.toFormat=function(e,t){var n=A(this,null!=e&&$(e,0,N,21)?~~e+this.e+1:null,t,21);if(this.c){var r,i=n.split("."),o=+Y.groupSize,u=+Y.secondaryGroupSize,s=Y.groupSeparator,a=i[0],l=i[1],c=this.s<0,f=c?a.slice(1):a,h=f.length;if(u&&(r=o,o=u,u=r,h-=r),o>0&&h>0){for(r=h%o||o,a=f.substr(0,r);r<h;r+=o)a+=s+f.substr(r,o);u>0&&(a+=s+f.slice(r)),c&&(a="-"+a)}n=l?a+Y.decimalSeparator+((u=+Y.fractionGroupSize)?l.replace(new RegExp("\\d{"+u+"}\\B","g"),"$&"+Y.fractionGroupSeparator):l):a}return n},x.toFraction=function(e){var n,r,o,u,s,a,l,c,f,h=V,p=this,g=p.c,d=new t(U),y=r=new t(U),v=l=new t(U);if(null!=e&&(V=!1,a=new t(e),V=h,(h=a.isInt())&&!a.lt(U)||(V&&E(22,"max denominator "+(h?"out of range":"not an integer"),e),e=!h&&a.c&&D(a,a.e+1,1).gte(U)?a:null)),!g)return p.toString();for(f=i(g),u=d.e=f.length-p.e-1,d.c[0]=_[(s=u%O)<0?O+s:s],e=!e||a.cmp(d)>0?u>0?d:y:a,s=q,q=1/0,a=new t(f),l.c[0]=0;c=F(a,d,0,1),1!=(o=r.plus(c.times(v))).cmp(e);)r=v,v=o,y=l.plus(c.times(o=y)),l=o,d=a.minus(c.times(o=d)),a=o;return o=F(e.minus(r),v,0,1),l=l.plus(o.times(y)),r=r.plus(o.times(v)),l.s=y.s=p.s,u*=2,n=F(y,v,u,R).minus(p).abs().cmp(F(l,r,u,R).minus(p).abs())<1?[y.toString(),v.toString()]:[l.toString(),r.toString()],q=s,n},x.toNumber=function(){return+this},x.toPower=x.pow=function(e,n){var r,i,o,u=d(e<0?-e:+e),s=this;if(null!=n&&(P=23,n=new t(n)),!$(e,-S,S,23,"exponent")&&(!isFinite(e)||u>S&&(e/=0)||parseFloat(e)!=e&&!(e=NaN))||0==e)return r=Math.pow(+s,e),new t(n?r%n:r);for(n?e>1&&s.gt(U)&&s.isInt()&&n.gt(U)&&n.isInt()?s=s.mod(n):(o=n,n=null):W&&(r=g(W/O+2)),i=new t(U);;){if(u%2){if(!(i=i.times(s)).c)break;r?i.c.length>r&&(i.c.length=r):n&&(i=i.mod(n))}if(!(u=d(u/2)))break;s=s.times(s),r?s.c&&s.c.length>r&&(s.c.length=r):n&&(s=s.mod(n))}return n?i:(e<0&&(i=U.div(i)),o?i.mod(o):r?D(i,W,R):i)},x.toPrecision=function(e,t){return A(this,null!=e&&$(e,1,N,24,"precision")?0|e:null,t,24)},x.toString=function(e){var t,n=this,r=n.s,o=n.e;return null===o?r?(t="Infinity",r<0&&(t="-"+t)):t="NaN":(t=i(n.c),t=null!=e&&$(e,2,64,25,"base")?h(c(t,o),0|e,10,r):o<=j||o>=L?l(t,o):c(t,o),r<0&&n.c[0]&&(t="-"+t)),t},x.truncated=x.trunc=function(){return D(new t(this),this.e+1,1)},x.valueOf=x.toJSON=function(){var e,t=this,n=t.e;return null===n?t.toString():(e=i(t.c),e=n<=j||n>=L?l(e,n):c(e,n),t.s<0?"-"+e:e)},x.isBigNumber=!0,null!=e&&t.config(e),t}function r(e){var t=0|e;return e>0||e===t?t:t-1}function i(e){for(var t,n,r=1,i=e.length,o=e[0]+"";r<i;){for(t=e[r++]+"",n=O-t.length;n--;t="0"+t);o+=t}for(i=o.length;48===o.charCodeAt(--i););return o.slice(0,i+1||1)}function o(e,t){var n,r,i=e.c,o=t.c,u=e.s,s=t.s,a=e.e,l=t.e;if(!u||!s)return null;if(n=i&&!i[0],r=o&&!o[0],n||r)return n?r?0:-s:u;if(u!=s)return u;if(n=u<0,r=a==l,!i||!o)return r?0:!i^n?1:-1;if(!r)return a>l^n?1:-1;for(s=(a=i.length)<(l=o.length)?a:l,u=0;u<s;u++)if(i[u]!=o[u])return i[u]>o[u]^n?1:-1;return a==l?0:a>l^n?1:-1}function u(e,t,n){return(e=f(e))>=t&&e<=n}function s(e){return"[object Array]"==Object.prototype.toString.call(e)}function a(e,t,n){for(var r,i,o=[0],u=0,s=e.length;u<s;){for(i=o.length;i--;o[i]*=t);for(o[r=0]+=b.indexOf(e.charAt(u++));r<o.length;r++)o[r]>n-1&&(null==o[r+1]&&(o[r+1]=0),o[r+1]+=o[r]/n|0,o[r]%=n)}return o.reverse()}function l(e,t){return(e.length>1?e.charAt(0)+"."+e.slice(1):e)+(t<0?"e":"e+")+t}function c(e,t){var n,r;if(t<0){for(r="0.";++t;r+="0");e=r+e}else if(n=e.length,++t>n){for(r="0",t-=n;--t;r+="0");e+=r}else t<n&&(e=e.slice(0,t)+"."+e.slice(t));return e}function f(e){return(e=parseFloat(e))<0?g(e):d(e)}var h,p=/^-?(\d+(\.\d*)?|\.\d+)(e[+-]?\d+)?$/i,g=Math.ceil,d=Math.floor,y=" not a boolean or binary digit",v="rounding mode",m="number type has more than 15 significant digits",b="0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$_",w=1e14,O=14,S=9007199254740991,_=[1,10,100,1e3,1e4,1e5,1e6,1e7,1e8,1e9,1e10,1e11,1e12,1e13],T=1e7,N=1e9;(h=n()).default=h.BigNumber=h,e.exports?e.exports=h:(t||(t="undefined"!=typeof self?self:Function("return this")()),t.BigNumber=h)}(V)}),G=Object.defineProperty,H="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},W=Object.getOwnPropertyDescriptor,Y=Object.getOwnPropertyNames,K=Object.getOwnPropertySymbols,Z=(z=function e(){r(this,e),n(this,"debounceTimeoutIds",R,this),n(this,"throttleTimeoutIds",j,this),n(this,"throttlePreviousTimestamps",L,this),n(this,"throttleTrailingArgs",B,this),n(this,"profileLastRan",q,this)},R=i(z.prototype,"debounceTimeoutIds",[t],{enumerable:!0,initializer:function(){return{}}}),j=i(z.prototype,"throttleTimeoutIds",[t],{enumerable:!0,initializer:function(){return{}}}),L=i(z.prototype,"throttlePreviousTimestamps",[t],{enumerable:!0,initializer:function(){return{}}}),B=i(z.prototype,"throttleTrailingArgs",[t],{enumerable:!0,initializer:function(){return null}}),q=i(z.prototype,"profileLastRan",[t],{enumerable:!0,initializer:function(){return null}}),K?function(e){return Y(e).concat(K(e))}:Y),J="object"===("undefined"==typeof console?"undefined":H(console))&&console&&"function"==typeof console.warn?c(console.warn,console):function(){},X="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},Q=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),ee=/^function ([_$a-zA-Z\xA0-\uFFFF][_$a-zA-Z0-9\xA0-\uFFFF]*)?(\([^\)]*\))[\s\S]+$/,te=(function(){function e(t,n,r,i){f(this,e),this.parentKlass=t,this.childKlass=n,this.parentDescriptor=r,this.childDescriptor=i}Q(e,[{key:"_getTopic",value:function(e){return void 0===e?null:"value"in e?e.value:"get"in e?e.get:"set"in e?e.set:void 0}},{key:"_extractTopicSignature",value:function(e){switch(void 0===e?"undefined":X(e)){case"function":return this._extractFunctionSignature(e);default:return this.key}}},{key:"_extractFunctionSignature",value:function(e){var t=this;return e.toString().replace(ee,function(e){return(arguments.length>1&&void 0!==arguments[1]?arguments[1]:t.key)+arguments[2]})}},{key:"key",get:function(){return this.childDescriptor.key}},{key:"parentNotation",get:function(){return this.parentKlass.constructor.name+"#"+this.parentPropertySignature}},{key:"childNotation",get:function(){return this.childKlass.constructor.name+"#"+this.childPropertySignature}},{key:"parentTopic",get:function(){return this._getTopic(this.parentDescriptor)}},{key:"childTopic",get:function(){return this._getTopic(this.childDescriptor)}},{key:"parentPropertySignature",get:function(){return this._extractTopicSignature(this.parentTopic)}},{key:"childPropertySignature",get:function(){return this._extractTopicSignature(this.childTopic)}}]),Q(e,[{key:"assert",value:function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"";!0!==e&&this.error("{child} does not properly override {parent}"+t)}},{key:"error",value:function(e){var t=this;throw e=e.replace("{parent}",function(e){return t.parentNotation}).replace("{child}",function(e){return t.childNotation}),new SyntaxError(e)}}])}(),Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e}),ne=function(){function e(e,t){var n=[],r=!0,i=!1,o=void 0;try{for(var u,s=e[Symbol.iterator]();!(r=(u=s.next()).done)&&(n.push(u.value),!t||n.length!==t);r=!0);}catch(e){i=!0,o=e}finally{try{!r&&s.return&&s.return()}finally{if(i)throw o}}return n}return function(t,n){if(Array.isArray(t))return t;if(Symbol.iterator in Object(t))return e(t,n);throw new TypeError("Invalid attempt to destructure non-iterable instance")}}(),re="This function will be removed in future versions.",ie=Object.defineProperty,oe=Object.getPrototypeOf,ue=void 0,se=Object.defineProperty,ae={};console.time&&console.time.bind(console),console.timeEnd&&console.timeEnd.bind(console),console.profile&&c(console.profile,console),console.profileEnd&&c(console.profileEnd,console);S.prototype.get=function(e){var t;return this.lastItem&&this.isEqual(this.lastItem.key,e)?this.lastItem.val:(t=this.indexOf(e))>=0?(this.lastItem=this.list[t],this.list[t].val):void 0},S.prototype.set=function(e,t){var n;return this.lastItem&&this.isEqual(this.lastItem.key,e)?(this.lastItem.val=t,this):(n=this.indexOf(e))>=0?(this.lastItem=this.list[n],this.list[n].val=t,this):(this.lastItem={key:e,val:t},this.list.push(this.lastItem),this.size++,this)},S.prototype.delete=function(e){var t;if(this.lastItem&&this.isEqual(this.lastItem.key,e)&&(this.lastItem=void 0),(t=this.indexOf(e))>=0)return this.size--,this.list.splice(t,1)[0]},S.prototype.has=function(e){var t;return!(!this.lastItem||!this.isEqual(this.lastItem.key,e))||(t=this.indexOf(e))>=0&&(this.lastItem=this.list[t],!0)},S.prototype.forEach=function(e,t){var n;for(n=0;n<this.size;n++)e.call(t||this,this.list[n].val,this.list[n].key,this)},S.prototype.indexOf=function(e){var t;for(t=0;t<this.size;t++)if(this.isEqual(this.list[t].key,e))return t;return-1},S.prototype.isEqual=function(e,t){return e===t||e!==e&&t!==t};var le,ce,fe,he,pe,ge=S,de=function(e){return"function"!=typeof Map||e?new ge:new Map},ye=function(e){var t=new de("true"==="{}".FORCE_SIMILAR_INSTEAD_OF_MAP),n=[];return function(r){var i=function(){var o,u,s,a=t,l=arguments.length-1,c=Array(l+1),f=!0;if((i.numArgs||0===i.numArgs)&&i.numArgs!==l+1)throw new Error("Memoizerific functions should always be called with the same number of arguments");for(s=0;s<l;s++)c[s]={cacheItem:a,arg:arguments[s]},a.has(arguments[s])?a=a.get(arguments[s]):(f=!1,o=new de("true"==="{}".FORCE_SIMILAR_INSTEAD_OF_MAP),a.set(arguments[s],o),a=o);return f&&(a.has(arguments[l])?u=a.get(arguments[l]):f=!1),f||(u=r.apply(null,arguments),a.set(arguments[l],u)),e>0&&(c[l]={cacheItem:a,arg:arguments[l]},f?_(n,c):n.push(c),n.length>e&&T(n.shift())),i.wasMemoized=f,i.numArgs=l+1,u};return i.limit=e,i.wasMemoized=!1,i.cache=t,i.lru=n,i}},ve=function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")},me=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),be=function(e){if(Array.isArray(e)){for(var t=0,n=Array(e.length);t<e.length;t++)n[t]=e[t];return n}return Array.from(e)};if("undefined"==typeof window)we=we;else var we=window.Date;var Oe=1e6,Se=19,_e={1:31,2:28,3:31,4:30,5:31,6:30,7:31,8:31,9:30,10:31,11:30,12:31},Te=["getFullYear","getYear","getMonth","getDate","getDay","getHours","getMinutes","getSeconds","getMilliseconds","getUTCFullYear","getUTCYear","getUTCMonth","getUTCDate","getUTCDay","getUTCHours","getUTCMinutes","getUTCSeconds","getUTCMilliseconds","toDateString","toLocaleDateString","toLocaleString","toTimeString","toLocaleTimeString","toISOString","getTimezoneOffset"];return le=O(ye(250)),ce=O(ye(100)),fe=function(){for(var e=arguments.length,t=Array(e),n=0;n<e;n++)t[n]=arguments[n];return s(h,t)}("Use toUTCString() instead"),function(){for(var e=arguments.length,t=Array(e),n=0;n<e;n++)t[n]=arguments[n];return 0===t.length?function(){return v(arguments)}:v(t)}((pe=function(){function e(t,n,r,i,o,u,s){if(ve(this,e),"string"==typeof t)this._full=I(E(t)?t:new we(t).valueOf()*Oe);else if(0===arguments.length)this._full=I((new we).valueOf()*Oe);else if(1===arguments.length)if(t instanceof e)this._full=t._full;else if(t instanceof we)this._full=I(t.valueOf()*Oe);else{if("number"!=typeof t)throw Error("Input not of any type that can be converted to a date");var a=Oe;(""+t).indexOf(".")>-1&&(a=1),this._full=I(t*a)}else{var l=new we(t,n||0,r||0,i||0,o||0,u||0,s||0);this._full=I(l.valueOf()*Oe)}this._setupFunctions()}return me(e,[{key:"_setupFunctions",value:function(){var e=this;this._date=new we(this.valueOf()),Te.forEach(function(t){e[t]=function(){var n;return(n=e._date)[t].apply(n,arguments)}}),this._buildSetFunctions()}},{key:"_getDaysBetween",value:function(e,t,n){if(e.eq(t))return new $(0);for(var r=new $(0),i=e.lt(t)?1:-1,o=new $(e);!o.eq(t);)r=r.plus(n(o)),o=o.plus(i);return r.times(i)}},{key:"_getDays",value:function(e){var t=new $(e),n=new $(0);if(e>=12){var r=t.dividedToIntegerBy(12),i=new $(this.getFullYear()),o=i.plus(r);n=this._getDaysBetween(i,o,F),t=t.plus(r.times(12).times(t.lessThan(0)?1:-1))}var u=new $(this.getMonth()),s=u.plus(t);return n.plus(this._getDaysBetween(u,s,C))}},{key:"_getValue",value:function(e,t,n){var r=new $(n);switch(t){case"year":return e._getValue(e,"month",r.times(12));case"month":return e._getValue(e,"day",e._getDays(r));case"day":return e._getValue(e,"hour",r.times(24));case"hour":return e._getValue(e,"minute",r.times(60));case"minute":return e._getValue(e,"second",r.times(60));case"second":return e._getValue(e,"milli",r.times(1e3));case"milli":return e._getValue(e,"micro",r.times(1e3));case"micro":return e._getValue(e,"nano",r.times(1e3));case"nano":default:return r}}},{key:"getTime",value:function(){return this._full.toString()}},{key:"valueOf",value:function(){return this._full.dividedBy(Oe).truncated().toNumber()}},{key:"valueOfWithMicro",value:function(){return parseFloat(this.valueOf()+"."+k(this.getMicroseconds()),10)}},{key:"valueOfWithNano",value:function(){return""+this.valueOfWithMicro().toFixed(3)+k(this.getNanoseconds())}},{key:"getMicroseconds",value:function(){return this._full.minus(this.valueOf()*Oe).dividedBy(1e3).truncated().toNumber()}},{key:"getNanoseconds",value:function(){return this._full.minus(this.valueOf()*Oe).minus(1e3*this.getMicroseconds()).truncated().toNumber()}},{key:"_buildSetFunctions",value:function(){var e=U.bind(this,this);this.setUTCNanoseconds=this.setNanoseconds=e("setNanoseconds",["nanosecond"],this.getNanoseconds,"nano"),this.setUTCMicroseconds=this.setMicroseconds=e("setMicoseconds",["microsecond","nanosecond"],this.getMicroseconds,"micro",this.setNanoseconds),this.setUTCMilliseconds=this.setMilliseconds=e("setMilliseconds",["millisecond","microsecond","nanosecond"],this.getMilliseconds,"milli",this.setMicroseconds),this.setUTCSeconds=this.setSeconds=e("setSeconds",["second","millisecond","microsecond","nanosecond"],this.getSeconds,"second",this.setMilliseconds),this.setUTCHours=this.setHours=e("setHours",["hour","second","millisecond","microsecond","nanosecond"],this.getHours,"hour",this.setMilliseconds),this.setUTCDate=this.setDate=e("setDate",["day"],this.getDate,"day"),this.setUTCMonth=this.setMonth=e("setMonth",["month","day"],this.getMonth,"month",this.setDate),this.setUTCFullYear=this.setFullYear=e("setFullYear",["year","month","day"],this.getFullYear,"year",this.setMonth)}},{key:"setTime",value:function(e){return this._full=I(e),this._setupFunctions(),e}},{key:"setUTCTime",value:function(e){return this.setTime(e)}},{key:"_toString",value:function(e){var t=this._date[e]().split(" GMT"),n=this.getMilliseconds(),r=this.getMicroseconds(),i=this.getNanoseconds();return t[0]+="."+k(n)+k(r)+k(i),t.join(" GMT")}},{key:"toString",value:function(){return this._toString("toString")}},{key:"toUTCString",value:function(){return this._toString("toUTCString")}},{key:"toGMTString",value:function(){return this.toUTCString()}}],[{key:"now",value:function(){return(new e).valueOf()}},{key:"parseISO",value:function(t){var n,r=/.*\.(\d+)[+-Z].*/,i=t.match(r),o=new e((n=new we).parse.apply(n,be(args)));if(void 0!=i&&2==i.length){var u=i[1];u=k(u),o.setNanoseconds(u)}return o}},{key:"parse",value:function(){var t;return new e((t=new we).parse.apply(t,arguments))}},{key:"UTC",value:function(){for(var t=arguments.length,n=Array(t),r=0;r<t;r++)n[r]=arguments[r];return new(Function.prototype.bind.apply(e,[null].concat(n)))}}]),e}(),A(pe.prototype,"_getDaysBetween",[le],Object.getOwnPropertyDescriptor(pe.prototype,"_getDaysBetween"),pe.prototype),A(pe.prototype,"_getValue",[ce],Object.getOwnPropertyDescriptor(pe.prototype,"_getValue"),pe.prototype),A(pe.prototype,"toGMTString",[fe],Object.getOwnPropertyDescriptor(pe.prototype,"toGMTString"),pe.prototype),he=pe))||he}();
//# sourceMappingURL=nano-date.js.map
