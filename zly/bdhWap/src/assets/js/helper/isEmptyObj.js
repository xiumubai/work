export function isEmptyObj (obj){
	for(var key in obj){
		if(obj[key]){
			return false
		}
	}
	return true;
}