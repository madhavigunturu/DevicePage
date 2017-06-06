define([
    'underscore', 
    'backbone', 
	'models/gw/gridwallModel',
	'collections/gw/devicesCollection',
	'views/gw/pageHeaderView',
	'views/gw/deviceListingView',
	'views/gw/paymentOptionsView',
	'views/gw/breadBoxView',
	'views/gw/filtersView',
	'views/gw/sortOptionsView',
	'hbs!templates/gw/gwMain'
], function(_, Backbone, GridwallModel, DevicesCollection, PageHeaderView, DeviceListingView, PaymentOptionsView, BreadBoxView, FiltersView, SortOptionsView, GWMainTemplate) {

    var MainView = Backbone.View.extend({
        el: '#pageWrapper',
		template: GWMainTemplate,
		deviceListingView: null,
		
        initialize: function() {
			var gridwallJSON = window.gridwallJSON.gridwallContent;
        	this.model = new GridwallModel(gridwallJSON);
			this.render();
        },
		events: {
            "click .o-feature-text-description-close": "closeLinkTextDescription"
        },
        render: function() {
			this.$el.html(this.template(this.model.toJSON()));
			this.renderPartialViews();
			$(".spinner").hide();
			return this;
        },
        renderPartialViews: function() {
			new PageHeaderView({
                model: this.model
            });
			
			this.deviceListingView = new DeviceListingView({
				model: this.model,
				collection: new DevicesCollection(this.model.get("results").devices)
			});
			
			new PaymentOptionsView({
				model: this.model
			});

			new BreadBoxView({
	            model: this.model
	        });

			new FiltersView({
				model: new Backbone.Model(this.model.get("filtersAndBreadcrumb").filtersAndBreadcrumbContent)
			});

			new SortOptionsView({
				model: this.model
			});
		},
		closeLinkTextDescription: function(evt) {
            evt.preventDefault();
            $('.o-feature-text-description').hide();
            $('#c-linkTextDescription').html('');
        }
    });

    return MainView;
});
