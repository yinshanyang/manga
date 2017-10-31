import cheerio from 'cheerio-without-node-native'

const getPages = (url, callback) =>
  fetch(url)
    .then((response) => response.text())
    .then((text) => cheerio.load(text))
    .then(($) => $('.mangaread-page option')
        .map((index, el) =>
          $(el).attr('value').replace(/^\/\//, 'https://')
        )
        .get()
    )
    .then(callback)

export default getPages
