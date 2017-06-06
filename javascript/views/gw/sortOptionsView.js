define([
    'jquery',
    'underscore',
    'backbone',
    'handlebars',
    'bootstrap',
    'hbs!templates/gw/sortOptionsTemplate'
], function($,_, Backbone, Handlebars, BootstrapSelectPicker, sortOptionsTemplate) {
    var SortOptionsView = Backbone.View.extend({
        el: '#sort-options',
        events: {
            "change select": "sortDevices"
        },
        template:sortOptionsTemplate,
        initialize: function(){
            this.render();
        },
        render: function(){
            var self = this;
            this.$el.html(this.template({
                "sortOptions": self.getTemplateData(),
                hideSort:self.model.get("results").hideSort
            }));
            self.initSelectPicker();
            return this;
        },
        initSelectPicker: function(){
            $("select#sortDevices").selectpicker();
            $(".filter-option", "#sort-options").addClass("bold");
        },
        sortDevices: function(){
            window.location.href = this.$el.find('#sortDevices').val();
        },
        getTemplateData: function(){
            var sortOptionsIndexesCollection = this.model.get("results").sortOptionsIndexes,
                sortOptionsIndexArr = String(sortOptionsIndexesCollection["full-retail-price"]).split(','),
                filteredSortedOpts = [];

            sortOptionsIndexArr = _.map(sortOptionsIndexArr, function(num) {
                return parseInt(num);
            });

            filteredSortedOpts = _.filter(this.model.get("results").sortOptions, function(model, index) {
                return (sortOptionsIndexArr.indexOf(index) !== -1);
            });

            return filteredSortedOpts;
        }
    });
    return SortOptionsView;
});