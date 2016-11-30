var utilities = require('./utilities');
var Sizzle = require('./Sizzle');

var _Element = {
	// 获取指定DOM Element
	get: function(index){
		return this.DOMList[index];
	},

	// 获取指定索引的jTool对象
	eq: function(index){
		return new Sizzle(this.DOMList[index]);
	},

	// 返回指定选择器的jTool对象
	find: function(selectText) {
		return new Sizzle(selectText, this);
	},

	// 获取与 th 同列的 td jTool 对象, 该方法的调用者只允许为 Th
	getRowTd: function() {
		var th = this.eq(0);
		if (th.get(0).tagName.toUpperCase() !== 'TH') {
			utilities.error('getRowTd的调用者只允许为Th');
			return;
		}

		var table = th.closest('table'),
			trList = new Sizzle('tbody tr', table);

		var tdList = [],
			thIndex = th.index();

		utilities.each(trList, function(i, v) {
			tdList.push(new Sizzle('td', v).get(thIndex));
		});

		return new Sizzle(tdList);
	}
};

module.exports = _Element;