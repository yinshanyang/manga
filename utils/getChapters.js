import cheerio from 'cheerio-without-node-native'

const getChapters = (url, callback) =>
  fetch(url)
    .catch((error) => alert(error.message))
    .then((response) => response.text())
    .then((text) => cheerio.load(text))
    .then(($) => {
      const title = $('.manga-detail-top .title').text().trim()
      const chapters = $('.chlist a')
        .map((index, el) => ({
          key: $(el).attr('href'),
          link: $(el).attr('href').replace('//', 'http://'),
          title: $(el).text().match(/[0-9]+/)[0] || '0'
        }))
        .get()
      const tags = $('.manga-genres li')
        .map((index, el) => $(el).text().trim())
        .get()
      const summary = $('.manga-summary').text().trim()
      return { title, chapters, tags, summary }
    })
    .then((d) => callback(d))

export default getChapters
