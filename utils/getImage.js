import cheerio from 'cheerio-without-node-native'

const getImage = (url, callback) =>
  fetch(url)
    .catch((error) => alert(error.message))
    .then((response) => response.text())
    .then((text) => cheerio.load(text))
    .then(($) => $('#viewer img').attr('src'))
    .then((image) =>
      image
        ? callback(image)
        : return null
    )

export default getImage
