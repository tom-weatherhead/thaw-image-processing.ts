// thaw-image-processing.ts/src/cli.ts

// E.g. : npm start -- -sc -w 235 -h 763 in.jpg out.jpg -q 34

import * as fs from 'fs';

import * as engine from '..';

// // CLI: resample-jpeg [-sn | -sl | -sc] -w dstWidth -h dstHeight
// // -sn = Nearest Neighbour
// // -sl = Bilinear
// // -sc = Bicubic

const fileManager = engine.createFileIOManager(fs);

// //const defaultSrcFilePath = 'test/input-files/unconventional-table.jpg';
const defaultSrcFilePath = 'test/input-files/fast-and-fourier.jpg';
// const defaultSrcFilePath =
// 	'test/input-files/Vermeer-Girl_with_Pearl_Earring1665_716x1024.png';

// // The option -q (JPEG export quality) is common to all operations; its value must be an integer in the range [0, 100].

// /*
// const dispatchDescriptors = {
// 	'c': {},
// 	'ds': {},
// 	'f': {},
// 	'gb': {},
// 	'm': {},
// 	'p': {},
// 	'rs': {
// 		func: engine.resampleImageFromJpegFile,
// 		defaultDstFilename: 'resample.jpg',
// 		optionsWithNoArguments: {
// 			'sc': options => { options.mode = engine.modeBicubic },
// 			'sl': options => { options.mode = engine.modeBilinear },
// 			'sn': options => { options.mode = engine.modeNearestNeighbour }
// 		},
// 		optionsWithOneArgument: {
// 			'h': {
// 				argumentName: 'height',
// 				argumentType: 'i'
// 			},
// 			'w': {
// 				argumentName: 'width',
// 				argumentType: 'i'
// 			}
// 		}
// 	},
// 	'r90ccw': {},
// 	'r90cw': {},
// 	'r180': {}
// };
// */

const dstFileExtension = engine.getExtensionFromFilePath(defaultSrcFilePath);

// **** JPEG ****

async function dispatchCompositeTest(argv: string[]): Promise<void> {
	let srcFilePath = defaultSrcFilePath;
	let dstFilePath = `test/output-files/composite-test.${dstFileExtension}`;

	if (!fs.existsSync(srcFilePath)) {
		console.log(`There is no file at the path ${srcFilePath}`);

		return;
	}

	for (let i = 0; i < argv.length; i++) {
		const arg = argv[i];

		if (arg.substr(0, 1) !== '-') {
			if (!srcFilePath) {
				srcFilePath = arg;
			} else if (!dstFilePath) {
				dstFilePath = arg;
			}
		}
	}

	console.log('Composite.');

	const srcImage = await fileManager.load(srcFilePath);
	const dstImage = engine.compositeTest(srcImage);

	await fileManager.save(dstImage, dstFilePath);
}

async function dispatchDesaturate(argv: string[]): Promise<void> {
	let srcFilePath = defaultSrcFilePath;
	let dstFilePath = `test/output-files/desaturate.${dstFileExtension}`;

	for (let i = 0; i < argv.length; i++) {
		const arg = argv[i];

		if (arg.substr(0, 1) !== '-') {
			if (!srcFilePath) {
				srcFilePath = arg;
			} else if (!dstFilePath) {
				dstFilePath = arg;
			}
		}
	}

	console.log('Desaturate.');

	const srcImage = await fileManager.load(srcFilePath);
	const dstImage = engine.desaturateImage(srcImage);

	await fileManager.save(dstImage, dstFilePath);
}

async function dispatchFlip(argv: string[]): Promise<void> {
	const srcFilePath = defaultSrcFilePath;
	const dstFilePath = `test/output-files/flip.${dstFileExtension}`;

	// for (let i = 0; i < argv.length; i++) {
	// 	const arg = argv[i];

	// 	if (arg.substr(0, 1) !== '-') {
	// 		if (!srcFilePath) {
	// 			srcFilePath = arg;
	// 		} else if (!dstFilePath) {
	// 			dstFilePath = arg;
	// 		}
	// 	}
	// }

	console.log('Flip:', argv);

	const srcImage = await fileManager.load(srcFilePath);
	const dstImage = engine.flipImage(srcImage);

	await fileManager.save(dstImage, dstFilePath);
}

