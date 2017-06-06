define([
    'jquery',
    'underscore',
    'backbone',
    'handlebars',
    'hbs!templates/gw/filtersTemplate'
], function($,_, Backbone, Handlebars, FiltersTemplate) {
    var FiltersView = Backbone.View.extend({
        el: '#c-filters',
        template:FiltersTemplate,
        events:{
            "click .c-filter-header": "expCollapseFilter",
            "click .c-filter-header span": "delegateClick",
            "change .c-filterCtrl:not([type='link'])": "onFilterChange",
            "click .c-filterCtrl[type='link']":"onFilterChange"
        },
        initialize: function(){
            this.render();
            this.initialFilterDisplay();
        },
        render: function(){
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        },
        initialFilterDisplay: function() {
            var collapse = 'collapse',
                collapseItems = $('.gridwallFilter_wrapper').find("[data-toggle='" + collapse + "']");
                
            collapseItems.find('.font-icon_minus').removeClass('font-icon_minus').addClass('font-icon_plus');
            collapseItems.next().hide();
        },
        delegateClick: function(e) {
            $(e.target).parent().trigger('click');
        },
        expCollapseFilter: function(e) {
            var $element = $(e.target),
                $iconContainer = $element.find('span');
                
            $element.parent().next().animate({
                height: "toggle"
            }, function() {
                $iconContainer.toggleClass("font-icon_minus font-icon_plus");
            }).removeClass('is-hidden');
        },
        onFilterChange: function(evt) {
            var $target = $(evt.currentTarget || evt.srcElement);
            if(typeof $target.data("navState") !== 'undefined'){
                window.location.href = $target.data('navState');
            }
        }
    });
    return FiltersView;
});