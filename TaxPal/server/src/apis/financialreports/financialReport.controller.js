const financialReportService = require('./financialReport.service');
const url = require('url');
const fs = require('fs');

exports.handleRequest = async function(req, res) {
    const parsedUrl = url.parse(req.url, true);
    const method = req.method;
    const pathname = parsedUrl.pathname;

    // POST /api/financialReports/generate
    if (method === 'POST' && pathname === '/api/financialReports/generate') {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', async () => {
            try {
                const data = JSON.parse(body);
                const report = await financialReportService.generateReport(data);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true, report }));
            } catch (err) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, error: err.message }));
            }
        });
        return;
    }

    // GET /api/financialReports?userId=xxx
    if (method === 'GET' && pathname === '/api/financialReports') {
        const userId = parsedUrl.query.userId;
        try {
            const reports = await financialReportService.listReports(userId);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true, reports }));
        } catch (err) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, error: err.message }));
        }
        return;
    }

    // GET /api/financialReports/:id/download
    const downloadMatch = pathname.match(/^\/api\/financialReports\/([^\/]+)\/download$/);
    if (method === 'GET' && downloadMatch) {
        const id = downloadMatch[1];
        try {
            const filePath = await financialReportService.getReportFilePath(id);
            fs.createReadStream(filePath)
                .on('error', () => {
                    res.writeHead(404, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: false, error: 'File not found' }));
                })
                .pipe(res);
        } catch (err) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, error: err.message }));
        }
        return;
    }

    // Not found
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: false, error: 'Not found' }));
};

// Express-style controller functions

exports.generateReport = async (req, res) => {
    try {
        const data = req.body;
        const report = await financialReportService.generateReport(data);
        res.status(200).json({ success: true, ...report });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

exports.listReports = async (req, res) => {
    try {
        const userId = req.query.userId;
        const reports = await financialReportService.listReports(userId);
        res.status(200).json({ success: true, reports });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

exports.downloadReport = async (req, res) => {
    try {
        const id = req.params.id;
        const filePath = await financialReportService.getReportFilePath(id);
        res.download(filePath);
    } catch (err) {
        res.status(404).json({ success: false, error: err.message });
    }
};
