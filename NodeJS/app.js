const http = require('http')
const fs = require('fs')
const path = require("path");
const PORT = 3000;


function createPath(page){
    return path.resolve(__dirname,'../Pages', page + '.html');
}


const server = http.createServer((req, res) => {
    console.log(`Server request: ${req.url}`);
    res.setHeader('Content-Type', 'text/html');

    let basePath = '';

    switch (req.url) {
        case '/registration':
            basePath = createPath('RegistrationPage')
            break
        case '/login':
            basePath = createPath('LoginPage')
            break
        default:
            basePath = createPath('NotFoundPage')
            break
    }

    fs.readFile(basePath, (err,data)=>{
        if (err){
            console.log(err);
            res.end();
        }else{
            res.write(data);
            res.end();
        }
    })
});

server.listen(PORT, 'localhost', (error) => {
    error ? console.log(error) : console.log(`listening port ${PORT}`);
})


