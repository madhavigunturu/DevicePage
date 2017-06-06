define([
    "handlebarspartials", 
    "hbs!templates/partials/filter",
    "hbs!templates/partials/devicePrice"
],function(Partial, FilterTmpl, DevicePriceTmpl) {
    var partial = new Partial();
    var subPartial = {
        filter: function(data,options){
            var status = {},
                helpers = options.helpers,
                loopIndex = options.hash.index,
                inputStyle = options.hash.style,
                filterName = options.hash.name;

            status.filterData = data;
            status.id = "cid_" + Math.floor((Math.random() * 9999) + 1) + "_" + loopIndex;
            status.inputType = (data.multiSelect) ? "checkbox" : "radio";
            status.inputClass = (data.multiSelect) ? "checkboxCustom" : "radioCustom";
            status.navState = (typeof data.properties.linkURLforNewNavState === "undefined") ? data.properties.newNavState : data.properties.linkURLforNewNavState;
            status.isChecked =  (data.selected) ? "checked" : "";
            status.isBold = (data.selected) ? "bold" : "";
            status.multiSelect = data.multiSelect;

            if(filterName === "Customer Rating"){
                status.customerRating =(data.label).replace("Deals", "").substring(0, 1);
            }else if(filterName === "Color"){
                status.filterColor = true;
            }

            var inputStyles = helpers.gwFilterInputStyle(inputStyle);
            status = _.extend(status, inputStyles);       

            return FilterTmpl(status);
        },
        devicePrice: function(data, options){
            var status = {},
                helpers = options.helpers;

            if(typeof data.strikePrice !== 'undefined' && data.strikePrice > 0){
                status.strikePrice = "$" + helpers.addFloat(data.strikePrice);
            }

            status.displayPrice = "$" + helpers.addFloat(data.displayPrice);            
            return DevicePriceTmpl(status);
        }
    };
    _.extend(partial.methods, subPartial);
    partial.init();
});