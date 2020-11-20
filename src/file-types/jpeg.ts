// thaw-image-processing.ts/src/file-types/jpeg.ts

// import * as fs from 'fs'; // Used only as a type, so Angular is OK.

// import { decode, encode } from 'jpeg-js';

// import { isNonNegativeInteger } from 'thaw-common-utilities.ts';

// import { createThAWImage, IThAWImage } from '../util/image';

// import { compositeTest } from '../util/composite';
// import { desaturateImage } from '../processing/desaturate';
// import { flipImage } from '../processing/flip';
// import { gaussianBlurImage } from '../processing/gaussian-blur';
// import {
// 	ColourMapperType,
// 	mapColoursInImageFromBuffer
// } from '../util/map-colours';
// import { mirrorImage } from '../processing/mirror';
// import { pixelateImageFromBuffer } from '../processing/pixelate';
// import {
// 	resampleImageFromBuffer,
// 	ResamplingMode
// } from '../processing/resample';
// import {
// 	rotate180DegreesFromImage,
// 	rotate90DegreesClockwiseFromImage,
// 	rotate90DegreesCounterclockwiseFromImage
// } from '../processing/rotate';

// export const defaultJpegQuality = 90;

// // **** 1) The JPEG File Manager ****

// // 1a) Types

// export interface IFileManager {
// 	load(path: string): IThAWImage;
// 	save(image: IThAWImage, path: string): void;
// }

// export interface IJpegFileManager extends IFileManager {
// 	getDstImageQuality(): number;
// 	setDstImageQuality(newDstImageQuality: number): void;
// }

// // 1b) Code

// // From https://github.com/eugeneware/jpeg-js :

// // Decode Options

// // Option 	Description 	Default

// // colorTransform 	Transform alternate colorspaces like YCbCr. undefined means respect the default behavior encoded in metadata. 	undefined
// // useTArray 	Decode pixels into a typed Uint8Array instead of a Buffer. 	false
// // formatAsRGBA 	Decode pixels into RGBA vs. RGB. 	true
// // tolerantDecoding 	Be more tolerant when encountering technically invalid JPEGs. 	true
// // maxResolutionInMP 	The maximum resolution image that jpeg-js should attempt to decode in megapixels. Images larger than this resolution will throw an error instead of decoding. 	100
// // maxMemoryUsageInMB 	The (approximate) maximum memory that jpeg-js should allocate while attempting to decode the image in mebibyte. Images requiring more memory than this will throw an error instead of decoding. 	512

// function loadJpegFile(fsInjected: typeof fs, path: string): IThAWImage {
// 	const srcJpegData = fsInjected.readFileSync(path);
// 	const srcImage = decode(srcJpegData, { useTArray: true });

// 	return createThAWImage(
// 		srcImage.width,
// 		srcImage.height,
// 		undefined,
// 		undefined,
// 		Uint8ClampedArray.from(srcImage.data)
// 	);
// }

// function isLegalJpegImageQuality(n: number): boolean {
// 	return isNonNegativeInteger(n) && n <= 100;
// }

// // function getLegalJpegImageQuality(n: number): number {
// // 	if (isLegalJpegImageQuality(n)) {
// // 		return n;
// // 	} else {
// // 		return defaultJpegQuality;
// // 	}
// // }

// function saveJpegFile(
// 	fsInjected: typeof fs,
// 	image: IThAWImage,
// 	path: string,
// 	options: {
// 		quality: number;
// 	}
// ): void {
// 	const dstJpegData = encode(image, options.quality);

// 	fsInjected.writeFileSync(path, dstJpegData.data);
// }

// export function createJpegFileManager(
// 	fsInjected: typeof fs
// ): IJpegFileManager {
// 	let dstImageQuality = defaultJpegQuality;

// 	return {
// 		load: (path: string) => loadJpegFile(fsInjected, path),
// 		save: (image: IThAWImage, path: string) =>
// 			saveJpegFile(fsInjected, image, path, {
// 				quality: dstImageQuality
// 			}),
// 		getDstImageQuality: () => dstImageQuality,
// 		setDstImageQuality: (newDstImageQuality: number) => {
// 			if (isLegalJpegImageQuality(newDstImageQuality)) {
// 				dstImageQuality = newDstImageQuality;
// 			}
// 		}
// 	};
// }

// // **** Image Operations on JPEG Files ****

