/*  Compare Devices View    */

define(['jquery', 'underscore', 'backbone', 'text!templates/gw/compareDevicesTemplate.html', 'constants'], function($, _, Backbone, compareTemplate, Constants) {
    return Backbone.View.extend({
        el: '.c-compareDevices',
        template: _.template(compareTemplate),
        initialize: function(options) {
            this.options = options;
            this.devices = this.devices || {};
            this.deviceData = this.deviceData || [];
            this.listenTo(this.collection, 'change:compare', this.update);
            //Call update to build the list if we compared on previous page/refresh?
            if(gridwallJSON.gridwallContent.compareList.innerCompareList){
                this.deviceData = gridwallJSON.gridwallContent.compareList.innerCompareList;
                this.render();
            }
        },
        events: {
            'click .c-clearAllDevices': 'onClearDevices',
            'click .c-compareDevicesBtn': 'onCompareDevices',
            'click .c-removeDevice': 'onRemoveDevice'
        },
        update: function(nonPageDevice, nonPageDeviceData) {

            var o = _.keys(this.devices),
                n = _.map(this.collection.where({
                    compare: true
                }), function(k, v) {
                    return k.cid;
                }),
                a = _.difference(n, o),
                r = _.difference(o, n);
            if (a.length) {
                this.addDevice(this.collection.get(a[0]));
                this.devices[a[0]] = this.collection.get(a[0]);
            } else if (r.length) {
                if(this.devices[r[0]]){
                    delete this.devices[r[0]];    
                }
                this.removeDevice(this.collection.get(r[0]));
            } else if(nonPageDevice){
                delete this.devices[nonPageDeviceData];
                this.removeDevice(nonPageDeviceData, nonPageDevice);
            }
            return this;
        },
        render: function() {
            //change from checking _.keys(this.devices).length
            this.totalDevices = this.deviceData.length ;
            $('.c-compare-device:not(:checked)').prop('disabled', (this.totalDevices >= 4));

            if (this.deviceData.length) {
                this.$el.html(this.template({
                    devices: this.deviceData,
                    showMaxSizeMsg: this.totalDevices === 4,
                    enableControls: this.totalDevices > 1
                }));
            }
            this.$el.toggleClass('is-hidden', this.totalDevices <= 0);
            return this;
        },
        ajaxPost: function(params, success, datatype) {
            $.post(Constants.EndPoints.BaseAjaxServlet, params, success, datatype);
            return this;
        },
        parseResponse: function(response) {
            if (response.Success) { // TODO - Fix this filter once backend code is fixed
                var deviceIds = _.map(_.values(this.devices), function(m) {
                    return m.get('attributes')['product.repositoryId'][0];
                });
                //change to not remove products that are not on page
                this.deviceData = response.productList;
                // this.deviceData = _.filter(response.productList, function(o) {
                //     return $.inArray(o.deviceid, deviceIds) >= 0;
                // });
                this.render();
            }
            return this;
        },
        addDevice: function(device) {
            var self = this,
                attrs = device.get('attributes'),
                upgradeFilters = this.options.deviceUpgradeFilters,
                records = _.filter(device.get('records'), function(item) {
                    return item.attributes["sku.id"][0] === device.get('currentSku');
                }),
                params = {
                    ajaxName: 'addProductComparison',
                    compareProductId: attrs['product.repositoryId'][0],
                    compareSkuId: records[0]['attributes']['sku.id'][0],
                    productImg: Constants.EndPoints.Scene7imagePath + records[0]['attributes']['sku.imageName'] + '?$acc-lg$&fmt=jpeg',
                    upgradeTwoYearEligibleDevice: null,
                    upgradeEdgeEligibleDevice: null,
                    employeeOffer: attrs['product.gridwallDevicePriceVO'][0].employeeOfferText,
                    upgradeEdgeEligible: null,
                    upgradeTwoYearEligible: null,
                    isEdgePriceShow: this.options.isEdgePriceShow,
                    edgeEligible: attrs['product.gridwallDevicePriceVO'][0].edgeEnabled,
                    displayPrice: attrs['product.gridwallDevicePriceVO'][0].discountedContractPrice,
                    displayPriceStartsAt: attrs['product.gridwallDevicePriceVO'][0].contractPrice
                };

            if (upgradeFilters !== null) {
                (upgradeFilters.upgradeTwoYearEligibleDevice !== null) && (params.upgradeTwoYearEligibleDevice = upgradeFilters.upgradeTwoYearEligibleDevice);
                (upgradeFilters.upgradeEdgeEligibleDevice !== null) && (params.upgradeEdgeEligibleDevice = upgradeFilters.upgradeEdgeEligibleDevice);
                (upgradeFilters.upgradeEdgeEligible !== null) && (params.upgradeEdgeEligible = upgradeFilters.upgradeEdgeEligible);
                (upgradeFilters.upgradeTwoYearEligible !== null) && (params.upgradeTwoYearEligible = upgradeFilters.upgradeTwoYearEligible);
            }

            this.ajaxPost(params, function(r) {
                if (typeof $.parseJSON(r).productList !== 'undefined') {
                    self.parseResponse($.parseJSON(r));
                }
            });
            return this;
        },
        removeDevice: function(device, nonPageDevice) {
            var self = this;
            var params;
            if (nonPageDevice){
                params = {
                    ajaxName: 'removeProductComparison',
                    removeProductId: device.deviceid,
                    removeSkuId: device.skuid
                };

            }else{
                params = {
                    ajaxName: 'removeProductComparison',
                    removeProductId: device.get('attributes')['product.repositoryId'][0],
                    removeSkuId: device.get('currentSku')
                };
            }                
            this.ajaxPost(params, function(r) {
                if (typeof $.parseJSON(r).productList !== 'undefined') {
                    self.parseResponse($.parseJSON(r));
                }
            });
            return this;
        },
        onRemoveDevice: function(e) {
            var deviceId = $(e.currentTarget).data('deviceId');

            var deviceOnPage = this.collection.find(function(m) {
                //returns undefined if device is not on the page
                return m.get('attributes')['product.repositoryId'][0] === deviceId;
            });

            if (deviceOnPage === undefined){
                var result = this.deviceData.filter(function( obj ) {
                  return obj.deviceid == deviceId;
                });
                this.update(true, result[0]);
            }else{
                this.collection.find(function(m) {
                    return m.get('attributes')['product.repositoryId'][0] === deviceId;
                }).set('compare', false);                
            }


            return this;
        },
        onClearDevices: function() {
            var self = this;
            if(this.devices.length != this.deviceData.length){
                _.each(_.values(self.devices), function(m) {
                    m.set('compare', false);
                });
                _.each(self.deviceData, function(m){
                    self.update(true,m);
                })
            }else{
                _.each(_.values(self.devices), function(m) {
                    m.set('compare', false);
                });    
            }
            

            //check to see if any devices are not on page, manually call update for them

            /**
             * Todo - Fix clear all at once only when backend code is fixed
             * 
            models = _.values(this.devices), params = {
                ajaxName: 'removeProductComparison',
                clearAll: true,
                removeSkuIdArr: _.map(models, function(m) {
                    return m.get('currentSku');
                }).toString(),
                removeProductIdArr: _.map(models, function(m) {
                    return m.get('attributes')['product.repositoryId'][0];
                }).toString()
            };
            this.ajaxPost(params, function(r) {
                // disregard the response
            });
            */
            return this;
        },
        onCompareDevices: function() {
            //change from checking _.keys(this.devices).length
            if (this.deviceData.length > 1) {
                window.location.href = Constants.EndPoints.ComparePage;
            }
            return this;
        }
    });
});