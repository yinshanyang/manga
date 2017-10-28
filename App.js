import React, { PureComponent } from 'react'
import getLatest from './utils/getLatest'
import getChapters from './utils/getChapters'
import getPages from './utils/getPages'
import getImage from './utils/getImage'

import {
  StatusBar,
  FlatList,
  View,
  Text,
  Image,
  Modal,
  TouchableWithoutFeedback
} from 'react-native'
import Swiper from 'react-native-swiper'

const styles = {
  base: {
    width: '100%',
    height: '100%',
    backgroundColor: '#1a1a1a'
  },
  mangas: {
    flex: 1,
    backgroundColor: '#333333'
  },
  manga: {
    flex: 1,
    aspectRatio: 0.642857143,
    position: 'relative'
  },
  mangaImage: {
    position: 'absolute',
    width: '100%',
    aspectRatio: 0.642857143
  },
  mangaText: {
    position: 'absolute',
    left: 8,
    right: 8,
    bottom: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '700'
  },
  chapters: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#333'
  },
  chaptersImage: {
    width: '100%',
    aspectRatio: 1
  },
  chapter: {
    padding: 16,
    backgroundColor: '#333',
    borderBottomWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.3)'
  },
  chapterText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff'
  },
  pages: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#000'
  },
  pagesClose: {
    position: 'absolute',
    top: 0,
    left: 0,
    fontSize: 32,
    color: 'rgba(0, 0, 0, 0)',
    backgroundColor: 'transparent'
  },
  pagesPagination: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0
  },
  pagesDot: {
    flex: 1,
    width: '100%',
    height: 3,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    marginTop: 0,
    marginBottom: 0,
    marginLeft: 0,
    marginRight: 0,
    borderRadius: 0
  },
  pagesDotActive: {
    flex: 1,
    width: '100%',
    height: 3,
    backgroundColor: 'rgba(255, 128, 0, 1)',
    marginTop: 0,
    marginBottom: 0,
    marginLeft: 0,
    marginRight: 0,
    borderRadius: 0
  },
  page: {
    flex: 1
  },
  pageImage: {
    width: '100%',
    height: '100%'
  }
}

class Mangas extends PureComponent {
  getKey = ({ key }) => key

  renderManga = ({ item }) => (
    <Manga manga={item} onSelect={this.props.onSelect(item)} />
  )

  render () {
    const { refreshing, mangas, onRefresh, onEndReached, onSelect } = this.props

    return (
      <FlatList
        style={styles.mangas}
        numColumns={4}
        data={mangas}
        keyExtractor={this.getKey}
        refreshing={refreshing}
        onRefresh={onRefresh}
        onEndReached={onEndReached}
        onEndThreshold={0}
        renderItem={this.renderManga}
      />
    )
  }
}

class Manga extends PureComponent {
  render () {
    const { manga, onSelect } = this.props

    return (
      <TouchableWithoutFeedback onPress={onSelect}>
        <View style={styles.manga}>
          <Image style={styles.mangaImage} source={{uri: manga.cover}} />
          <Text style={styles.mangaText}>
            {manga.title}
          </Text>
        </View>
      </TouchableWithoutFeedback>
    )
  }
}

class Chapters extends PureComponent {
  componentWillMount () {
    const { manga, onLoad } = this.props
    getChapters(manga.link, onLoad)
  }

  getKey = ({ key }) => key

  renderChapter = ({ item }) => (
    <Chapter chapter={item} onSelect={this.props.onSelect(item)} />
  )

  render () {
    const { manga, chapters, onClose, onLoad } = this.props

    return (
      <View style={styles.chapters}>
        <TouchableWithoutFeedback onPress={onClose}>
          <Image style={styles.chaptersImage} source={{uri: manga.cover}} />
        </TouchableWithoutFeedback>
        <FlatList
          data={chapters}
          keyExtractor={this.getKey}
          refreshing={chapters.length === 0}
          renderItem={this.renderChapter}
        />
      </View>
    )
  }
}

class Chapter extends PureComponent {
    render () {
      const { chapter, onSelect } = this.props

      return (
        <TouchableWithoutFeedback onPress={onSelect}>
          <View style={styles.chapter}>
            <Text style={styles.chapterText}>
              Chapter {chapter.title}
            </Text>
          </View>
        </TouchableWithoutFeedback>
      )
    }
}

class Pages extends PureComponent {
  componentWillMount () {
    const { chapter, onLoad } = this.props
    getPages(chapter.link, onLoad)
  }

  render () {
    const { chapter, pages, onClose } = this.props
    return (
      <View style={styles.pages}>
        {
          pages.length
          ? (
            <Swiper
              loop={false}
              index={pages.length - 1}
              paginationStyle={styles.pagesPagination}
              dotStyle={styles.pagesDot}
              activeDotStyle={styles.pagesDotActive}
            >
              {
                pages.map((page, index) => (
                  <Page key={index} page={page} />
                ))
              }
            </Swiper>
          )
          : null
        }
        <Text style={styles.pagesClose} onPress={onClose}>
          CLOSE
        </Text>
      </View>
    )
  }
}

class Page extends PureComponent {
  state = {
    image: null
  }

  componentWillMount () {
    const { page } = this.props
    getImage(page, (image) => this.setState({ image }))
  }

  render () {
    const { image } = this.state
    return (
      <View style={styles.page}>
        {
          image
            ? (
              <Image
                style={styles.pageImage}
                resizeMode='contain'
                source={{uri: image}}
              />
            )
            : null
        }
      </View>
    )
  }
}

class App extends PureComponent {
  state = {
    refreshing: false,
    page: 1,
    manga: null,
    chapter: null,
    mangas: [],
    chapters: [],
    pages: []
  }

  componentWillMount () {
    this.handleRefresh()
  }

  render () {
    const { refreshing, manga, chapter, mangas, chapters, pages } = this.state
    return (
      <View
        style={styles.base}
      >
        <StatusBar hidden />
        <Mangas
          refreshing={refreshing}
          mangas={mangas}
          onRefresh={this.handleRefresh}
          onEndReached={this.handleLoadMore}
          onSelect={this.handleSelectManga}
        />

        {
          manga
            ? (
              <Chapters
                manga={manga}
                chapters={chapters}
                onClose={this.handleDeselectManga}
                onSelect={this.handleSelectChapter}
                onLoad={this.handleLoadedChapters}
              />
            )
            : null
        }

        {
          chapter
            ? (
              <Pages
                chapter={chapter}
                pages={pages}
                onClose={this.handleDeselectChapter}
                onLoad={this.handleLoadedPages}
              />
            )
            : null
        }
      </View>
    )
  }

  handleRefresh = () => {
    this.setState(
      {
        page: 1,
        refreshing: true
      },
      () =>
        getLatest(this.state.page, (mangas) => {
          this.setState({
            mangas,
            refreshing: false
          })
        })
    )
  }

  handleLoadMore = () => {
    this.setState(
      {
        page: ++this.state.page,
        refreshing: true
      },
      () =>
        getLatest(this.state.page, (mangas) => {
          this.setState({
            mangas: [ ...this.state.mangas, ...mangas ],
            refreshing: false
          })
        })
    )
  }

  handleLoadedChapters = (chapters) => this.setState({ chapters })

  handleLoadedPages = (pages) => this.setState({ pages })

  handleSelectManga = (manga) => () => this.setState({ manga })

  handleDeselectManga = () => this.setState({manga: null, chapters: []})

  handleSelectChapter = (chapter) => () => this.setState({ chapter })

  handleDeselectChapter = () => this.setState({chapter: null, pages: []})
}

export default App
