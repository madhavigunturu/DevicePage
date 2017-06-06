/*  Promo Targeter View */

define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/gw/customPromoTargeterTemplate.html',
    'helpers/modal'
    
], function($, _, Backbone, DeviceTemplate, ModalOverlay) {
    var PromoTargeterView = Backbone.View.extend({
        template: _.template(DeviceTemplate),
       
        initialize: function(options) {
       
            this.options = options;
           this.customview= this.options.customview;

            this.render();
        },
        events: {
            'click .c-banner-overlay-modal': 'displayBannerOverlay',
            'click .slidesBorder':'handleClick',
             'click .slidesGridBorder':'handleClick'


            
        },
        render: function() {
             
            //console.log('inside promo targeter'+self.model.get('results').sortOptions[0].selected);
              //console.log('inside promo targeter1'+self.model.get('results').promoTiles.tileContainer.tileMaxCount);
                  //   console.log('inside promo targeter2'+this.model['results']['promoTiles']);

              this.$el.html(this.template({
                        promo: this.model
                    }));

            return this;
        },
        handleClick:function(e){
          
         console.log($(e.currentTarget).attr('type'));
            if($(e.currentTarget).attr('type')=="PostpayCustomPromoTile"){
            location.href=$(e.currentTarget).attr('url');
        }

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