const db = require('../models/db');

exports.getUrlAnalytics = async (req, res) => {
  try {
    const { urlId } = req.params;
    
    // Verify ownership
    const urlCheck = await db.query('SELECT * FROM urls WHERE id = $1 AND user_id = $2', [urlId, req.user.id]);
    if (urlCheck.rows.length === 0) return res.status(403).json({ error: 'Unauthorized' });

    const totalClicks = await db.query('SELECT COUNT(*) FROM clicks WHERE url_id = $1', [urlId]);
    const uniqueClicks = await db.query('SELECT COUNT(DISTINCT visitor_id) FROM clicks WHERE url_id = $1', [urlId]);
    const deviceStats = await db.query('SELECT device_type, COUNT(*) as count FROM clicks WHERE url_id = $1 GROUP BY device_type', [urlId]);

    res.json({
      total: totalClicks.rows[0].count,
      unique: uniqueClicks.rows[0].count,
      devices: deviceStats.rows
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};