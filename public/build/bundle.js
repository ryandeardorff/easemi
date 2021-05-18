var app=function(){"use strict";function t(){}function e(t){return t()}function n(){return Object.create(null)}function o(t){t.forEach(e)}function i(t){return"function"==typeof t}function s(t,e){return t!=t?e==e:t!==e||t&&"object"==typeof t||"function"==typeof t}function l(e,...n){if(null==e)return t;const o=e.subscribe(...n);return o.unsubscribe?()=>o.unsubscribe():o}function r(t){let e;return l(t,(t=>e=t))(),e}function c(t,e,n){t.$$.on_destroy.push(l(e,n))}function u(t,e,n,o){return t[1]&&o?function(t,e){for(const n in e)t[n]=e[n];return t}(n.ctx.slice(),t[1](o(e))):n.ctx}function a(t,e,n,o,i,s,l){const r=function(t,e,n,o){if(t[2]&&o){const i=t[2](o(n));if(void 0===e.dirty)return i;if("object"==typeof i){const t=[],n=Math.max(e.dirty.length,i.length);for(let o=0;o<n;o+=1)t[o]=e.dirty[o]|i[o];return t}return e.dirty|i}return e.dirty}(e,o,i,s);if(r){const i=u(e,n,o,l);t.p(i,r)}}function f(t){return null==t?"":t}function d(t,e,n=e){return t.set(n),e}const p="undefined"!=typeof window;let y=p?()=>window.performance.now():()=>Date.now(),x=p?t=>requestAnimationFrame(t):t;const h=new Set;function m(t){h.forEach((e=>{e.c(t)||(h.delete(e),e.f())})),0!==h.size&&x(m)}function $(t,e){t.appendChild(e)}function g(t,e,n){t.insertBefore(e,n||null)}function E(t){t.parentNode.removeChild(t)}function v(t){return document.createElement(t)}function T(t){return document.createElementNS("http://www.w3.org/2000/svg",t)}function w(t){return document.createTextNode(t)}function b(){return w(" ")}function O(t,e,n,o){return t.addEventListener(e,n,o),()=>t.removeEventListener(e,n,o)}function _(t){return function(e){return e.preventDefault(),t.call(this,e)}}function M(t,e,n){null==n?t.removeAttribute(e):t.getAttribute(e)!==n&&t.setAttribute(e,n)}function S(t,e,n,o){t.style.setProperty(e,n,o?"important":"")}let I;function L(t){I=t}function B(){const t=function(){if(!I)throw new Error("Function called outside component initialization");return I}();return(e,n)=>{const o=t.$$.callbacks[e];if(o){const i=function(t,e){const n=document.createEvent("CustomEvent");return n.initCustomEvent(t,!1,!1,e),n}(e,n);o.slice().forEach((e=>{e.call(t,i)}))}}}function D(t,e){const n=t.$$.callbacks[e.type];n&&n.slice().forEach((t=>t(e)))}const k=[],P=[],A=[],C=[],X=Promise.resolve();let R=!1;function V(t){A.push(t)}let G=!1;const N=new Set;function Y(){if(!G){G=!0;do{for(let t=0;t<k.length;t+=1){const e=k[t];L(e),F(e.$$)}for(L(null),k.length=0;P.length;)P.pop()();for(let t=0;t<A.length;t+=1){const e=A[t];N.has(e)||(N.add(e),e())}A.length=0}while(k.length);for(;C.length;)C.pop()();R=!1,G=!1,N.clear()}}function F(t){if(null!==t.fragment){t.update(),o(t.before_update);const e=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,e),t.after_update.forEach(V)}}const j=new Set;let H;function U(){H={r:0,c:[],p:H}}function Z(){H.r||o(H.c),H=H.p}function q(t,e){t&&t.i&&(j.delete(t),t.i(e))}function z(t,e,n,o){if(t&&t.o){if(j.has(t))return;j.add(t),H.c.push((()=>{j.delete(t),o&&(n&&t.d(1),o())})),t.o(e)}}function W(t){t&&t.c()}function J(t,n,s){const{fragment:l,on_mount:r,on_destroy:c,after_update:u}=t.$$;l&&l.m(n,s),V((()=>{const n=r.map(e).filter(i);c?c.push(...n):o(n),t.$$.on_mount=[]})),u.forEach(V)}function K(t,e){const n=t.$$;null!==n.fragment&&(o(n.on_destroy),n.fragment&&n.fragment.d(e),n.on_destroy=n.fragment=null,n.ctx=[])}function Q(t,e){-1===t.$$.dirty[0]&&(k.push(t),R||(R=!0,X.then(Y)),t.$$.dirty.fill(0)),t.$$.dirty[e/31|0]|=1<<e%31}function tt(e,i,s,l,r,c,u=[-1]){const a=I;L(e);const f=e.$$={fragment:null,ctx:null,props:c,update:t,not_equal:r,bound:n(),on_mount:[],on_destroy:[],before_update:[],after_update:[],context:new Map(a?a.$$.context:[]),callbacks:n(),dirty:u,skip_bound:!1};let d=!1;if(f.ctx=s?s(e,i.props||{},((t,n,...o)=>{const i=o.length?o[0]:n;return f.ctx&&r(f.ctx[t],f.ctx[t]=i)&&(!f.skip_bound&&f.bound[t]&&f.bound[t](i),d&&Q(e,t)),n})):[],f.update(),d=!0,o(f.before_update),f.fragment=!!l&&l(f.ctx),i.target){if(i.hydrate){const t=function(t){return Array.from(t.childNodes)}(i.target);f.fragment&&f.fragment.l(t),t.forEach(E)}else f.fragment&&f.fragment.c();i.intro&&q(e.$$.fragment),J(e,i.target,i.anchor),Y()}L(a)}class et{$destroy(){K(this,1),this.$destroy=t}$on(t,e){const n=this.$$.callbacks[t]||(this.$$.callbacks[t]=[]);return n.push(e),()=>{const t=n.indexOf(e);-1!==t&&n.splice(t,1)}}$set(t){var e;this.$$set&&(e=t,0!==Object.keys(e).length)&&(this.$$.skip_bound=!0,this.$$set(t),this.$$.skip_bound=!1)}}const nt=[];function ot(e,n=t){let o;const i=[];function l(t){if(s(e,t)&&(e=t,o)){const t=!nt.length;for(let t=0;t<i.length;t+=1){const n=i[t];n[1](),nt.push(n,e)}if(t){for(let t=0;t<nt.length;t+=2)nt[t][0](nt[t+1]);nt.length=0}}}return{set:l,update:function(t){l(t(e))},subscribe:function(s,r=t){const c=[s,r];return i.push(c),1===i.length&&(o=n(l)||t),s(e),()=>{const t=i.indexOf(c);-1!==t&&i.splice(t,1),0===i.length&&(o(),o=null)}}}}function it(t){return"[object Date]"===Object.prototype.toString.call(t)}function st(t,e,n,o){if("number"==typeof n||it(n)){const i=o-n,s=(n-e)/(t.dt||1/60),l=(s+(t.opts.stiffness*i-t.opts.damping*s)*t.inv_mass)*t.dt;return Math.abs(l)<t.opts.precision&&Math.abs(i)<t.opts.precision?o:(t.settled=!1,it(n)?new Date(n.getTime()+l):n+l)}if(Array.isArray(n))return n.map(((i,s)=>st(t,e[s],n[s],o[s])));if("object"==typeof n){const i={};for(const s in n)i[s]=st(t,e[s],n[s],o[s]);return i}throw new Error(`Cannot spring ${typeof n} values`)}function lt(t,e={}){const n=ot(t),{stiffness:o=.15,damping:i=.8,precision:s=.01}=e;let l,r,c,u=t,a=t,f=1,d=0,p=!1;function $(e,o={}){a=e;const i=c={};if(null==t||o.hard||g.stiffness>=1&&g.damping>=1)return p=!0,l=y(),u=e,n.set(t=a),Promise.resolve();if(o.soft){const t=!0===o.soft?.5:+o.soft;d=1/(60*t),f=0}return r||(l=y(),p=!1,r=function(t){let e;return 0===h.size&&x(m),{promise:new Promise((n=>{h.add(e={c:t,f:n})})),abort(){h.delete(e)}}}((e=>{if(p)return p=!1,r=null,!1;f=Math.min(f+d,1);const o={inv_mass:f,opts:g,settled:!0,dt:60*(e-l)/1e3},i=st(o,u,t,a);return l=e,u=t,n.set(t=i),o.settled&&(r=null),!o.settled}))),new Promise((t=>{r.promise.then((()=>{i===c&&t()}))}))}const g={set:$,update:(e,n)=>$(e(a,t),n),subscribe:n.subscribe,stiffness:o,damping:i,precision:s};return g}function rt(e){let n;return{c(){n=v("div"),n.textContent="this is an image element",M(n,"class","svelte-108a3i5")},m(t,e){g(t,n,e)},p:t,i:t,o:t,d(t){t&&E(n)}}}class ct extends et{constructor(t){super(),tt(this,t,null,rt,s,{})}}const ut=ot({x:0,y:0}),at=ot(1),ft=ot(1),dt=ot({x:0,y:0});class pt{constructor(t,e,n,o){this.id="",this.position={x:0,y:0},this.scale={x:10,y:10},this.component=ct,this.inSelectionRange=!1,this.selected=!1,this.id=t,this.position=e,this.scale=n,this.component=o}}const yt=ot([new pt("asdfsjakldfldsa",{x:0,y:0},{x:100,y:100},ct),new pt("asdfsjakldflddsaf",{x:200,y:200},{x:300,y:300},ct),new pt("asdfsjakldfldsa",{x:300,y:0},{x:100,y:100},ct),new pt("asdfsjakldfldsa",{x:400,y:0},{x:100,y:100},ct),new pt("asdfsjakldfldsa",{x:500,y:0},{x:100,y:100},ct)]);let xt=[];const ht={SELECT:"item.select",SELECT_ADDITIVE:"item.select_additive",MOVE:"item.move"},mt={BOX_SELECT:"canvas.box_select",BOX_SELECT_ADDITIVE:"canvas.box_select_additive",PAN:"canvas.pan",ZOOM_IN:"canvas.zoom_in",ZOOM_OUT:"canvas.zoom_out"},$t={SAVE:"shortcut.save",ALIGN_TOP:"shortcut.align_top"};class gt{constructor(t,e){this.input=[],this.onDown=()=>{},this.onUp=()=>{},this.operation=t,this.input=e}setDown(t){return this.onDown=t,this}setUp(t){return this.onUp=t,this}}let Et=[new gt($t.ALIGN_TOP,["control","arrowup"]),new gt(mt.BOX_SELECT,["leftMouse"]),new gt(mt.BOX_SELECT_ADDITIVE,["shift","leftMouse"]),new gt(mt.PAN,["alt","rightMouse"]),new gt(mt.PAN,["middleMouse"]),new gt(mt.ZOOM_IN,["scrollUp"]),new gt(mt.ZOOM_OUT,["scrollDown"]),new gt(ht.MOVE,["leftMouse"]),new gt(ht.SELECT,["leftMouse"]),new gt(ht.SELECT_ADDITIVE,["shift","leftMouse"])];function vt(t,e,n=null,o=null,i=null){let s=function(){let t={x:0,y:0},e=1;return t=r(ut),e=r(at),{offset:t,scale:e}}();return null!=n&&(s.offset.x=n),null!=o&&(s.offset.y=o),null!=i&&(s.scale=i),{x:(t-s.offset.x)/s.scale,y:(e-s.offset.y)/s.scale}}function Tt(t,e,n=null,o=null,i=null){let s;return s={offset:{x:0,y:0},scale:1},null!=n&&(s.offset.x=n),null!=o&&(s.offset.y=o),null!=i&&(s.scale=i),{x:t*s.scale+s.offset.x,y:e*s.scale+s.offset.y}}class wt{static addEach(t,e){if(null!=t&&null!=e)return{x:t.x+e.x,y:t.y+e.y}}static subtractEach(t,e){if(null!=t&&null!=e)return{x:t.x-e.x,y:t.y-e.y}}static multiplyBoth(t,e){if(null!=t&&null!=e)return{x:t.x*e,y:t.y*e}}static multiplyEach(t,e){if(null!=t&&null!=e)return{x:t.x*e.x,y:t.y*e.y}}static divideEach(t,e){if(null!=t&&null!=e)return{x:t.x/e.x,y:t.y*e.y}}static getLength(t){if(null!=t)return Math.sqrt(Math.pow(t.x,2)+Math.pow(t.y,2))}}function bt(t,e){let n=!1;return t&&e&&(n=!(t.right<e.left||t.left>e.right||t.bottom<e.top||t.top>e.bottom)),n}const Ot=["leftMouse","middleMouse","rightMouse"];function _t(t,e){xt.includes(t)||xt.push(t)}function Mt(t){xt.includes(t)&&xt.splice(xt.indexOf(t),1)}function St(t,e=xt){let n=Et.filter((e=>e.operation==t));for(let o of n){if(e.toString()==o.input.toString())return!0;for(let n of Et.filter((e=>e.operation!=t)))if(e.toString().includes(n.input.toString()))return!1;if(e.toString().includes(o.input.toString()))return!0}}function It(t,e){if(Et.find((t=>t.input.toString()==xt.toString())))try{e.preventDefault()}catch(t){console.warn('Error preventing default for input "',Et.find((t=>t.input.toString()==xt.toString())).operation,'" this may be a bug, or may be fine',"\n",t)}}function Lt(t){let e=Et.filter((t=>t.operation.startsWith("shortcut")));for(let n=0;n<e.length;n++)e[n].input.toString()==xt.toString()&&(e[n].onUp(),It(0,t))}function Bt(t){let e=t;return e=e.toLowerCase(),e}function Dt(){for(let t of r(yt).filter((t=>t.selected)))t.selected=!1;yt.update((t=>t))}function kt(e){let n,i,s,l,r,c,u,a,f,d,p,y;return{c(){n=T("svg"),i=T("defs"),s=T("filter"),l=T("feGaussianBlur"),r=T("feBlend"),c=T("rect"),M(l,"result","blurOut"),M(l,"stdDeviation","10"),M(r,"in","SourceGraphic"),M(r,"in2","blurOut"),M(r,"mode","normal"),M(s,"id","selection-glow"),M(s,"x","-10"),M(s,"y","-10"),M(s,"width","200"),M(s,"height","200"),M(c,"id","selection-box"),M(c,"x","3"),M(c,"y","3"),M(c,"width",u=Math.max(3,e[1].x-6)),M(c,"height",a=Math.max(3,e[1].y-6)),M(c,"rx","5"),M(c,"filter","url(#selection-glow)"),M(c,"class","svelte-vbnion"),M(n,"id","selection"),M(n,"width",f=Math.max(6,e[1].x)),M(n,"height",d=Math.max(6,e[1].y)),S(n,"transform","translate("+e[2].x+"px, "+e[2].y+"px)"),S(n,"visibility",e[0]),M(n,"class","svelte-vbnion")},m(t,o){g(t,n,o),$(n,i),$(i,s),$(s,l),$(s,r),$(n,c),p||(y=[O(window,"mousemove",e[3]),O(window,"mouseup",e[4])],p=!0)},p(t,[e]){2&e&&u!==(u=Math.max(3,t[1].x-6))&&M(c,"width",u),2&e&&a!==(a=Math.max(3,t[1].y-6))&&M(c,"height",a),2&e&&f!==(f=Math.max(6,t[1].x))&&M(n,"width",f),2&e&&d!==(d=Math.max(6,t[1].y))&&M(n,"height",d),4&e&&S(n,"transform","translate("+t[2].x+"px, "+t[2].y+"px)"),1&e&&S(n,"visibility",t[0])},i:t,o:t,d(t){t&&E(n),p=!1,o(y)}}}function Pt(t,e,n){let o,i,s,l;c(t,yt,(t=>n(12,i=t))),c(t,dt,(t=>n(8,s=t))),c(t,ft,(t=>n(9,l=t)));let{visibility:r="hidden"}=e,u={x:0,y:0},a={x:0,y:0},f={x:0,y:0},d=!1;function p(t,e,o){let s=vt(t,e),l=function(t,e){let n={x:0,y:0},o={x:0,y:0};return t.x>e.x?(n.x=e.x,o.x=t.x-e.x):(n.x=t.x,o.x=e.x-t.x),t.y>e.y?(n.y=e.y,o.y=t.y-e.y):(n.y=t.y,o.y=e.y-t.y),{x:n.x,y:n.y,width:o.x,height:o.y}}(u,s);n(6,a={x:l.width,y:l.height}),n(7,f={x:l.x,y:l.y}),n(0,r="visible"),function(t){for(let t of i)bt(new DOMRect(f.x,f.y,a.x,a.y),new DOMRect(t.position.x,t.position.y,t.scale.x,t.scale.y))?t.inSelectionRange=!0:t.inSelectionRange=!1;yt.update((t=>t))}()}function y(){for(let t of i)t.inSelectionRange&&(t.selected=!0,t.inSelectionRange=!1);yt.update((t=>t)),d=!1,n(0,r="hidden")}let x={x:0,y:0};return t.$$set=t=>{"visibility"in t&&n(0,r=t.visibility)},t.$$.update=()=>{896&t.$$.dirty&&n(2,o=Tt(f.x,f.y,s.x,s.y,l)),576&t.$$.dirty&&n(1,x=wt.multiplyBoth(a,l))},[r,x,o,function(t){!function(t){d&&(St(mt.BOX_SELECT)||St(mt.BOX_SELECT_ADDITIVE)?p(t.clientX,t.clientY):y())}(t)},function(t){d&&xt.toString()!=Et.find((t=>t.operation==mt.BOX_SELECT||mt.BOX_SELECT_ADDITIVE)).input.toString()&&y()},(t,e,o)=>function(t,e,o){d=!0,u=vt(t,e),n(6,a={x:0,y:0}),n(7,f={x:0,y:0}),n(0,r="hidden"),o||Dt()}(t,e,o),a,f,s,l]}class At extends et{constructor(t){super(),tt(this,t,Pt,kt,s,{visibility:0,backgroundStartBoxSelection:5})}get backgroundStartBoxSelection(){return this.$$.ctx[5]}}function Ct(e){let n,i,s,l,r,c,u,a,f,d,p,y,x,h,m,w,b,_,I,L,B,D,k,P,A,C,X;return{c(){n=v("div"),i=T("svg"),s=T("line"),a=T("rect"),h=T("circle"),b=T("circle"),L=T("circle"),k=T("circle"),M(s,"x1",l=e[1].x),M(s,"y1",r=e[1].y-1),M(s,"x2",c=e[1].x+e[2].x),M(s,"y2",u=e[1].y-1),M(a,"x",f=e[1].x),M(a,"y",d=e[1].y),M(a,"width",p=e[2].x+"px"),M(a,"height",y=e[2].y+"px"),M(a,"rx",x=40*e[0]),M(a,"class","svelte-1k24ufo"),M(h,"cx",m=e[1].x),M(h,"cy",w=e[1].y),M(h,"r",8),M(h,"class","svelte-1k24ufo"),M(b,"cx",_=e[1].x+e[2].x),M(b,"cy",I=e[1].y),M(b,"r",8),M(b,"class","svelte-1k24ufo"),M(L,"cx",B=e[1].x+e[2].x),M(L,"cy",D=e[1].y+e[2].y),M(L,"r",8),M(L,"class","svelte-1k24ufo"),M(k,"cx",P=e[1].x),M(k,"cy",A=e[1].y+e[2].y),M(k,"r",8),M(k,"class","svelte-1k24ufo"),M(i,"class","svelte-1k24ufo"),M(n,"id","selection"),S(n,"--visibility",e[3]),M(n,"class","svelte-1k24ufo")},m(t,o){g(t,n,o),$(n,i),$(i,s),$(i,a),$(i,h),$(i,b),$(i,L),$(i,k),C||(X=[O(window,"mousemove",e[5]),O(window,"mouseup",e[6]),O(h,"mousedown",e[14]),O(b,"mousedown",e[15]),O(L,"mousedown",e[16]),O(k,"mousedown",e[17])],C=!0)},p(t,[e]){2&e&&l!==(l=t[1].x)&&M(s,"x1",l),2&e&&r!==(r=t[1].y-1)&&M(s,"y1",r),6&e&&c!==(c=t[1].x+t[2].x)&&M(s,"x2",c),2&e&&u!==(u=t[1].y-1)&&M(s,"y2",u),2&e&&f!==(f=t[1].x)&&M(a,"x",f),2&e&&d!==(d=t[1].y)&&M(a,"y",d),4&e&&p!==(p=t[2].x+"px")&&M(a,"width",p),4&e&&y!==(y=t[2].y+"px")&&M(a,"height",y),1&e&&x!==(x=40*t[0])&&M(a,"rx",x),2&e&&m!==(m=t[1].x)&&M(h,"cx",m),2&e&&w!==(w=t[1].y)&&M(h,"cy",w),6&e&&_!==(_=t[1].x+t[2].x)&&M(b,"cx",_),2&e&&I!==(I=t[1].y)&&M(b,"cy",I),6&e&&B!==(B=t[1].x+t[2].x)&&M(L,"cx",B),6&e&&D!==(D=t[1].y+t[2].y)&&M(L,"cy",D),2&e&&P!==(P=t[1].x)&&M(k,"cx",P),6&e&&A!==(A=t[1].y+t[2].y)&&M(k,"cy",A),8&e&&S(n,"--visibility",t[3])},i:t,o:t,d(t){t&&E(n),C=!1,o(X)}}}function Xt(t,e,n){let o,i,s,l,r;c(t,yt,(t=>n(11,s=t))),c(t,dt,(t=>n(13,l=t))),c(t,ft,(t=>n(0,r=t)));let u={x:0,y:0},a={x:100,y:50},f={x:0,y:0},d=!0,p="hidden",y={left:0,right:0,top:0,bottom:0};const x={TOP_LEFT:{x:1,y:1},TOP_RIGHT:{x:0,y:1},BOTTOM_LEFT:{x:1,y:0},BOTTOM_RIGHT:{x:0,y:0}},h={TOP_LEFT:{x:-1,y:-1},TOP_RIGHT:{x:1,y:-1},BOTTOM_LEFT:{x:-1,y:1},BOTTOM_RIGHT:{x:1,y:1}},m={TOP_LEFT:{positionMultiplier:x.TOP_LEFT,scaleMultiplier:h.TOP_LEFT},TOP_RIGHT:{positionMultiplier:x.TOP_RIGHT,scaleMultiplier:h.TOP_RIGHT},BOTTOM_LEFT:{positionMultiplier:x.BOTTOM_LEFT,scaleMultiplier:h.BOTTOM_LEFT},BOTTOM_RIGHT:{positionMultiplier:x.BOTTOM_RIGHT,scaleMultiplier:h.BOTTOM_RIGHT}};let $=!1,g=null;function E(t,e=m.TOP_LEFT){_t(Ot[t.button]),St(ht.MOVE)&&($=!0,g=e,f=a)}return t.$$.update=()=>{if(2048&t.$$.dirty&&n(10,o=s),1024&t.$$.dirty&&n(12,i=o.filter((t=>t.selected))),4096&t.$$.dirty&&(i.length>0?n(8,d=!0):n(8,d=!1)),256&t.$$.dirty&&n(3,p=d?"visible":"hidden"),4352&t.$$.dirty&&d){let t=i.sort(((t,e)=>t.position.x-e.position.x))[0].position.x,e=i.sort(((t,e)=>-t.position.x-t.scale.x+(e.position.x+e.scale.x))),o=e[0].position.x+e[0].scale.x,s=i.sort(((t,e)=>t.position.y-e.position.y))[0].position.y,l=i.sort(((t,e)=>-t.position.y-t.scale.y+e.position.y+e.scale.y)),r=l[0].position.y+l[0].scale.y;n(9,y={left:t,right:o,top:s,bottom:r})}if(8961&t.$$.dirty&&d&&n(1,u=Tt(y.left,y.top,l.x,l.y,r)),769&t.$$.dirty&&d){let t=Tt(y.right,y.bottom),e=Tt(y.left,y.top),o={x:t.x-e.x,y:t.y-e.y};n(2,a=wt.multiplyBoth(o,r))}},[r,u,a,p,m,function(t){if(St(ht.MOVE)&&$&&null!=g){let e=wt.multiplyBoth({x:t.movementX,y:t.movementY},1/r),n=wt.multiplyEach(e,g.positionMultiplier),o=wt.multiplyEach(e,g.scaleMultiplier);for(let t of i){wt.divideEach(t.position,f);let e=wt.divideEach(t.scale,f);console.log(e);let i=n,s=wt.multiplyEach(o,e);t.position=wt.addEach(t.position,i),t.scale=wt.addEach(t.scale,s)}yt.update((t=>t))}},function(t){St(ht.MOVE)||($=!1,g=null)},E,d,y,o,s,i,l,t=>E(t,m.TOP_LEFT),t=>E(t,m.TOP_RIGHT),t=>E(t,m.BOTTOM_RIGHT),t=>E(t,m.BOTTOM_LEFT)]}class Rt extends et{constructor(t){super(),tt(this,t,Xt,Ct,s,{})}}const Vt=t=>({itemId:1&t,position:4&t,scale:8&t}),Gt=t=>({class:"slot",itemId:t[0],position:t[2],scale:t[3]});function Nt(t){let e,n,i,s,l;const r=t[15].default,c=function(t,e,n,o){if(t){const i=u(t,e,n,o);return t[0](i)}}(r,t,t[14],Gt),d=c||function(t){let e;return{c(){e=w("This item has no type")},m(t,n){g(t,e,n)},d(t){t&&E(e)}}}();return{c(){e=v("div"),d&&d.c(),M(e,"id","root"),S(e,"--positionX",t[2].x+"px"),S(e,"--positionY",t[2].y+"px"),S(e,"--scaleX",t[3].x+"px"),S(e,"--scaleY",t[3].y+"px"),S(e,"--canvasZoom",t[4]),M(e,"class",n=f(t[1])+" svelte-x87490")},m(n,o){g(n,e,o),d&&d.m(e,null),i=!0,s||(l=[O(window,"mousemove",t[6]),O(window,"mouseup",t[7]),O(e,"mousedown",t[5])],s=!0)},p(t,[o]){c&&c.p&&16397&o&&a(c,r,t,t[14],o,Vt,Gt),(!i||4&o)&&S(e,"--positionX",t[2].x+"px"),(!i||4&o)&&S(e,"--positionY",t[2].y+"px"),(!i||8&o)&&S(e,"--scaleX",t[3].x+"px"),(!i||8&o)&&S(e,"--scaleY",t[3].y+"px"),(!i||16&o)&&S(e,"--canvasZoom",t[4]),(!i||2&o&&n!==(n=f(t[1])+" svelte-x87490"))&&M(e,"class",n)},i(t){i||(q(d,t),i=!0)},o(t){z(d,t),i=!1},d(t){t&&E(e),d&&d.d(t),s=!1,o(l)}}}function Yt(t,e,n){let o,i,s,l,r;c(t,ft,(t=>n(9,l=t))),c(t,yt,(t=>n(11,r=t)));let{$$slots:u={},$$scope:a}=e;B();let{itemId:f=""}=e,{itemIndex:d=0}=e,p="",y={x:0,y:0},x={x:1,y:1},h=1,m=!1,$=!1,g=!1,E=!1,v={x:0,y:0};function T(t=!1){console.log(t),console.log("selected ",o.selected),(m||$)&&(t?n(10,o.selected=!o.selected,o):(Dt(),n(10,o.selected=!0,o)),yt.update((t=>t))),m=!1,$=!1}return t.$$set=t=>{"itemId"in t&&n(0,f=t.itemId),"itemIndex"in t&&n(8,d=t.itemIndex),"$$scope"in t&&n(14,a=t.$$scope)},t.$$.update=()=>{512&t.$$.dirty&&n(4,h=l),2304&t.$$.dirty&&n(10,o=r[d]),1024&t.$$.dirty&&n(2,y=o.position),1024&t.$$.dirty&&n(3,x=o.scale),1024&t.$$.dirty&&n(12,i=o.selected),1024&t.$$.dirty&&n(13,s=o.inSelectionRange),12288&t.$$.dirty&&n(1,p=i?"root selected":s?"root test":"root selectable")},[f,p,y,x,h,function(t){_t(Ot[t.button]),St(ht.SELECT)&&(m=!0),St(ht.SELECT_ADDITIVE)&&($=!0),St(ht.MOVE)&&(g=!0,v={x:t.clientX,y:t.clientY})},function(t){if(!E){let e=wt.subtractEach({x:t.clientX,y:t.clientY},v);wt.getLength(e)>20&&(E=!0)}St(ht.MOVE)&&g&&E&&(i||(Dt(),n(10,o.selected=!0,o)),function(t,e){for(let n of r.filter((t=>1==t.selected))){let o=wt.multiplyBoth({x:t,y:e},1/l);n.position=wt.addEach(n.position,o)}yt.update((t=>t))}(t.movementX/devicePixelRatio,t.movementY/devicePixelRatio),m=!1,$=!1)},function(t){St(ht.MOVE)||(g=!1,E=!1),!St(ht.SELECT)&&m&&T(!1),!St(ht.SELECT_ADDITIVE)&&$&&T(!0)},d,l,o,r,i,s,a,u]}class Ft extends et{constructor(t){super(),tt(this,t,Yt,Nt,s,{itemId:0,itemIndex:8})}}function jt(t,e,n){const o=t.slice();return o[34]=e[n],o[36]=n,o}function Ht(t){let e,n,o;var i=t[34].component;return i&&(e=new i({})),{c(){e&&W(e.$$.fragment),n=b()},m(t,i){e&&J(e,t,i),g(t,n,i),o=!0},p(t,o){if(i!==(i=t[34].component)){if(e){U();const t=e;z(t.$$.fragment,1,0,(()=>{K(t,1)})),Z()}i?(e=new i({}),W(e.$$.fragment),q(e.$$.fragment,1),J(e,n.parentNode,n)):e=null}},i(t){o||(e&&q(e.$$.fragment,t),o=!0)},o(t){e&&z(e.$$.fragment,t),o=!1},d(t){e&&K(e,t),t&&E(n)}}}function Ut(t){let e,n;return e=new Ft({props:{itemId:t[34].id,itemIndex:t[36],$$slots:{default:[Ht]},$$scope:{ctx:t}}}),e.$on("clearselection",Dt),{c(){W(e.$$.fragment)},m(t,o){J(e,t,o),n=!0},p(t,n){const o={};8&n[0]&&(o.itemId=t[34].id),8&n[0]|64&n[1]&&(o.$$scope={dirty:n,ctx:t}),e.$set(o)},i(t){n||(q(e.$$.fragment,t),n=!0)},o(t){z(e.$$.fragment,t),n=!1},d(t){K(e,t)}}}function Zt(t){let e,n,i,s,l,r,c,u,a,f,d;s=new At({props:{}}),t[13](s),r=new Rt({});let p=t[3],y=[];for(let e=0;e<p.length;e+=1)y[e]=Ut(jt(t,p,e));const x=t=>z(y[t],1,1,(()=>{y[t]=null}));return{c(){e=v("div"),n=v("div"),i=b(),W(s.$$.fragment),l=b(),W(r.$$.fragment),c=b(),u=v("div");for(let t=0;t<y.length;t+=1)y[t].c();M(n,"id","background"),M(n,"class","svelte-19f4qs0"),M(u,"id","contents"),S(u,"transform","translate("+t[0].x+"px,"+t[0].y+"px)scale("+t[1]+","+t[1]+")"),M(u,"class","svelte-19f4qs0"),M(e,"id","canvas"),M(e,"class","svelte-19f4qs0")},m(o,p){g(o,e,p),$(e,n),$(e,i),J(s,e,null),$(e,l),J(r,e,null),$(e,c),$(e,u);for(let t=0;t<y.length;t+=1)y[t].m(u,null);a=!0,f||(d=[O(n,"mousedown",t[4]),O(e,"mousedown",t[5]),O(e,"wheel",t[6])],f=!0)},p(t,e){if(s.$set({}),8&e[0]){let n;for(p=t[3],n=0;n<p.length;n+=1){const o=jt(t,p,n);y[n]?(y[n].p(o,e),q(y[n],1)):(y[n]=Ut(o),y[n].c(),q(y[n],1),y[n].m(u,null))}for(U(),n=p.length;n<y.length;n+=1)x(n);Z()}(!a||3&e[0])&&S(u,"transform","translate("+t[0].x+"px,"+t[0].y+"px)scale("+t[1]+","+t[1]+")")},i(t){if(!a){q(s.$$.fragment,t),q(r.$$.fragment,t);for(let t=0;t<p.length;t+=1)q(y[t]);a=!0}},o(t){z(s.$$.fragment,t),z(r.$$.fragment,t),y=y.filter(Boolean);for(let t=0;t<y.length;t+=1)z(y[t]);a=!1},d(n){n&&E(e),t[13](null),K(s),K(r),function(t,e){for(let n=0;n<t.length;n+=1)t[n]&&t[n].d(e)}(y,n),f=!1,o(d)}}}function qt(){}function zt(t,e,n){let o,i,s,l,r,u,a,f,p;function y(t){St(mt.PAN)&&(t.clientX,t.clientY,v=!0,console.log("panstart"))}function x(){v&&St(mt.PAN)&&(v=!1)}c(t,ut,(t=>n(15,i=t))),c(t,at,(t=>n(16,s=t))),c(t,ft,(t=>n(17,u=t))),c(t,dt,(t=>n(18,a=t))),c(t,yt,(t=>n(3,f=t))),document.addEventListener("keydown",(function(t){let e=Bt(t.key);if(t.repeat)return;_t(e),function(t){let e=Et.filter((t=>t.operation.startsWith("shortcut")));for(let n=0;n<e.length;n++)if(e[n].input.toString()==xt.toString()){try{e[n].onDown()}catch(t){console.error(xt)}It(0,t)}}(t),y(t)})),document.addEventListener("keyup",(function(t){t.preventDefault();let e=Bt(t.key);Lt(t),Mt(e),x()})),window.addEventListener("focus",qt),window.addEventListener("blur",(function(){Lt(null),xt.splice(0,xt.length)})),document.addEventListener("mousedown",(function(t){_t(Ot[t.button])})),document.addEventListener("mouseup",(function(t){Mt(Ot[t.button]),x()})),document.addEventListener("mousemove",(function(t){!function(t){v&&St(mt.PAN)&&(e=t.movementX,o=t.movementY,n(9,h.x=h.x+e/devicePixelRatio,h),n(9,h.y=h.y+o/devicePixelRatio,h),m.update((t=>h)));var e,o}(t)}));let h={x:0,y:0};const m=lt({x:0,y:0},{stiffness:1,damping:1,precision:1e-4});c(t,m,(t=>n(11,l=t)));let $={x:0,y:0,s:1};const g=lt({x:0,y:0,s:1},{stiffness:.2,damping:1,precision:1e-4});c(t,g,(t=>n(12,r=t)));let E={x:0,y:0},v=!1;function T(t){n(10,$.s=$.s+t*$.s*.1,$),g.update((t=>$))}return t.$$.update=()=>{1536&t.$$.dirty[0]&&d(ut,i=wt.addEach(h,{x:$.x,y:$.y}),i),1024&t.$$.dirty[0]&&d(at,s=$.s,s),6144&t.$$.dirty[0]&&n(0,E={x:l.x+r.x,y:l.y+r.y}),4096&t.$$.dirty[0]&&n(1,o=r.s),2&t.$$.dirty[0]&&d(ft,u=o,u),1&t.$$.dirty[0]&&d(dt,a=E,a)},[E,o,p,f,function(t){_t(Ot[t.button]),St(mt.BOX_SELECT)&&p.backgroundStartBoxSelection(t.clientX,t.clientY,!1),St(mt.BOX_SELECT_ADDITIVE)&&p.backgroundStartBoxSelection(t.clientX,t.clientY,!0)},function(t){_t(Ot[t.button]),y(t)},function(t){switch(-1*(e=t.deltaY,o=-1,i=1,Math.min(Math.max(e,o),i))){case-1:_t("scrollDown");break;case 1:_t("scrollUp")}var e,o,i;const s=vt(t.clientX,t.clientY);!function(){St(mt.ZOOM_IN)&&T(2);St(mt.ZOOM_OUT)&&T(-2)}(),Mt("scrollDown"),Mt("scrollUp");const l=vt(t.clientX,t.clientY,null,null,$.s);let r=wt.multiplyBoth(wt.subtractEach(l,s),$.s);var c,u;c=r.x,u=r.y,n(10,$.x=$.x+c,$),n(10,$.y=$.y+u,$),g.update((t=>$))},m,g,h,$,l,r,function(t){P[t?"unshift":"push"]((()=>{p=t,n(2,p)}))}]}class Wt extends et{constructor(t){super(),tt(this,t,zt,Zt,s,{},[-1,-1])}}function Jt(e){let n,i,s,l,r;return i=new Wt({}),{c(){n=v("main"),W(i.$$.fragment)},m(t,o){g(t,n,o),J(i,n,null),s=!0,l||(r=[O(n,"contextmenu",_(e[0])),O(n,"drag",_(e[1])),O(n,"dragstart",_(e[2])),O(n,"dragenter",_(e[3]))],l=!0)},p:t,i(t){s||(q(i.$$.fragment,t),s=!0)},o(t){z(i.$$.fragment,t),s=!1},d(t){t&&E(n),K(i),l=!1,o(r)}}}function Kt(t){return[function(e){D(t,e)},function(e){D(t,e)},function(e){D(t,e)},function(e){D(t,e)}]}return new class extends et{constructor(t){super(),tt(this,t,Kt,Jt,s,{})}}({target:document.body})}();
//# sourceMappingURL=bundle.js.map
