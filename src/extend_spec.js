'use strict';

import extend from './extend';

describe('extend', () => {

	let obj1 = null;
	let	obj2 = null;
	let	obj3 = null;
	let	obj4 = null;
	let	obj5 = null;

	beforeEach(() => {
		obj1 = {
			prop: 0,
			prop1: 1,
			fun1() {

			}
		};

		obj2 = 	{
			prop: 11,
			prop2: 2,
			fun() {

			}
		};

		obj3 = {
			prop3: 3,
			fun() {

			}
		};

		obj4 = Object.create(obj2);

		obj4.prop4 = 4;

		obj5 = {};

		Object.defineProperty(obj5, 'prop', {
			enumerable: true,
			configurable: false,
			writable: false,
			value: 'enumerable'
		});

		Object.defineProperty(obj5, 'anotherProp', {
			enumerable: false,
			value: 'noEnumerable'
		});
	});

	afterEach(() => {
		obj1 = obj2 = obj3 = obj4 = obj5 = null;
	});

	it('两个对象之间的 extend', () => {
		expect(extend(obj1, obj2)).toEqual({prop: 11, prop1: 1, prop2: 2, fun1: obj1.fun1, fun: obj2.fun});
	});

	it('多个对象之间的 extend', () => {
		expect(extend(obj1, obj2, obj3)).toEqual({prop: 11, prop1: 1, prop2: 2, prop3: 3, fun1: obj1.fun1, fun: obj3.fun});
	});

	it('extend 对象自身的属性和方法', () => {
		expect(extend(obj1, obj4)).toEqual({prop: 0, prop1: 1, fun1: obj1.fun1, prop4: 4});
	});

	it('extend 可枚举的属性和方法', () => {
		expect(extend(obj1, obj5)).toEqual({prop: 'enumerable', prop1: 1, fun1: obj1.fun1});
	});

	it('对 JTool 对象进行扩展', () => {
		let JTool = {};
		JTool.extend = extend;
		JTool.extend(obj1);

		expect(JTool.fun1).toEqual(obj1.fun1);
		expect(JTool.prop).toEqual(obj1.prop);
		expect(JTool.prop1).toEqual(obj1.prop1);
	});

});
