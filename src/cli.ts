// thaw-image-processing.ts/src/cli.ts

// E.g. : npm start -- -sc -w 235 -h 763 in.jpg out.jpg -q 34

import * as fs from 'fs';

import * as engine from '..';

// // CLI: resample-jpeg [-sn | -sl | -sc] -w dstWidth -h dstHeight
// // -sn = Nearest Neighbour
// // -sl = Bilinear
// // -sc = Bicubic

const jpegFileManager = engine.createJpegFileManager(fs);
const pngFileManager = engine.createPngFileManager(fs);

const fileManager = engine.createFileIOManager(fs);

// //const defaultSrcFilePath = 'test/input-files/unconventional-table.jpg';
// const defaultSrcFilePath = 'test/input-files/fast-and-fourier.jpg';
const defaultSrcFilePath =
	'test/input-files/Vermeer-Girl_with_Pearl_Earring1665_716x1024.png';

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

// **** JPEG ****

function dispatchCompositeTest(argv: string[]): void {
	let srcFilePath = defaultSrcFilePath;
	let dstFilePath = 'test/output-files/composite-test.jpg';

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
	engine.compositeTestFromJpegFile(
		jpegFileManager,
		srcFilePath,
		dstFilePath
	);
}

function dispatchDesaturate(argv: string[]): void {
	let srcFilePath = defaultSrcFilePath;
	let dstFilePath = 'test/output-files/desaturate.jpg';

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
	engine.mapColoursInImageFromJpegFile(
		jpegFileManager,
		srcFilePath,
		dstFilePath,
		engine.desaturateRGBA
	);
}

function dispatchFlip(argv: string[]): void {
	const srcFilePath = defaultSrcFilePath;
	const dstFilePath = 'test/output-files/flip.jpg';

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
	engine.flipImageFromJpegFile(jpegFileManager, srcFilePath, dstFilePath);
}

function dispatchGaussianBlur(argv: string[]): void {
	let srcFilePath = defaultSrcFilePath;
	let dstFilePath = 'test/output-files/gaussian-blur.jpg';
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
			} else if (arg === '-q') {
				const dstQuality = parseInt(nextArg, 10);

				jpegFileManager.setDstImageQuality(dstQuality);
			}
		}
	}

	console.log('Gaussian blur.');
	engine.gaussianBlurImageFromJpegFile(
		jpegFileManager,
		srcFilePath,
		dstFilePath,
		sigma,
		kernelSize
	);
}

function dispatchMirror(argv: string[]): void {
	const srcFilePath = defaultSrcFilePath;
	const dstFilePath = 'test/output-files/mirror.jpg';

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
	engine.mirrorImageFromJpegFile(jpegFileManager, srcFilePath, dstFilePath);
}

function dispatchPixelate(argv: string[]): void {
	let srcFilePath = defaultSrcFilePath;
	let dstFilePath = 'test/output-files/pixelate.jpg';
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
			} else if (arg === '-q') {
				const dstQuality = parseInt(nextArg, 10);

				jpegFileManager.setDstImageQuality(dstQuality);
			}
		}
	}

	console.log('Pixelate.');
	engine.pixelateImageFromJpegFile(
		jpegFileManager,
		srcFilePath,
		dstFilePath,
		pixelWidth,
		pixelHeight
	);
}

function dispatchResample(argv: string[]): void {
	let srcFilePath = defaultSrcFilePath;
	let dstFilePath = 'test/output-files/resample.jpg';
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
			} else if (arg === '-q') {
				const dstQuality = parseInt(nextArg, 10);

				jpegFileManager.setDstImageQuality(dstQuality);
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
	engine.resampleImageFromJpegFile(
		jpegFileManager,
		srcFilePath,
		dstFilePath,
		dstWidth,
		dstHeight,
		mode
	);
}

// function dispatchRotate90DegreesClockwise(argv: string[]): void {
async function dispatchRotate90DegreesClockwise(argv: string[]): Promise<void> {
	let srcFilePath = defaultSrcFilePath;
	// let dstFilePath = 'test/output-files/rotate90cw.jpg';
	let dstFilePath = 'test/output-files/rotate90cw.png';

	for (let i = 0; i < argv.length; i++) {
		const arg = argv[i];

		if (arg.substr(0, 1) !== '-') {
			if (!srcFilePath) {
				srcFilePath = arg;
			} else if (!dstFilePath) {
				dstFilePath = arg;
			}
		} else if (i < argv.length - 1) {
			const nextArg = argv[i + 1];
			i++;

			if (arg === '-q') {
				const dstQuality = parseInt(nextArg, 10);

				jpegFileManager.setDstImageQuality(dstQuality);
			}
		}
	}

	console.log('Rotate 90 degrees clockwise.');

	const srcImage = await fileManager.load(srcFilePath);
	const dstImage = engine.rotate90DegreesClockwiseFromImage(srcImage);

	await fileManager.save(dstImage, dstFilePath);
}

