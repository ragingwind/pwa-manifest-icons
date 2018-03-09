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
  ...manifestDefault
  icons: [{
    'src': `${__dirname}/.tmp/images/icons/icon-144x144.png`,
    'sizes': '144x144',
    'type': 'image/png'
  }, {
    'src': `${__dirname}/.tmp/images/icons/icon-192x192.png`,
    'sizes': '192x192',
    'type': 'image/png'
  }, {
    'src': `${__dirname}/.tmp/images/icons/icon-512x512.png`,
    'sizes': '512x512',
    'type': 'image/png'
  }]
}

await manifestIcons(srcImagePath, manifest.icons)

```

# License

MIT @ [Jimmy Moon](https://ragingwind.me)
