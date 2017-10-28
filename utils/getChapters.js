import cheerio from 'cheerio-without-node-native'

const getChapters = (url, callback) =>
  fetch(url)
    .then((response) => response.text())
    .then((text) => cheerio.load(text))
    .then(($) => {
      const chapters = $('.chlist a')
        .map((index, el) => ({
          key: $(el).attr('href'),
          title: $(el).text().match(/[0-9]+/)[0] || '0',
          link: $(el).attr('href').replace(/^\/\//, 'https://')
        }))
        .get()
      return chapters
    })
    .then((d) => callback(d))

export default getChapters
