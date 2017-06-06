/*  Filters View    */

define(['underscore', 'backbone', 'text!templates/gw/filterTemplate.html', 'views/gw/lpChatView', 'constants'], function(_, Backbone, FilterTemplate, LpChatView, Constants) {
    var FiltersView = Backbone.View.extend({
        el: '#c-filters',
        initialize: function() {
            this.results = this.model.get('results');
            this.render();
            this.initialFilterDisplay();
        },
        events: {
            "change .c-filterCtrl": "onFilterChange",
            "change .c-filterAjaxCtrl": "onAjaxFilterChange",
            "click .c-filter-header": "expCollapse",
            'click .c-filter-header span': 'delegateClick',
            'click .c-filter-display': 'toggleFilterDisplay'
        },
        template: _.template(FilterTemplate),
        render: function() {
            var filtersObj = {
                refinements: this.model.get("filtersAndBreadcrumb").filtersAndBreadcrumbContent,
                selectedContractFilter: '',
                constants: Constants.GW
            };

            if (this.model.get("promos")["promotions"]["contractFilterContainer"] !== undefined) {
                var contractFilterObj = _.indexBy(this.model.get("promos").promotions.contractFilterContainer, 'sort');
                var selectedContractFiter = _.findWhere(this.model.get("promos").promotions.contractFilterContainer, {
                    selected: true
                });

                if (this.results.isIntentDecided === "EUP" && this.results.isUpgradeGridWall === true) {
                    selectedContractFiter = "&contractPickerSelect=" + selectedContractFiter.value;
                } else {
                    selectedContractFiter = "";
                }

                filtersObj = $.extend(filtersObj, {
                    contractFilter: contractFilterObj,
                    selectedContractFilter: selectedContractFiter,
                    intent: this.results.isIntentDecided
                });
            }
            this.$el.html(this.template(filtersObj));
            this.hideExtrafilters();
        },
        onAjaxFilterChange: function(e) {
            var $target = $(e.currentTarget),
                params = {},
                deviceNo = this.results.pagination.paginationValues["NoForPage" + this.results.pagination.paginationValues.pageNum] - 1;
			
			document.cookie="creditRangeOptionsSelected=no";
            if ($target.data("nav-state") === ".prepaid") {
                window.location.href = $target.data('url');
                return;
            }

            if ($(".c-paymentFilter").length) {
                params.contractPickerSelect = $('.c-paymentFilter:checked').data('navState');
            }

            if (this.results.isIntentDecided === "EUP" && this.results.isUpgradeGridWall === true) {
                window.location = String(this.results.currentNavState) + '&' + $.param(params);
            } else {
                params.pageName = String(this.results.currentNavState).toLowerCase();

                //persisting to the current page 
                params.No = deviceNo.toString();
                params.pageNum = this.results.pagination.paginationValues.pageNum;

                document.chatEl = document.chatEl || $('.gwLP_ChatWrapper').detach();
                this.model.fetch({
                    data: $.param(params),
                    type: "POST"
                });
            }
        },
        onFilterChange: function(evt) {
            var $target = $(evt.currentTarget);
            // Changed for SEO issue
            (typeof $target.data("navState") !== 'undefined') && (window.location.href = $target.data('navState'));
        },
        delegateClick: function(e) {
            $(e.target).parent().trigger('click');
        },
        expCollapse: function(e) {
            var $element = $(e.target),
                $iconContainer = $(e.target).find('span');
            $element.parent().next().animate({
                height: "toggle"
            }, function() {
                if ($iconContainer.hasClass('font-icon_minus')) {
                    $iconContainer.removeClass('font-icon_minus').addClass('font-icon_plus');
                } else {
                    $iconContainer.removeClass('font-icon_plus').addClass('font-icon_minus');
                }
            }).removeClass('is-hidden');
        },
        hideExtrafilters: function() {
            $('.plainList', '.gwFilterOptions').each(function() {
                var $this = $(this);
                if ($this.find('li.is-hidden').length) {
                    $this.find('li.is-hidden').attr('data-display-toggle', true);
                    $this.find('li.c-filter-display').data('shown', false);
                } else {
                    $this.find('li.c-filter-display').remove();
                }
            });
        },
        toggleFilterDisplay: function(e) {
            var $this = $(e.currentTarget),
                $filtersToToggle = $this.parent().find('li[data-display-toggle="true"]');
               
            if ($this.data('shown')) {
                $filtersToToggle.addClass('is-hidden');
                $this.data('shown', false).text($this.data('showMoreLabel'));
            } else {
                $filtersToToggle.removeClass('is-hidden');
                $this.data('shown', true).text($this.data('showLessLabel'));                
            }
        },

        initialFilterDisplay: function() {
         var collapse = 'collapse';
         var collapseItems = $('.gridwallFilter_wrapper').find("[data-toggle='" + collapse + "']");
         collapseItems.find('.font-icon_minus').removeClass('font-icon_minus').addClass('font-icon_plus');
         collapseItems.next().hide();
     }

    });
    return FiltersView;
});