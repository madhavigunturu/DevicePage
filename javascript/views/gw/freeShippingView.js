define([
    'jquery',
    'underscore',
    'backbone',
    'hbs!templates/gw/freeShippingTemplate',
    'betterTooltip'
], function ($, _, Backbone, FreeShippingTemplate) {
    var FreeShippingView = Backbone.View.extend({
        el: '#freeShippingWrapper',
        template: FreeShippingTemplate,
        initialize: function () {
            this.render();
            $('.tooltip').betterTooltip({hover: true});
        },
        render: function(){
            if(typeof this.model.get("FreeOvernightShipping") !== 'undefined'){
                this.$el.html(this.template({
                    shippingData : decodeURIComponent(this.model.get("FreeOvernightShipping").targeterResponse.targeterResponse)
                }));
            }
		}
    });
	return FreeShippingView;
});