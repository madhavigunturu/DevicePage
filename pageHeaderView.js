/*  LinkText View   */

define([
    'jquery',
    'underscore',
    'backbone',
    'views/gw/linkTextMainView',
    'views/gw/breadCrumbView',
    'views/gw/sortOptionsView',
	'views/gw/progressBarEUPView',
    'views/gw/contractTypeSortOptionsView'
], function ($, _, Backbone,LinkTextMainView, BreadcrumbView, SortOptionsView, ProgressBarEUPView, contractTypeSortOptionsView) {
    var PageHeaderView = Backbone.View.extend({
        tagName: 'li',
        initialize: function () {
            this.render();
             
        },
        render: function(){
            var linkContainerArr = this.model.get("promos")["promotions"]["linkTextContainer"];
            if(typeof linkContainerArr !== typeof undefined){
                var linkTextView = new LinkTextMainView({
                collection:new Backbone.Collection(this.model.get("promos")["promotions"]["linkTextContainer"]['linkContainer'])
                });
                $("#c-link-text").prepend(linkTextView.render().el);

            }
            
			var isEUPFlow = (this.model.get("results")["mtnDetailsVOList"] != null && this.model.get("results")["mtnDetailsVOList"].length != 0) ? true : false;
			if(isEUPFlow ){
				var progressBarEUPView = new ProgressBarEUPView({
					model : this.model
				});
			}

            new SortOptionsView({
               model:this.model
            });


if ((this.model.get('pageType').isHolidayPage!=null) && (this.model.get('pageType').isHolidayPage==true && !$.isEmptyObject(this.model.get('contractFilter'))  )){
            new contractTypeSortOptionsView({
                model:this.model
            });

}
			if(typeof this.model.get("promos")["promotions"]["refinementContainer"] !== 'undefined'){
				var breadcrumbView = new BreadcrumbView({
					collection:new Backbone.Collection(this.model.get("promos")["promotions"]["refinementContainer"]['refinementCrumbs'])
				});				
			}

        }
        
    });

    return PageHeaderView;
});