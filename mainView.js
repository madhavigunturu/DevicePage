/*  GWGrid View */

define([
    'underscore', 
    'backbone', 
    'loader', 
    'views/gw/pageHeaderView', 
    'views/gw/creditRangeView',
    'views/gw/breadBoxView', 
    'views/gw/filtersView', 
    'views/gw/devicesView', 
    'views/gw/earlyUpgradeModalView',   
    'text!templates/gw/gwMain.html', 
    'helpers/devicedetect', 
    'views/gw/lpChatView', 
    'helpers/minicart',
    'betterTooltip',
    'timer',
    'views/timeout/sessionTimeoutView',
    'globalEvents'
], function(_, Backbone, Loader, PageHeaderView, CreditRangeView, BreadBoxView, FiltersView, DevicesView, EarlyUpgradeModalView, GWMainTemplate, DeviceDetect, LpChatView, minicart, BetterTooltip,  timer, SessionTimeoutView, GlobalEvents) {

    var MainView = Backbone.View.extend({
        el: '#pageWrapper',
        initialize: function() {
            this.listenTo(this.model, "change", this.onModelChange);
        },
        onModelChange: function() {
            this.render();
        },
        template: _.template(GWMainTemplate),
        events: {
            "click .o-feature-text-description-close": "closeLinkTextDescription",
            "click .d-prequalify-clear": "resetPreQualifyMsg"
            
        },
        render: function() {
            this.$el.html(this.template(this.model.toJSON()));
            this.cQContentModel = this.model.get("cqContent");
            this.renderPartialViews();
            this.stickyUpgradeBar();
            this.getPromos();
            new LpChatView();
            new SessionTimeoutView();
            new EarlyUpgradeModalView();
            //minicart count update
//            minicart.init();
            //hide loader on loading all partials
            $(document.body).loader().hideMe();
            //Temporary SEO related code

 if(!_.isUndefined(this.model.get('promos')) && !_.isNull(this.model.get('promos')) 
    && !_.isUndefined(this.model.get('promos').promotions) && !_.isNull(this.model.get('promos').promotions) 
    && !_.isUndefined(this.model.get('promos').promotions.refinementContainer) && !_.isNull(this.model.get('promos').promotions.refinementContainer)
    && !_.isUndefined(this.model.get('promos').promotions.refinementContainer.holidayImageUrl)
    && !_.isNull(this.model.get('promos').promotions.refinementContainer.holidayImageUrl)
    && this.model.get('promos').promotions.refinementContainer.holidayImageUrl) {
        var imageURL =this.model.get('promos').promotions.refinementContainer.holidayImageUrl[0];
      $('#breadCrumbHeaderWrapper').css('background-image', 'url('+imageURL+')');
            $('#breadCrumbHeader').addClass('span_5_of_12');
            $('#lpVoiceChatHeader').addClass('span_5_of_12');
            $('#lpVoiceChatHeader').css('float','left');

    }

                
            if (this.model.get("commonConfiguration").commonConfiguration.triggerSnapshotAJAX) {
                var _self = this;
                setTimeout(function() {
                    //remove the DIV related to JSON                    
                    $('#serviceContentId').remove();
                    $('#hideNavs').remove();
                    var pageSnapshot  = $('html').clone();
                                        $('#seo_noscript', pageSnapshot).remove();
                                        $('script[src*="mbox"]', pageSnapshot).remove();  
                                        
                                        if ($('.creditOptions_header').length) {                                            
                                            $(pageSnapshot).find('.creditOptions_header').remove();
                                        }
                                        
                                        
                                        
                    //Added for glocal NAV                  
                    $(pageSnapshot).find('#desktopOmniNav').addClass('vgn_nojs');
                    
                    //Defect-33280 fix
                    $(pageSnapshot).find('a.checkbox label[for]').removeAttr('for');
                    
                    if ($('.gridwallPromoSLinks').length) {                             
                        $(pageSnapshot).find('.gridwallPromoSLinks').remove();
                    }
                    if ($('#hideHidNavs').length) {                             
                        $(pageSnapshot).find('#hideHidNavs').remove();
                    }
                    var data = $(pageSnapshot).html(),
                   // var data = $('html').html(),
                    pageUrl = window.location.pathname,
                    sessConfNo = null;
                        
                    if (typeof _self.model.get("commonConfiguration").commonConfiguration.sessionConfirmationNumber !== typeof undefined && _self.model.get("commonConfiguration").commonConfiguration.sessionConfirmationNumber !== "") {
                        sessConfNo = _self.model.get("commonConfiguration").commonConfiguration.sessionConfirmationNumber;
//                        console.log("gridwall sessionConfirmationNumber : " + sessConfNo);
                    } else {
                        sessConfNo = document.cookie.split('_dynSessConf=')[1].split(':')[0];
//                        console.log("Cookie sessionConfirmationNumber : " + sessConfNo);
                    }
                    $.ajax({
                        url: "/postpayservices/model/com/vzw/rest/common/HtmlCacheActor/htmlCache",
                        type: "post",
                        data: {
                            pageUrl: pageUrl,
                            htmlContent: data,
                            _dynSessConf: sessConfNo
                        },
                        success: function() {
//                            console.log("success")
                        pageSnapshot = "";
                        data = "";
                        },
                        error: function() {
//                            console.log("error")
                        pageSnapshot = "";
                        data = "";
                        }
                    });
                   // $('#desktopOmniNav').removeClass('vgn_nojs');
                }, 10000);
            }
            //Temporary SEO related code

            // Global Nav - Moving to render along with other sections
            if (window.render && window.App && App.omninav.footer.init) {
                render('globalNavId');
                App.omninav.footer.init();
            }
            var navHiddenStyle = document.getElementById('hideNavs');
            navHiddenStyle && document.body.removeChild(navHiddenStyle);
            setTimeout(minicart.init, 1000);
            
            $('.tooltip').betterTooltip({hover: true});
            document.cookie="creditRangeOptionsSelected=no";
            return this;
        },
        renderPartialViews: function() {
            var self = this;

            new PageHeaderView({
                model: this.model
            });
          
            new CreditRangeView({
                model: this.model,
                sessionConfirmationNumber: this.model.get('commonConfiguration').commonConfiguration.sessionConfirmationNumber
            });
            
            // we are enabling the breadbox for holiday pages - please do not comment or remove it
//            var holidayPage = window.location.pathname;
//            if ((self.model.get("filtersAndBreadcrumb").filtersAndBreadcrumbContent.breadBox !== null) && (holidayPage.indexOf("landingpages") > -1)) {
     if(self.model.get("filtersAndBreadcrumb")["filtersAndBreadcrumbContent"]["breadBox"]!=null){
                new BreadBoxView({
                    model: self.model,
                    collection: new Backbone.Collection(self.model.get("filtersAndBreadcrumb").filtersAndBreadcrumbContent.breadBox.refinementBreadBox)
                });
            }
//            }
            new FiltersView({
                model: this.model
            });


            var creditOptionsAvailability = this.model.get('results').creditOptionsAvailability;

            var selectedCreditOption = null;

            if (creditOptionsAvailability !== null) {
                selectedCreditOption = creditOptionsAvailability.selectedCreditOption;
            }
            new DevicesView({
                model: this.model,
                cqContent: this.cQContentModel,
                selectedCreditOption : selectedCreditOption
            });

            //footnote
            var footNote = self.model.get("results")["footNotes"];
            if (typeof footNote !== typeof undefined && typeof footNote["footNotesValues"] !== typeof undefined) {
                this.$el.find(".c-footerNotes").html(footNote["footNotesValues"]["content"]);
            }
            return this;
        },
        resetPreQualifyMsg : function(evt) {
            
             evt.preventDefault();
             var sessConfNo = null;
             if (typeof this.model.get("commonConfiguration").commonConfiguration.sessionConfirmationNumber !== typeof undefined && this.model.get("commonConfiguration").commonConfiguration.sessionConfirmationNumber !== "") {
                 sessConfNo = this.model.get("commonConfiguration").commonConfiguration.sessionConfirmationNumber;
             } else {
                 sessConfNo = document.cookie.split('_dynSessConf=')[1].split(':')[0];
             }              
             $.ajax({
                 url: "/postpayservices/model/atg/commerce/order/purchase/CartModifierActor/clearCartPrequalify",
                 type: "post",
                 data: {                                  
                      _dynSessConf: sessConfNo
                 },
                 success: function() {                  
                     location.reload();
                 },
                 error: function() {
                     location.reload();
                 }
             });
        
        },
        closeLinkTextDescription: function(evt) {
            evt.preventDefault();
            $('.o-feature-text-description-close').hide();
            $('#c-linkTextDescription').html('');
        },        
        stickyUpgradeBar: function() {
            var $upgradeBar = $(".c-upgradeBar"),
                initialPos = $upgradeBar.length && $upgradeBar.offset().top || 0;

            $(window).scroll(function() {
                if (window.pageYOffset >= initialPos) {
                    $upgradeBar.css({
                        position: 'fixed',
                        backgroundColor: '#f6f6f6',
                        zIndex: '999999',
                        width: "940px",
                        top: '0'
                    });
                } else {
                    $upgradeBar.css({
                        position: 'static',
                        backgroundColor: 'rgba(0, 0, 0, 0)'
                    });
                }
            });
                 },
             getPromos: function() {
        

      //  console.log(this.model.get('results').timerContent.targetDate)

        
      

if(this.model.get('results').timerContent !=null) {

            var dt=new Date(this.model.get('results').timerContent.targetDate);
               console.log( dt.getDate());
        console.log( dt.getMonth());
        console.log( dt.getFullYear());

             
              /*       $('#countdown_dashboard').countDown({
                                                    targetDate: {
                                                        'day':     27,
                                                        'month':    11,
                                                        'year':     2016,
                                                        'hour':    0,
                                                        'min':     0,
                                                        'sec':      0
                 }
            });*/
         
                     $('#countdown_dashboard').countDown({
                                                    targetDate: {
                                                        'day':      dt.getDate(),
                                                        'month':    dt.getMonth()+1,
                                                        'year':     dt.getFullYear(),
                                                        'hour':     dt.getHours(),
                                                        'min':      dt.getMinutes(),
                                                        'sec':      dt.getSeconds()
                                                    }
            });

                 }

    }});

    return MainView;
});
