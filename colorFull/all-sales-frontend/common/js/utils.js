export function formatDate(date, fmt) {
	var currentDate = new Date(date);
	var o = {
		"M+": currentDate.getMonth() + 1, //月份
		"d+": currentDate.getDate(), //日
		"h+": currentDate.getHours(), //小时
		"m+": currentDate.getMinutes(), //分
		"s+": currentDate.getSeconds(), //秒
		"q+": Math.floor((currentDate.getMonth() + 3) / 3), //季度
		"S": currentDate.getMilliseconds() //毫秒
	};
	if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (currentDate.getFullYear() + "").substr(4 - RegExp.$1.length));
	for (var k in o)
		if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k])
			.substr(("" + o[k]).length)));
	return fmt;
}

export function timeInterval(nowTime, endTime) {
	
	var date3 = endTime - nowTime  //时间差的毫秒数
	 
	//计算出相差天数
	var days = Math.floor(date3/(24*3600*1000))
	 
	//计算出小时数
	 
	var leave1 = date3%(24*3600*1000)    //计算天数后剩余的毫秒数
	var hours = Math.floor(leave1/(3600*1000))
	//计算相差分钟数
	var leave2 = leave1%(3600*1000)        //计算小时数后剩余的毫秒数
	var minutes = Math.floor(leave2/(60*1000))
	 
	 
	//计算相差秒数
	var leave3=leave2%(60*1000)      //计算分钟数后剩余的毫秒数
	var seconds=Math.round(leave3/1000)
	
	var date = {
		days: days,
		hours: hours,
		minutes: minutes,
		seconds: seconds
	}
	return date
}