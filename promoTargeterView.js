/*  Promo Targeter View */

define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/gw/promoTargeterTemplate.html',
    'helpers/modal'
], function($, _, Backbone, DeviceTemplate, ModalOverlay) {
    var PromoTargeterView = Backbone.View.extend({
        template: _.template(DeviceTemplate),
        initialize: function() {
            this.render();
        },
        events: {
            'click .c-banner-overlay-modal': 'displayBannerOverlay'
        },
        render: function() {
            var targeterResponseElement;
            if ($(decodeURIComponent(this.model["targeterResponse"].targeterResponse)).filter('a').length > 0){
                targeterResponseElement = $(decodeURIComponent(this.model["targeterResponse"].targeterResponse)).filter('a').attr({
                  "data-attr_campaign_id": this.model.contentId,
                  "data-attr_campaign_source": this.model["type"],
                  "data-attr_reporting_id": this.model.reportingId
                });
            }else{
                targeterResponseElement = $(decodeURIComponent(this.model["targeterResponse"].targeterResponse));
                targeterResponseElement.find('a').attr({
                  "data-attr_campaign_id": this.model.contentId,
                  "data-attr_campaign_source": this.model["type"],
                  "data-attr_reporting_id": this.model.reportingId
                });
            }
            var promoHTML=(targeterResponseElement[0]) ? targeterResponseElement[0].outerHTML:"";
            
            this.$el.html(this.template({
                promo: encodeURIComponent(promoHTML),
                tileSize: this.model["targeterTileSize"]
                // promo: this.model
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
