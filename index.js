const {dirname, resolve, join, basename, extname} = require('path')
const fs = require('fs-extra')
const jimp = require('jimp')
const findCacheDir = require('find-cache-dir')
const hasha = require('hasha')

const writeIcon = (file, icon, size) => {
	return new Promise(resolve => {
		if (fs.pathExistsSync(icon)) {
			resolve(icon)
			return
		}

		file.clone().resize(size, size).quality(100).write(icon, () => {
			resolve(icon)
		})
	})
}

const prepareCacheRoot = src => {
	return hasha.fromFile(src, {algorithm: 'md5'}).then(hash => {
		const cacheRoot = join(findCacheDir({name: 'pwa-manifest-icons', create: true}), hash)
		return fs.ensureDir(cacheRoot).then(() => Promise.resolve(cacheRoot))
	})
}

const cacheIcons = ({src, output, sizes}) => {
	return prepareCacheRoot(src).then(cacheRoot => {
		return jimp.read(src).then(file => {
			return Promise.all(sizes.map(size => writeIcon(file, join(cacheRoot, `icon-${size}x${size}.png`), size)))
		})
	})
}

const copyIcons = (icons, {output}) => {
	return Promise.all(icons.map(icon => fs.copy(icon, join(output, basename(icon)))))
}

const remapIconPath = (icons, {sizes, publicPath}) => {
	return icons.map((icon, i) => {
		return {
			src: publicPath ? join(publicPath, basename(icon)) : icon,
			sizes: `${sizes[i]}x${sizes[i]}`,
			type: `image/${extname(icon).slice(1)}`
		}
	})
}

module.exports = opts => {
	if (!opts || !opts.src) {
		throw new Error('Source image path, or buffer must be exist')
	}

	opts = {
		cache: false,
		output: './',
		publicPath: null,
		sizes: [192, 512],
		...opts
	}

	return cacheIcons(opts).then(icons => {
		return copyIcons(icons, opts).then(() => {
			return remapIconPath(icons, opts)
		})
	})
}