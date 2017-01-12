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
			"fs": "fs",
			"excursio": "excursio",
			"komento": "komento"
		}
	@end-include
*/

const asea = require( "asea" );
const doubt = require( "doubt" );
const fs = require( "fs" );
const excursio = require( "excursio" );
const komento = require( "komento" );

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
const ribosome = function ribosome( expression, option ){
	/*;
		@meta-configuration:
			{
				"expression:required": "function",
				"option": "object"
			}
		@end-meta-configuration
	*/

	let name = option.name || "method";

	if( !protype( expression, FUNCTION ) ){
		throw new Error( "invalid expression" );
	}

	let parameter = option.parameter || [ ];
	if( !doubt( parameter ).ARRAY ){
		throw new Error( "invalid parameter" );
	}

	expression = komento( expression, option.data );

	let dependency = option.dependency || [ ];
	dependency = dependency.map( function onEachDependency( need ){
		if( asea.client ){
			if( !protype( window[ need ], UNDEFINED ) || window[ need ] === null ){
				let error = `dependency ${ need } not defined`;

				throw new Error( error );
			}

			return `${ need };`;

		}else if( asea.server ){
			try{
				let name = need.split( "@" )[ 0 ];
				let track = need.split( "@" )[ 1 ];

				fs.accessSync( track );

				return komento( function template( ){
					/*!
						( function ( ){
							{{{module}}}

							if( typeof global == "object" ){
								global.{{name}} = {{name}};
							}

							if( typeof window == "object" ){
								window.{{name}} = {{name}};
							}
						} )( );
					*/
				}, {
					"module": fs.readFileSync( track, "utf8" ),
					"name": name
				} );

			}catch( error ){
				error = `dependency file ${ need } does not exists, ${ error.message }`;

				throw new Error( error );
			}
		}
	} ).join( "\n" );

	try{
		expression = komento( function template( ){
			/*!
				function {{name}}( {{parameter}} ){
					{{{dependency}}}

					{{{expression}}}
				}
			*/
		}, {
			"name": name,
			"parameter": parameter.join( ", " ),
			"dependency": dependency,
			"expression": expression
		} );

		let method = excursio( expression );

		return method;

	}catch( error ){
		error = `error encountered constructing function, ${ error.message }`;

		throw new Error( error );
	}
};

module.exports = ribosome;
