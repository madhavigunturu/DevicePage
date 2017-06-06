/*  LinkText View   */

define([
    'jquery',
    'underscore',
    'backbone',
    "view/gw/linkTextChildView",
    'text!templates/gw/linkTextTemplate.html'
], function ($, _, Backbone,LinkTextChildView, LinkTextTemplate) {
    var LinkTextMainView = Backbone.View.extend({
        tagName: '#c-link-text',
        initialize: function () {
            
            this.render();
        },
        events: {
            'click a': 'showLinkText'
        },
        getTemplateData : function(){
            var data={};
            this.collection.each(function(model){
                console.log(model.toJSON());
            });
        },
        template: _.template(LinkTextTemplate),
        render: function () {
            this.getTemplateData();
            //this.$el.html(this.template(this.model.toJSON()));
        },
        showLinkText: function(e) {
            this.$el.find('section').html($(e.target).data('linkText'));
        }
    });

    return LinkTextMainView;
});