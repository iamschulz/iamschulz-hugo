// import dependencies
const fs = require("fs");
const mime = require("mime-types");
const webp = require("webp-converter");
const sharp = require("sharp");

// globals
const consoleLog = console.log;
const images = [];

// parse args
const config = {};
process.argv
	.filter((cnf) => cnf.includes("="))
	.forEach((cnf) => {
		config[cnf.split("=")[0]] = cnf.split("=")[1];
	});
const dir = config.dir ? config.dir : "./public";
const override = config.override ? config.override : false;

// methods
const getWebpPath = (path) => {
	let splitPath = path.split(".");
	splitPath.pop();
	return splitPath.join(".") + ".webp";
};

const getAvifPath = (path) => {
	let splitPath = path.split(".");
	splitPath.pop();
	return splitPath.join(".") + ".avif";
};

const crawlDir = (dir) => {
	fs.readdirSync(dir).forEach((file) => {
		const path = `${dir}/${file}`;
		const isDir = fs.lstatSync(path).isDirectory();
		const mimetype = mime.lookup(path);
		const webpPath = getWebpPath(path);
		const webpExists = fs.existsSync(webpPath) && !override;

		if (
			!webpExists &&
			((mimetype && mimetype.split("/")[1] === "jpeg") ||
				(mimetype && mimetype.split("/")[1] === "png") ||
				(mimetype && mimetype.split("/")[1] === "gif"))
		) {
			images.push(path);
		} else if (isDir) {
			crawlDir(path);
		}
	});
};

const enableLog = () => {
	console.log = consoleLog;
};
const disableLog = () => {
	console.log = function () {};
};

// todo: fix animated gifs in avif
// todo: fix progression counter
const convertImage = (imageUrl, index) => {
	const mimetype = mime.lookup(imageUrl);
	const webpPath = getWebpPath(imageUrl);
	const avifPath = getAvifPath(imageUrl);

	const isAnimated = mimetype && mimetype.split("/")[1] === "gif";

	process.stdout.clearLine();
	process.stdout.cursorTo(0);
	process.stdout.write(`converting ${index + 1}/${images.length}...`);

	//disableLog();

	fs.readFile(imageUrl, (err, inputBuffer) => {
		if (err) {
			console.error(err);
			return;
		}

		sharp(inputBuffer, { animated: isAnimated })
			.webp({ quality: 85, speed: 1 })
			.toFile(webpPath, (err, info) => {});

		sharp(inputBuffer, { animated: isAnimated })
			.avif({ quality: 55, speed: 1 })
			.toFile(avifPath, (err, info) => {});
	});

	//enableLog();

	if (index + 1 >= images.length) {
		process.stdout.write("\ndone.\n");
	}
};

// exec
console.log("\nConverting images to webp...");
crawlDir(dir);
console.log(`found ${images.length} new files`);
images.forEach((imageUrl, index) => {
	convertImage(imageUrl, index);
});
