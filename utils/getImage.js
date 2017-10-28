import cheerio from 'cheerio-without-node-native'

const getImage = (url, callback) =>
  fetch(url)
    .then((response) => response.text())
    .then((text) => cheerio.load(text))
    .then(($) => $('#viewer img').attr('src'))
    .then(callback)

export default getImage
