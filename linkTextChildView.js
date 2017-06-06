/*  LinkText View   */

define([
    'jquery',
    'underscore',
    'backbone',
    'views/gw/linkTextDescriptionView',
    'text!templates/gw/linkTextTemplate.html'
], function($, _, Backbone, LinkTextDescriptionView, LinkTextTemplate) {
    var LinkTextView = Backbone.View.extend({
        tagName: 'li',
        initialize: function() {
            this.render();
            this.linkTextDescriptionView = new LinkTextDescriptionView();
        },
        events: {
            'click a': 'showLinkText'
        },
        template: _.template(LinkTextTemplate),
        render: function() {
            var self = this;
            _.each(this.model.toJSON(), function(value, key) {
                self.$el.html(self.template({
                    linkText: key,
                    description: value
                })).addClass('gridwallLinks_link');
            });
            return this;
        },
        showLinkText: function(e) {
            this.linkTextDescriptionView.render($(e.target).data('linkText'));
        }
    });

    return LinkTextView;
});