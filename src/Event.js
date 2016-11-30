/*
 * Event 事件
 * --事件中的参数对应--
 * event: 事件名
 * querySelector: 子选择器
 * callback: 事件触发后执行的函数
 * useCapture: 指定事件是否在捕获或冒泡阶段执行.true - 事件句柄在捕获阶段执行 false- 默认。事件句柄在冒泡阶段执行
 *
 * --注意事项--
 * #Event001: 预绑定的事件,无法通过new Event().dispatchEvent()来执行,所以通过属性调用的方式来触发.
 *            存在父级的元素不会是window 或document 所以不会存在问题.
 *            目前只有click事件可以通过trigger进行调用, 需要修改.(但是通过真实的事件触发,是不会有问题的)
 * #Event002: 当前使用的是new Event().dispatchEvent();
 *            并未使用document.createEvent('HTMLEvents').initEvent(event, true, true).dispatchEvent()
 *            原因是initEvent已经被新的DOM标准废弃了。
 * #Event003: 如果存在子选择器,会对回调函数进行包装, 以达到在触发事件时所传参数为当前的window.event对象
 * --ex--
 * 在选择元素上绑定一个或多个事件的事件处理函数: .bind('click mousedown', function(){}) 或.on('click mousedown', function(){})
 * 在选择元素上为当前并不存在的子元素绑定事件处理函数: .on('click mousedown', '.test', function(){})
 * */
var utilities = require('./utilities');
var _Event = {
	on: function(event, querySelector, callback, useCapture) {
		// 将事件触发执行的函数存储于DOM上, 在清除事件时使用
		return this.addEvent(this.getEventObject(event, querySelector, callback, useCapture));
	},

	off: function(event, querySelector) {
		return this.removeEvent(this.getEventObject(event, querySelector));
	},

	bind: function(event, callback, useCapture) {
		return this.on(event, undefined, callback, useCapture);
	},

	unbind: function(event) {
		return this.removeEvent(this.getEventObject(event));
	},

	trigger: function(event) {
		utilities.each(this.DOMList, function(index, element){
			try {
				// #Event001: trigger的事件是直接绑定在当前DOM上的
				if(element.jToolEvent && element.jToolEvent[event].length > 0){
					var myEvent = new Event(event); // #Event002: 创建一个事件对象，用于模拟trigger效果
					element.dispatchEvent(myEvent)
				}
				// trigger的事件是预绑定在父级或以上级DOM上的
				else{
					element[event]();
				}
			}catch(e){
				utilities.error('事件:['+ event +']未能正确执行, 请确定方法已经绑定成功');
			}
		});
		return this;
	},

	// 获取 jTool Event 对象
	getEventObject: function(event, querySelector, callback, useCapture) {
		// $(dom).on(event, callback);
		if (typeof querySelector === 'function') {
			callback = querySelector;
			useCapture = callback || false;
			querySelector = undefined;
		}
		// event callback 为必要参数
		if (!event) {
			utilities.error('事件绑定失败,原因: 参数中缺失事件类型');
			return this;
		}

		// 子选择器不存在 或 当前DOM对象包含Window Document 则将子选择器置空
		if(!querySelector || jTool.type(this.DOMList[0]) !== 'element'){
			querySelector = '';
		}
		// #Event003 存在子选择器 -> 包装回调函数, 回调函数的参数
		if(querySelector !== ''){
			var fn = callback;
			callback = function(e){
				// 验证子选择器所匹配的nodeList中是否包含当前事件源
				// 注意: 这个方法为包装函数,此处的this为触发事件的Element
				if([].indexOf.call( this.querySelectorAll(querySelector), e.target) !== -1){
					fn.apply(e.target, arguments);
				}
			};
		}
		var eventSplit = event.split(' ');
		var eventList = [],
			eventScopeSplit,
			eventObj;

		utilities.each(eventSplit, function(i, eventName) {
			if (eventName.trim() === '') {
				return true;
			}

			eventScopeSplit = eventName.split('.');
			eventObj = {
				eventName: eventName + querySelector,
				type: eventScopeSplit[0],
				querySelector: querySelector,
				callback: callback || utilities.noop,
				useCapture: useCapture || false,
				// TODO: nameScope暂时不用
				nameScope: eventScopeSplit[1] || undefined
			};
			eventList.push(eventObj);
		});

		return eventList;
	},

	// 增加事件,并将事件对象存储至DOM节点
	addEvent: function(eventList) {
		var _this = this;
		utilities.each(eventList, function (index, eventObj) {
			utilities.each(_this.DOMList, function(i, v){
				v.jToolEvent = v.jToolEvent || {};
				v.jToolEvent[eventObj.eventName] = v.jToolEvent[eventObj.eventName] || [];
				v.jToolEvent[eventObj.eventName].push(eventObj);
				v.addEventListener(eventObj.type, eventObj.callback, eventObj.useCapture);
			});
		});
		return _this;
	},

	// 删除事件,并将事件对象移除出DOM节点
	removeEvent: function(eventList) {
		var _this = this;
		var eventFnList; //事件执行函数队列
		utilities.each(eventList, function(index, eventObj) {
			utilities.each(_this.DOMList, function(i, v){
				if (!v.jToolEvent) {
					return;
				}
				eventFnList = v.jToolEvent[eventObj.eventName];
				if (eventFnList) {
					utilities.each(eventFnList, function(i2, v2) {
						v.removeEventListener(v2.type, v2.callback);
					});
					v.jToolEvent[eventObj.eventName] = undefined;
				}
			});
		});
		return _this;
	}
};

module.exports = _Event;
