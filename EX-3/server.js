
// server.js
const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {
    const url = req.url;
    const method = req.method;

    console.log(`Received ${method} request for ${url}`);

    if (url === '/' && method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        return res.end('Welcome to the Home Page');
    }

    if (url === '/contact' && method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(`
          <form method="POST" action="/contact">
            <input type="text" name="name" placeholder="Your name" />
            <button type="submit">Submit</button>
          </form>
        `);
        return;
    }

    if (url === '/contact' && method === 'POST') {
        // Implement form submission handling
        let body = '';
        req.on('data', (chunk) => {
            body += chunk.toString();
        });

        req.on('end', () => {
            console.log('Raw data:', body);

            // Parse URL-encoded data
            const params = new URLSearchParams(body);
            const name = params.get('name');

            console.log('Parsed name', name);

            // Bonus 1: validate input

            if(!name || name.trim()===''){
                res.writeHead(400, { 'Content-Type': 'text/html' });
                return res.end(`                
                <h1>Error</h1>
                <p>Name cannot be empty.</p>
                <a href="/contact">Go Back</a>
                `);
            }

            // Write into file (use append here)
            fs.appendFile('submissions.txt', name + '\n',(err) => {
                if (err){
                    console.error(err);
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    return res.end('Server Error');
                }

                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(`
                <p>Your name "${name}" was submitted successfully.</p>
                <a href="/contact">Go back</a>
                `);
            })

        })

        // Handle request errors
        req.on('error', (err) => {
            console.error('Request error:', err);
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Request error');
        });

        return;

    }

    else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        return res.end('404 Not Found');
    }
});

server.listen(3000, () => {
    console.log('Server is running at http://localhost:3000');
});