function dispatchRotate90DegreesCounterclockwise(argv: string[]): void {
	let srcFilePath = defaultSrcFilePath;
	let dstFilePath = 'test/output-files/rotate90ccw.jpg';

	for (let i = 0; i < argv.length; i++) {
		const arg = argv[i];

		if (arg.substr(0, 1) !== '-') {
			if (!srcFilePath) {
				srcFilePath = arg;
			} else if (!dstFilePath) {
				dstFilePath = arg;
			}
		} else if (i < argv.length - 1) {
			const nextArg = argv[i + 1];
			i++;

			if (arg === '-q') {
				const dstQuality = parseInt(nextArg, 10);

				jpegFileManager.setDstImageQuality(dstQuality);
			}
		}
	}

	console.log('Rotate 90 degrees counter-clockwise.');
	engine.rotate90DegreesCounterclockwiseFromJpegFile(
		jpegFileManager,
		srcFilePath,
		dstFilePath
	);
}

function dispatchRotate180Degrees(argv: string[]): void {
	let srcFilePath = defaultSrcFilePath;
	let dstFilePath = 'test/output-files/rotate180.jpg';

	for (let i = 0; i < argv.length; i++) {
		const arg = argv[i];

		if (arg.substr(0, 1) !== '-') {
			if (!srcFilePath) {
				srcFilePath = arg;
			} else if (!dstFilePath) {
				dstFilePath = arg;
			}
		} else if (i < argv.length - 1) {
			const nextArg = argv[i + 1];
			i++;

			if (arg === '-q') {
				const dstQuality = parseInt(nextArg, 10);

				jpegFileManager.setDstImageQuality(dstQuality);
			}
		}
	}

	console.log('Rotate 180 degrees.');
	engine.rotate180DegreesFromJpegFile(
		jpegFileManager,
		srcFilePath,
		dstFilePath
	);
}

// **** PNG ****

// function dispatchRotate90DegreesClockwisePng(argv: string[]): void {
// 	let srcFilePath = defaultPngSrcFilePath;
// 	let dstFilePath = 'test/output-files/rotate90cw.png';

// 	for (let i = 0; i < argv.length; i++) {
// 		const arg = argv[i];

// 		if (arg.substr(0, 1) !== '-') {
// 			if (!srcFilePath) {
// 				srcFilePath = arg;
// 			} else if (!dstFilePath) {
// 				dstFilePath = arg;
// 			}
// 		} else if (i < argv.length - 1) {
// 			const nextArg = argv[i + 1];
// 			i++;

// 			// if (arg === '-q') {
// 			// 	const dstQuality = parseInt(nextArg, 10);

// 			// 	jpegFileManager.setDstImageQuality(dstQuality);
// 			// }
// 		}
// 	}

// 	console.log('Rotate 90 degrees clockwise.');
// 	engine.rotate90DegreesClockwiseFromPngFile(
// 		pngFileManager,
// 		srcFilePath,
// 		dstFilePath
// 	);
// }

function dispatch(argv: string[]): void {
	const command = argv.shift();

	switch (command) {
		// **** JPEG ****

		case 'c':
			dispatchCompositeTest(argv);
			break;

		case 'ds':
			dispatchDesaturate(argv);
			break;

		case 'f':
			dispatchFlip(argv);
			break;

		case 'gb':
			dispatchGaussianBlur(argv);
			break;

		case 'm':
			dispatchMirror(argv);
			break;

		case 'p':
			dispatchPixelate(argv);
			break;

		case 'rs':
			dispatchResample(argv);
			break;

		case 'r90ccw':
			dispatchRotate90DegreesCounterclockwise(argv);
			break;

		case 'r90cw':
			// dispatchRotate90DegreesClockwise(argv);
			dispatchRotate90DegreesClockwise(argv)
				.then(() => {
					console.log('dispatchRotate90DegreesClockwise() : Success');
				})
				.catch((error) => {
					console.error('dispatchRotate90DegreesClockwise() : Error:', typeof error, error);
				});
			break;

		case 'r180':
			dispatchRotate180Degrees(argv);
			break;

		// **** PNG ****

		// case 'r90cw_p':
		// 	dispatchRotate90DegreesClockwisePng(argv);
		// 	break;

		default:
			console.error('Unrecognized command:', command);
			break;
	}
}

// // console.log(process.argv);
// // console.log(process.argv.slice(2));
dispatch(process.argv.slice(2).filter((arg) => arg !== '--'));
