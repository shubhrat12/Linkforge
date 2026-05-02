// --- services/analyticsQueue.js ---
const { Queue } = require('bullmq');
const redis = require('./redis');

const clickQueue = new Queue('clicks', { connection: redis });

exports.enqueueClickEvent = async (data) => {
  await clickQueue.add('click', data);
};