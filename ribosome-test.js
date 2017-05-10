const assert = require( "assert" );
const ribosome = require( "./ribosome.js" );

assert.equal( ribosome( "return hello;", {
	"name": "yeah",
	"parameter": [ "hello" ]
} )( "world" ), "world" );

console.log( "ok" );
