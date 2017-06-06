require(['jquery', 'backbone', 'underscore', 'configuration/global-includes','views/gw/mainView', 'templates/helpers/gw/partials'],
    function ($, Backbone, _, GlobalEvents,  MainView) {
		GlobalEvents.init();
        new MainView();
});