
define(['jquery', 
    'underscore',
     'backbone',
     'handlebars',
     'views/gw/deviceView',
     'views/gw/promoTargeterView',
	 'helpers/simplePagination'
      ], function($, _, Backbone, Handlebars, DeviceView, PromoTargeterView) {
    var DeviceListingView = Backbone.View.extend({
        el: '#devices',
        initialize: function() {
			this.results = this.model.get("results");
            this.render();            
			this.initPagination();
            this.addEventHandlers();
        },
        render: function() {
            var self = this;
            self.collection.each(function(device) {
                var deviceView = new DeviceView({
                    model: device,
                });
                self.$el.append(deviceView.render().el);
            }, this);

            self.addTargeter();

		  return this;
        },
        addTargeter: function(){
            var promo = null,
                self = this;

            _.each(this.model.get('results').targeters, function(targeterRespObj) {
                if (typeof targeterRespObj.targeterRow !== "undefined" && typeof targeterRespObj.targeterResponse !== "undefined") {
                    var slidesPerRow = self.isPortraitView() ? 2 : 3,
                        targeterPosition = targeterRespObj.targeterRow === "0" ? 1 : targeterRespObj.targeterRow * slidesPerRow;

                    promo = new PromoTargeterView({
                        model: targeterRespObj
                    });

                    switch(targeterPosition){
                        case 1:
                            self.$el.prepend(promo.render().el);
                            break;
                        default:
                            self.$el.find(".gridwallTile_col").parent(":nth-child(" + targeterPosition + ")").after(promo.render().el);
                            break;
                    }
                }
            });
        },
		initPagination: function() {
            if(!_.isNull(this.results.pagination) && !_.isUndefined(this.results.pagination)){
                var recsPerPage = parseInt(this.results.pagination.paginationValues.recsPerPage),
                    totalNumRecs = parseInt(this.results.pagination.paginationValues.totalNumRecs),           
                    pageNum = parseInt(this.results.pageNum),
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
                        onPageClick: function(pageNumber/*, event*/) {
                            self.onPagination(pageNumber);
                        }
                    });
                }
            }
        },
        onPagination: function(pageNumber) {
            var currentUrl = null;
            if (this.results.isIntentDecided === "EUP" && this.results.isUpgradeGridWall === true) {
                var recsPerPage = parseInt(this.results.pagination.paginationValues.recsPerPage),
                    params = {
                        No: recsPerPage * (pageNumber - 1),
                        pageNum: pageNumber
                    },
					curNavState=String(this.model.get("results").currentNavState);
					currentUrl = ((curNavState).indexOf('?') === -1 )? curNavState + '?' + $.param(params): curNavState + '&' + $.param(params);					
            } else {
                currentUrl = this.results.pagination.paginationValues['UrlforPage' + pageNumber];
            }
            window.location.href = currentUrl;
        },
        isPortraitView: function() {
            return window.Modernizr.mq('(max-width: 981px)');
        },
        handleOrientationChange: function(){//call all the reqd functions to be triggered on orientation change
            this.updateTargeterPosition();
        },
        updateTargeterPosition: function(){
            if($(".c-promoTargeter").length){
                //remove the existing promo targeter HTML element
                $(".c-promoTargeter").parent().remove();
                //add it again based on the device orientation view
                this.addTargeter();
            }
        },
        addEventHandlers: function(){
            var self = this;
            $(window).on('orientationchange resize', function() {
                self.handleOrientationChange();
            });
        }
    });
	return DeviceListingView;
});
