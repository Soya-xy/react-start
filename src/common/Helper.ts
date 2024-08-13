export default class Helper {
	static getNum(index: any, total: any, size: any, page: any, orderBy: any) {

		var num = index + 1;
		if (orderBy == "desc") {
			num = total - (page - 1) * size - (num - 1);
		} else {
			num = (page - 1) * size + num
		}
		if (num < 10) {
			num = '0' + num;
		}
		return num
	}
	static getLetter(num: any) {
		if (parseInt(num) > 0 && parseInt(num) < 27) {
			return String.fromCharCode(num + 64);
		}
		return "";
	}
	static getValue(value: any) {
		if (!value) {
			return value
		}
		// 去掉富文本所有标签
		value = value.replace(/(\n)/g, "");
		value = value.replace(/(\t)/g, "");
		value = value.replace(/(\r)/g, "");
		value = value.replace(/<\/?[^>]*>/g, "");
		value = value.replace(/\s*/g, "");
		return value
	}
	static getNumber(value: any) {
		// 只允许输入数字
		value = value.replace(/[^\d]/g, '')
		return value
	}
	static getFloat(obj: any) { // 值允许输入一个小数点和数字 
		obj = obj.replace(/[^\d.]/g, ""); //先把非数字的都替换掉，除了数字和. 
		obj = obj.replace(/^\./g, ""); //必须保证第一个为数字而不是. 
		obj = obj.replace(/\.{2,}/g, "."); //保证只有出现一个.而没有多个. 
		obj = obj.replace(".", "$#$").replace(/\./g, "").replace("$#$", "."); //保证.只出现一次，而不能出现两次以上 
		return obj
	}
	static fetchTemplete(name: any) {
		var requrl = "/templete/" + name;
		return fetch(requrl, {
			method: "GET"
		}).then(res => {
			// 获取blob文件流
			return res.blob();
		}).then(blob => {
			let a = document.createElement('a');
			// 通过 blob 对象获取对应的 url
			let url = window.URL.createObjectURL(blob);
			a.href = url;
			a.download = name;
			a.click();
			a.remove();
		})
	}
	//秒数转化为时分秒
	static formatSeconds(value: any) {
		var secondTime: any = parseInt(value);// 秒
		var minuteTime: any = 0;// 分
		var hourTime: any = 0;// 小时
		if (secondTime > 60) {//如果秒数大于60，将秒数转换成整数
			//获取分钟，除以60取整数，得到整数分钟
			minuteTime = parseInt((secondTime / 60) as any);
			//获取秒数，秒数取余，得到整数秒数
			secondTime = parseInt((secondTime % 60) as any);
			//如果分钟大于60，将分钟转换成小时
			if (minuteTime > 60) {
				//获取小时，获取分钟除以60，得到整数小时
				hourTime = parseInt((minuteTime / 60) as any);
				//获取小时后取余的分，获取分钟除以60取余的分
				minuteTime = parseInt((minuteTime % 60) as any);
			}
		}
		var result = "" + parseInt(secondTime) + "秒";

		if (minuteTime > 0) {
			result = "" + parseInt(minuteTime) + "分" + result;
		}
		if (hourTime > 0) {
			result = "" + parseInt(hourTime) + "小时" + result;
		}
		return result;
	}
	// 二维数组转换成一维数组
	static arr2Toarr1(arr: any) {
		var arr2 = arr.reduce(function (a: any, b: any) { return a.concat(b) });
		return arr2;
	}
	// 一维数组转换成二维数组
	static arr1Toarr2(maxBlock: any, blankSudoku: any = []) {
		// let maxBlock = 4 // 4-四宫，6-六宫，9-九宫
		if (blankSudoku.length == 0) {
			// 定义一个空数独
			// var blankSudoku = new Array()
			for (let i = 0; i < maxBlock * maxBlock; i++) {
				blankSudoku[i] = 0
			}
		}
		let rowData = [];
		let result = [];
		for (let i = 0; i < blankSudoku.length; i++) {
			if (i % maxBlock == 0) {
				rowData = []
			}
			rowData.push(blankSudoku[i])
			if (rowData.length == maxBlock) {
				// console.log(rowData)
				result.push(rowData)
			}
		}
		return result;
	}
}
