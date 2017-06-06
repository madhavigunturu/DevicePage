define(['jquery', 'underscore', 'backbone', 'text!templates/gw/deviceTemplate.html', 'helpers/modal', 'loader'], function($, _, Backbone, DeviceTemplate, ModalClass, Loader) {
    return Backbone.View.extend({
        template: _.template(DeviceTemplate),
        initialize: function(options) {
            this.options = options;
            var device = this.model.toJSON();
            
            
            isUpgrade = Boolean(typeof gridwallJSON.gridwallContent.results.mtnDetailsVOList !== "undefined" && gridwallJSON.gridwallContent.results.mtnDetailsVOList !== null );
        		var annualUpgradeDeviceCompatible = true;
        
            if (isUpgrade) {
                var selectedMtnList =  _.findWhere(gridwallJSON.gridwallContent.results.mtnDetailsVOList, {deviceAdded: false}),
                isBuyout = selectedMtnList.mtnDetailVO.buyOutAmtAddedToOrder,
                gwSelectedMtn = (typeof selectedMtnList !== "undefined" && selectedMtnList !== null ) ? selectedMtnList.mtn : 'not an upgrade';
                deviceCompatibleList = device.attributes["product.mtnSorCategoryCompatabilityMap"][0];
                deviceCompatible = deviceCompatibleList[gwSelectedMtn];
                annualUpgradeDeviceCompatible= !(selectedMtnList.mtnDetailVO.deviceCategoryCode == "UO" && !deviceCompatible && !isBuyout );  
            };

 						/*console.log("dv annual upgrade device compatible? : "+annualUpgradeDeviceCompatible);*/

            var cqContent = this.options.cqContent;
            this.creditOptionSelected = this.options.isCreditOptionSelected;
            this.model.set({
                BACK_ORDER_LBL: cqContent.label.BACK_ORDER_LBL,
                PRE_ADD_TO_CART_LBL: cqContent.label.PRE_ADD_TO_CART_LBL,
                OUT_OF_STOCK_LBL: cqContent.label.OUT_OF_STOCK_LBL,
                ANNUAL_UPGRADE_DEV_COMPATIBLE: annualUpgradeDeviceCompatible
            });
            
            this.model.on('change', this.render, this);
            this.pageType=this.options.pageType;
            if (gridwallJSON.gridwallContent.compareList.innerCompareList){
                var gridwallCompare = gridwallJSON.gridwallContent.compareList.innerCompareList;
                for(i = 0; i < gridwallCompare.length; i++){
                    if(device.currentSku == gridwallCompare[i].skuid){
                        //because this element does not exist until render has run
                        setTimeout(function(){
                            $("div.gridwallTile_wrapper [data-skuid='" + device.currentSku  +"'] input.c-compare-device").change();
                        },0)
                    }
                }
            }
            this.displayDiscountPercentage();
        },
        attributes: {
            class: 'gridwallTile_wrapper'
        },
        events: {
            'click a.gridwallTile_colorSwatch': 'onColorChange',
            'click .gridwallTile': 'pdpRedirection',
            'click .c-compare-device-label': 'preventBubbling',
            'click .c-compare-device': 'preventBubbling',
            'change .c-compare-device': 'compareDevice'
        },
        render: function() {
            this.$el.html(this.template({
                device: this.model.toJSON(),
                creditOptionSelected: this.options.creditOptionSelected,
                iscreditOptionsAvailable: this.options.iscreditOptionsAvailable,
                selectedCreditOption: this.options.isCreditOptionSelected
            }));
                var device = this.model.toJSON();

                
                    var product= device.attributes;
					//f(product['product.sedOfferEndDate']!=null  && this.pageType==true){

                    if(typeof(product['product.sedOfferEndDate']) !="undefined"   && product['product.sedOfferEndDate']!=null){
                    
                   if(product['product.repositoryId'] !== "" && product["product.repositoryId"][0] !== "" && (typeof product["product.repositoryId"][0] !== "undefined")){
                            this.productId=product['product.repositoryId'][0];
                   }
                var secondDate=new Date(product['product.sedOfferEndDate'][0]);
                var firstDate=new Date();
                this.count= Math.round((secondDate.getTime()-firstDate.getTime())/1000);
                 var   self=this;
                 if(secondDate.getTime()-firstDate.getTime()>0){
                 this.counter= setInterval(function(){
                       // console.log('inside count'+self.count);
                    if (parseInt(self.count) <= 0) {
                            temp="00:00:00";
                          $('.timer').html("Ends in  "+temp);
                        clearInterval(self.counter);

                        return;
                    }
                    var sec_num = parseInt(self.count, 10); // don't forget the second parm
                        var hours = Math.floor(sec_num / 3600);
                        var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
                        var seconds = sec_num - (hours * 3600) - (minutes * 60);

                        if (hours < 10) {
                            hours = "0" + hours;
                        }
                            days="";
                         if (hours > 24) {
                              days= Math.floor(hours/24)+"d ";
                              hours=hours%24;

                              if(hours < 10){
                                 hours = "0" + hours ;
                             }
                           
                        }
                        if (minutes < 10) {
                            minutes = "0" + minutes;
                        }
                        if (seconds < 10) {
                            seconds = "0" + seconds;
                        }
                       /* var time = days +':'+hours + ':' + minutes + ':' + seconds;*/
                         time = days + hours + ':' + minutes + ':' + seconds;
                            temp=time;

                   // console.log('inside  after count'+self.count);
                       self.count = (parseInt(self.count) - 1).toString();
                       var ele="."+self.productId+'_timer';
                       $(ele).html("Ends in  "+temp);

            }, 1000);

}
                    }
            return this;
        },
        onColorChange: function(e) {
            e.preventDefault();
            e.stopPropagation();
            var targetData = $(e.target).data();
            this.model.set('currentSku', targetData.skuid + '');
            this.model.set('inventoryStatus', targetData.inventory + '');
            this.model.set('inventoryAvailDate', targetData.availdate + '');
            this.displayDiscountPercentage();
        },
        displayDiscountPercentage: function(){
            var records = this.model.get('records'),attributes = null; 
            for (var i in records) {
                deviceSkuId = records[i].attributes['sku.id'];
                var currentSkuId = this.model.get('currentSku');
                if(deviceSkuId == currentSkuId){                   
                    var attributes=records[i].attributes['sku.gridwallDeviceSkuPriceVO'];                             
                }  
            }
            this.model.set({'discountPercentage': attributes[0].discountPercentage});  
        },
        pdpRedirection: function(e) {
            e.preventDefault();

            var locationHref = null;

            if (typeof $(e.target).data('pdpurl') !== 'undefined') {
                locationHref = $(e.target).data('pdpurl');
            } else {
                locationHref = $(e.target).closest('.gridwallTile').data('pdpurl');
            }
            
            if (typeof this.options.model.attributes.ANNUAL_UPGRADE_DEV_COMPATIBLE !== 'undefined' && this.options.model.attributes.ANNUAL_UPGRADE_DEV_COMPATIBLE == false) {
                this.launchEarlyUpgradeModal();
            } else {
                location.href = locationHref;
            }
        },
        preventBubbling: function(e) {
            e.stopImmediatePropagation();
        },
        compareDevice: function() {
            this.model.set('compare', !this.model.get('compare'));
        },
        launchEarlyUpgradeModal: function() {
        	var _this = this;
        	var selectedSku = this.model.get("currentSku");
        	var productId = this.model.get("attributes")['product.repositoryId'][0];
        	var inventoryStatus = this.model.get("inventoryStatus");
        	var sessionConf = this.model.get("dynSessionConf");
			var selectecContractTerm = this.model.get("selectedContractTerm");
			var contractTerm = "0";
			
			if(selectecContractTerm === ".edge-monthly-price") {
				contractTerm = "99";
			} else if(selectecContractTerm === ".two-year-price") {
				contractTerm = "24";
			}
					
            ModalClass.modal(earlyUpgradeModal, {
                type: 'colorbox',
                close: 'icon'
            }, function() {
                //openCallback
                $(".modal-content .c-continue").on("click", function() {
                   $("body").loader().showMe();
                   $.ajax({
                   		url: "/postpayservices/model/atg/commerce/order/purchase/CartModifierActor/undoEdgeBuyOutAndAddDeviceInfo",
                   		"method": "POST",
                   		data: {
                   			_dynSessConf:sessionConf,
                   			catalogRefIds: selectedSku,
                   			productId: productId,
                   			quantity:"1",
                   			contractTerm: contractTerm,
                   			motomakerToken:""
                   		},
                   		"success": function(data) {
                   			data = data.outputMap;
                   			//window.location = data.successUrl;
                   			setTimeout(function(){
                   				_this.edgeUpBuyoutAjaxCall();
                   				
                   			},0);
                   		},
        				"error": function(data) {
        					data = data.outputMap;
                   			window.location = data.errorUrl;
        				}
                   });
                });
                $('.modal-content .c-abandon').on('click', function() {
                	ModalClass.closeModal();
                	if(window.location.href.indexOf("upgradegridwall.jsp") == -1) {
                 	   window.location.href = window.top.location.protocol+"//"+window.top.location.host+"/vzw/desktop/common/upgradegridwall.jsp";
                     }
                });
            });
        },
        
        edgeUpBuyoutAjaxCall: function(){
        	$.ajax({
           		url: "/postpayservices/model/atg/commerce/order/purchase/CartModifierActor/edgeUp",
           		"method": "POST",
           		"success": function(data) {
           			data = data.outputMap;
           			window.location = data.successUrl;
           		},
				"error": function(data) {
					data = data.outputMap;
           			window.location = data.errorUrl;
				}
           });
        }
    });
});
