/**
 *
 * @param s String
 */
function solution(s: string) {
	let str = s

	s.split('').length
	while (true) {
		const x = /(AA|BB|CC)/
		if (x.test(s)) {
			str = str.replace(x, '')
			continue
		}
		return str
	}
	// write your code in JavaScript (Node.js 8.9.4)
}

test('Test', () => {
	expect(1).toEqual(1)
})
