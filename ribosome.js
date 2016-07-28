"use strict";

/*;
	@module-license:
		The MIT License (MIT)
		@mit-license

		Copyright (@c) 2016 Richeve Siodina Bebedor
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
			"eMail": "richeve.bebedor@gmail.com",
			"repository": "https://github.com/volkovasystems/ribosome.git",
			"test": "ribosome-test.js",
			"global": true
		}
	@end-module-configuration

	@module-documentation:
	@end-module-documentation

	@example:
	@end-example

	@include:
		{
		}
	@end-include
*/

if( typeof window == "undefined" ){
	var asea = require( "asea" );
	var fs = require( "fs" );
	var excursio = require( "excursio" );
	var komento = require( "komento" );
}

if( typeof window != "undefined" &&
	!( "asea" in window ) )
{
	throw new Error( "asea is not defined" );
}

if( asea.client &&
	!( "excursio" in window ) )
{
	throw new Error( "excursio is not defined" );
}

if( asea.client &&
	!( "komento" in window ) )
{
	throw new Error( "komento is not defined" );
}

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
var ribosome = function ribosome( expression, option ){
	/*;
		@meta-configuration:
			{
				"expression:required": "function",
				"option": "object"
			}
		@end-meta-configuration
	*/

	var name = option.name || "method";

	if( typeof expression != "function" ){
		throw new Error( "invalid expression" );
	}

	var parameter = option.parameter || [ ];
	if( !Array.isArray( parameter ) ){
		throw new Error( "invalid parameter" );
	}

	expression = komento( expression, option.data );

	var dependency = option.dependency || [ ];
	dependency = dependency.map( function onEachDependency( _dependency ){
		if( asea.client ){
			if( typeof window[ _dependency ] == "undefined" ||
				window[ _dependency ] === null )
			{
				throw new Error( [ "dependency", _dependency,
					"not defined" ].join( " " ) );
			}

			return [ _dependency, ";" ].join( "" );

		}else if( asea.server ){
			try{
				var name = _dependency.split( "@" )[ 0 ];
				var _path = _dependency.split( "@" )[ 1 ];

				fs.accessSync( _path );

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
					"module": fs.readFileSync( _path, "utf8" ),
					"name": name
				} );

			}catch( error ){
				throw new Error( [ "dependency file", _dependency,
					"does not exists" ].join( " " ) );
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

		var method = excursio( expression );

		return method;

	}catch( error ){
		throw new Error( "error encountered constructing function " + error.message );
	}
};

if( asea.server ){
	module.exports = ribosome;
}
