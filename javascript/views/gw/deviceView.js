define([
	'jquery', 
	'underscore', 
	'backbone',
	'hbs!templates/gw/deviceTemplate'
], function($, _, Backbone, DeviceTemplate) {
    return Backbone.View.extend({
        template: DeviceTemplate,
        events: {
        	'click a.gridwallTile_colorSwatch': 'onColorChange'
        },
        initialize: function() {
			this.model.on('change', this.render, this);			
		},
        render: function() {
			this.$el.html(this.template({
				device: this.model.toJSON(),
				deviceInfo: this.model.toJSON().attributes,
				availableSkuDetails: this.model.toJSON().records
			}));
			return this;
        },
        onColorChange: function(e) {
            e.preventDefault();
            e.stopPropagation();
            var targetData = $(e.target).data();
            this.model.set('currentSku', targetData.skuid + '');
        }
    });
});
