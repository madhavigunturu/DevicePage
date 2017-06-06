/*  Breadcrumb View */

define([
    'underscore',
    'backbone',
    'hbs!templates/gw/breadCrumbTemplate'
], function(_, Backbone, BreadCrumbTemplate) {
    var BreadCrumbView = Backbone.View.extend({
        el: '#breadCrumbHeader',
        initialize: function() {
			this.pageUrl = window.location.origin.replace("https://", "http://");
			this.render();
        },
        template: BreadCrumbTemplate,
        render: function() {
            var self = this;
            self.$el.append( self.template({
				"breadcrumbList":self.collection.toJSON(),
				"pageUrl": this.pageUrl
			}));
            return this;
        }
    });
    return BreadCrumbView;
});