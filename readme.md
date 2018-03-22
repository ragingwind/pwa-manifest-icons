# pwa-manifest-icons

> Generate icon images by Web Manifest icons property. size and location will be referenced as writing icon images

# Install

```sh
npm install --save @pwa/manifest-icons
```

# Usase

```js
const manifestIcons = require('@pwa/manifest-icons');
const manifest = {
  ...defaultManifest
};

const manifest.icons = await manifestIcons({
  // path for source image
  src: path.resolve(process.cwd(). './assets/icon.png'),
  // using cached images
  cache: true,
  // root path for output icons
  output: './static/manifest/icons',
  // revamp icon path with publicPath, which will be returned after resize. if null, using 
  // output path
  publicPath: '/static/manifest/icons/',
  // sizes for resizing, default is 192, 512
  sizes: [192, 512]
})
```

# License

MIT @ [Jimmy Moon](https://ragingwind.me)
