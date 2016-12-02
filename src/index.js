import Sizzle from './Sizzle';
import Extend from './extend';
import Utilities from './utilities';

// 如果需要集成Angular,React,在此处进行集成
let jTool = function (selector, context) {
	return new Sizzle(selector, context);
};

// 把jquery原先的jQuery.fn给省略了.原先的方式是 init = jQuery.fn.init; init.prototype = jQuery.fn;
Sizzle.prototype = jTool.prototype = {};
// 捆绑jTool 工具
jTool.extend = jTool.prototype.extend = Extend;
jTool.extend(Utilities);


window.jTool = jTool;

export default jTool;
