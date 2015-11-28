var formatAsBlanks = require('../format-as-blanks');
var expect = require('chai').expect;

describe('formatAsBlanks', function () {
	it('is a function', function () {
		expect(typeof formatAsBlanks).to.equal('function');
	});

	it('formats simple one word strings as blanks', function () {
		expect(formatAsBlanks('hello')).to.equal('xxxxx');
		expect(formatAsBlanks('5')).to.equal('x');
	});

	it('renders apostrophe as-is', function () {
		expect(formatAsBlanks("denny's")).to.equal("xxxxx'x");
	});

	it('renders dashes as-is', function () {
		expect(formatAsBlanks('tip-tip')).to.equal('xxx-xxx')
	});


});