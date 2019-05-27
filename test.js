const test = require('ava');
const { join, resolve } = require('path');
const fs = require('fs-extra');
const fn = require('./');

const srcImage = join(__dirname, 'test/fixtures/icon-192x192.png');

test.beforeEach(t => {
  fs.removeSync(resolve(__dirname, '.tmp'));
  fs.removeSync(
    resolve(__dirname, '../node_modules/.cache/pwa-manifest-icons')
  );
  fs.ensureDirSync(resolve(__dirname, '.tmp'));
});

test('typeof', t => {
  t.is(typeof fn, 'function');
});

test(
  'generate icon',
  async t => {
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

    const icons = await fn(opts);

    t.true(exist());
    t.true(match(opts.sizes, icons));
  }
);

test(
  'generate icon in sync',
  t => {
    const opts = {
      src: srcImage,
      cache: true,
      output: `${__dirname}/.tmp/static/manifest/icons/`,
      publicPath: '/static/manifest/icons/',
      sizes: [192, 512]
    };

    const icon = size => join(opts.output, `icon-${size}x${size}.png`);
    const exist = () => opts.sizes.every(size => fs.existsSync(icon(size)));

    fn.sync(opts);
    t.true(exist());
  }
);
