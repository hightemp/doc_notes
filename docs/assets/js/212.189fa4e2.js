(window.webpackJsonp=window.webpackJsonp||[]).push([[212],{482:function(e,t,n){"use strict";n.r(t);var i=n(14),a=Object(i.a)({},(function(){var e=this,t=e._self._c;return t("ContentSlotsDistributor",{attrs:{"slot-key":e.$parent.slotKey}},[t("p",[e._v("https://medium.com/@valerka/how-to-register-the-plugin-correctly-in-nuxt-js-91ed2d95b81f")]),e._v(" "),t("h1",{attrs:{id:"how-to-correctly-register-the-plugin-in-nuxt-js"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#how-to-correctly-register-the-plugin-in-nuxt-js"}},[e._v("#")]),e._v(" How to correctly register the plugin in nuxt.js")]),e._v(" "),t("p",[e._v("In my opinion, the official documentation of nuxt.js does not exactly reveal how to properly implement plugins into your application, so I want to tell you more about it.")]),e._v(" "),t("p",[e._v("First, I’ll show what "),t("strong",[e._v("NOT")]),e._v(" the right implementations I’ve met on my development way.")]),e._v(" "),t("p",[t("strong",[e._v("Attention, this is NOT the correct implementation!")])]),e._v(" "),t("div",{staticClass:"language- extra-class"},[t("pre",{pre:!0,attrs:{class:"language-text"}},[t("code",[e._v("\nVue.use({  \n install(Vue) {  \n  // here the plugin is initialized  \n  // then added to the prototype Vue under $plugin allias  \n  Vue.prototype.$plugin = $plugin  \n }  \n})// Then, a function is imported that returns the plugin itself  \n// this is required for the asynchronous require of the plugin.  \nexport default () => $plugin\n")])])]),t("p",[e._v("And even met such an invention.")]),e._v(" "),t("p",[t("strong",[e._v("Attention, this is also NOT the right implementation!")])]),e._v(" "),t("div",{staticClass:"language- extra-class"},[t("pre",{pre:!0,attrs:{class:"language-text"}},[t("code",[e._v("export default {  \n install (Vue) {  \n   // Here the global Vue is polluted  \n   // in the plugins we have access to the plugin  \n   // under the allias plugin  \n   // in components after initializing Vue, under $plugin  \n  Vue.prototype.$plugin = Vue.plugin = plugin  \n }  \n}\n")])])]),t("p",[e._v("Ok, let’s find the right solution, "),t("a",{attrs:{href:"https://nuxtjs.org/guide/plugins/#inject-in-root-amp-context",target:"_blank",rel:"noopener noreferrer"}},[e._v("here"),t("OutboundLink")],1),e._v(" is an example from the official documentation, but as you can see not the most extensive explanation.")]),e._v(" "),t("div",{staticClass:"language- extra-class"},[t("pre",{pre:!0,attrs:{class:"language-text"}},[t("code",[e._v("import Vue from 'vue'  \nimport VueI18n from 'vue-i18n'\nVue.use(VueI18n)\nexport default ({ app }, inject) => {  \n // In this case, we added a plugin to our application and this  \n // will give the opportunity to get it from middleware and on pages  \n // in asyncData/fetch  \n app.i18n = new VueI18n()  \n}\n")])])]),t("p",[e._v("But there is another problem, how to access the i18n plugin from another plugin?"),t("br"),e._v("\nFor example, I have a plugin that shows the notifications on the pages and I want to show translated notifications."),t("br"),e._v("\nIf you thought about a simple import, then it does not work because of the asynchronous require of plugins. At the time of requiring the plugin notifications, the translation plugin is probably still not imported and you will get undefined.")]),e._v(" "),t("p",[e._v("Here, the inject function will help us, which comes in the second parameter and which you need to call with two parameters to “inject” plugin."),t("br"),e._v("\nThe first parameter — has a String type. This is name of our plugin, to which the prefix $ will be added, our plugin will be available in ctx.app.$pluginName in plugins and this.$pluginName in components."),t("br"),e._v("\nThe second parameter —has a Function type. This is our plugin implementation(function that will be executed when this.$pluginName() is called).")]),e._v(" "),t("p",[t("strong",[e._v("Attention, the correct implementation, in case you need to access one plugin in another.")])]),e._v(" "),t("p",[e._v("We rewrite the official example for:")]),e._v(" "),t("div",{staticClass:"language- extra-class"},[t("pre",{pre:!0,attrs:{class:"language-text"}},[t("code",[e._v("export default (ctx, inject) => {  \n   inject('i18n', new VueI18n())  \n}\n")])])]),t("p",[e._v("Now in the plugin, where you need the translator plugin, we have access like this:")]),e._v(" "),t("div",{staticClass:"language- extra-class"},[t("pre",{pre:!0,attrs:{class:"language-text"}},[t("code",[e._v("export default ({ app }) => {  \n   app.$i18n() // its works, cool!  \n}\n")])])]),t("p",[e._v("Well, if you do not need access to your newly created plugin from other plugins, then we do it as shown in the official documentation:")]),e._v(" "),t("div",{staticClass:"language- extra-class"},[t("pre",{pre:!0,attrs:{class:"language-text"}},[t("code",[e._v("export default ({ app }) => {  \n    // Will be available in the components as this.$i18n  \n    app.i18n = new VueI18n()  \n}\n")])])]),t("p",[e._v("Ciao!")])])}),[],!1,null,null,null);t.default=a.exports}}]);