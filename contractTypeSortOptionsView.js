/*  SortOptions View    */

define(['underscore', 
    'backbone', 
    'helpers/selectPicker',
     'text!templates/gw/contractTypeSortOptionsTemplate.html'], function(_, Backbone, selectPicker, contractTypeSortOptionsTemplate) {
    var SortOptionsView = Backbone.View.extend({
        el: '#contract-options',
        initialize: function() {
            this.render();
        },
        events: {
            'change select': 'sortContract'
        },
        template: _.template(contractTypeSortOptionsTemplate),
        render: function() {
            var self = this;

            this.$el.html(this.template({
                "sortOptions": self.getTemplateData(),
                 pageType:self.model.get('pageType').isHolidayPage

            }));
            this.initSelectPicker();
            
        },
        getTemplateData: function() {
            var filteredSortedOpts = this.model.get("contractFilter");
            return filteredSortedOpts;
        },
        sortContract: function() {
           /* var contractPickerSelect = "";
            if ($(".c-paymentFilter").length) {
               contractPickerSelect = "&contractPickerSelect="+$('.c-paymentFilter:checked').data('navState');
            }
*/
          console.log('location'+this.$el.find('#contract-options').val());
        window.location = this.$el.find('#sortContract').val();
            

            
        },
         initSelectPicker: function() {
            $('#sortContract').selectpicker();
            $('.filter-option', '#contract-options').addClass('bold');
        }

    });

    return SortOptionsView;
});
