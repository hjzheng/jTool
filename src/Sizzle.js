// Sizzle 选择器, 类似于 jQuery.Sizzle;

import utilities from './utilities';

const Sizzle = function (selector, context) {

	let DOMList;

	if (!selector) { // selector -> undefined || null
		selector = null;
	} else if (utilities.isWindow(selector)) { // selector -> window
		DOMList = [selector];
		context = undefined;
	} else if (selector === document) { // selector -> document
		DOMList = [document];
		context = undefined;
	} else if (selector instanceof HTMLElement) { // selector -> DOM
		DOMList = [selector];
		context = undefined;
	} else if (selector instanceof NodeList || selector instanceof Array) { // selector -> NodeList || selector -> Array
		DOMList = selector;
		context = undefined;
	} else if (selector.jTool) { // selector -> jTool Object
		DOMList = selector.DOMList;
		context = undefined;
	} else if (/<.+>/.test(selector)) { // selector -> Html String
		// TODO
		DOMList = utilities.createDOM(selector);
		context = undefined;
	} else { // selector -> 字符CSS选择器
		// context -> undefined
		if (!context) {
			DOMList = document.querySelectorAll(selector);
		} else if (typeof context === 'string') { // context -> 字符CSS选择器
			context = document.querySelectorAll(context);
		} else if (context instanceof HTMLElement) { // context -> DOM 将HTMLElement转换为数组
			context = [context];
		} else if (context instanceof NodeList) { // context -> NodeList
			context = context;
		} else if (context.jTool) { // context -> jTool Object
			context = context.DOMList;
		} else { // 其它不可以用类型
			context = undefined;
		}

		// 通过父容器获取 NodeList: 存在父容器
		if (context) {
			DOMList = [];
			utilities.each(context, function (i, v) {
				// NodeList 只是类数组, 直接使用 concat 并不会将两个数组中的参数边接, 而是会直接将 NodeList 做为一个参数合并成为二维数组
				utilities.each(v.querySelectorAll(selector), function (i2, v2) {
					DOMList.push(v2);
				});
			});
		}
	}

	if (!DOMList || DOMList.length === 0) {
		DOMList = undefined;
	}

	// 用于确认是否为jTool对象
	this.jTool = true;

	// 用于存储当前选中的节点
	this.DOMList = DOMList;
	this.length = this.DOMList ? this.DOMList.length : 0;

	// 存储选择器条件
	this.querySelector = selector;

	return this;
};

export default Sizzle;
