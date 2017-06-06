/*  LinkText View   */

define([
    'jquery',
    'underscore',
    'backbone',
    'views/gw/linkTextChildView'
], function ($, _, Backbone,LinkTextChildView) {
    var LinkTextMainView = Backbone.View.extend({
        tagName: 'ul',
        className:'plainList bold',
        initialize: function () {
            
             
        },
        
        getTemplateData : function(){
            var data={};
          
        },
        
        render: function () {
            var self = this;
            this.collection.each(function(model){
                self.renderLinkText(model)
               

            });

            return this; 
             
        },
        renderLinkText: function (model) {
            var linkTextChildView = new LinkTextChildView({
                model: model
            });
           this.$el.append(linkTextChildView.render().el);

        } 
    });

    return LinkTextMainView;
});