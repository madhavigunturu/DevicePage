/*  Promo Targeter View */

define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/gw/timerTemplate.html',
    'helpers/modal',
   
], function($, _, Backbone, DeviceTemplate, ModalOverlay) {
    var PromoTargeterView = Backbone.View.extend({
        template: _.template(DeviceTemplate),
       
        initialize: function(options) {
       
            this.options = options;
           this.customview= this.options.customview;

            this.render();
        },
        events: {
            'click .c-banner-overlay-modal': 'displayBannerOverlay'
        },
        render: function() {
             
             
              this.$el.html(this.template({
                        promo: this.model
                    }));

              

            return this;
        },
        displayBannerOverlay: function(e) {
            e.preventDefault();
            var targetModal = $(e.currentTarget).data('modal');
            
            if (typeof targetModal !== "undefined" && targetModal !== "") {
                ModalOverlay.modal($(targetModal).html(), {
                    type: 'colorbox',
                    close: 'icon'
                });
            }
        }
    });

    return PromoTargeterView;
});