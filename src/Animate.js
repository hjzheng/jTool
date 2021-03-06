/*
 * 动画效果
 * --动画中的参数对应--
 * styleObj: 元素将要实现的样式, 只允许为Object格式
 * time: 执行动画的间隔时间
 * callback: 动画执行完成后的回调函数
 * --Ex--
 * 无回调参数: jTool('#div1').animate({height: '100px', width: '200px'}, 1000);
 * 无时间参数: jTool('#div1').animate({height: '100px', width: '200px'}, callback);
 * 完整参数: jTool('#div1').animate({height: '100px', width: '200px'}, 1000, callback);
 * --注意事项--
 * show与hide方法只是一个简单的实现,不支持参数及动画效果
 * */
var utilities = require('./utilities');
var _Css = require('../src/Css');

var _Animate = {
	show: function() {
		utilities.each(this.DOMList, function(i, v) {
			if(v.style.oldDisplay && v.style.oldDisplay !== 'none'){
				v.style.display = v.style.oldDisplay;
			}
			else{
				v.style.display = 'block';
			}
		});
		return this;
	},
	hide: function() {
		utilities.each(this.DOMList, function(i, v){
			v.style.oldDisplay = utilities.getStyle(v, 'display');
			v.style.display = 'none';
		});
		return this;
	},
	// 动画效果, 动画样式仅支持以对象类型传入且值需要存在有效的单位
	animate: function(styleObj, time, callback) {
		var animateFromText = '',   // 动画执行前样式文本
			animateToText = '',     // 动画执行后样式文本
			node = this.DOMList[0];
		// 无有效的参数, 直接跳出. 但并不返回错误.
		if(!styleObj){
			return;
		}
		// 参数转换
		if(utilities.type(callback) === 'undefined' && utilities.type(time) === 'function'){
			callback = time;
			time = 0;
		}
		if(utilities.type(callback) === 'undefined'){
			callback = utilities.noop;
		}
		if(utilities.type(time) === 'undefined'){
			time = 0;
		}
		// 组装动画 keyframes
		utilities.each(styleObj, function(key, v){
			key = utilities.toHyphen(key);
			animateFromText += key + ':' + utilities.getStyle(node, key) + ';';
			animateToText += key + ':' + v + ';';
		});
		// 拼接动画样式文本
		var animateText = '@keyframes jToolAnimate {' +
			'from {' +
			animateFromText +
			'}' +
			'to {' +
			animateToText +
			'}' +
			'}';

		// 引入动画样式至页面
		var jToolAnimate = document.createElement('style');
		jToolAnimate.className = 'jTool-animate-style';
		jToolAnimate.type = 'text/css';
		document.head.appendChild(jToolAnimate);
		jToolAnimate.textContent = jToolAnimate.textContent + animateText;

		// 启用动画
		node.style.animation = 'jToolAnimate ' + time / 1000 + 's ease-in-out forwards';

		// 延时执行回调函数及清理操作
		window.setTimeout(function(){
			_Css.css(styleObj);
			node.style.animation = '';
			jToolAnimate.remove();
			callback();
		}, time);
	}
};

module.exports = _Animate;
