/*  LinkText View   */

define([
    'jquery',
    'underscore',
    'backbone'
], function ($, _, Backbone) {
    var LinkTextDescriptionView = Backbone.View.extend({
        el: '#c-linkTextDescription',
        render: function (html) {
           this.$el.html(html);
		   $('.o-feature-text-description').show();
            return this;
        }
    });
	return LinkTextDescriptionView;
});