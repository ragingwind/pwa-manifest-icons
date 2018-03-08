# pwa-manifest-webpack-plugin

> webpack plugin for generating PWA manifest.

# Install

```sh
npm install --save-dev pwa-manifest-webpack-plugin
```

# Usase

```js
const PWAManifestWebpackPlugin = require('@pwa/manifest-webpack-plugin');

module.exports = {
  ...
  plugins: [
    new PWAManifestWebpackPlugin({
      ...customManifestConfigs
    })
  ]
}
```

# License

MIT @ [Jimmy Moon](https://ragingwind.me)
