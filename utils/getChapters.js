import cheerio from 'cheerio-without-node-native'

const getChapters = (url, callback) =>
  fetch(url)
    .then((response) => response.text())
    .then((text) => cheerio.load(text))
    .then(($) => {
      const chapters = $('.chlist a')
        .map((index, el) => ({
          key: $(el).attr('href'),
          link: $(el).attr('href').replace(/^\/\//, 'https://'),
          title: $(el).text().match(/[0-9]+/)[0] || '0'
        }))
        .get()
      const tags = $('.manga-genres li')
        .map((index, el) => $(el).text().trim())
        .get()
      const summary = $('.manga-summary').text().trim()
      return { chapters, tags, summary }
    })
    .then((d) => callback(d))

export default getChapters
