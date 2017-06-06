/*  PaymentOptions View   */

define([
    'underscore',
    'backbone',
    'hbs!templates/gw/paymentOptionsTemplate'
], function(_, Backbone, PaymentOptionsTemplate) {
    var PaymentOptionsView = Backbone.View.extend({
        el: '#c-contractFilter',
        initialize: function() {
			this.results = this.model.get('results');
			this.render();
        },
        events: {
            "change .c-filterAjaxCtrl": "onAjaxFilterChange"
        },
        template: PaymentOptionsTemplate,
        render: function() {
			var filtersObj = {
                selectedContractFilter: '',
            };

			var self = this;

			if (self.model.get("availableContractFilter").availableContractsMap !== undefined) {
                var contractFilterObj = _.sortBy(self.model.get("availableContractFilter").availableContractsMap, 'sort');
				var selectedContractFiter = _.find(self.model.get("availableContractFilter").availableContractsMap, {
                    selected: true
                });

				filtersObj = $.extend(filtersObj, {
					contractFilter: contractFilterObj,
					selectedContractFilter: selectedContractFiter
				});
			}

			if(filtersObj){
				self.$el.html(self.template(filtersObj));
			}
            return this;
        },
        onAjaxFilterChange: function(e) {
			var $target = $(e.currentTarget);

			if ($target.data("nav-state") !== ".prepaid") {
				var selectedContract = $target.data("nav-state");
				$.post('/prepayservices/model/com/vzw/pp/rest/browse/GridwallActor/gridwallSelectPaymentOption?selectedContract='+selectedContract, function() {
				}).always(function() {
					window.location.href = $target.data('url');
					return;
				});
            }
		}
    });
    return PaymentOptionsView;
});