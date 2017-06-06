/*  LinkText View   */

define([
    'jquery',
    'underscore',
    'backbone'
], function ($, _, Backbone) {
    var LinkTextDescriptionView = Backbone.View.extend({
        el: '#c-linkTextDescription',
        initialize: function () {
            
             
        },
        
      
        render: function (html) {
            var self = this;
           this.$el.html(html);
		   $('.o-feature-text-description-close').show();
            return this;
        }
        
    });

    return LinkTextDescriptionView;
});