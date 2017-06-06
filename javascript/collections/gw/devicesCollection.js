/*  Devices Collection  */

define(['backbone', 'models/gw/deviceModel'], function(Backbone, DeviceModel) {
    return Backbone.Collection.extend({
        model: DeviceModel
	});
});