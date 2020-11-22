import MD5 from 'blueimp-md5'
//解析url参数
function queryObj(query) {
	// let query = window.location.search;
	const res = {}
	query = query.trim().replace(/^(\?|#|&)/, '')

	if (!query) {
		return res
	}

	query.split('&').forEach(param => {
		const parts = param.replace(/\+/g, ' ').split('=')
		const key = decodeURIComponent(parts.shift())
		const val = parts.length > 0 ?
			decodeURIComponent(parts.join('=')) :
			null

		if (res[key] === undefined) {
			res[key] = val
		} else if (Array.isArray(res[key])) {
			res[key].push(val)
		} else {
			res[key] = [res[key], val]
		}
	})
	return res;
}


//url签名 make signature
function makeSignature(axiosConfig) {
	let data = axiosConfig.data && JSON.parse(JSON.stringify(axiosConfig.data)) || {};
	axiosConfig.params = axiosConfig.params || {};
	let params = axiosConfig.params && JSON.parse(JSON.stringify(axiosConfig.params));
	let timestamp = String(new Date().getTime()).substr(0, 10);
	
	//获取url上面的参数
	let url = axiosConfig.url.split('?');
	if (url.length > 1 && url[1].length > 0) {
		let queryParams = queryObj(url[1]);
		for(let key in queryParams){
			if(key.indexOf('[') > -1){
				delete queryParams[key];
			}
		}
		params = Object.assign(queryParams, params);
	}
	data = Object.assign(params || {}, data || {}, {
		'timestamp': timestamp
	});
	let keys = data && Object.keys(data).length > 0 ? Object.keys(data).sort() : null;
	let keysTmp = [];
	let paramsUrl = '';
	if (keys) {
		for (let key in keys) {
			if (typeof data[keys[key]] !== 'object' && keys[key] !== 'sign') {
				keysTmp.push(keys[key] + '=' + data[keys[key]]);
			}
		}
	}
	paramsUrl = keysTmp.join('&') + 'iiWb6mVPPZDUWpzb';
	// console.log(paramsUrl);
	axiosConfig.params.timestamp = timestamp;
	axiosConfig.params.sign = MD5(paramsUrl);
}

export default makeSignature