const e = require('express')
const router = require('express').Router()
const qbitorrent = require('../utils/torrent')

const SHAREWOOD_API_KEY = process.env.SHAREWOOD_API_KEY

router.get('/latest', async (req, res) => {

  let latestTorrents = await fetch(`https://www.sharewood.tv/api/${SHAREWOOD_API_KEY}/last-torrents?category=4&subcategory=27`)
    .then(response => response.json())
    .then(data => {
      return data
    })

  console.log(latestTorrents)


  latestTorrents = latestTorrents.map(torrent => {
    if (torrent.seeders === 0) {
      return null

    } else {

      return {
        id: torrent.id,
        name: torrent.name,
        size: torrent.size,
      }
    }
  })

  res.json(latestTorrents)

})


router.get('/search', async (req, res) => {
  const query = req.query.query
  let searchResults = await fetch(`https://www.sharewood.tv/api/${SHAREWOOD_API_KEY}/search?name=${query}&category=4&subcategory=27`)
    .then(response => response.json())
    .then(data => {
      return data
    })

  searchResults = searchResults.map(torrent => {
    if (torrent.seeders === 0) {
      return null

    } else {

      return {
        id: torrent.id,
        name: torrent.name,
        size: torrent.size,
      }
    }
  })

  res.json(searchResults)
})

router.get('/download/:id', async (req, res) => {
  const id = req.params.id

  res.json(await qbitorrent.addTorrent(id))



})

module.exports = router