const path = require('path');

require('dotenv').config({ path: path.resolve(__dirname, '.env.json') });

module.exports = {
	retries: process.env.PLAYWRIGHT_RETRIES,
	workers: process.env.PLAYWRIGHT_WORKERS,
	use: {
		baseURL: process.env.PLAYWRIGHT_BASE_URL
	}
};
