/**
 * @module {connect.Behavior} can-connect/can/constructor-hydrate/constructor-hydrate constructor-hydrate
 * @parent can-connect.behaviors
 *
 * Always check the [can-connect/constructor/store/store.instanceStore] when creating new instances of the connected
 * [can-connect/can/map/map._Map] type. Prevents duplication of instances when instances are created outside of the
 * `can-connect` connection.
 *
 * @signature `constructorHydrate( baseConnection )`
 *
 * Overrides [can-define/map/map DefineMaps]'s `setup` method and checks whether a newly created instance already
 * exists in the [can-connect/constructor/store/store.instanceStore]. If it exists that instance will be returned
 * instead of a new object.
 *
 * This behavior has to be used with [can-connect/constructor/store/store] and [can-connect/can/map/map can/map] behaviors.
 *
 * @body
 *
 * ## Use
 *
 * This behavior is useful if `Type` converters of [can-define/map/map] are used in multiple places of your app.
 * In which case if a property is set with an id of an already created instance then the connection behavior will
 * check [can-connect/constructor/store/store.instanceStore]. If there is already an instance with the same id
 * then it will be returned instead of a new object.
 *
 * Let's say we have the following page state with two properties which are of type `Student`:
 * ```js
 * var myPage = new (DefineMap.extend({
 *     student: { Type: Student },
 * 	   teamLead: { Type: Student },
 * }));
 * ```
 *
 * The type `Student` is a DefineMap with `can-connect` capabilities:
 * ```js
 * var Student = DefineMap.extend({});
 * Student.List = DefineList.extend({
 *     '#': { Type: Student }
 * });
 *
 * Student.connection = connect([
 * 	   require("can-connect/data/url/url"),
 * 	   require("can-connect/constructor/constructor"),
 * 	   require("can-connect/constructor/store/store"),
 * 	   require("can-connect/can/map/map"),
 * 	   require("can-connect/can/constructor-hydrate/constructor-hydrate"),
 * ], {
 * 	   Map: Student,
 * 	   List: Student.List,
 * 	   url: "api/students"
 * });
 * ```
 *
 * Now lets say your application loads `student` via `can-connect` using `Student.get()`, and it gets data for
 * `teamLead` from elsewhere. Also let's say in this example the team lead is the same person as student:
 *
 * ```js
 * myPage.student = Student.get({id: 1}); // loaded via can-connect
 *
 * myPage.loadTeamLead().then( function(person){ myPage.teamLead = person; } ); // not loaded via can-connect
 * ```
 *
 * Without [can-connect/can/constructor-hydrate/constructor-hydrate] we would end up with two instances of `Student`
 * with the same id. Additionally, `teamLead` would not be an instance that is stored in the connection's `instanceStore`
 * and thus would not benefit from the real-time updates offered by the [can-connect/real-time/real-time real-time]
 * behavior.
 *
 * `constructor-hydrate` solves this problem by checking `instanceStore` before creating a new instance. So, in our app
 * it will return the existing instance and give it to `teamLead`. Now both `myPage.student` and `myPage.teamLead`
 * are referencing the same instance:
 *
 * ```js
 * var instanceStore = Student.connection.instanceStore;
 * myPage.student === myPage.teamLead;                           // => true
 * myPage.teamLead === instanceStore.get( myPage.teamLead.id );  // => true
 * ```
 */

var connect = require("can-connect");
var Construct = require("can-construct");

var constructorHydrateBehavior = connect.behavior("can-connect/can/construct-hydrate", function(baseConnect){
	return {
		init: function(){
			var oldSetup = this.Map.prototype.setup;
			var connection = this;
			this.Map.prototype.setup = function(props){
				if (connection.instanceStore.has( connection.id(props) )) {
					return new Construct.ReturnValue( connection.hydrateInstance(props) );
				}
				return oldSetup.apply(this, arguments);
			};
			baseConnect.init.apply(this, arguments);
		}
	}
});

module.exports = constructorHydrateBehavior;

//!steal-remove-start
var validate = require('can-connect/helpers/validate');
module.exports = validate(constructorHydrateBehavior, ['Map', 'List', 'instanceStore', 'hydrateInstance']);
//!steal-remove-end