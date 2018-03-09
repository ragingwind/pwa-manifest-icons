const { dirname } = require('path')
const fs = require('fs-extra')
const jimp = require('jimp')

function resizeAndWrite(image, icons) {
	return Promise.all(icons.map(async icon => {
		const size =  Math.floor(/([\d]+)/.exec(icon.sizes)[0])

		await fs.ensureDir(dirname(icon.src))
		await image.clone()
					.resize(size, size)
					.quality(100)
					.write(icon.src)
	}))
}

module.exports = (src, icons) => {
	if (!src) {
		throw new Error('Source image path, or buffer must be exist')
	}

	return jimp.read(src).then(image => {
		return resizeAndWrite(image, icons)
	})
}