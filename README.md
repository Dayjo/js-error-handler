# JS Error Handler

Simple script to handle js errors and send them server-side for your perusal. It catches errors and optionally sends them to your server via ajax. It stores all errors in the browsers [sessionStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage) making them available to your JS app too.


__Note:__ This library has no included dependencies. If you want the AJAX posting to work, you'll need to be including either `jQuery` or `axios`. It looks for either `$.post` or `axios.post` to send the data.

------

## Quick Start
Simply include the js-error-handler.js in your web page. It's avaialable using jsDelivr;

```html
<script src="https://cdn.jsdelivr.net/gh/pallant/js-error-handler/dist/js-error-handler.min.js"></script>
```

Then intialise and configure it;

```html
<script>
// Initiate Error Handler with no AJAX
var MyErrorHandler = new JSErrorHandler();
</script>
```

------

## Additional Options

```html
<script>
// Initiate Error Handler with options
var MyErrorHandler = new JSErrorHandler({
    ajaxURL:     '',
    extraParams: {},
    onSaveError: function(error){ … },
    onSave:      function(response){ … }
});
</script>
```

#### ajaxURL (string)
The url to post the error to, without this, it will not attempt to save over ajax. Remember, if you include this option you must be including either `axios` or `jQuery` for it to work.

#### extraParams (object)
An object of extra parameters to send with the ajax requests, useful for sending user identifying information i.e;

```
extraParams: { userId: 12345 }
```

#### onSaveError (function)
Callback function that runs when the ajax request fails. Passes one parameter to the callback which is the error that was thrown so it can be handled some other way (It should still be in session storage at this point).

#### onSave (function)
Callback function that runs when the save request was successful. The only parameter passed to function is the response from the ajax request.

------

## Programatically access errors array
You can access the array of errors that have occured for a user over their browser session by accessing the `.sessionStorageErrors` property on your error handler object. This might be useful within the callback functions i.e.

```html
<script>
// Initiate Error Handler with options
var MyErrorHandler = new JSErrorHandler({
    ajaxURL:     '/errors',
    onSaveError: function(error){

        // Failed to save, so do something with the errors
        console.log(this.sessionStorageErrors);

    },
});
</script>
```

------

## Building Yourself

1. Clone the repo
2. Run `npm install`
3. Run `npm run build`
4. JS file will now be in the dist/js-error-handler.js