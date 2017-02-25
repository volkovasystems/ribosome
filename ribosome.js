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

const asea = require( "asea" );
const doubt = require( "doubt" );
const excursio = require( "excursio" );
const falzy = require( "falzy" );
const komento = require( "komento" );
const protype = require( "protype" );
const truly = require( "truly" );
const wichevr = require( "wichevr" );
const wichis = require( "wichis" );

//: @server:
const kept = require( "kept" );
const lire = require( "lire" );
//: @end-server

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
				"expression:required": [
					"function",
					"string"
				],
				"option": "object"
			}
		@end-meta-configuration
	*/

	if( falzy( expression ) || !protype( expression, FUNCTION + STRING ) ){
		throw new Error( "invalid expression" );
	}

	let parameter = wichis( option.parameter, [ ] );
	if( !doubt( parameter, ARRAY ) ){
		throw new Error( "invalid parameter" );
	}

	expression = komento( expression, wichis( option.data, { } ) );

	let dependency = wichis( option.dependency, [ ] );

	dependency = dependency.map( function onEachDependency( dependency ){
		if( asea.client ){
			if( falzy( window[ dependency ] ) ){
				throw new Error( `dependency ${ dependency } not loaded` );
			}

			return `${ dependency };`;

		}else if( asea.server ){
			let [ name, track ] = dependency.split( "@" );

			if( truly( name ) && truly( track ) && kept( track, true ) ){
				return `
					( function ( ){
						var _${ name } = null;

						try{
							_${ name } = ( ${ lire( track, true ) } );
						}catch( error ){
							throw new Error( "cannot load module, " + error.stack );
						}

						if( typeof global == "object" && !global.${ name } ){
							global.${ name } = ( typeof ${ name } != "undefined" )? ${ name } : _${ name };
						}

						if( typeof window == "object" ){
							window.${ name } = ( typeof ${ name } != "undefined" )? ${ name } : _${ name };
						}
					} )( );
				`;

			}else{
				throw new Error( `cannot load dependency file ${ track } of ${ name }` );
			}
		}
	} ).join( "\n" );

	let name = wichevr( option.name, "method" );

	try{
		let method = excursio( `
			function ${ name }( ${ parameter.join( ", " ) } ){
				${ dependency }

				${ expression }
			}
		` );

		return method;

	}catch( error ){
		throw new Error( `error encountered constructing function, ${ error.stack }` );
	}
};

module.exports = ribosome;
