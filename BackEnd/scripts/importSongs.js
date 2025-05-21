const fs = require('fs');
const path = require('path');
const mm = require('music-metadata');
const db = require('../db');

const audioDir = path.join(__dirname, '..', 'uploads', 'audio');

async function importSongs() {
  const files = fs.readdirSync(audioDir);

  for (const file of files) {
    if (!file.match(/\.(mp3|wav|ogg|flac)$/i)) continue;

    const filePath = path.join(audioDir, file);
    let title = path.parse(file).name;
    let artist = '';
    let album = '';
    let duration = 0;
    let img_url = '';

    try {
      const metadata = await mm.parseFile(filePath);
      title = metadata.common.title || title;
      artist = metadata.common.artist || '';
      album = metadata.common.album || '';
      duration = metadata.format.duration ? Math.round(metadata.format.duration) : 0;

      // If cover art is present, save it as an image file and set img_url
      if (metadata.common.picture && metadata.common.picture.length > 0) {
        const picture = metadata.common.picture[0];
        const imgFileName = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_cover.${picture.format.split('/')[1] || 'jpg'}`;
        const imgPath = path.join(__dirname, '..', 'uploads', 'covers', imgFileName);
        fs.mkdirSync(path.dirname(imgPath), { recursive: true });
        fs.writeFileSync(imgPath, picture.data);
        img_url = `/uploads/covers/${imgFileName}`;
      }
    } catch (err) {
      console.warn(`Metadata read failed for ${file}: ${err.message}`);
    }

    const audio_url = `/uploads/audio/${file}`;

    try {
      await db.query(
        'INSERT INTO songs (title, artist, album, duration, audio_url, img_url) VALUES ($1, $2, $3, $4, $5, $6)',
        [title, artist, album, duration, audio_url, img_url]
      );
      console.log(`Inserted: ${title}`);
    } catch (err) {
      console.error(`Error inserting ${file}:`, err.message);
    }
  }

  console.log('Import complete!');
  process.exit();
}

importSongs();