(window.webpackJsonp=window.webpackJsonp||[]).push([[16],{63:function(e,t,n){"use strict";n.r(t),n.d(t,"frontMatter",(function(){return i})),n.d(t,"rightToc",(function(){return c})),n.d(t,"default",(function(){return b}));n(0);var r=n(99);function a(){return(a=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e}).apply(this,arguments)}function o(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},o=Object.keys(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var i={id:"dateTimePickerRange",title:"DateTimePickerRange"},c=[{value:"Notes",id:"notes",children:[]},{value:"Props",id:"props",children:[]},{value:"How to use",id:"how-to-use",children:[]},{value:"Storybook",id:"storybook",children:[]}],l={rightToc:c},p="wrapper";function b(e){var t=e.components,n=o(e,["components"]);return Object(r.b)(p,a({},l,n,{components:t,mdxType:"MDXLayout"}),Object(r.b)("h2",{id:"notes"},"Notes"),Object(r.b)("p",null,"Based on ",Object(r.b)("inlineCode",{parentName:"p"},"TextField")," and two ",Object(r.b)("inlineCode",{parentName:"p"},"DateTimePicker"),"'s'."),Object(r.b)("p",null,"All properties passing to ",Object(r.b)("inlineCode",{parentName:"p"},"TextField"),"."),Object(r.b)("h2",{id:"props"},"Props"),Object(r.b)("table",null,Object(r.b)("thead",{parentName:"table"},Object(r.b)("tr",{parentName:"thead"},Object(r.b)("th",a({parentName:"tr"},{align:null}),"Name"),Object(r.b)("th",a({parentName:"tr"},{align:"center"}),"Type"),Object(r.b)("th",a({parentName:"tr"},{align:null}),"Default"),Object(r.b)("th",a({parentName:"tr"},{align:null}),"Description"))),Object(r.b)("tbody",{parentName:"table"},Object(r.b)("tr",{parentName:"tbody"},Object(r.b)("td",a({parentName:"tr"},{align:null}),"PickersFromProps"),Object(r.b)("td",a({parentName:"tr"},{align:"center"}),"object"),Object(r.b)("td",a({parentName:"tr"},{align:null})),Object(r.b)("td",a({parentName:"tr"},{align:null}),"Properties for first DateTimePicker")),Object(r.b)("tr",{parentName:"tbody"},Object(r.b)("td",a({parentName:"tr"},{align:null}),"PickersToProps"),Object(r.b)("td",a({parentName:"tr"},{align:"center"}),"object"),Object(r.b)("td",a({parentName:"tr"},{align:null})),Object(r.b)("td",a({parentName:"tr"},{align:null}),"Properties for second DateTimePicker")))),Object(r.b)("h2",{id:"how-to-use"},"How to use"),Object(r.b)("pre",null,Object(r.b)("code",a({parentName:"pre"},{className:"language-javascript"}),"import { DateTimePickerRange } from '@mic3/platform-ui';\n\n<DateTimePicker\n    label={'Date Time Picker Range'}\n    value={[\n        moment().format('LLL').toDate(), // start date\n        moment().add(2, 'hours').format('LLL').toDate() // end date\n    ]}\n    onChange={onChange}\n    clearable\n/>\n")),Object(r.b)("h2",{id:"storybook"},"Storybook"),Object(r.b)("p",null,"<",Object(r.b)("a",a({parentName:"p"},{href:"/redirect?/storybook/index.html?path=/story/components-datetimepickers--datetimepickerrange"}),"DateTimePickerRange"),">"))}b.isMDXComponent=!0},99:function(e,t,n){"use strict";n.d(t,"a",(function(){return c})),n.d(t,"b",(function(){return u}));var r=n(0),a=n.n(r),o=a.a.createContext({}),i=function(e){var t=a.a.useContext(o),n=t;return e&&(n="function"==typeof e?e(t):Object.assign({},t,e)),n},c=function(e){var t=i(e.components);return a.a.createElement(o.Provider,{value:t},e.children)};var l="mdxType",p={inlineCode:"code",wrapper:function(e){var t=e.children;return a.a.createElement(a.a.Fragment,{},t)}},b=Object(r.forwardRef)((function(e,t){var n=e.components,r=e.mdxType,o=e.originalType,c=e.parentName,l=function(e,t){var n={};for(var r in e)Object.prototype.hasOwnProperty.call(e,r)&&-1===t.indexOf(r)&&(n[r]=e[r]);return n}(e,["components","mdxType","originalType","parentName"]),b=i(n),u=r,m=b[c+"."+u]||b[u]||p[u]||o;return n?a.a.createElement(m,Object.assign({},{ref:t},l,{components:n})):a.a.createElement(m,Object.assign({},{ref:t},l))}));function u(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var o=n.length,i=new Array(o);i[0]=b;var c={};for(var p in t)hasOwnProperty.call(t,p)&&(c[p]=t[p]);c.originalType=e,c[l]="string"==typeof e?e:r,i[1]=c;for(var u=2;u<o;u++)i[u]=n[u];return a.a.createElement.apply(null,i)}return a.a.createElement.apply(null,n)}b.displayName="MDXCreateElement"}}]);