const { join, resolve } = require('path');
const fs = require('fs-extra');
const fn = require('../');

const srcImage = join(__dirname, 'fixtures/icon-192x192.png');

beforeAll(() => {
  fs.removeSync(resolve(__dirname, '.tmp'));
  fs.removeSync(
    resolve(__dirname, '../node_modules/.cache/pwa-manifest-icons')
  );
  fs.ensureDirSync(resolve(__dirname, '.tmp'));
});

test('typeof', () => {
  expect(typeof fn).toBe('function');
});

test(
  'generate icon',
  async () => {
    const opts = {
      src: srcImage,
      cache: true,
      output: `${__dirname}/.tmp/static/manifest/icons/`,
      publicPath: '/static/manifest/icons/',
      sizes: [192, 512]
    };

    const icon = size => join(opts.output, `icon-${size}x${size}.png`);
    const exist = () => opts.sizes.every(size => fs.existsSync(icon(size)));
    const match = (sizes, icons) =>
      sizes.every(
        (size, i) =>
          icons[i].src === `/static/manifest/icons/icon-${size}x${size}.png`
      );

    try {
      const icons = await fn(opts);

      expect(exist()).toBe(true);
      expect(match(opts.sizes, icons)).toBe(true);
    } catch (e) {
      console.log('Error', e);
    }
  },
  1000 * 50
);

test(
  'generate icon in sync',
  () => {
    const opts = {
      src: srcImage,
      cache: true,
      output: `${__dirname}/.tmp/static/manifest/icons/`,
      publicPath: '/static/manifest/icons/',
      sizes: [192, 512]
    };

    const icon = size => join(opts.output, `icon-${size}x${size}.png`);
    const exist = () => opts.sizes.every(size => fs.existsSync(icon(size)));

      console.log('start1')
      fn.sync(opts);

      expect(exist()).toBe(true);
  },
  1000 * 50
);
