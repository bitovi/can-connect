var connect = require("can-connect");

require("../../constructor/");
require("../map/");
require("../can");
require("../../constructor/store/");
require("../../constructor/callbacks-once/");
require("../../data/callbacks/");
require("../../data/callbacks-cache/");
require("../../data/combine-requests/");
require("../../data/inline-cache/");
require("../../data/localstorage-cache/");
require("../../data/parse/");
require("../../data/url/");
require("../../fall-through-cache/");
require("../../real-time/");

var $ = require("jquery");

connect.superMap = function(options){

	var behaviors = [
		"constructor",
		"can-map",
		"constructor-store",
		"data-callbacks",
		"data-callbacks-cache",
		"data-combine-requests",
		"data-inline-cache",
		"data-parse",
		"data-url",
		"real-time",
		"constructor-callbacks-once"];

	if(typeof localStorage !== "undefined") {
		// if no cacheConnection provided, create one
		if (typeof options.cacheConnection === 'undefined' || (options.cacheConnection.__behaviorName !== 'data-localstorage-cache' && options.cacheConnection.__behaviorName !== 'data-memory-cache' && options.cacheConnection.__behaviorName !== 'data-inline-cache')) {
            options.cacheConnection = connect(['data-localstorage-cache'], {
                name: options.name,
                idProp: options.idProp,
                algebra: options.algebra
            });
        }
        // use the cacheConnection options if none are set by superMap
        options.name = options.cacheConnection.name || options.name;
        options.idProp = options.cacheConnection.idProp || options.idProp;
        options.algebra = options.cacheConnection.algebra || options.algebra;
        
        can.simpleExtend(options.cacheConnection, {name: options.name, idProp: options.idProp, algebra: options.algebra});
        
		behaviors.push("fall-through-cache");
	}
	options.ajax = $.ajax;

	return connect(behaviors,options);
};

module.exports = connect.superMap;



