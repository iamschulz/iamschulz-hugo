const fs = require('fs');
const mime = require('mime-types');
const webp = require('webp-converter');
const testFolder = './dist';

//pass input image(.jpeg,.pnp .....) path ,output image(give path where to save and image file name with .webp extension)
//pass option(read  documentation for options)

//cwebp(input,output,option,result_callback)

webp.cwebp("input.jpg", "output.webp", "-q 80", function (status, error) {
    //if conversion successful status will be '100'
    //if conversion fails status will be '101'
    console.log(status, error);
});

const crawlDir = (dir) => {
    fs.readdirSync(dir).forEach(file => {
        const path = `${dir}/${file}`;
        const isDir = fs.lstatSync(path).isDirectory();
        const mimetype = mime.lookup(path);

        if (mimetype && mimetype.split('/')[0] === 'image') {
            images.push(path);
        } else if (isDir) {
            crawlDir(path);
        }
    });
}

const images = [];
crawlDir(testFolder);
images.forEach(image => {

    webp.cwebp(image, "./output.webp", "-q 100", function (status, error) {

        //if conversion successful status will be '100'
        //if conversion fails status will be '101'
        if (status > 100) {
            console.error(image, 'failed to convert');
        }
    });
})