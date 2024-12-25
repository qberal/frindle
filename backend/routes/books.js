const e = require('express');
const router = require('express').Router();
const qbitorrent = require('../utils/torrent');

const SHAREWOOD_API_KEY = process.env.SHAREWOOD_API_KEY;

router.get('/latest', async (req, res) => {
  try {
    const response = await fetch(`https://www.sharewood.tv/api/${SHAREWOOD_API_KEY}/last-torrents?category=4&subcategory=27`);
    const latestTorrents = await response.json();

    // Utilisation de Promise.all pour attendre que toutes les promesses dans map soient résolues
    const parsedTorrents = await Promise.all(
      latestTorrents.map(parseTorrentMetadata)
    );

    // Filtrer les torrents sans seeders
    const filteredTorrents = parsedTorrents.filter(torrent => torrent !== null);

    res.json(filteredTorrents);
  } catch (error) {
    console.error('Error fetching latest torrents:', error);
    res.status(500).json({ error: 'Error fetching latest torrents' });
  }
});

router.get('/search', async (req, res) => {
  const query = req.query.query;
  try {
    const response = await fetch(`https://www.sharewood.tv/api/${SHAREWOOD_API_KEY}/search?name=${query}&category=4&subcategory=27`);
    const searchResults = await response.json();

    // Utilisation de Promise.all pour attendre que toutes les promesses dans map soient résolues
    const parsedResults = await Promise.all(
      searchResults.map(parseTorrentMetadata)
    );

    // Filtrer les torrents sans seeders
    const filteredResults = parsedResults.filter(torrent => torrent !== null);

    res.json(filteredResults);
  } catch (error) {
    console.error('Error fetching search results:', error);
    res.status(500).json({ error: 'Error fetching search results' });
  }
});

router.get('/download/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const torrentResponse = await qbitorrent.addTorrent(id);
    res.json(torrentResponse);
  } catch (error) {
    console.error('Error downloading torrent:', error);
    res.status(500).json({ error: 'Error downloading torrent' });
  }
});

async function parseTorrentMetadata(torrent) {
  if (!torrent.seeders) return null; // Ignorer les torrents sans seeders

  const name = torrent.name;
  let author = null;
  let title = name;

  // Détection du séparateur principal
  if (name.includes(" - ")) {
    const parts = name.split(" - ");
    author = parts[0].trim(); // L'auteur est avant le premier tiret
    title = parts.slice(1).join(" - ").trim(); // Le reste est le titre
  } else if (name.includes(",")) {
    const parts = name.split(",");
    if (parts.length > 2) {
      title = parts[0].trim();
      author = parts.slice(1, -1).join(",").trim(); // Concatène tout sauf la dernière partie
    } else {
      title = parts[0].trim();
      author = parts[1].trim();
    }
  }

  title = title
    .replace(/\b(FR|EN|Ang|French|English)\b/gi, "")
    .replace(/\b\d{4}\b/g, "")
    .replace(/\b(epub|pdf)\b/gi, "")
    .replace(/\s{2,}/g, " ")
    .trim();

  const typeMatch = /(pdf|epub)/i.exec(name);
  const type = typeMatch ? typeMatch[1].toUpperCase() : null;

  const languageMatch = /\b(FR|EN|Ang|French|English)\b/i.exec(name);
  const language = languageMatch ? languageMatch[0].toUpperCase() : "Inconnu";

  const isPackByName = /pack|intégrale|volumes|tomes/i.test(name);
  const isPackBySize = torrent.size > 10_000_000;
  const isPack = isPackByName || isPackBySize;

  const cover = await getBookCoverFromGoogleBooks(title);

  return {
    id: torrent.id,
    name: torrent.name,
    size: torrent.size,
    cover,
    author,
    title,
    type,
    language,
    isPack
  };
}

async function getBookCoverFromGoogleBooks(title) {
  const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(title)}&key=${process.env.GOOGLE_BOOKS_API_KEY}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    const book = data.items?.[0];
    return book?.volumeInfo?.imageLinks?.thumbnail || 'https://bookcart.azurewebsites.net/Upload/Default_image.jpg';
  } catch (error) {
    console.error('Error fetching book cover:', error);
    return null;
  }
}

module.exports = router;