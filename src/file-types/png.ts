// thaw-image-processing.ts/src/file-types/png.ts

import * as fs from 'fs'; // Used only as a type, so Angular is OK.

import { decode, encode } from '@vivaxy/png';

import { createThAWImage, IThAWImage } from '../util/image';

import { IFileManager } from './jpeg';

import {
	// rotate180DegreesFromImage,
	rotate90DegreesClockwiseFromImage // ,
	// rotate90DegreesCounterclockwiseFromImage
} from '../processing/rotate';

// enum COLOR_TYPES {
//   GRAYSCALE = 0,
//   TRUE_COLOR = 2,
//   PALETTE = 3,
//   GRAYSCALE_WITH_ALPHA = 4 | GRAYSCALE,
//   TRUE_COLOR_WITH_ALPHA = 4 | TRUE_COLOR,
// }

// export const COLOR_TYPES_TO_CHANNEL_PER_PIXEL = {
//   [COLOR_TYPES.GRAYSCALE]: 1,
//   [COLOR_TYPES.TRUE_COLOR]: 3,
//   [COLOR_TYPES.PALETTE]: 1,
//   [COLOR_TYPES.GRAYSCALE_WITH_ALPHA]: 2,
//   [COLOR_TYPES.TRUE_COLOR_WITH_ALPHA]: 4,
// };

function loadPngFile(fsInjected: typeof fs, path: string): IThAWImage {
	const srcPngData = fsInjected.readFileSync(path);
	const srcImage = decode(srcPngData);

	// srcImage is of type Metadata; i.e.:

	// const metadata: Metadata = {
	// 	width: 0,
	// 	height: 0,
	// 	depth: 0,
	// 	colorType: 0,
	// 	compression: 0,
	// 	interlace: 0,
	// 	filter: 0,
	// 	data: [],
	// };

	return createThAWImage(
		srcImage.width,
		srcImage.height,
		undefined,
		undefined,
		Uint8ClampedArray.from(srcImage.data)
	);
}

function savePngFile(
	fsInjected: typeof fs,
	image: IThAWImage,
	path: string
): void {
	// export default function encodeIDAT(
	// 	data: number[],
	// 	width: number,
	// 	height: number,
	// 	colorType: COLOR_TYPES,
	// 	depth: number,
	// 	interlace: number,
	// 	palette?: [number, number, number, number][],
	// ) {

	const dstPngData = encode({
		// 	data: number[],
		data: Array.from(image.data),
		// 	width: number,
		width: image.width,
		// 	height: number,
		height: image.height,
		// 	colorType: COLOR_TYPES,
		colorType: 2, // TRUE_COLOR
		// 	depth: number,
		depth: 8,
		// 	interlace: number,
		interlace: 0,
		// 	palette?: [number, number, number, number][],
		compression: 0,
		filter: 0
	});

	fsInjected.writeFileSync(path, dstPngData);
}

export function createPngFileManager(fsInjected: typeof fs): IFileManager {
	// or IPngFileManager
	// let dstImageQuality = defaultJpegQuality;

	return {
		load: (path: string) => loadPngFile(fsInjected, path),
		save: (image: IThAWImage, path: string) =>
			savePngFile(fsInjected, image, path)
	};
}

export function rotate90DegreesClockwiseFromPngFile(
	fileManager: IFileManager,
	srcFilePath: string,
	dstFilePath: string
): void {
	const srcImage = fileManager.load(srcFilePath);
	const dstImage = rotate90DegreesClockwiseFromImage(srcImage);

	fileManager.save(dstImage, dstFilePath);
}
