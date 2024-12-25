const axios = require('axios');
const FormData = require('form-data');
const QBITTORRENT_URL = process.env.QBITTORRENT_URL;

/**
 * Ajoute un torrent à qBittorrent à partir d'une URL.
 * @param {string} torrentUrl - URL du fichier torrent ou lien magnet.
 */
async function addTorrent(id) {
  const cookie = await getCookie();

  torrentUrl = `https://www.sharewood.tv/api/${process.env.SHAREWOOD_API_KEY}/${id}/download`

  if (!cookie) {
    console.error('Impossible de récupérer le cookie.');
    return;
  }

  const formData = new FormData();
  formData.append('urls', torrentUrl); // URL du torrent
  formData.append('category', 'frindle'); // Catégorie par défaut

  try {
    const response = await axios.post(`${QBITTORRENT_URL}/api/v2/torrents/add`, formData, {
      headers: {
        ...formData.getHeaders(),
        Cookie: cookie, // Cookie pour l'authentification
      },
    });

    console.log('Torrent ajouté avec succès :', response.status, response.data);
  } catch (error) {
    console.error('Erreur lors de l\'ajout du torrent :', error.response?.data || error.message);
  }
}

/**
 * Fonction pour récupérer le cookie de session.
 * @returns {string} - Cookie de session.
 */
async function getCookie() {
  const username = process.env.QBITTORRENT_USERNAME;
  const password = process.env.QBITTORRENT_PASSWORD;

  const formData = new FormData();
  formData.append('username', username);
  formData.append('password', password);

  try {
    const response = await axios.post(`${QBITTORRENT_URL}/api/v2/auth/login`, formData, {
      headers: formData.getHeaders(),
    });

    const rawCookie = response.headers['set-cookie'];
    const match = rawCookie && rawCookie[0].match(/SID=([^;]+);/);
    const cookie = match ? `SID=${match[1]}` : null;

    console.log('Cookie récupéré :', cookie);
    return cookie;
  } catch (error) {
    console.error('Erreur lors de la récupération du cookie :', error.response?.data || error.message);
    return null;
  }
}

module.exports = {
  addTorrent,
};