async function dispatchGaussianBlur(argv: string[]): Promise<void> {
	let srcFilePath = defaultSrcFilePath;
	let dstFilePath = `test/output-files/gaussian-blur.${dstFileExtension}`;
	// let sigma = 1.0;
	let sigma = 4.0;
	// let kernelSize = 5; // kernelSize must be an odd positive integer smaller than 999.
	let kernelSize = 21;

	for (let i = 0; i < argv.length; i++) {
		const arg = argv[i];
		//const thereIsANextArg = i < argv.length - 1;

		if (arg.substr(0, 1) !== '-') {
			if (!srcFilePath) {
				srcFilePath = arg;
			} else if (!dstFilePath) {
				dstFilePath = arg;
			}
		} else if (i < argv.length - 1) {
			const nextArg = argv[i + 1];
			i++;

			if (arg === '-s') {
				sigma = parseFloat(nextArg);
			} else if (arg === '-ks') {
				kernelSize = parseInt(nextArg, 10);
				// } else if (arg === '-q') {
				// 	const dstQuality = parseInt(nextArg, 10);

				// 	jpegFileManager.setDstImageQuality(dstQuality);
			}
		}
	}

	console.log('Gaussian blur.');

	const srcImage = await fileManager.load(srcFilePath);
	const dstImage = engine.gaussianBlurImage(srcImage, sigma, kernelSize);

	await fileManager.save(dstImage, dstFilePath);
}

async function dispatchMirror(argv: string[]): Promise<void> {
	const srcFilePath = defaultSrcFilePath;
	const dstFilePath = `test/output-files/mirror.${dstFileExtension}`;

	// for (let i = 0; i < argv.length; i++) {
	// 	const arg = argv[i];

	// 	if (arg.substr(0, 1) !== '-') {
	// 		if (!srcFilePath) {
	// 			srcFilePath = arg;
	// 		} else if (!dstFilePath) {
	// 			dstFilePath = arg;
	// 		}
	// 	}
	// }

	console.log('Mirror:', argv);

	const srcImage = await fileManager.load(srcFilePath);
	const dstImage = engine.mirrorImage(srcImage);

	await fileManager.save(dstImage, dstFilePath);
}

async function dispatchPixelate(argv: string[]): Promise<void> {
	let srcFilePath = defaultSrcFilePath;
	let dstFilePath = `test/output-files/pixelate.${dstFileExtension}`;
	let pixelWidth = 8;
	let pixelHeight = 8;

	for (let i = 0; i < argv.length; i++) {
		const arg = argv[i];
		//const thereIsANextArg = i < argv.length - 1;

		if (arg.substr(0, 1) !== '-') {
			if (!srcFilePath) {
				srcFilePath = arg;
			} else if (!dstFilePath) {
				dstFilePath = arg;
			}
		} else if (i < argv.length - 1) {
			const nextArg = argv[i + 1];
			i++;

			if (arg === '-w') {
				pixelWidth = parseInt(nextArg, 10);
			} else if (arg === '-h') {
				pixelHeight = parseInt(nextArg, 10);
				// } else if (arg === '-q') {
				// 	const dstQuality = parseInt(nextArg, 10);

				// 	jpegFileManager.setDstImageQuality(dstQuality);
			}
		}
	}

	console.log('Pixelate.');

	const srcImage = await fileManager.load(srcFilePath);
	const dstImage = engine.pixelateImage(srcImage, pixelWidth, pixelHeight);

	await fileManager.save(dstImage, dstFilePath);
}

async function dispatchResample(argv: string[]): Promise<void> {
	let srcFilePath = defaultSrcFilePath;
	let dstFilePath = `test/output-files/resample.${dstFileExtension}`;
	let dstWidth = 0;
	let dstHeight = 0;
	const defaultDstWidth = 640;
	const defaultDstHeight = 480;
	let mode = engine.ResamplingMode.Bicubic;

	for (let i = 0; i < argv.length; i++) {
		const arg = argv[i];
		//const thereIsANextArg = i < argv.length - 1;

		if (arg.substr(0, 1) !== '-') {
			if (!srcFilePath) {
				srcFilePath = arg;
			} else if (!dstFilePath) {
				dstFilePath = arg;
			}
		} else if (arg === '-sn') {
			mode = engine.ResamplingMode.NearestNeighbour;
		} else if (arg === '-sl') {
			mode = engine.ResamplingMode.Bilinear;
		} else if (arg === '-sc') {
			mode = engine.ResamplingMode.Bicubic;
		} else if (i < argv.length - 1) {
			const nextArg = argv[i + 1];
			i++;

			if (arg === '-w') {
				dstWidth = parseInt(nextArg, 10);
			} else if (arg === '-h') {
				dstHeight = parseInt(nextArg, 10);
				// } else if (arg === '-q') {
				// 	const dstQuality = parseInt(nextArg, 10);

				// 	jpegFileManager.setDstImageQuality(dstQuality);
			}
		}
	}

	if (dstWidth !== dstWidth || dstWidth <= 0) {
		dstWidth = defaultDstWidth;
	}

	if (dstHeight !== dstHeight || dstHeight <= 0) {
		dstHeight = defaultDstHeight;
	}

	console.log('Resample.');

	const srcImage = await fileManager.load(srcFilePath);
	const dstImage = engine.resampleImage(
		srcImage,
		dstWidth,
		dstHeight,
		mode
	);

	await fileManager.save(dstImage, dstFilePath);
}