// export function compositeTestFromJpegFile(
// 	fileManager: IFileManager,
// 	srcFilePath: string,
// 	dstFilePath: string
// ): void {
// 	const srcImage = fileManager.load(srcFilePath);
// 	const dstImage = compositeTest(srcImage);

// 	fileManager.save(dstImage, dstFilePath);
// }

// export function desaturateImageFromJpegFile(
// 	fileManager: IFileManager,
// 	srcFilePath: string,
// 	dstFilePath: string
// ): void {
// 	const srcImage = fileManager.load(srcFilePath);
// 	const dstImage = desaturateImage(srcImage);

// 	fileManager.save(dstImage, dstFilePath);
// }

// export function flipImageFromJpegFile(
// 	fileManager: IFileManager,
// 	srcFilePath: string,
// 	dstFilePath: string
// ): void {
// 	const srcImage = fileManager.load(srcFilePath);
// 	const dstImage = flipImage(srcImage);

// 	fileManager.save(dstImage, dstFilePath);
// }

// export function gaussianBlurImageFromJpegFile(
// 	fileManager: IFileManager,
// 	srcFilePath: string,
// 	dstFilePath: string,
// 	sigma: number,
// 	kernelSize: number
// ): void {
// 	const srcImage = fileManager.load(srcFilePath);
// 	const dstImage = gaussianBlurImage(srcImage, sigma, kernelSize);

// 	fileManager.save(dstImage, dstFilePath);
// }

// // Used by Desaturate:

// export function mapColoursInImageFromJpegFile(
// 	fileManager: IFileManager,
// 	srcFilePath: string,
// 	dstFilePath: string,
// 	fnColourMapper: ColourMapperType
// ): void {
// 	const srcImage = fileManager.load(srcFilePath);
// 	const dstImage = mapColoursInImageFromBuffer(srcImage, fnColourMapper);

// 	fileManager.save(dstImage, dstFilePath);
// }

// export function mirrorImageFromJpegFile(
// 	fileManager: IFileManager,
// 	srcFilePath: string,
// 	dstFilePath: string
// ): void {
// 	const srcImage = fileManager.load(srcFilePath);
// 	const dstImage = mirrorImage(srcImage);

// 	fileManager.save(dstImage, dstFilePath);
// }

// // export function pixelateImageFromJpegFile(
// // 	fileManager: IFileManager,
// // 	srcFilePath: string,
// // 	dstFilePath: string,
// // 	dstWidth: number,
// // 	dstHeight: number
// // ): void {
// // 	const srcImage = fileManager.load(srcFilePath);
// // 	const dstImage = pixelateImageFromBuffer(srcImage, dstWidth, dstHeight);

// // 	fileManager.save(dstImage, dstFilePath);
// // }

// // export function resampleImageFromJpegFile(
// // 	fileManager: IFileManager,
// // 	srcFilePath: string,
// // 	dstFilePath: string,
// // 	dstWidth: number,
// // 	dstHeight: number,
// // 	mode: ResamplingMode
// // ): void {
// // 	const srcImage = fileManager.load(srcFilePath);
// // 	const dstImage = resampleImageFromBuffer(
// // 		srcImage,
// // 		dstWidth,
// // 		dstHeight,
// // 		mode
// // 	);

// // 	fileManager.save(dstImage, dstFilePath);
// // }

// export function rotate90DegreesClockwiseFromJpegFile(
// 	fileManager: IFileManager,
// 	srcFilePath: string,
// 	dstFilePath: string
// ): void {
// 	const srcImage = fileManager.load(srcFilePath);
// 	const dstImage = rotate90DegreesClockwiseFromImage(srcImage);

// 	fileManager.save(dstImage, dstFilePath);
// }

// export function rotate90DegreesCounterclockwiseFromJpegFile(
// 	fileManager: IFileManager,
// 	srcFilePath: string,
// 	dstFilePath: string
// ): void {
// 	const srcImage = fileManager.load(srcFilePath);
// 	const dstImage = rotate90DegreesCounterclockwiseFromImage(srcImage);

// 	fileManager.save(dstImage, dstFilePath);
// }

// export function rotate180DegreesFromJpegFile(
// 	fileManager: IFileManager,
// 	srcFilePath: string,
// 	dstFilePath: string
// ): void {
// 	const srcImage = fileManager.load(srcFilePath);
// 	const dstImage = rotate180DegreesFromImage(srcImage);

// 	fileManager.save(dstImage, dstFilePath);
// }
