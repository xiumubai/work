
//数字千分位格式化
export function toThousands (nums) {
	var num = (nums || 0).toString();
	var tmp = num.split(".");
	num = tmp[0].replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
	if (tmp[1]) {
		num += '.'+tmp[1]
	}
	return num;
}