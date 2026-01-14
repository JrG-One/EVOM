const axios = require('axios');

const executeCode = async (req, res) => {
    try {
        const { language, code, input } = req.body;

        if (!language || !code) {
            return res.status(400).json({ error: 'Language and code are required' });
        }

        const runnerUrl = process.env.CODE_RUNNER_URL || 'http://localhost:5001';
        const serviceSecret = process.env.SERVICE_SECRET;

        const response = await axios.post(`${runnerUrl}/execute`, {
            language,
            code,
            input_data: input || ""
        }, {
            headers: {
                'X-Service-Token': serviceSecret,
                'Content-Type': 'application/json'
            }
        });

        res.json(response.data);

    } catch (error) {
        console.error('Code execution failed:', error.message);
        if (error.response) {
             return res.status(error.response.status).json(error.response.data);
        }
        res.status(500).json({ error: 'Internal Server Error during code execution' });
    }
};

module.exports = { executeCode };
