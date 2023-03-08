https://dev.to/michellebuchiokonicha/how-to-handle-file-uploadimages-documents-etc-in-nuxtjs-and-vuejs-with-vuex-and-axios-api-57ci

Handling files is always a hurdle especially if it is your first time. This is because files are not stored the same way normal data is. You would need to handle the files correctly first.  
You need to use your formdata.

[![Image description](https://res.cloudinary.com/practicaldev/image/fetch/s--wO6k9WEe--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_auto%2Cw_880/https://dev-to-uploads.s3.amazonaws.com/uploads/articles/nts8oxsrdom1kq474x5h.png)](https://res.cloudinary.com/practicaldev/image/fetch/s--wO6k9WEe--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_auto%2Cw_880/https://dev-to-uploads.s3.amazonaws.com/uploads/articles/nts8oxsrdom1kq474x5h.png)

Here is an extract of the function for your upload files.  
If you are adding this to your vuex store, then you would need to add this to your action as done above.  
After which you can call the API and then dispatch the form in the appropriate pages.  
It becomes easy from here after you have added it to your action.

For an image, to ensure that the image is gotten from the API and also previewed, you need to use the @change event .

[![Image description](https://res.cloudinary.com/practicaldev/image/fetch/s--vBd86uJ7--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_auto%2Cw_880/https://dev-to-uploads.s3.amazonaws.com/uploads/articles/h937wcfn7a1xar28v5ou.png)](https://res.cloudinary.com/practicaldev/image/fetch/s--vBd86uJ7--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_auto%2Cw_880/https://dev-to-uploads.s3.amazonaws.com/uploads/articles/h937wcfn7a1xar28v5ou.png)

Next, you need to add this function to your input field so you can be able to preview the image.

[![Image description](https://res.cloudinary.com/practicaldev/image/fetch/s--i4Tn69OM--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_auto%2Cw_880/https://dev-to-uploads.s3.amazonaws.com/uploads/articles/7advpj8242svf0u7nzoy.png)](https://res.cloudinary.com/practicaldev/image/fetch/s--i4Tn69OM--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_auto%2Cw_880/https://dev-to-uploads.s3.amazonaws.com/uploads/articles/7advpj8242svf0u7nzoy.png)

Next, to preview this image, you need to add this to an image tag that enables you view images stored in the database.

[![Image description](https://res.cloudinary.com/practicaldev/image/fetch/s--ROozm7dP--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_auto%2Cw_880/https://dev-to-uploads.s3.amazonaws.com/uploads/articles/70p0ruaqtyer97aakmcz.png)](https://res.cloudinary.com/practicaldev/image/fetch/s--ROozm7dP--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_auto%2Cw_880/https://dev-to-uploads.s3.amazonaws.com/uploads/articles/70p0ruaqtyer97aakmcz.png)

The v-bind:src is obtained from the API. the previewFiles is from the handle function you created.

Lastly, you need to dispatch the image to the API.

[![Image description](https://res.cloudinary.com/practicaldev/image/fetch/s--XElUqFW1--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_auto%2Cw_880/https://dev-to-uploads.s3.amazonaws.com/uploads/articles/rrni627mjkjri1kc0svw.png)](https://res.cloudinary.com/practicaldev/image/fetch/s--XElUqFW1--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_auto%2Cw_880/https://dev-to-uploads.s3.amazonaws.com/uploads/articles/rrni627mjkjri1kc0svw.png)

This is a step by step process on uploading files and sending files to the database with vuex and axios.

My Twitter Handle: [https://twitter.com/mchelleOkonicha](https://twitter.com/mchelleOkonicha)

My LinkedIn Handle: [https://www.linkedin.com/in/buchi-michelle-okonicha-0a3b2b194/](https://www.linkedin.com/in/buchi-michelle-okonicha-0a3b2b194/)