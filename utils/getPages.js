import cheerio from 'cheerio-without-node-native'

const getPages = (url, callback) =>
  fetch(url)
    .catch((error) => alert(error.message))
    .then((response) => response.text())
    .then((text) => cheerio.load(text))
    .then(($) => $('.mangaread-page option')
        .map((index, el) =>
          $(el).attr('value').replace('//', 'http://')
        )
        .get()
    )
    .then((pages) =>
      pages.length
        ? callback(pages)
        : setTimeout(() => getPages(url, callback), 1000)
    )

export default getPages
