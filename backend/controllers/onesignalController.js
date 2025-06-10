const pool = require('../db');

exports.savePlayerId = async (req, res) => {
  const { player_id, user_id } = req.body;

  if (!player_id || !user_id) {
    return res.status(400).json({ message: 'Player ID and User ID are required' });
  }

  try {
    // Cek apakah player_id sudah ada untuk user tersebut
    const exists = await pool.query(
      'SELECT * FROM onesignal_ids WHERE player_id = $1 AND user_id = $2',
      [player_id, user_id]
    );

    if (exists.rows.length > 0) {
      return res.status(200).json({ message: 'Player ID already exists for this user' });
    }

    // Simpan player_id baru
    await pool.query(
      'INSERT INTO onesignal_ids (player_id, user_id) VALUES ($1, $2)',
      [player_id, user_id]
    );

    res.status(201).json({ message: 'Player ID saved successfully' });
  } catch (err) {
    console.error('Error saving player ID:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};