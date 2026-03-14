const fs = require('fs');
const http = require('http');
const https = require('https');
const path = require('path');

const dir = path.join(__dirname, 'assets');
if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
}

const filesToProcess = ['index.html', 'equipe.html', 'eventos.html', 'registros.html', 'contato.html', 'script.js'];

async function downloadImage(url, dest) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(dest);
        https.get(url, function(response) {
            response.pipe(file);
            file.on('finish', function() {
                file.close(resolve);
            });
        }).on('error', function(err) {
            fs.unlink(dest, () => {});
            reject(err);
        });
    });
}

async function processFiles() {
    const urls = new Set();
    
    // First pass: extract all Imgur URLs
    for (const file of filesToProcess) {
        if (!fs.existsSync(file)) continue;
        const text = fs.readFileSync(file, 'utf8');
        const regex = /https:\/\/i\.imgur\.com\/([a-zA-Z0-9]+)\.(png|jpeg|jpg|mp4)/g;
        let match;
        while ((match = regex.exec(text)) !== null) {
            urls.add(match[0]);
        }
    }
    
    console.log(`Found ${urls.size} images/videos to download.`);
    
    // Download all
    const mapping = {};
    for (const url of urls) {
        const filename = url.split('/').pop();
        const dest = path.join(dir, filename);
        console.log(`Downloading ${url} -> ${dest}`);
        try {
            await downloadImage(url, dest);
            mapping[url] = `assets/${filename}`;
        } catch (e) {
            console.error(`Failed to download ${url}`, e);
        }
    }
    
    // Second pass: replace URLs in files
    for (const file of filesToProcess) {
        if (!fs.existsSync(file)) continue;
        let text = fs.readFileSync(file, 'utf8');
        let changed = false;
        
        for (const [url, localPath] of Object.entries(mapping)) {
            if (text.includes(url)) {
                text = text.split(url).join(localPath);
                changed = true;
            }
        }
        
        if (changed) {
            fs.writeFileSync(file, text);
            console.log(`Updated ${file}`);
        }
    }
    
    console.log("Done!");
}

processFiles();
