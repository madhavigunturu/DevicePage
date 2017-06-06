/*  PageHeader View   */

define([
    'jquery',
    'underscore',
    'backbone',
	'views/gw/linkTextMainView',
    'views/gw/breadCrumbView',
    'views/gw/freeShippingView'
], function ($, _, Backbone, LinkTextMainView, BreadcrumbView, FreeShippingView) {
    var PageHeaderView = Backbone.View.extend({
        tagName: 'li',
        initialize: function () {
            this.render();
        },
        render: function(){
			var linkContainerArr = this.model.get("promos").promotions.linkTextContainer;
            if(typeof linkContainerArr !== undefined){
                var linkTextView = new LinkTextMainView({
                collection:new Backbone.Collection(this.model.get("promos").promotions.linkTextContainer.linkContainer)
                });
                $("#c-link-text").prepend(linkTextView.render().el);

            }
			
            if(typeof this.model.get("promos").promotions.refinementContainer !== 'undefined'){
				new BreadcrumbView({
					collection: new Backbone.Collection(this.model.get("promos").promotions.refinementContainer.refinementCrumbs)
				});				
			}

            if(typeof this.model.get("results").targeters !== 'undefined'){
                new FreeShippingView({
                    model: new Backbone.Model(this.model.get("results").targeters)
                });
            }
		}
    });
	return PageHeaderView;
});