import cheerio from 'cheerio-without-node-native'

const getLatest = (page, callback) =>
  fetch(`http://m.mangafox.me/latest/?page=${page}`)
    .then((response) => response.text())
    .then((text) => cheerio.load(text))
    .then(($) => {
      const mangas = $('.post')
        .map((index, el) => ({
          key: $(el).find('a').attr('href'),
          title: $(el).find('img').attr('title'),
          cover: $(el).find('img').attr('src'),
          link: $(el).find('a').attr('href'),
          release: $(el).find('em').text()
        }))
        .get()
      return mangas
    })
    .then((d) => callback(d))

export default getLatest
