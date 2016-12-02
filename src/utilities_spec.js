import utilities from './utilities';

describe('utilities', () => {

	var nodeList = null;
	var divEle = null;

	beforeEach(() => {
		divEle = document.createElement('div');
		document.body.appendChild(divEle);
		nodeList = document.querySelectorAll('div');
	});

	afterEach(() => {
		document.body.removeChild(divEle);
		nodeList = null;
		divEle = null;
	});

	it('isArray', () => {
		expect(utilities.isArray([])).toBe(true);
		expect(utilities.isArray({})).toBe(false);
		expect(utilities.isArray(function () {})).toBe(false);
		expect(utilities.isArray(123)).toBe(false);
	});

	it('type', () => {
		expect(utilities.type(undefined)).toBe('undefined');
		expect(utilities.type(null)).toBe('null');
		expect(utilities.type(true)).toBe('boolean');
		expect(utilities.type(Boolean())).toBe('boolean');
		expect(utilities.type(123)).toBe('number');
		expect(utilities.type(Number(123))).toBe('number');
		expect(utilities.type('123')).toBe('string');
		expect(utilities.type(String('123'))).toBe('string');
		expect(utilities.type(function () {})).toBe('function');
		expect(utilities.type([])).toBe('array');
		expect(utilities.type(new Array(1))).toBe('array');
		expect(utilities.type(new Date())).toBe('date');
		expect(utilities.type(Error())).toBe('error');
		expect(utilities.type(/test/)).toBe('regexp');
		expect(utilities.type(document.body)).toBe('element');
		expect(utilities.type(nodeList)).toBe('nodeList');
		expect(utilities.type(divEle)).toBe('element');
	});

	describe('each', () => {

		var callback = null;

		beforeEach(() => {
			callback = jasmine.createSpy('callback');
		});

		afterEach(() => {
			callback = null;
		});

		it('遍历数组', () => {
			var arr = [1, 2, 3];
			utilities.each(arr, callback);
			expect(callback.calls.count()).toBe(3);
			expect(callback.calls.argsFor(0)).toEqual([0, 1]);

			var sum = 0;
			utilities.each(arr, (i, v) => {
				sum += v;
			});
			expect(sum).toBe(6);
		});

		it('遍历类数组 arguments', () => {
			function test() {
				utilities.each(arguments, callback);
				expect(callback.calls.count()).toBe(4);
			}

			test(1, 2, 3, 4);
		});

		it('遍历类数组 nodeList', () => {
			utilities.each(nodeList, callback);
			expect(callback.calls.count()).toBe(1);
		});

		it('遍历对象', () => {
			var obj = {
				'a': 1,
				'b': 2,
				'c': 3
			};
			utilities.each(obj, callback);
			expect(callback.calls.count()).toBe(3);
			expect(callback.calls.argsFor(0)).toEqual(['a', 1]);
		});

		it('遍历 JTool 对象', () => {
			var obj = {
				'a': 1,
				'b': 2,
				'c': 3
			};

			obj.jTool = 'jTool';
			obj.DOMList = nodeList;
			utilities.each(obj, callback);
			expect(callback.calls.count()).toBe(1);
		});
	});

	it('trim', () => {
		expect(utilities.trim(' 123')).toBe('123');
		expect(utilities.trim('123 ')).toBe('123');
		expect(utilities.trim(' 12 3')).toBe('12 3');
		expect(utilities.trim(' 123  ')).toBe('123');
	});

	it('error', () => {
		expect(utilities.error).toThrowError(/jTool Error/);
	});

	it('isEmptyObject', () => {
		expect(utilities.isEmptyObject({})).toBe(true);
		expect(utilities.isEmptyObject(Object.create(null))).toBe(true);
		expect(utilities.isEmptyObject({ a: 1 })).toBe(false);
		expect(utilities.isEmptyObject(Object.create({ a: 1 }))).toBe(true);
		expect(utilities.isEmptyObject(Object.prototype)).toBe(true);
	});

	it('getStyle', () => {
		expect(utilities.getStyle(divEle)).toEqual(jasmine.any(Object));
		divEle.style.fontSize = '12px';
		expect(utilities.getStyle(divEle, 'font-size')).toBe('12px');
	});

	it('getStyleUnit', () => {
		expect(utilities.getStyleUnit('12px')).toBe('px');
		expect(utilities.getStyleUnit('12em')).toBe('em');
		expect(utilities.getStyleUnit('12%')).toBe('%');
		expect(utilities.getStyleUnit('12vem')).toBe('vem');
	});

	it('toHump', () => {
		expect(utilities.toHump('font-size')).toBe('fontSize');
		expect(utilities.toHump('-font-size')).toBe('FontSize');
		expect(utilities.toHump('-font-size-')).toBe('FontSize-');
		expect(utilities.toHump('color')).toBe('color');
		expect(utilities.toHump('xxx-111-xx')).toBe('xxx111Xx');
		expect(utilities.toHump('background-color')).toBe('backgroundColor');
	});

	it('toHyphen', () => {
		expect(utilities.toHyphen('FontSize')).toBe('-font-size');
		expect(utilities.toHyphen('fontSize')).toBe('font-size');
		expect(utilities.toHyphen('FontSize-')).toBe('-font-size-');
		expect(utilities.toHyphen('XXX')).toBe('-x-x-x');
	});

	it('isWindow', () => {
		expect(utilities.isWindow(window)).toBe(true);
	});

	it('createDOM', () => {
		expect(utilities.createDOM('<div id="haha">hahaha</div>')[0].id).toBe('haha');
		expect(document.getElementById('jTool-create-dom')).toBe(null);
	});

});
