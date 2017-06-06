/*  SortOptions View    */

define(['underscore', 'backbone', 'helpers/selectPicker', 'text!templates/gw/sortOptionsTemplate.html'], function(_, Backbone, selectPicker, SortOptionsTemplate) {
    var SortOptionsView = Backbone.View.extend({
        el: '#sort-options',
        initialize: function() {
            this.render();
        },
        events: {
            'change select': 'sortDevices'
        },
        template: _.template(SortOptionsTemplate),
        render: function() {
            var self = this;

            this.$el.html(this.template({
                "sortOptions": self.getTemplateData(),
                pageType:self.model.get('pageType').isHolidayPage
            }));
            this.initSelectPicker();
        },
        getTemplateData: function() {
            var filteredSortedOpts = this.model.get("results")["sortOptions"];

            var CPO_str = "Certified Pre-Owned";

            if(this.model.get("filtersAndBreadcrumb")["filtersAndBreadcrumbContent"]["breadBox"]!=null){

				var gridwallType = _.filter(this.model.get("filtersAndBreadcrumb")["filtersAndBreadcrumbContent"]["breadBox"]["refinementBreadBox"], {
					"label": CPO_str
				});

			}
            var selectedPaymentOpt;

            if (typeof this.model.get("promos")["promotions"]["contractFilterContainer"] !== typeof undefined) {
                var paymentOpts = this.model.get("promos")["promotions"]["contractFilterContainer"];
                
                if (paymentOpts.length > 1) {
                    //select payment option with selected:true
                    if (typeof _.findWhere(paymentOpts, {
                        "selected": true
                    }) !== typeof undefined) {
                        selectedPaymentOpt = String(_.findWhere(paymentOpts, {
                            "selected": true
                        })["value"]).replace(".", "");
                    } else {
                        //if current gridwall is CPO, make "Full Retail Price" as default payment 
                        var paymentOptObj;
                        if (gridwallType.length > 0) {
                            paymentOptObj = _.findWhere(paymentOpts, {
                                "value": ".full-retail-price"
                            });
                            selectedPaymentOpt = String(paymentOptObj["value"]).replace(".", "");
                        } else { //if current gridwall is not CPO, make "Monthly Payment" as default payment     
                            paymentOptObj = _.findWhere(paymentOpts, {
                                "value": ".edge-monthly-price"
                            });
                            selectedPaymentOpt = String(paymentOptObj["value"]).replace(".", "");
                        }
                    }
                } else if (paymentOpts.length === 1) {
                    paymentOpts[0].selected = true;
                    selectedPaymentOpt = String(paymentOpts[0].value).replace(".", "");
                }
            } else {
                //if current gridwall is CPO, make "Full Retail Price" as default payment 
                if(gridwallType !=null){
                if ( gridwallType.length > 0) {
                  //  console.log('inside');
                    selectedPaymentOpt = "full-retail-price";
                } else {
                    selectedPaymentOpt = "edge-monthly-price";
                }
            }
            }

            var sortOptionsIndexesCollection = this.model.get("results")["sortOptionsIndexes"];
			
            if(this.model.get('results').hasOwnProperty('sortbyPriceName') && (String(this.model.get("results")["sortbyPriceName"])) === "monthly-payment"){
                selectedPaymentOpt = "edge-monthly-price";
            }else if(this.model.get('results').hasOwnProperty('sortbyPriceName') && (String(this.model.get("results")["sortbyPriceName"])) === "full-price"){
                 selectedPaymentOpt = "full-retail-price";
            }else if(this.model.get('results').hasOwnProperty('sortbyPriceName') && (String(this.model.get("results")["sortbyPriceName"])) === "see-all"){
                selectedPaymentOpt = "combined-deals-price";
            }

            if(typeof selectedPaymentOpt !== typeof undefined){
				// console.log('selectedPaymentOpt'+selectedPaymentOpt);
				var sortOptionsIndexArr = String(sortOptionsIndexesCollection[selectedPaymentOpt]).split(',');
			}

            sortOptionsIndexArr = _.map(sortOptionsIndexArr, function(num) {
                return parseInt(num);
            });

            filteredSortedOpts = _.filter(this.model.get("results")["sortOptions"], function(model, index) {
                return (sortOptionsIndexArr.indexOf(index) !== -1);
            });
			
			this.filteredSortedOpts = filteredSortedOpts; 

            return filteredSortedOpts;
        },
        sortDevices: function() {
            var contractPickerSelect = "";
            if ($(".c-paymentFilter").length) {
               contractPickerSelect = "&contractPickerSelect="+$('.c-paymentFilter:checked').data('navState');
            }

            if(this.model.get("results")["isIntentDecided"] === "EUP" && this.model.get("results")["isUpgradeGridWall"] === true){
                window.location = this.$el.find('#sortDevices').val()+contractPickerSelect;
            }else{
            	if(this.$el.find('#sortDevices').val().indexOf("?")!=-1){
            		window.location = this.$el.find('#sortDevices').val()+((this.$el.find('#sortDevices').val()!=undefined)?"&sortedValue="+this.getSortedValue(this.$el.find('#sortDevices').val()):'');
            	}else{
            		window.location = this.$el.find('#sortDevices').val()+((this.$el.find('#sortDevices').val()!=undefined)?"?sortedValue="+this.getSortedValue(this.$el.find('#sortDevices').val()):'');
            	}
            }
           
        },
		getSortedValue: function (sortedValue) {
			var sorted;
			
			sorted = _.findLastIndex(this.filteredSortedOpts, {
				navigationState: sortedValue
			});
			
			return parseInt(sorted)+1;
		},
		getQueryParams: function (qs) {
			qs = qs.split('+').join(' ');
			var params = {},
				tokens,
				re = /[?&]?([^=]+)=([^&]*)/g;
				
			while (tokens = re.exec(qs)) {
				params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
			}

			return params.sortedValue;
		},
        initSelectPicker: function() {
			if(window.location.href.indexOf("sortedValue")>0){
				var selectedValue = this.getQueryParams(window.location.href);
				$('#sortDevices').prop('selectedIndex', selectedValue).selectpicker('refresh');
			} else {
				$('#sortDevices').selectpicker();
			}
            $('.filter-option', '#sort-options').addClass('bold');
        }
    });

    return SortOptionsView;
});
