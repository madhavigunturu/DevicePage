define([
    'underscore',
    'backbone',
    'text!templates/gw/earlyUpgradeModalTemplate.html',    
    'helpers/modal'
], function(_,Backbone,earlyUpgradeModalTemplate,ModalHelper){
	var earlyUpgradeModalView = Backbone.View.extend({
		el:"#earlyUpgradeModal",
		earlyUpgradeModalTemplate :_.template(earlyUpgradeModalTemplate),
		initialize:function(options){
			var self = this;
			/*self.datasrc = typeof options !== typeof undefined ? options.datasrc  : checkoutJson;*/
			self.datasrc = {
					"cqContent" : {
						"html":{
							"ONE_CLICK_NO_ACTIVITY_TIME_OUT": "ONE_CLICK_NO_ACTIVITY_TIME_OUT",
							"ONE_CLICK_TIMED_OUT": "ONE_CLICK_TIMED_OUT"
						},
						"label":{
							"ONE_CLICK_HOMEPAGE_LBL": "ONE_CLICK_HOMEPAGE_LBL",
							"ONE_CLICK_STILL_HERE_LBL": "ONE_CLICK_STILL_HERE_LBL"
						}
					}
				};
			self.render();
		},
		events:{
			'click .c-continuezzzzzz' : 'submitForm',
			'click .c-abandonzzzzzzzzzz': 'closeOverlay'
		},

		submitForm:function(evt){
			evt.preventDefault();
			console.log('this will submit the form');
			if($('#formId').length){
				$('#formId').submit();
			}					
		},
		
		closeOverlay:function(evt){
			evt.preventDefault();
			ModalHelper.closeModal();			
			console.log('	ModalHelper.closeModal();	');	
		},

		render:function(){
			var self = this;
			self.$el.append(self.earlyUpgradeModalTemplate(self.datasrc));
		},

		showOverlay:function(){
			var self = this;
			self.$el.undelegateEvents();
			self.modalObj = ModalHelper.modal(self.$el, {
                type: 'colorbox',
                close: 'icon'
            },function(){
            	self.delegateEvents();// ? see what this does
            },function(){
            });
		}
	});
	return earlyUpgradeModalView;
});