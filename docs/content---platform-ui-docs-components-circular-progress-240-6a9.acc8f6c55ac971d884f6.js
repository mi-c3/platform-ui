(window.webpackJsonp=window.webpackJsonp||[]).push([[11],{55:function(e,t,r){"use strict";r.r(t),r.d(t,"frontMatter",(function(){return i})),r.d(t,"rightToc",(function(){return c})),r.d(t,"default",(function(){return u}));r(0);var n=r(99);function a(){return(a=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var r=arguments[t];for(var n in r)Object.prototype.hasOwnProperty.call(r,n)&&(e[n]=r[n])}return e}).apply(this,arguments)}function o(e,t){if(null==e)return{};var r,n,a=function(e,t){if(null==e)return{};var r,n,a={},o=Object.keys(e);for(n=0;n<o.length;n++)r=o[n],t.indexOf(r)>=0||(a[r]=e[r]);return a}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(n=0;n<o.length;n++)r=o[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(a[r]=e[r])}return a}var i={id:"circularProgress",title:"CircularProgress"},c=[{value:"Notes",id:"notes",children:[]},{value:"Props",id:"props",children:[]},{value:"How to use",id:"how-to-use",children:[]}],l={rightToc:c},p="wrapper";function u(e){var t=e.components,r=o(e,["components"]);return Object(n.b)(p,a({},l,r,{components:t,mdxType:"MDXLayout"}),Object(n.b)("h2",{id:"notes"},"Notes"),Object(n.b)("p",null,"Component ",Object(n.b)("inlineCode",{parentName:"p"},"CircularProgress")," based on Material UI ",Object(n.b)("inlineCode",{parentName:"p"},"CircularProgress"),". All properties you can see in ",Object(n.b)("a",a({parentName:"p"},{href:"https://v3.material-ui.com/api/circular-progress/"}),"official documentation")),Object(n.b)("h2",{id:"props"},"Props"),Object(n.b)("table",null,Object(n.b)("thead",{parentName:"table"},Object(n.b)("tr",{parentName:"thead"},Object(n.b)("th",a({parentName:"tr"},{align:null}),"Name"),Object(n.b)("th",a({parentName:"tr"},{align:"center"}),"Type"),Object(n.b)("th",a({parentName:"tr"},{align:null}),"Default"),Object(n.b)("th",a({parentName:"tr"},{align:null}),"Description"))),Object(n.b)("tbody",{parentName:"table"},Object(n.b)("tr",{parentName:"tbody"},Object(n.b)("td",a({parentName:"tr"},{align:null}),"fillColor"),Object(n.b)("td",a({parentName:"tr"},{align:"center"}),"string"),Object(n.b)("td",a({parentName:"tr"},{align:null}),"'primary'"),Object(n.b)("td",a({parentName:"tr"},{align:null}),"for color customization can be 'primary' or any Hex Code RGB")))),Object(n.b)("h2",{id:"how-to-use"},"How to use"),Object(n.b)("pre",null,Object(n.b)("code",a({parentName:"pre"},{className:"language-javascript"}),"import { CircularProgress } from '@mic3/platform-ui';\n\n<CircularProgress fillColor=\"#FFFFFF\" />\n")))}u.isMDXComponent=!0},99:function(e,t,r){"use strict";r.d(t,"a",(function(){return c})),r.d(t,"b",(function(){return s}));var n=r(0),a=r.n(n),o=a.a.createContext({}),i=function(e){var t=a.a.useContext(o),r=t;return e&&(r="function"==typeof e?e(t):Object.assign({},t,e)),r},c=function(e){var t=i(e.components);return a.a.createElement(o.Provider,{value:t},e.children)};var l="mdxType",p={inlineCode:"code",wrapper:function(e){var t=e.children;return a.a.createElement(a.a.Fragment,{},t)}},u=Object(n.forwardRef)((function(e,t){var r=e.components,n=e.mdxType,o=e.originalType,c=e.parentName,l=function(e,t){var r={};for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&-1===t.indexOf(n)&&(r[n]=e[n]);return r}(e,["components","mdxType","originalType","parentName"]),u=i(r),s=n,b=u[c+"."+s]||u[s]||p[s]||o;return r?a.a.createElement(b,Object.assign({},{ref:t},l,{components:r})):a.a.createElement(b,Object.assign({},{ref:t},l))}));function s(e,t){var r=arguments,n=t&&t.mdxType;if("string"==typeof e||n){var o=r.length,i=new Array(o);i[0]=u;var c={};for(var p in t)hasOwnProperty.call(t,p)&&(c[p]=t[p]);c.originalType=e,c[l]="string"==typeof e?e:n,i[1]=c;for(var s=2;s<o;s++)i[s]=r[s];return a.a.createElement.apply(null,i)}return a.a.createElement.apply(null,r)}u.displayName="MDXCreateElement"}}]);