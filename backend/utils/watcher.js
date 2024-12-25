const chokidar = require('chokidar');
const mailer = require('./mailer');
require('dotenv').config();

class FileWatcher {
  constructor() {
    this.watcher = null;
  }

  initialize() {
    console.log('Initialisation du watcher...');

    this.watcher = chokidar.watch(process.env.WATCH_FOLDER, {
      persistent: true
    });

    this.watcher.on('add', async (filepath) => {
      console.log(`Nouveau fichier détecté: ${filepath}`);
      try {
        await mailer.sendToKindle(filepath);
        console.log(`Fichier envoyé avec succès: ${filepath}`);
      } catch (error) {
        console.error(`Erreur lors de l'envoi du fichier: ${filepath}`, error);
      }
    });

    this.watcher.on('error', error => {
      console.error(`Erreur de surveillance: ${error}`);
    });
  }

  getStatus() {
    return {
      status: 'running',
      watchedFolder: process.env.WATCH_FOLDER
    };
  }
}

module.exports = new FileWatcher();