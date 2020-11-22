import {formatDate} from '../helper/formatDate'
import {toThousands} from '../helper/toThousands'
import {isEmptyObj} from '../helper/isEmptyObj'
import makeSignature from '../helper/makeSignature'
window.helper = {
	formatDate, 	//格式化时间
	toThousands, 	//数字千分位格式化
	isEmptyObj, 	//判断是否是空对象
	makeSignature //url签名
};
