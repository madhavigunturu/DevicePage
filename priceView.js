/*  Price View  */

define([
    'underscore',
    'backbone',
    'text!templates/gw/priceTemplate.html'
], function(_, Backbone, PriceTemplate) {
    var PriceView = Backbone.View.extend({
        el: '.pricing',
        initialize: function() {
            vzw.log('PriceView: initialized');
            this.render();
        },
        template: _.template(PriceTemplate),
        render: function() {
            this.$el.html(this.template({
                filters: vzw.models.GW.FiltersModel.toJSON()
            }));
            return this;
        }
    });
    
    return PriceView;
});