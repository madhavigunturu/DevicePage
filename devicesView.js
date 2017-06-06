/*  Devices View    */

define(['jquery', 
    'underscore',
     'backbone',
     'collections/gw/devicesCollection', 
     'views/gw/deviceView', 
     'helpers/simplePagination',
      'views/gw/promoTargeterView', 
      'views/gw/customPromoTargeterView',
      'views/gw/compareDevicesView',
      'carousel'
      ], function($, _, Backbone, DevicesCollection, DeviceView, SimplePagination, PromoTargeterView, CustomPromoTargeterView, CompareDevicesView, Carousel) {
    var DevicesView = Backbone.View.extend({
        el: '#devices',
        initialize: function(options) {
            this.options = options;
            this.devicesCollection = new DevicesCollection(this.model.get('results').devices);           
            this.render();
            this.compareDevicesView = new CompareDevicesView({
                collection: this.devicesCollection,
                deviceUpgradeFilters: this.model.get('results').deviceUpgradeFiltersVO
            });
            this.initPagination();
            this.toggleTileView();
        },
        render: function() {
            this.addCustomTargeter();
            this.devicesCollection.each(function(device, index) {
                var deviceView = null,
                    self = this;

                if (typeof this.model.get('results').targeters !== typeof undefined) { //  TODO - make this dynamic
                    this.addTargeter(index, this);
                }
                
                var dynSessionConf = this.model.get("commonConfiguration").commonConfiguration.sessionConfirmationNumber;
				var contracts = this.model.get("promos").promotions.contractFilterContainer;
				var selectedContract = _.find(contracts, function(temp){
					return temp.selected;
				});
				
				var selectedContractTerm = typeof selectedContract === "undefined"?".full-retail-price":selectedContract.value;
				
                if(typeof dynSessionConf === "undefined" || dynSessionConf === "" || dynSessionConf === null){
                	dynSessionConf = document.cookie.split('_dynSessConf=')[1].split(':')[0];
                }
                
                device.set("selectedContractTerm",selectedContractTerm);
                device.set("dynSessionConf",dynSessionConf);
                
                deviceView = new DeviceView({
                    model: device,
                    cqContent: this.options.cqContent,
                    isEdgePriceShow: self.model.get('results').isEdgePriceShow,
                    isCreditOptionSelected: this.options.selectedCreditOption,
					iscreditOptionsAvailable: self.model.get('results').creditOptionsAvailability ? true : false,
                    pageType:self.model.get('pageType').isHolidayPage
                });
                this.$el.append(deviceView.render().el);
            }, this);

            return this;
        },
         addCustomTargeter: function() {
                self = this;
                 var customPromo = null;
                        //this is for custom view
                      
                        if(this.model.get('results').promoTiles && this.model.get('results').promoTiles.tileContainer!=null){

                            

                            customPromo = new CustomPromoTargeterView({
                                model: self.model,
                                collection:self.model.get('results').targeters,
                                //collection:targetersArray,
                                customview:true
                            });
                             this.$el.append(customPromo.render().el);
                         
                           
                        //check if carosel enable


//this.model.get('results').promoTiles.tileContainer.tileStyle=="grid"
                        if(this.model.get('results').promoTiles.tileContainer.tileStyle=="carousal") {

                            $('.variable-width').slick({
                              dots: true,
                              infinite: true,
                              speed: 300,
                              slidesToShow:1,
                              centerMode: true,
                              variableWidth: true
                            });  

                        }  

                    }

          


         },
        addTargeter: function(index, context) {
            var promo = null;
            _.each(this.model.get('results').targeters, function(value, item) {
                if (value.targeterRow === "" && (index / 3) % 2 === 1) {
                    if (typeof value.targeterResponse !== typeof undefined) {
                        promo = new PromoTargeterView({
                            model: value
                        });
                        context.$el.append(promo.render().el);
                    }
                } else if (index / 3 === parseInt(value.targeterRow) - 1) {
                    if (typeof value.targeterResponse !== typeof undefined) {
                        promo = new PromoTargeterView({
                            model: value
                        });
                        context.$el.append(promo.render().el);
                    }
                }
            }, context);
        },
        initPagination: function() {

            if(this.model.get("results")["pagination"]!=null){


            var recsPerPage = parseInt(this.model.get("results")["pagination"]["paginationValues"]["recsPerPage"]);
                totalNumRecs = parseInt(this.model.get("results")["pagination"]["paginationValues"]["totalNumRecs"]);

           
                pageNum = parseInt(this.model.get("results")["pageNum"]),
                self = this,
                gwUrl = window.location.href.substring(0, window.location.href.indexOf('page')); // will create an absolute url if url has keyword "page"
            

            if ( totalNumRecs / recsPerPage > 1) {
                $(".pagination").pagination({
                    items: totalNumRecs,
                    itemsOnPage: recsPerPage,
                    currentPage: pageNum,
                    prevText: "Previous",
                    nextText: "Next",
                    hrefTextPrefix: gwUrl + "page-",
                    hrefTextSuffix: "/",
                    onPageClick: function(pageNumber, event) {
                        self.onPagination(pageNumber);
                    }
                });
            }

             }
        },
        onPagination: function(pageNumber) {
            var currentUrl = null;
            if (this.model.get("results").isIntentDecided === "EUP" && this.model.get("results").isUpgradeGridWall === true) {
                var recsPerPage = parseInt(this.model.get("results").pagination.paginationValues.recsPerPage),
                    params = {
                        No: recsPerPage * (pageNumber - 1),
                        pageNum: pageNumber
                    };
					/* CR 38837 changes starts*/
					if((this.model.get("results").currentNavState).indexOf('?/featuredd')==-1 && parseInt(this.model.get("results").pagination.paginationValues.totalNumRecs)>=parseInt(this.model.get("results").pagination.paginationValues.lastRecNum)){
						currentUrl = String(this.model.get("results").currentNavState) +"?/featuredd/"+ "&" + $.param(params);
					} else {	 
						currentUrl = String(this.model.get("results").currentNavState) + '&' + $.param(params);
					}
					/* CR 38837 changes ends*/
            } else {
                currentUrl = this.model.get("results").pagination.paginationValues['UrlforPage' + pageNumber];
            }
            window.location.href = currentUrl;
        },
        toggleTileView: function() {
            this.$el.on('mouseenter', '.c-gridwallTile', function() {
                $(this).addClass("gridwallTile_highlight");
            }).on('mouseleave', '.c-gridwallTile', function() {
                $(this).removeClass("gridwallTile_highlight");
            });
        }
    });

    return DevicesView;
});