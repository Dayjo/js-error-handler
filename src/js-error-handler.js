/**
 * JS Error Handler
 * Catches javascript errors in your app.
 * immediately reports error to an ajax url
 */
var JSErrorHandler = function(config){

    var errorHandler = {
        errors: [],
        ajaxProvider: null,
        config: config,

        /**
         * Initialise the event listener
         */
        init: function() {
            var self = this;
            window.addEventListener('error', function(e){
                let err = JSON.parse(JSON.stringify(e, ['message', 'filename', 'lineno', 'colno']));
                err.stack = e.error.stack;
                err.timestamp = Date.now();

                // Look through the errors array to see if we have already done this one
                self.errors.indexOf(err);
                self.errors.push(err);

                // If there's an onError callback, call it
                if (typeof self.config.onError == 'function' ){
                    self.config.onError.call(self, err);
                }

                self.save();

            });

        },

        /**
         * Save the errors
         */
        save: function() {
            // Determine how to save
            if ( this.config.ajaxProvider && typeof this.config.ajaxProvider == 'function' ) {
                this.ajaxProvider = this.config.ajaxProvider;
            }
            else if ( typeof axios != "undefined" ) {
                this.ajaxProvider = axios.post;
            }
            else if ( typeof jQuery != 'undefined' && jQuery.fn.jquery) {
                this.ajaxProvider = jQuery.post;
            }
            else {
                console.warn("JSErrorHandler: No ajax provider found, please ensure jQuery or axios are included");
            }

            if ( typeof this.config.ajaxURL != 'undefined' && this.ajaxProvider ) {

                let params = {};
                if ( this.config.extraParams ) {
                    params = this.config.extraParams;
                }
                params.errors = this.errors;

                try {
                    this.ajaxProvider(this.config.ajaxURL, params)
                        .then(this.onSave.bind(this))
                        .catch(this.onSaveError.bind(this));
                }
                catch(err) {
                    console.warn('JSErrorHandler: ajaxProvider is not a real Promise, not able to save errors.', err);
                }
            }
        },

        /**
         * The onSave callback, runs if the error ajax request was successful
         * @param  {Object} response The response from the ajax request
         * @return {void}
         */
        onSave: function(response){
            if (typeof this.config.onSave == 'function' ){
                this.config.onSave.call(this, response);
            }

            this.errors = [];
        },

        /**
         * The onSaveError callback, runs if the ajax request failed
         * @param  {Object} response The response from the server
         * @return {void}
         */
        onSaveError: function(response){
            if (typeof this.config.onSaveError == 'function' ){
                this.config.onSaveError.call(this,response);
            }
        },

    };

    /**
     * Initialise the handler
     */
    errorHandler.init();
    return errorHandler;

};

if ( typeof module != "undefined" ) {
    module.exports = JSErrorHandler;
}