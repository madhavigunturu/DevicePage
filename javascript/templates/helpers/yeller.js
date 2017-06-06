/*Custom handlebar helpers  to be added to this file*/

define(['handlebars'], function ( Handlebars ){
 	'use strict';
	 
		/*Compare*/
		function addFloat(number,options){
			var parsednumber = parseFloat(number);
			if(parsednumber%1 === 0){
				return number.toFixed(2);
			}else{
				return number;
			}
		}
		function ifeq(a, b) {
			if (a == b) {
				return true;
			} else{
				return false;
			}
		}
		function lesserThan (context, options){
			if (context < options.hash.compare) {
				return options.fn(this);
			}
			return options.inverse(this);
		}
		function cq ( option, key, isDecode){
			if(typeof window.cq !== "undefined"){
				var output = "";
				 switch (option) {
					 case "html":
						 output = window.cq.html[key];
						 break;
						 
					case "label":
						 output = window.cq.label[key];
						 break;
					 default:
					 	output = "";
						break;
				 }
				 if(isDecode && isDecode=="true") {
					output = decodeURIComponent(output);
				}
				return (output !== "undefined") ? output : "" ;
			}else{
				return "";
			}
		}

		function greaterThan (context, options) {
			if (context > options.hash.compare) {
				return options.fn(this);
			}
			return options.inverse(this);
		}

		function isEqualTo(context,options){
			if(context === options.hash.compare){
				return options.fn(this);
			}
			return options.inverse(this);
		}
		
		function iffeaturedtechSpecs(value) {
			if(value ==="Standby Time - Up to:" ||  value ==="Usage Time - Up to:" || value ==="Camera" || value ==="Height" ){
				return true;
			} else{
				return false;
			}
		}
		/*compare end*/
		/*Image and Videos*/
		function s7image (value, options) {
			//console.log(value);
			value = value.replace('VerizonWireless/', '');

			return new Handlebars.SafeString('https://ss7.vzw.com/is/image/VerizonWireless/'+value+'?$acc-lg$&amp;fmt=png&amp&bgc=e4e5e3');
		}
		function largeImg(value, options) {
			return new Handlebars.SafeString('https://ss7.vzw.com/is/image/VerizonWireless/'+value+'?$fmt=png$&alpha256&bgc=e4e5e3');
		}
		function s7video(value, options) {
			return new Handlebars.SafeString('https://ss7.vzw.com/is/content/'+value);
		}
		function tagorstar(value){
			var v = value.toLowerCase();
			if(v.indexOf('top seller') !== -1 || v.indexOf('great value') !== -1){
				return new Handlebars.SafeString('star');
			}else{
				return new Handlebars.SafeString('pricetag');
			}
		}
		/*Image and Video*/
		
		
		
		/*conversions*/
		function starRating (param) {			
			if (param) {
				var rating = (Math.round(parseFloat(param) * 2) / 2).toString().split(".");
				rating[1] = rating[1] || '0';
				param = rating[0] + "_" + rating[1];
			}
			return new Handlebars.SafeString(param);
		}
		function date(param) {
			var d = new Date(param);
			return new Handlebars.SafeString((d.getMonth()+1)+'/'+d.getDate()+'/'+d.getFullYear());				
		}
		function inc(value, options) {
			return parseInt(value) + 1;
		}
		function ifdiscount(discountPrice, contractPrice){
			if(parseFloat(discountPrice) < parseFloat(contractPrice) ){
				return true;
			} else{
				return false;
			}
		}
		function wasPrice(discountPrice){
			//console.log(();
			return ((discountPrice/24)*100/100).toFixed(2);
		}
		
		function selectedContract(promotext, selectedSku){
				var selectedContractTerm = [];
				if(promotext.length > 1){
					selectedSku.forEach(function(element) {
					if(element.selected){
						promotext.forEach(function(el) {
							if(el.contractTerm == element.contractTerm){
								selectedContractTerm.push(el);
								
							}
						}, this);
					}
				}, this);
				
			}else{
				selectedContractTerm= promotext;
			}
			return selectedContractTerm;
			
			//return addFloat(Math.round(((discountPrice/24)*100/100).toFixed(2)));
		}
		
		function contractName (conditional, options) {
			if (conditional === 99) {
				return new Handlebars.SafeString('Monthly');
			} else if (conditional === 0) {
				return new Handlebars.SafeString('Retail');
			}
		}
		function percentage(recom, notRecom){
			return (parseInt(recom)/(parseInt(recom)+parseInt(notRecom))*100).toFixed(0);
		}
		function trim(value, options) {
			if(value !== null){
				return value.replace(/\s/g, '_');    
			}
		}
		function groups(every, context, options) {
			var out = "", subcontext = [], i;
			if (context && context.length > 0) {
				for (i = 0; i < context.length; i++) {
					if (i > 0 && i % every === 0) {
						out += options.fn(subcontext);
						subcontext = [];
					}
					subcontext.push(context[i]);
				}
				out += options.fn(subcontext);
			}
			return out;
		}
		function decodeCQContent(str) {	
			return decodeURIComponent(str);
		}
		function unicodeEscape(str) {
			var r = /\\u([\d\w]{4})/gi;
			var s = str.replace(r, function (match, grp) {
   			 	return String.fromCharCode(parseInt(grp, 16)); 
			});
			return s.replace(/\\/g, '');
		}
		function escapeCQContent(str) {
		    return _.unescape(str);
		}
		/*conversions end*/
		
		Handlebars.registerHelper('decodeCQContent', decodeCQContent);
		Handlebars.registerHelper("trim", trim);
		Handlebars.registerHelper('group', groups);
		Handlebars.registerHelper("recommendedPercentage", percentage);
		Handlebars.registerHelper('contractName', contractName);
		Handlebars.registerHelper("ifdiscount", ifdiscount);
		Handlebars.registerHelper('date', date);
		Handlebars.registerHelper("inc", inc);
		Handlebars.registerHelper("s7video", s7video);
		Handlebars.registerHelper('starRating', starRating);
		Handlebars.registerHelper("s7image", s7image);
		Handlebars.registerHelper("s7Largeimage", largeImg);
		Handlebars.registerHelper("if_eq", ifeq);
		Handlebars.registerHelper('if_gt',greaterThan);
		Handlebars.registerHelper('if_lt',lesserThan);
		Handlebars.registerHelper('is_eqto',isEqualTo);
		Handlebars.registerHelper('if_featuredtechSpecs',iffeaturedtechSpecs);
		Handlebars.registerHelper('addFloat',addFloat);
		Handlebars.registerHelper('wasPrice',wasPrice);
		Handlebars.registerHelper('escapeCQContent',escapeCQContent);
		Handlebars.registerHelper('unicodeEscape',unicodeEscape);
		Handlebars.registerHelper('cq',cq);
		Handlebars.registerHelper('selectedContract',selectedContract);
		Handlebars.registerHelper('tagorstar',tagorstar);
  
  
  
  
  		/*Register Partials*/
		/*PartialMethods*/
		function activationFeePartial (contractTerm, options){
			var html = "";
			var flag = window.waivedactfee!=="undefined" ? window.waivedactfee : "false";
			if((contractTerm.toString() == "99" || contractTerm.toString() == "0")){
				if(flag=="true" ){
					html+= cq("html", "WAIVE_ACTIVATION_FEE_ZERO_YEAR");
					html+='<span class="font-icon_tooltip c-tooltip" data-tooltip="'+cq("html", "WAIVE_ACTIVATION_FEE_ZERO_YEAR_TOOL_TIP_MSG")+'"></span>';
				}else{
					html+= cq("label", "ACTIVATION_FEE_DPP_FRP");
					html+='<span class="font-icon_tooltip c-tooltip" data-tooltip="'+cq("html", "ACTIVATION_FEE_TOOL_TIP")+'"></span>';
				}
			}else{
				html+= cq("label", "ACTIVATION_FEE_2YR");
				html+='<span class="font-icon_tooltip c-tooltip" data-tooltip="'+cq("html", "ACTIVATION_FEE_TOOL_TIP")+'"></span>';
			}
			return html;
		}
		/*registering partials*/
		Handlebars.registerPartial('activationFee', activationFeePartial);
  
});
