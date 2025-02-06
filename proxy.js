import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();
const PORT = 3001;
const BASE_URL = 'http://192.168.1.201:5003';

app.use(cors());
app.use(express.json());

app.post('/proxy/auth', async (req, res) => {
    try {
        const response = await fetch(`${BASE_URL}/api/auth/generate_token`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(req.body),
        });

        const data = await response.json();
        console.log("Token Response:", data);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch data from backend' });
    }
});

app.post('/proxy/group/add', async (req, res) => {
    try {
        console.log("Forwarding request to backend...");
        console.log("Headers:", req.headers);
        console.log("Body:", req.body);

        const response = await fetch(`${BASE_URL}/api/group/add`, {
            method: 'POST',
            headers: {
                'Authorization': req.headers.authorization,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(req.body),
        });

        const text = await response.text();
        console.log("Response from backend:", text);

        res.status(response.status).send(text);
    } catch (error) {
        console.error("Error in proxy:", error);
        res.status(500).json({ error: 'Failed to add group' });
    }
});

app.post('/proxy/group/list', async (req, res) => {
    const page = req.query.p || 1;
    try {
        const response = await fetch(`${BASE_URL}/api/group/list?p=${page}`, {
            method: 'POST',
            headers: {
                'Authorization': req.headers.authorization,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(req.body),
        });

        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to list groups' });
    }
});

app.post('/proxy/group/:group_id', async (req, res) => {
    const { group_id } = req.params;
    console.log(`Fetching group with ID: ${group_id}`);
    console.log("Request Body:", req.body);

    try {
        const response = await fetch(`${BASE_URL}/api/group/${group_id}`, {
            method: 'POST',
            headers: {
                'Authorization': req.headers.authorization,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(req.body),
        });

        const text = await response.text();
        console.log("Raw Response:", text); 

        try {
            const data = JSON.parse(text);
            res.json(data);
        } catch (jsonError) {
            console.error("Failed to parse JSON:", jsonError);
            res.status(500).json({ error: "Invalid JSON response from API", rawResponse: text });
        }
    } catch (error) {
        console.error("Error fetching group:", error);
        res.status(500).json({ error: 'Failed to fetch group by ID' });
    }
});

app.post('/proxy/group/edit', async (req, res) => {
    try {
        const response = await fetch(`${BASE_URL}/api/group/edit`, {
            method: 'POST',
            headers: {
                'Authorization': req.headers.authorization,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(req.body),
        });

        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to edit group' });
    }
});

app.post('/proxy/group/delete', async (req, res) => {
    try {
        const response = await fetch(`${BASE_URL}/api/group/delete`, {
            method: 'POST',
            headers: {
                'Authorization': req.headers.authorization,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(req.body),
        });

        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete group' });
    }
});

app.listen(PORT, () => console.log(`Proxy running on http://127.0.0.1:${PORT}`));
