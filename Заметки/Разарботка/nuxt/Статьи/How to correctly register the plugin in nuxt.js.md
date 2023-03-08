https://medium.com/@valerka/how-to-register-the-plugin-correctly-in-nuxt-js-91ed2d95b81f

# How to correctly register the plugin in nuxt.js

In my opinion, the official documentation of nuxt.js does not exactly reveal how to properly implement plugins into your application, so I want to tell you more about it.

First, I’ll show what **NOT** the right implementations I’ve met on my development way.

**Attention, this is NOT the correct implementation!**

```

Vue.use({  
 install(Vue) {  
  // here the plugin is initialized  
  // then added to the prototype Vue under $plugin allias  
  Vue.prototype.$plugin = $plugin  
 }  
})// Then, a function is imported that returns the plugin itself  
// this is required for the asynchronous require of the plugin.  
export default () => $plugin
```

And even met such an invention.

**Attention, this is also NOT the right implementation!**

```
export default {  
 install (Vue) {  
   // Here the global Vue is polluted  
   // in the plugins we have access to the plugin  
   // under the allias plugin  
   // in components after initializing Vue, under $plugin  
  Vue.prototype.$plugin = Vue.plugin = plugin  
 }  
}
```

Ok, let’s find the right solution, [here](https://nuxtjs.org/guide/plugins/#inject-in-root-amp-context) is an example from the official documentation, but as you can see not the most extensive explanation.

```
import Vue from 'vue'  
import VueI18n from 'vue-i18n'
Vue.use(VueI18n)
export default ({ app }, inject) => {  
 // In this case, we added a plugin to our application and this  
 // will give the opportunity to get it from middleware and on pages  
 // in asyncData/fetch  
 app.i18n = new VueI18n()  
}
```

But there is another problem, how to access the i18n plugin from another plugin?  
For example, I have a plugin that shows the notifications on the pages and I want to show translated notifications.  
If you thought about a simple import, then it does not work because of the asynchronous require of plugins. At the time of requiring the plugin notifications, the translation plugin is probably still not imported and you will get undefined.

Here, the inject function will help us, which comes in the second parameter and which you need to call with two parameters to “inject” plugin.  
The first parameter — has a String type. This is name of our plugin, to which the prefix $ will be added, our plugin will be available in ctx.app.$pluginName in plugins and this.$pluginName in components.  
The second parameter —has a Function type. This is our plugin implementation(function that will be executed when this.$pluginName() is called).

**Attention, the correct implementation, in case you need to access one plugin in another.**

We rewrite the official example for:

```
export default (ctx, inject) => {  
   inject('i18n', new VueI18n())  
}
```

Now in the plugin, where you need the translator plugin, we have access like this:

```
export default ({ app }) => {  
   app.$i18n() // its works, cool!  
}
```

Well, if you do not need access to your newly created plugin from other plugins, then we do it as shown in the official documentation:

```
export default ({ app }) => {  
    // Will be available in the components as this.$i18n  
    app.i18n = new VueI18n()  
}
```

Ciao!