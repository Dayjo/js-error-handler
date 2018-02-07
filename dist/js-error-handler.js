'use strict';

/**
 * JS Error Handler
 * Catches javascript errors in your app. Stores them in sessionStorage,
 * immediately reports error to an ajax url
 */
var JSErrorHandler = function JSErrorHandler(config) {

    var errorHandler = {
        errors: [],
        sessionStorageErrors: [],
        config: config,

        /**
         * Initialise the event listener
         */
        init: function init() {
            var self = this;
            window.addEventListener('error', function (e) {
                var err = JSON.parse(JSON.stringify(e, ['message', 'filename', 'lineno', 'colno', 'error']));
                self.errors.push(err);
                self.sessionStorageErrors.push(err);

                self.save();
            });

            // Determine how to save
            if (typeof jQuery != 'undefined') {
                this.ajaxProvider = $.post;
            } else if (typeof axios != "undefined") {
                this.ajaxProvider = axios.post;
            }

            if (typeof sessionStorage != 'undefined') {
                var jsErrors = sessionStorage.getItem('jsErrors');
                if (jsErrors) {
                    this.sessionStorageErrors = JSON.parse(jsErrors);
                }
            }
        },
        save: function save() {
            if (typeof config.ajaxURL != 'undefined') {

                var params = {};
                if (this.config.extraParams) {
                    params = this.config.extraParams;
                }
                params.errors = this.errors;

                this.ajaxProvider(this.config.ajaxURL, params).then(this.onSave.bind(this)).catch(this.onSaveError.bind(this));
            }

            if (typeof sessionStorage != 'undefined') {
                sessionStorage.setItem('jsErrors', JSON.stringify(this.sessionStorageErrors));
            }
        },

        onSave: function onSave(response) {
            if (typeof this.config.onSave == 'function') {
                this.config.onSave.call(this, response);
            }

            if (this.config.clearOnSave) {
                this.errors = [];
            }

            console.log(response);
        },

        onSaveError: function onSaveError(response) {
            if (typeof this.config.onSaveError == 'function') {
                this.config.onSaveError(response);
            }

            console.log(response);
        }

    };

    errorHandler.init();
    return errorHandler;
};

if (typeof module != "undefined") {
    module.exports = JSErrorHandler;
}