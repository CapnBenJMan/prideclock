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
<line x1="5" y1="5" x2="5" y2="1.5" stroke="black" stroke-linecap="round" transform="rotate(${360 * hour / 12})" transform-origin="center" />
<line x1="5" y1="5" x2="5" y2="0.5" stroke="black" stroke-linecap="round" transform="rotate(${360 * minute / 60})" transform-origin="center" />
</svg>`
	qry('link[rel=icon]').href = `data:image/svg+xml;base64,${window.btoa(svg)}`
}

const root = document.documentElement.style,
	nums = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'],
	ids = ['hour1', 'hour2', 'colon1', 'minute1', 'minute2', 'colon2', 'second1', 'second2'],
	cont = ID('numbercontainer'),
	prideObj = JSON.parse(localStorage['s']),
	prides = new Proxy(Object.values(prideObj), {
		get(target, prop) {
			if (Number(prop) >= target.length) return target[Number(prop) - target.length]
			else return target[prop]
		}
	})
let interval = 0, last = 0
document.addEventListener("DOMContentLoaded", () => {
	let bool = false
	for (let x of ids) {
		const el = document.createElement("table")
		el.id = x
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
	}
	const nEl = document.createElement("select")
	nEl.innerHTML = Object.keys(prideObj).reduce((tot, cur) => tot += `<option value="${cur}">${cur.capitalize()} Flag</option>`, '')
	nEl.classList.add('dark')
	nEl.id = 'selector'
	nEl.onchange = changer
	const previous = localStorage['prev'] || prides[0]
	qry('.content').appendChild(nEl)
	ID('selector').value = keyFromValue(prideObj, previous)
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

		for (let i in ids) {
			if (timestring[i] == ':') continue
			const cur = ID(ids[i])
			cur.classList.remove(...nums)
			cur.classList.add(nums[timestring[i]])
		}
		qryA('.colon').forEach(x => x.classList.toggle('active'))
	}
	const tempHour = Number(`${timestring[0]}${timestring[1]}`)
	minute = Number(`${timestring[3]}${timestring[4]}`)
	hour = tempHour > 12 ? tempHour - 12 : tempHour
}

setInterval(setDate, 100)
setInterval(() => urlSetter(prideObj[ID('selector').value]), 1000)

function toggler() {
	const button = [ID('toggle'), ID('toggle1'), ID('selector')]
	if (button[0].innerHTML.includes('Light')) {
		button[0].innerHTML = 'Toggle Dark Mode'
		root.setProperty('--fadecolor', '#ddd6')
		root.setProperty('--backcolor', 'white')
	} else {
		button[0].innerHTML = 'Toggle Light Mode'
		root.setProperty('--fadecolor', '#3336')
		root.setProperty('--backcolor', 'black')
	}
	button.forEach(b => b.classList.toggle('light'))
	button.forEach(b => b.classList.toggle('dark'))
}

/** @param {{[s: string]: any}} obj @param {string} val*/
function keyFromValue(obj, val) {
	return Object.keys(obj).find(key => obj[key] == val)
}

function toggler1() {
	const button = ID('toggle1'),
		selector = ID('selector'),
		numcolor = root.getPropertyValue('--numcolor'),
		index = (numcolor) ? prides.indexOf(numcolor) + 1 : 1
	root.setProperty('--numcolor', prides[index])
	selector.value = keyFromValue(prideObj, prides[index])
	urlSetter(prides[index])
	localStorage['prev'] = prides[index]
}

function changer() {
	const selection = ID('selector').value
	root.setProperty('--numcolor', prideObj[selection])
	urlSetter(prideObj[selection])
	localStorage['prev'] = prideObj[selection]
}