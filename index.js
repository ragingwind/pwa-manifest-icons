const { join, basename, extname } = require('path');
const fs = require('fs-extra');
const findCacheDir = require('find-cache-dir');
const hasha = require('hasha');
// const lipo = new (require('lipo'))();
const sharp = require('sharp');

const joinCachePath = hash =>
  join(findCacheDir({ name: 'pwa-manifest-icons', create: true }), hash);

const getCachePath = async src => {
  return joinCachePath(await hasha.fromFile(src, { algorithm: 'md5' }));
};

const getCachePathSync = src => {
  return joinCachePath(hasha.fromFileSync(src, { algorithm: 'md5' }));
};

const cacheIcons = async ({ src, sizes }) => {
  const cachepath = await getCachePath(src);
  await fs.ensureDir(cachepath);

  return await Promise.all(
    sizes.map(async size => {
      const icon = join(cachepath, `icon-${size}x${size}.png`);

      if (fs.pathExistsSync(icon)) {
        return icon;
      }

      await sharp()
        .resize({
          width: size,
          height: size
        })
        .toFile(icon);

      return icon;
    })
  );
};

const cacheIconsSync = ({ src, sizes }) => {
  const cachepath = getCachePathSync(src);
  const icons = [];

  fs.ensureDirSync(cachepath);

  sizes.forEach(size => {
    const icon = join(cachepath, `icon-${size}x${size}.png`);

    if (!fs.pathExistsSync(icon)) {
      const transformer = sharp().resize({
        width: size,
        height: size
      });

      fs.createReadStream(src)
        .pipe(transformer)
        .pipe(fs.createWriteStream(icon));
    }

    icons.push(icon);
    return icon;
  });

  return icons;
};

const copyIcons = (icons, { output }) => {
  return Promise.all(
    icons.map(icon => {
      return fs.copy(icon, join(output, basename(icon)));
    })
  );
};

const copyIconsSync = (icons, { output }) => {
  icons.forEach(icon => {
    fs.copySync(icon, join(output, basename(icon)));
  });
};

const remapIconPath = (icons, { sizes, publicPath }) => {
  return icons.map((icon, i) => {
    return {
      src: publicPath ? join(publicPath, basename(icon)) : icon,
      sizes: `${sizes[i]}x${sizes[i]}`,
      type: `image/${extname(icon).slice(1)}`
    };
  });
};

const mergeOptions = opts => {
  if (!opts || !opts.src) {
    throw new Error('Source image path, or buffer must be exist');
  }

  return {
    cache: false,
    output: './',
    publicPath: null,
    sizes: [192, 512],
    ...opts
  };
};

async function generateIcons(options) {
  const opts = mergeOptions(options);
  const icons = await cacheIcons(opts);
  await copyIcons(icons, opts);
  return remapIconPath(icons, opts);
}

function generateIconsSync(options) {
  const opts = mergeOptions(options);
  const icons = cacheIconsSync(opts);
  copyIconsSync(icons, opts);
  return remapIconPath(icons, opts);
}

module.exports = generateIcons;

module.exports.sync = generateIconsSync;
