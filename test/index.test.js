const { join } = require('path')
const fs = require('fs-extra')
const fn = require('../')

const srcImage = join(__dirname, 'fixtures/icon-192x192.png')

beforeAll(() => {
  fs.removeSync('.tmp')
  fs.ensureDirSync('.tmp')
})

test('typeof', () => {
  expect(typeof fn).toBe('function')
})

test('generate icon', async () => {
  const icons = [{
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
  const exist = () => icons.every(async icon => await fs.pathExists(icon.src))
  
  await fn(srcImage, icons)

  expect(exist()).toBe(true)
})