define([
    'jquery',
    'underscore',
    'backbone',
    'handlebars',
    'hbs!templates/gw/promoTargeterTemplate'
], function($,_, Backbone, Handlebars, promoTargeterTemplate) {
    var PromoTargeterView = Backbone.View.extend({
        template: promoTargeterTemplate,
        initialize: function() {
            this.render();
        },
        render: function() {
            var targeterResponseElement,
                targeterResponse = this.model.targeterResponse.targeterResponse;

            if ($(decodeURIComponent(targeterResponse)).filter('a').length > 0){
                targeterResponseElement = $(decodeURIComponent(targeterResponse)).filter('a').attr({
                  "data-attr_campaign_id": this.model.contentId,
                  "data-attr_campaign_source": this.model.type,
                  "data-attr_reporting_id": this.model.reportingId
                });
            }else{
                targeterResponseElement = $("<div>").append( $(decodeURIComponent(targeterResponse)) );                
            }
            
            var promoHTML=(targeterResponseElement[0]) ? targeterResponseElement[0].outerHTML:"";
            this.$el.html(this.template({
                promo: promoHTML,
                tileSize: this.model.targeterTileSize * 4
            }));

            return this;
        }
    });
    return PromoTargeterView;
});
