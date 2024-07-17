async function hash(a, b) {
	b = b || 'SHA-256';
	const c = new TextEncoder().encode(a);
	const d = await crypto.subtle.digest(b, c);
	const e = Array.from(new Uint8Array(d));
	const f = e.map(function (c) {
		return c.toString(16).padStart(2, '0');
	}).join('');
	return f;
}

module.exports = hash;
