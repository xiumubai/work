'use strict'
let bdh_build = '"production"';
if(process.env.BDH_BUILD === 'test'){
	bdh_build = '"test"';
}
module.exports = {
	NODE_ENV: '"production"',
	BDH_BUILD: bdh_build
}
