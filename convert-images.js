// import dependencies
const fs = require('fs');
const mime = require('mime-types');
const webp = require('webp-converter');

// globals
const consoleLog = console.log;
const images = [];
const gifs = [];

// parse args
const config = {};
process.argv.filter(cnf => cnf.includes('=')).forEach((cnf) => {
    config[cnf.split('=')[0]] = cnf.split('=')[1];
});
const dir = config.dir ? config.dir : './public';
const override = config.override ? config.override : false;

// methods
const getWebpPath = (path) => {
    let splitPath = path.split(".");
    splitPath.pop();
    return splitPath.join(".") + ".webp";
}

const crawlDir = (dir) => {
    fs.readdirSync(dir).forEach(file => {
        const path = `${dir}/${file}`;
        const isDir = fs.lstatSync(path).isDirectory();
        const mimetype = mime.lookup(path);
        const webpPath = getWebpPath(path);
        const webpExists = fs.existsSync(webpPath) && !override;

        if (
            (!webpExists) && (
                mimetype && mimetype.split('/')[1] === 'jpeg'
                || mimetype && mimetype.split('/')[1] === 'png'
            )
        ) {
            images.push(path);
        } else if (
            (!webpExists) && (
                mimetype && mimetype.split('/')[1] === 'gif'
            )
        ) {
            gifs.push(path);
        } else if (isDir) {
            crawlDir(path);
        }
    });
}

const enableLog = () => { console.log = consoleLog };
const disableLog = () => { console.log = function() {} };

const convertImage = image => {
    const webpPath = getWebpPath(image);

    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    process.stdout.write(`converting ${image}`);

    disableLog();
    webp.cwebp(image, webpPath, "-q 85", function (status, error) {

        //if conversion successful status will be '100'
        //if conversion fails status will be '101'
        if (status > 100) {
            process.stdout.clearLine();
            process.stdout.cursorTo(0);
            enableLog();
            console.error('failed to convert', image);
            disableLog();
        }
    });
    enableLog();
}

const convertGif = image => {
    const webpPath = getWebpPath(image);

    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    process.stdout.write(`converting ${image}`);

    disableLog();
    webp.gwebp(image, webpPath, "-q 85", function (status, error) {

        //if conversion successful status will be '100'
        //if conversion fails status will be '101'
        if (status > 100) {
            enableLog();
            process.stdout.clearLine();
            process.stdout.cursorTo(0);
            console.error('failed to convert', image);
            disableLog();
        }
    });
    enableLog();
}

// exec
crawlDir(dir);
console.log(`found ${images.length + gifs.length} files`);
images.forEach((image) => {convertImage(image)});
gifs.forEach((image) => {convertGif(image)});