"use strict";

const ribosome = require( "./ribosome.js" );

console.log( ribosome( "return hello;", {
	"name": "yeah",
	"parameter": [ "hello" ]
} )( "world" ) );
