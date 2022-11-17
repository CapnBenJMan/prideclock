String.prototype.capitalize = function () {
	if (this.includes(' ')) return this.split(" ").reduce((cur, tot) => tot += (cur.charAt(0).toUpperCase() + cur.slice(1).toLowerCase() + ' '), '').trim()
	else return this.charAt(0).toUpperCase() + this.slice(1).toLowerCase()
}
let hour = 0, minute = 0
/** @param {string} n */ let ID = n => document.getElementById(n)
/** @param {string} n @param {HTMLElement|Element} [el] */ let qry = (n, el) => (el != undefined) ? el.querySelector(n) : document.querySelector(n)
/** @param {string} n @param {HTMLElement|Element} [el] */ let qryA = (n, el) => (el != undefined) ? el.querySelectorAll(n) : document.querySelectorAll(n)
/** @param {string} stuff */ let urlSetter = (stuff) => {
	const match = stuff.split(/, ?/),
		initial = match[0],
		splits = match.slice(1).map(x => x.trim().replace(/\)/g, '').split(' ')),
		gradient = initial.includes('linear') ? 'linearGradient' : 'radialGradient'

	let percentage = 0
	const processed = splits.reduce((tot, cur, i) => {
		return tot + `<stop offset="${100 / (splits.length - 1) * i}%" stop-color="${cur[0]}"/>`
	}, '')

	const svg = `<svg
viewBox="0 0 10 10"
xmlns="http://www.w3.org/2000/svg"
xmlns:xlink="http://www.w3.org/1999/xlink">
<defs>
	<${gradient} ${initial.includes('linear') ? `y2="100%" y1="0%" ` : ''}id="myGradient">
		${processed}
	</${gradient}>
</defs>
<circle cx="5" cy="5" r="5" fill="url('#myGradient')" />
<line x1="5" y1="5" x2="5" y2="0.5" stroke="black" stroke-linecap="round" transform="rotate(${360 * minute / 60})" transform-origin="center" />
<line x1="5" y1="5" x2="5" y2="1.5" stroke="black" stroke-linecap="round" transform="rotate(${360 * hour / 12})" transform-origin="center" />
</svg>`
	qry('link[rel=icon]').href = `data:image/svg+xml;base64,${window.btoa(svg)}`
}

const root = document.documentElement.style,
	nums = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'],
	ids = ['hour1', 'hour2', 'colon1', 'minute1', 'minute2', 'colon2', 'second1', 'second2'],
	cont = ID('numbercontainer'),
	prideObj = {
		"pride": "linear-gradient(135deg, black 0 5%, red, orange, yellow, green, blue, violet, black 95% 100%)",
		"pansexual": "linear-gradient(135deg, black 0 5%, deeppink, gold, royalblue, black 95% 100%)",
		"trans": "linear-gradient(135deg, black 0 5%, skyblue, lightpink, white, lightpink, skyblue, black 95% 100%)",
		"lesbian": "linear-gradient(135deg, black 0 5%, #d52c00, #ef7628, #ff9a56, white, #d162a4, #b55690, #a20262, black 95% 100%)",
		"bisexual": "linear-gradient(135deg, black 0 5%, #d60370 35%, #9b4f96, #9b4f96, #0138a9 65%, black 95% 100%)",
		"polysexual": "linear-gradient(135deg, black 0 5%, #f61cb9, #00d569, #1992f6, black 95% 100%)",
		"asexual": "linear-gradient(135deg, black 0 5%, #303030 25%, silver 30% 45%, white 50% 65%, purple 85%, black 95% 100%)",
		"nonbinary": "linear-gradient(135deg, black 0 5%, #fcf434, white, #9c59d1, #2c2c2c, black 95% 100%)",
		"intersex": "radial-gradient(circle at center, gold, gold, #7a02aa 40%, gold 50%)",
		"abrosexual": "linear-gradient(135deg, black 0 5%, #75ca91, #b4e5ca, white, #e695b6, #d9436e, black 95% 100%)",
		"omnisexual": "linear-gradient(135deg, black 0 5%, #ff9bcf, #ff56c0, #250148, #675eff, #8fa7fe, black 95% 100%)"
	},
	prides = new Proxy(Object.values(prideObj), {
		get(target, prop) {
			if (Number(prop) >= target.length) return target[Number(prop) - target.length]
			else return target[prop]
		}
	}),
	inputs = [ID('toggle'), ID('toggle1'), ID('selector'), qry('label')]

let interval = 0, last = 0

