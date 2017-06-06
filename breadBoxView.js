define(['underscore', 'backbone', 'text!templates/gw/breadBoxTemplate.html'], function(_, Backbone, BreadBoxTemplate) {
    var BreadBoxView = Backbone.View.extend({
        el: '#c-breadbox',
        initialize: function() {
            this.render();
        },
        events: {
            'change input[name^="breadBox"]': 'onUnCheckBredbox'
        },
        template: _.template(BreadBoxTemplate),
        render: function() {
            var self = this;
            var templateData = {};
            templateData = _.extend(templateData, _.last(self.model.get("header").headerContent));

            templateData = _.extend(templateData, {
                breadBoxList: self.collection.toJSON(),
                defaultNavigationState: (typeof self.model.get('promos').promotions.refinementContainer.refinementCrumbs[1] !== typeof undefined) ? ((self.model.get('promos').promotions.refinementContainer.refinementCrumbs[1].navigationState === '/smartphones') ? 	"/smartphones" : ((typeof self.model.get('promos').promotions.refinementContainer.refinementCrumbs[0] !== typeof undefined) ? self.model.get('promos').promotions.refinementContainer.refinementCrumbs[0].navigationState :"")) : ((typeof self.model.get('promos').promotions.refinementContainer.refinementCrumbs[0] !== typeof undefined) ? self.model.get('promos').promotions.refinementContainer.refinementCrumbs[0].navigationState :	"")
            });

            this.$el.html(this.template(templateData));
        },
        onUnCheckBredbox: function(e) {
            var $target = $(e.currentTarget);

            (typeof $target.data("navState") !== 'undefined') && (window.location.href = $target.data('navState'));
        }
    });

    return BreadBoxView;
});