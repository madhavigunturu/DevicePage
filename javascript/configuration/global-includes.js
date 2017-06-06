define([
    'handlebars',
    'handlebarhelpers',
    'helpers/ajaxHeaders'
], function(Handlebars, Helpers, ajaxHeaders) {
    var globalEvents = {
        init: function(opts) {
            var defaults = {
                    ajaxHeaders: true
                },
                _opts = $.extend(defaults, {}, opts);
            if (_opts.ajaxHeaders) {
                //  console.log("Ajax Headers Added");
                ajaxHeaders.init();
            }
            var helpers = new Helpers();
            helpers.init();
        }
    };

    return globalEvents;
});