// On DOM Content Loaded
document.addEventListener("DOMContentLoaded", () => {
	let bool = false
	const grid = ID('gridContainer')
	for (let x of ids) {
		const el = document.createElement("table")
		el.id = `${x}a`
		if (x.includes('colon')) {
			el.innerHTML = `<tr><td></td></tr>
		<tr><td></td></tr>
		<tr><td></td></tr>
		<tr><td></td></tr>
		<tr><td></td></tr>`
			el.classList.add('colon')
			el.classList.toggle('active', bool)
			bool = !bool
			cont.appendChild(el)
		} else {
			el.innerHTML = `<tr>
						<td></td>
						<td class="T"></td>
						<td></td>
						</tr>
						<tr>
							<td class="TL"></td>
			<td></td>
			<td class="TR"></td>
			</tr>
			<tr>
				<td></td>
				<td class="M"></td>
				<td></td>
				</tr>
				<tr>
					<td class="BL"></td>
					<td></td>
					<td class="BR"></td>
					</tr>
					<tr>
						<td></td>
						<td class="B"></td>
						<td></td>
						</tr>`
			el.classList.add('number')
			cont.appendChild(el)
		}

		let i = (x.includes('colon')) ? 1 : 0
		const temp = Array.from(document.getElementsByTagName("template"))[i].content,
			copy = document.importNode(temp, true)
		grid.appendChild(copy)
		const children = Array.from(grid.children),
			child = children[children.length - 1]
		child.id = `${x}b`
		if (x == 'colon1') child.classList.add('active')
	}

	const selector = ID('selector')
	selector.innerHTML = Object.keys(prideObj).reduce((tot, cur) => tot += `<option value="${cur}">${cur.capitalize()} Flag</option>`, '')
	selector.onchange = changer
	const previous = localStorage['CaptainBenJManPrideClockprev'] || prides[0]
	selector.value = keyFromValue(prideObj, previous)
	toggler(true)
	toggler2(localStorage['CaptainBenJManPrideClockmini'] == 'true')
	setDate()
	root.setProperty('--numcolor', previous)
	urlSetter(previous)
})

function setDate() {
	const timestring0 = new Date().toTimeString()
		.split('').slice(0, 8)
		.map(x => x != ':' ? Number(x) : x)
	const timestring = new Proxy(timestring0, {
		get(target, prop) {
			if (!isNaN(prop)) {
				prop = parseInt(prop, 10)
				if (prop < 0) prop += target.length
			}
			return target[prop]
		}
	})
	if ((last == 9 && timestring[-1] == 0) || last < timestring[-1]) {
		last = timestring[-1]

		for (let m of ['a', 'b']) {
			for (let i in ids) {
				if (timestring[i] == ':') continue
				const cur = ID(`${ids[i]}${m}`)
				cur.classList.remove(...nums)
				cur.classList.add(nums[timestring[i]])
			}
			qryA(`#colon1${m}, #colon2${m}`).forEach(x => x.classList.toggle('active'))
		}
	}
	const tempHour = Number(`${timestring[0]}${timestring[1]}`)
	minute = Number(`${timestring[3]}${timestring[4]}`)
	hour = tempHour > 12 ? tempHour - 12 : tempHour
}

setInterval(setDate, 100)
setInterval(() => urlSetter(prideObj[ID('selector').value]), 1000)

function toggler(stor = false) {
	let light = false, dark = false
	if (stor ? localStorage['CaptainBenJManPrideClockmode'] == 'light' : inputs[0].innerHTML.includes('Light')) {
		inputs[0].innerHTML = 'Toggle Dark Mode'
		root.setProperty('--fadecolor', '#ddd6')
		root.setProperty('--backcolor', 'white')
		localStorage['CaptainBenJManPrideClockmode'] = 'light'
		light = true
	} else {
		inputs[0].innerHTML = 'Toggle Light Mode'
		root.setProperty('--fadecolor', '#3336')
		root.setProperty('--backcolor', 'black')
		localStorage['CaptainBenJManPrideClockmode'] = 'dark'
		dark = true
	}
	inputs.forEach(b => b.classList.toggle('light', light))
	inputs.forEach(b => b.classList.toggle('dark', dark))
}

/** @param {{[s: string]: any}} obj @param {string} val*/
function keyFromValue(obj, val) {
	return Object.keys(obj).find(key => obj[key] == val)
}

function toggler1() {
	const selector = ID('selector'),
		numcolor = root.getPropertyValue('--numcolor'),
		index = (numcolor) ? prides.indexOf(numcolor) + 1 : 1
	root.setProperty('--numcolor', prides[index])
	selector.value = keyFromValue(prideObj, prides[index])
	urlSetter(prides[index])
	localStorage['CaptainBenJManPrideClockprev'] = prides[index]
}

function changer() {
	const selection = ID('selector').value
	root.setProperty('--numcolor', prideObj[selection])
	urlSetter(prideObj[selection])
	localStorage['CaptainBenJManPrideClockprev'] = prideObj[selection]
}

/** @param {boolean} bool */
function toggler2(bool) {
	const mini = bool ?? ID('minify').checked
	if (bool != undefined && bool != false) ID('minify').checked = true
	ID('gridContainer').classList.toggle('magic', !mini)
	ID('numbercontainer').classList.toggle('magic', mini)
	localStorage['CaptainBenJManPrideClockmini'] = mini
}