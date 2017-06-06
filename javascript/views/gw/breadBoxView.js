define([
    'jquery',
    'underscore',
    'backbone',
    'handlebars',
    'hbs!templates/gw/breadBoxTemplate'
], function($,_, Backbone, Handlebars, breadBoxTemplate) {
    var FiltersView = Backbone.View.extend({
        el: '#c-breadbox',
        template:breadBoxTemplate,
        events: {
            'change input[name^="breadBox"]': 'onUnCheckBredbox'
        },
        initialize: function(){
            this.render();
            
        },
        render: function(){
            var self = this,
                templateData = {},
                breadBoxObj = self.model.get("filtersAndBreadcrumb").filtersAndBreadcrumbContent.breadBox;

            templateData = _.extend(templateData, _.last(self.model.get("header").headerContent));

            if(!_.isNull(breadBoxObj)){
                templateData = _.extend(templateData, {
                    breadBoxList: breadBoxObj.refinementBreadBox,
                    defaultNavigationState : breadBoxObj.pageNavState
                });
            }

            this.$el.html(this.template(templateData));
            return this;
        },
        onUnCheckBredbox: function(e) {
            var $target = $(e.currentTarget);
            if(typeof $target.data("navState") !== 'undefined'){
                window.location.href = $target.data('navState');
            }
        }
    });
    return FiltersView;
});