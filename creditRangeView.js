/*  LinkText View   */

define([
    'jquery',
    'underscore',
    'backbone',
    'loader',
    'text!templates/gw/creditRangeTemplate.html'
	
], function ($, _, Backbone,  loader, CreditRangeTemplate) {
    var PageHeaderView = Backbone.View.extend({
    	el: '#c-customer-options-container',
        template: _.template(CreditRangeTemplate),
        events: {
            "change .creditRangeRadio": "onAjaxFilterChange",
            "click .learn-more-link": "toggleCreditRangeText",
            "change .c-runCredit" : "runYourCredit",
            "click .c-login" : "userLogin",
			"click .c-new-customer" : "newCustomerOptions"
        },
        initialize: function (options) {
        	 this.results = this.model.get('results');
             if (typeof $.cookie('myaccount') === 'undefined') {
                this.render();
            } else {
                if ($(".pre-qualify-msg").size() === 0) {
                    $(".creditOptions_header").remove();
                };
            }
            
            this.sessionConfirmationNumber = options.sessionConfirmationNumber; 
        },
        render: function(){
        	if(!_.isUndefined(this.model.get("results")["creditOptionsAvailability"]) && !_.isNull(this.model.get("results")["creditOptionsAvailability"])) {
        		var creditOptionAvailability = this.model.get("results")["creditOptionsAvailability"];
        		var creditOptions = creditOptionAvailability.creditOptionsAvailable;        		
            	var filtersObj = {
                        "creditOptions": creditOptions,
        				"selectedCreditOption": creditOptionAvailability.selectedCreditOption
                    };
            	 this.$el.find("#c-creditOptions-radio-text").html(this.template(filtersObj));
				 
				var creditRangeSelected =  "no";
				if (typeof $.cookie('creditRangeOptionsSelected') != 'undefined' && $.cookie('creditRangeOptionsSelected') != 'undefined') {
					creditRangeSelected = $.cookie('creditRangeOptionsSelected');
				}
				if(creditRangeSelected != 'undefined' && creditRangeSelected != 'null' && creditRangeSelected == "yes"){
					$("#c-customer-options-wrapper").hide();
					$("#c-credit-options-wrapper").show();
				}else {
					$("#c-customer-options-wrapper").show();
					$("#c-credit-options-wrapper").hide();
				}
        	}
        
        },
        toggleCreditRangeText: function(evt) {
            evt.preventDefault();
            var linkObj = $(evt.currentTarget);
            $('#upDownArrow').toggleClass('font-icon_caretDown font-icon_caretUp');
            if($('#upDownArrow').hasClass("font-icon_caretUp")){
            	$(linkObj).html($(linkObj).html().replace("Learn More", "Close"));
            }else{
            	$(linkObj).html($(linkObj).html().replace("Close", "Learn More"));
            }
            $('.creditOptionDesc').slideToggle(500);
        },
        onAjaxFilterChange: function(e) {
        	
        	 var $target = $(e.currentTarget),
             params = {},
             deviceNo = this.results.pagination.paginationValues["NoForPage" + this.results.pagination.paginationValues.pageNum] - 1;
        	 params.pageName = String(this.results.currentNavState).toLowerCase();        	 
        	 params.No = deviceNo.toString();
             params.pageNum = this.results.pagination.paginationValues.pageNum;                            
             params.contractPickerSelectCredit=$target.data("nav-state");
             document.chatEl = document.chatEl || $('.gwLP_ChatWrapper').detach();
			 $.cookie('creditRangeOptionsSelected','yes');
			
            this.model.fetch({
	             data: $.param(params),
	             type: "POST"
         		});
        	

        },
	runYourCredit: function(evt){
		var _self=  this;
		var selectedVal = $(evt.currentTarget).data("nav-state");
		var creditOption = _.find(this.results.creditOptionsAvailability.creditOptionsAvailable,{"creditClass": selectedVal});
	/*	var params = {};
		params.sessionConfirmationNumber = _self.sessionConfirmationNumber;
		params.restSubmissionUrl = creditOption.restSubmissionUrl;
        params.encryptDecryptKeySize = this.results.creditOptionsAvailability.encryptDecryptKeySize;
        params.encryptDecryptItrCount = this.results.creditOptionsAvailability.encryptDecryptItrCount;
		
            $(document.body).loader().showMe();
            $.ajax({
                url: "/vzw/global/preQualifyNow.jsp",
                dataType: "html",
                type: 'post',
                success: function(html) {
                   require(["pages/preQualify"], function(PreQualify){
                         $(document.body).loader().hideMe();
                            PreQualify.init(html, params);
                    });
                    
                }
               
            });*/
            if(selectedVal === "prequalifyNow" ) {
                window.location = creditOption.url;
            }
        },

        userLogin: function(evt){
            var selectedVal = $(evt.currentTarget).data("nav-state");
            var creditOption = _.find(this.results.creditOptionsAvailability.creditOptionsAvailable,{"creditClass": selectedVal});
            if(window.location.protocol !== 'https'){
                window.location = 'https://'+ window.location.host+creditOption.url;
            }else{
                window.location = creditOption.url;
            }
        },
		newCustomerOptions : function(evt){
		    var self = this;
			 
			if($(".c-filterAjaxCtrl:checked").data("nav-state") == ".edge-monthly-price"){
				 $("#c-credit-options-wrapper").show();
				 $("#c-customer-options-wrapper").hide();
			}
		}
        
    });

    return PageHeaderView;
});
