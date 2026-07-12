const https = require('https');
https.get('https://www.youtube.com/results?search_query=gayatri+mantra+tamil', (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        const match = data.match(/"videoId":"([^"]{11})"/);
        if (match) {
            console.log(match[1]);
        } else {
            console.log("No match found");
        }
    });
}).on('error', (err) => {
    console.error(err);
});
