async function hash(text, algorithm = 'SHA-256') {
	const encodedText = new TextEncoder().encode(text);
	const digest = await crypto.subtle.digest(algorithm , encodedText);
	const arrayBuffer = Array.from(new Uint8Array(digest));
	const hashedString = arrayBuffer.map(function (c) {
		return c.toString(16).padStart(2, '0');
	}).join('');
	return hashedString;
}

module.exports = hash;
