/*  Breadcrumb View */

define([
    'underscore',
    'backbone',
    'text!templates/gw/breadCrumbTemplate.html'
], function(_, Backbone, BreadCrumbTemplate) {
    var BreadCrumbView = Backbone.View.extend({
        el: '.breadcrumb',
        initialize: function() {
            this.render();
        },
        template: _.template(BreadCrumbTemplate),
        render: function() {
            var self = this;
            
            self.$el.append( self.template({"breadcrumbList":self.collection.toJSON()}));
            

            return this;
        }
    });
    
    return BreadCrumbView;
});