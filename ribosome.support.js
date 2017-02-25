"use strict";

/*;
	@module-license:
		The MIT License (MIT)
		@mit-license

		Copyright (@c) 2017 Richeve Siodina Bebedor
		@email: richeve.bebedor@gmail.com

		Permission is hereby granted, free of charge, to any person obtaining a copy
		of this software and associated documentation files (the "Software"), to deal
		in the Software without restriction, including without limitation the rights
		to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
		copies of the Software, and to permit persons to whom the Software is
		furnished to do so, subject to the following conditions:

		The above copyright notice and this permission notice shall be included in all
		copies or substantial portions of the Software.

		THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
		IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
		FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
		AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
		LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
		OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
		SOFTWARE.
	@end-module-license

	@module-configuration:
		{
			"package": "ribosome",
			"path": "ribosome/ribosome.js",
			"file": "ribosome.js",
			"module": "ribosome",
			"author": "Richeve S. Bebedor",
			"contributors": [
				"John Lenon Maghanoy <johnlenonmaghanoy@gmail.com>"
			],
			"eMail": "richeve.bebedor@gmail.com",
			"repository": "https://github.com/volkovasystems/ribosome.git",
			"test": "ribosome-test.js",
			"global": true
		}
	@end-module-configuration

	@module-documentation:
		Function factory.
	@end-module-documentation

	@include:
		{
			"asea": "asea",
			"doubt": "doubt",
			"excursio": "excursio",
			"kept": "kept",
			"komento": "komento",
			"lire": "lire",
			"protype": "protype",
			"truly": "truly",
			"wichevr": "wichevr",
			"wichis": "wichis"
		}
	@end-include
*/

var _slicedToArray2 = require("babel-runtime/helpers/slicedToArray");

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var asea = require("asea");
var doubt = require("doubt");
var excursio = require("excursio");
var falzy = require("falzy");
var komento = require("komento");
var protype = require("protype");
var truly = require("truly");
var wichevr = require("wichevr");
var wichis = require("wichis");

/*;
	@option:
		{
			"name": "string",
			"parameter": "[string]",
			"dependency": "[string]",
			"data": "object"
		}
	@end-option
*/
var ribosome = function ribosome(expression, option) {
	/*;
 	@meta-configuration:
 		{
 			"expression:required": [
 				"function",
 				"string"
 			],
 			"option": "object"
 		}
 	@end-meta-configuration
 */

	if (falzy(expression) || !protype(expression, FUNCTION + STRING)) {
		throw new Error("invalid expression");
	}

	var parameter = wichis(option.parameter, []);
	if (!doubt(parameter, ARRAY)) {
		throw new Error("invalid parameter");
	}

	expression = komento(expression, wichis(option.data, {}));

	var dependency = wichis(option.dependency, []);

	dependency = dependency.map(function onEachDependency(dependency) {
		if (asea.client) {
			if (falzy(window[dependency])) {
				throw new Error("dependency " + dependency + " not loaded");
			}

			return dependency + ";";
		} else if (asea.server) {
			var _dependency$split = dependency.split("@"),
			    _dependency$split2 = (0, _slicedToArray3.default)(_dependency$split, 2),
			    _name = _dependency$split2[0],
			    track = _dependency$split2[1];

			if (truly(_name) && truly(track) && kept(track, true)) {
				return "\n\t\t\t\t\t( function ( ){\n\t\t\t\t\t\tvar _" + _name + " = null;\n\n\t\t\t\t\t\ttry{\n\t\t\t\t\t\t\t_" + _name + " = ( " + lire(track, true) + " );\n\t\t\t\t\t\t}catch( error ){\n\t\t\t\t\t\t\tthrow new Error( \"cannot load module, \" + error.stack );\n\t\t\t\t\t\t}\n\n\t\t\t\t\t\tif( typeof global == \"object\" && !global." + _name + " ){\n\t\t\t\t\t\t\tglobal." + _name + " = ( typeof " + _name + " != \"undefined\" )? " + _name + " : _" + _name + ";\n\t\t\t\t\t\t}\n\n\t\t\t\t\t\tif( typeof window == \"object\" ){\n\t\t\t\t\t\t\twindow." + _name + " = ( typeof " + _name + " != \"undefined\" )? " + _name + " : _" + _name + ";\n\t\t\t\t\t\t}\n\t\t\t\t\t} )( );\n\t\t\t\t";
			} else {
				throw new Error("cannot load dependency file " + track + " of " + _name);
			}
		}
	}).join("\n");

	var name = wichevr(option.name, "method");

	try {
		var method = excursio("\n\t\t\tfunction " + name + "( " + parameter.join(", ") + " ){\n\t\t\t\t" + dependency + "\n\n\t\t\t\t" + expression + "\n\t\t\t}\n\t\t");

		return method;
	} catch (error) {
		throw new Error("error encountered constructing function, " + error.stack);
	}
};

module.exports = ribosome;

//# sourceMappingURL=ribosome.support.js.map