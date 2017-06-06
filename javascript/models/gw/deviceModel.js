/*  Device Model    */

define(['backbone'], function(Backbone) {
    return Backbone.Model.extend({
        initialize: function() {
            this.pdpUrl = this.get('attributes')['product.pdpUrl'][0];
            this.updateRatingClass();
            this.setDefaults();
            this.prodDiscountText = null;
        },
        updateRatingClass: function() {
            var attrs = this.attributes.attributes;
            if (attrs.hasOwnProperty('product.averageRating')) {
                var rating = (Math.round(parseFloat(attrs['product.averageRating']) * 2) / 2).toString().split(".");
                rating[1] = rating[1] || '0';
                attrs['product.ratingClass'] = rating[0] + "_" + rating[1];
            }
            return this;
        },
        setDefaults: function() {
            var attrs = this.get('records')[0].attributes;
            this.set({
                compare: false,
                currentSku: attrs['sku.id'][0],
                inventoryStatus: typeof attrs['inventory.status'][0] !== 'undefined' ? parseInt(attrs['inventory.status'][0]) : '',
                inventoryAvailDate: typeof attrs['inventory.avail.date'][0] !== 'undefined' ? attrs['inventory.avail.date'][0] : ''
            });

            this.on('change:currentSku', this.updateModel, this);
            return this;
        },
        updateModel: function() {
            var records = this.get('records'),
                updatedAttributes = null,
                index = 0,
                attrs = null;

            //TODO:: Check whether we need to use the below attribute for prepaid devices
            //this.prodDiscountText = (this.get('attributes')['product.discountText'] !== null && this.get('attributes')['product.discountText']) !== 'undefined' ? this.get('attributes')['product.discountText'] : [''];

            for (var i in records) {
                attrs = records[i].attributes;
                if ('' + attrs['sku.id'][0] === this.get('currentSku')) {
                    updatedAttributes = $.extend({}, this.get('attributes'), {
                        'product.imageName': attrs['sku.imageName'],
                        'sku.imageName': attrs['sku.imageName'],
                        'sku.displayName': attrs['sku.displayName'],
                        //'product.pdpUrl': attrs['sku.pdpUrl'],    // TODO - update this with SKU level pdp url once backend code is fixed
                        'product.pdpUrl': [this.pdpUrl + '#sku=' + attrs['sku.id'][0]],
                        //TODO:: Check whether we need to use the below attribute for prepaid devices
                        //'product.discountText': $.trim(this.prodDiscountText[0]) !== '' ? this.prodDiscountText : (typeof attrs['sku.discountText'] !== undefined && attrs['sku.discountText'][0] !== '') ? attrs['sku.discountText'] : this.get('attributes')['product.discountText'],
                        'product.isComingSoon': typeof attrs['sku.isComingSoon'] !== undefined ? attrs['sku.isComingSoon'] : '',
                        'product.isOutOfStock': typeof attrs['sku.isOutOfStock'] !== undefined ? attrs['sku.isOutOfStock'] : '',
                        'product.gridwallDevicePriceVO': this.get('attributes')["product.gridwallDevicePriceVO"]
                    });
                    index = i;
                    break;
                }
            }

            this.set({
                attributes: updatedAttributes,
                inventoryStatus: parseInt(attrs['inventory.status'][0]),
                inventoryAvailDate: attrs['inventory.avail.date'][0]
            });
            return this;
        }
    });
});