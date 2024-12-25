const e = require('express')
const router = require('express').Router()
const qbitorrent = require('../utils/torrent')

const SHAREWOOD_API_KEY = process.env.SHAREWOOD_API_KEY

router.get('/latest', async (req, res) => {
  const latestTorrents = await fetch(`https://www.sharewood.tv/api/${SHAREWOOD_API_KEY}/last-torrents?category=4&subcategory=27`)
    .then(response => response.json());

  const parsedTorrents = latestTorrents
    .map(parseTorrentMetadata)
    .filter(torrent => torrent !== null); // Filtrer les torrents sans seeders

  res.json(parsedTorrents);
});


router.get('/search', async (req, res) => {
  const query = req.query.query;
  const searchResults = await fetch(`https://www.sharewood.tv/api/${SHAREWOOD_API_KEY}/search?name=${query}&category=4&subcategory=27`)
    .then(response => response.json());

  const parsedResults = searchResults
    .map(parseTorrentMetadata)
    .filter(torrent => torrent !== null); // Filtrer les torrents sans seeders

  res.json(parsedResults);
});

router.get('/download/:id', async (req, res) => {
  const id = req.params.id

  res.json(await qbitorrent.addTorrent(id))

})


function parseTorrentMetadata(torrent) {
  if (!torrent.seeders) return null; // Ignorer les torrents sans seeders

  const name = torrent.name;

  // Initialisation des variables
  let author = null;
  let title = name;

  // Détection du séparateur principal
  if (name.includes(" - ")) {
    // Cas où le séparateur est un tiret
    const parts = name.split(" - ");
    author = parts[0].trim(); // L'auteur est avant le premier tiret
    title = parts.slice(1).join(" - ").trim(); // Le reste est le titre
  } else if (name.includes(",")) {
    // Cas où le séparateur est une virgule
    const parts = name.split(",");
    if (parts.length > 2) {
      // Supposons que le titre est la première partie et les auteurs suivent
      title = parts[0].trim();
      author = parts.slice(1, -1).join(",").trim(); // Concatène tout sauf la dernière partie
    } else {
      // Cas particulier avec seulement deux parties
      title = parts[0].trim();
      author = parts[1].trim();
    }
  }

  // Nettoyage du titre : retirer l'année, langue et type
  title = title
    .replace(/\b(FR|EN|Ang|French|English)\b/gi, "") // Supprimer les mentions de langue
    .replace(/\b\d{4}\b/g, "") // Supprimer l'année
    .replace(/\b(epub|pdf)\b/gi, "") // Supprimer le type
    .replace(/\s{2,}/g, " ") // Supprimer les espaces multiples
    .trim();

  // Détection du type (PDF ou EPUB)
  const typeMatch = /(pdf|epub)/i.exec(name);
  const type = typeMatch ? typeMatch[1].toUpperCase() : null;

  // Détection de la langue
  const languageMatch = /\b(FR|EN|Ang|French|English)\b/i.exec(name);
  const language = languageMatch ? languageMatch[0].toUpperCase() : "Inconnu";

  // Vérification si c'est un pack (basé sur le nom ou la taille)
  const isPackByName = /pack|intégrale|volumes|tomes/i.test(name);
  const isPackBySize = torrent.size > 10_000_000; // Exemple : 10 Mo ou plus pour un pack
  const isPack = isPackByName || isPackBySize;

  return {
    id: torrent.id,
    name: torrent.name,
    size: torrent.size,
    author,
    title,
    type,
    language,
    isPack
  };
}

module.exports = router