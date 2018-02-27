import React, { PureComponent } from 'react'
import { Dimensions } from 'react-native'
import getLatest from './utils/getLatest'
import getChapters from './utils/getChapters'
import getPages from './utils/getPages'
import getImage from './utils/getImage'

import {
  StatusBar,
  FlatList,
  ScrollView,
  View,
  Text,
  Image,
  TouchableWithoutFeedback
} from 'react-native'
import IScrollView from 'react-native-invertible-scroll-view'

const dimensions = Dimensions.get('window')
const columns = dimensions.width < 512 ? 3 : 4

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
    bottom: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '600'
  },
  mangaRelease: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    right: 8,
    paddingLeft: 8,
    paddingRight: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    color: '#fff',
    fontSize: 10,
    textAlign: 'center',
    fontWeight: '400'
  },
  chapters: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#333'
  },
  chaptersHeader: {
    flexDirection: 'row',
    backgroundColor: '#1a1a1a'
  },
  chaptersDescription: {
    position: 'absolute',
    width: `${100 - 100 / columns}%`,
    top: 0,
    bottom: 0,
    right: 0
  },
  chaptersDescriptionTextContainer: {
    padding: 16
  },
  chaptersDescriptionText: {
    color: '#fff',
    paddingBottom: 16
  },
  chaptersImage: {
    width: `${100 / columns}%`,
    aspectRatio: 0.642857143,
    backgroundColor: '#000'
  },
  chaptersList: {},
  chapter: {
    padding: 16,
    backgroundColor: '#333',
    borderBottomWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.3)'
  },
  chapterText: {
    fontSize: 16,
    fontWeight: '600',
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
  pagesList: {
    flex: 1,
    width: '100%',
    height: '100%'
  },
  page: {
    ...dimensions,
    flex: 1
  },
  pageImage: {
    ...dimensions
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
        numColumns={columns}
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
          <Text style={styles.mangaRelease}>
            {manga.release.toUpperCase()}
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
    const { manga, chapters, tags, summary, onClose, onLoad } = this.props
    return (
      <View style={styles.chapters}>
        <View style={styles.chaptersHeader}>
          <TouchableWithoutFeedback onPress={onClose}>
            <Image style={styles.chaptersImage} source={{uri: manga.cover}} />
          </TouchableWithoutFeedback>
          <ScrollView contentContainerStyle={styles.chaptersDescriptionTextContainer} style={styles.chaptersDescription}>
            {
              summary
                ? <Text style={styles.chaptersDescriptionText}>{summary}</Text>
                : null
            }
            {
              tags.length
                ? <Text style={styles.chaptersDescriptionText}>{tags.join(', ')}</Text>
                : null
            }

          </ScrollView>
        </View>
        <FlatList
          style={styles.chaptersList}
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

  renderPage = ({ item }) => (
    <Page page={item} />
  )

  render () {
    const { chapter, pages, onClose } = this.props
    return (
      <View style={styles.pages}>
        {
          pages.length
          ? (
            <FlatList
              style={styles.pagesList}
              data={pages}
              indicatorStyle='white'
              horizontal
              directionalLockEnabled
              pagingEnabled
              inverted
              renderItem={this.renderPage}
            />
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
      <ScrollView
        style={styles.page}
        bouncesZoom
        centerContent
        directionalLockEnabled
        maximumZoomScale={3}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      >
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
      </ScrollView>
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
    tags: [],
    summary: null,
    pages: []
  }

  componentWillMount () {
    this.handleRefresh()
  }

  render () {
    const { refreshing, manga, chapter, mangas, chapters, tags, summary, pages } = this.state
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
                tags={tags}
                summary={summary}
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

  handleLoadedChapters = ({ chapters, tags, summary }) => this.setState({ chapters, tags, summary })

  handleLoadedPages = (pages) => this.setState({ pages })

  handleSelectManga = (manga) => () => this.setState({ manga })

  handleDeselectManga = () => this.setState({manga: null, chapters: [], tags: [], summary: null})

  handleSelectChapter = (chapter) => () => this.setState({ chapter })

  handleDeselectChapter = () => this.setState({chapter: null, pages: []})
}

export default App