async function dispatchRotate90DegreesClockwise(
	argv: string[]
): Promise<void> {
	let srcFilePath = defaultSrcFilePath;
	let dstFilePath = `test/output-files/rotate90cw.${dstFileExtension}`;

	for (let i = 0; i < argv.length; i++) {
		const arg = argv[i];

		if (arg.substr(0, 1) !== '-') {
			if (!srcFilePath) {
				srcFilePath = arg;
			} else if (!dstFilePath) {
				dstFilePath = arg;
			}
		} else if (i < argv.length - 1) {
			// const nextArg = argv[i + 1];
			i++;

			// if (arg === '-q') {
			// 	const dstQuality = parseInt(nextArg, 10);

			// 	jpegFileManager.setDstImageQuality(dstQuality);
			// }
		}
	}

	console.log('Rotate 90 degrees clockwise.');

	const srcImage = await fileManager.load(srcFilePath);
	const dstImage = engine.rotate90DegreesClockwiseFromImage(srcImage);

	await fileManager.save(dstImage, dstFilePath);
}

async function dispatchRotate90DegreesCounterclockwise(
	argv: string[]
): Promise<void> {
	let srcFilePath = defaultSrcFilePath;
	let dstFilePath = `test/output-files/rotate90ccw.${dstFileExtension}`;

	for (let i = 0; i < argv.length; i++) {
		const arg = argv[i];

		if (arg.substr(0, 1) !== '-') {
			if (!srcFilePath) {
				srcFilePath = arg;
			} else if (!dstFilePath) {
				dstFilePath = arg;
			}
		} else if (i < argv.length - 1) {
			// const nextArg = argv[i + 1];
			i++;

			// if (arg === '-q') {
			// 	const dstQuality = parseInt(nextArg, 10);

			// 	jpegFileManager.setDstImageQuality(dstQuality);
			// }
		}
	}

	console.log('Rotate 90 degrees counter-clockwise.');

	const srcImage = await fileManager.load(srcFilePath);
	const dstImage = engine.rotate90DegreesCounterclockwiseFromImage(
		srcImage
	);

	await fileManager.save(dstImage, dstFilePath);
}

async function dispatchRotate180Degrees(argv: string[]): Promise<void> {
	let srcFilePath = defaultSrcFilePath;
	let dstFilePath = `test/output-files/rotate180.${dstFileExtension}`;

	for (let i = 0; i < argv.length; i++) {
		const arg = argv[i];

		if (arg.substr(0, 1) !== '-') {
			if (!srcFilePath) {
				srcFilePath = arg;
			} else if (!dstFilePath) {
				dstFilePath = arg;
			}
		} else if (i < argv.length - 1) {
			// const nextArg = argv[i + 1];
			i++;

			// if (arg === '-q') {
			// 	const dstQuality = parseInt(nextArg, 10);

			// 	jpegFileManager.setDstImageQuality(dstQuality);
			// }
		}
	}

	console.log('Rotate 180 degrees.');
	// engine.rotate180DegreesFromJpegFile(
	// 	jpegFileManager,
	// 	srcFilePath,
	// 	dstFilePath
	// );

	const srcImage = await fileManager.load(srcFilePath);
	const dstImage = engine.rotate180DegreesFromImage(srcImage);

	await fileManager.save(dstImage, dstFilePath);
}

async function dispatch(argv: string[]): Promise<void> {
	const command = argv.shift();

	switch (command) {
		case 'c':
			await dispatchCompositeTest(argv);
			break;

		case 'ds':
			await dispatchDesaturate(argv);
			break;

		case 'f':
			await dispatchFlip(argv);
			break;

		case 'gb':
			await dispatchGaussianBlur(argv);
			break;

		case 'm':
			await dispatchMirror(argv);
			break;

		case 'p':
			await dispatchPixelate(argv);
			break;

		case 'rs':
			await dispatchResample(argv);
			break;

		case 'r90ccw':
			await dispatchRotate90DegreesCounterclockwise(argv);
			break;

		case 'r90cw':
			await dispatchRotate90DegreesClockwise(argv);
			break;

		case 'r180':
			await dispatchRotate180Degrees(argv);
			break;

		default:
			console.error('Unrecognized command:', command);
			break;
	}
}

dispatch(process.argv.slice(2).filter((arg) => arg !== '--'))
	.then(() => {
		console.log('dispatch() : Success');
	})
	.catch((error) => {
		console.error('dispatch() : Error:', typeof error, error);
	});
