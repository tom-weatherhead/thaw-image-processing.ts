// thaw-image-processing.ts/src/file-types/jpeg.ts

'use strict';

// import { readFileSync, writeFileSync } from 'fs';
import * as fs from 'fs';

// import * as jpegJs from 'jpeg-js';
import { decode, encode } from 'jpeg-js';

// import { ifDefinedThenElse } from 'thaw-common-utilities.ts';

import { createThAWImage, IThAWImage } from '../thawimage';

import { compositeTest } from '../composite';
import { convolveImageFromBuffer } from '../convolve';
import { flipImage } from '../flip';
import {
	ColourMapperType,
	mapColoursInImageFromBuffer
} from '../map-colours';
import { mirrorImage } from '../mirror';
import { pixelateImageFromBuffer } from '../pixelate';
import { resampleImageFromBuffer } from '../resample';

export const defaultJpegQuality = 90;

// **** 1) The JPEG File Manager ****

// 1a) Types

interface IFileOptions {
	quality?: number;
}

interface IFileManager {
	load(path: string): IThAWImage;
	save(image: IThAWImage, path: string): void;
}

export interface IJpegFileManager extends IFileManager {
	getDstImageQuality(): number;
	setDstImageQuality(newDstImageQuality: number): void;
}

// 1b) Code

function loadJpegFile(fsInjected: typeof fs, path: string): IThAWImage {
	const srcJpegData = fsInjected.readFileSync(path);
	const srcImage = decode(srcJpegData);

	return createThAWImage(
		srcImage.width,
		srcImage.height,
		undefined,
		undefined,
		Uint8ClampedArray.from(srcImage.data)
	);
}

function saveJpegFile(
	fsInjected: typeof fs,
	image: IThAWImage,
	path: string,
	options?: IFileOptions
): void {
	let quality = defaultJpegQuality;

	if (
		typeof options !== 'undefined' &&
		typeof options.quality !== 'undefined'
	) {
		quality = options.quality;
	}
	const dstJpegData = encode(image, quality);

	fsInjected.writeFileSync(path, dstJpegData.data);
}

export function createJpegFileManager(
	fsInjected: typeof fs,
	dstImageQuality = 90
): IJpegFileManager {
	return {
		load: (path: string) => loadJpegFile(fsInjected, path),
		save: (image: IThAWImage, path: string) =>
			saveJpegFile(fsInjected, image, path, {
				quality: dstImageQuality
			}),
		getDstImageQuality: () => dstImageQuality,
		setDstImageQuality: (newDstImageQuality: number) => {
			dstImageQuality = newDstImageQuality;
		}
	};
}

// **** 2) ****

// 2a) Types

// eslint-disable-next-line @typescript-eslint/no-empty-interface
// export interface IOperationOptions {
// 	// quality?: number;
// }

// type ImageOperation = (
// 	srcImage: IThAWImage,
// 	operationOptions?: IOperationOptions
// ) => IThAWImage;

// type ImageOperationOnJpegFile = (
// 	srcFilePath: string,
// 	dstFilePath: string,
// 	fileManager?: IFileManager,
// 	operationOptions?: IOperationOptions,
// 	fileOptions?: IFileOptions
// ) => void;

// 2b) Code

// function doOperationOnImageFromFile(
// 	srcFilePath: string,
// 	dstFilePath: string,
// 	operation: ImageOperation,
// 	fileManager: IFileManager,
// 	operationOptions?: IOperationOptions,
// 	fileOptions?: IFileOptions
// ): void {
// 	const srcImage = fileManager.load(srcFilePath);
// 	const dstImage = operation(srcImage, operationOptions);

// 	fileManager.save(dstImage, dstFilePath, fileOptions);
// }

// function makeImageOperationOnJpegFile(
// 	operation: ImageOperation
// ): ImageOperationOnJpegFile {
// 	return (
// 		srcFilePath: string,
// 		dstFilePath: string,
// 		fileManager?: IFileManager,
// 		operationOptions?: IOperationOptions,
// 		fileOptions?: IFileOptions
// 	) => {
// 		doOperationOnImageFromFile(
// 			srcFilePath,
// 			dstFilePath,
// 			operation,
// 			ifDefinedThenElse(fileManager, createJpegFileManager()),
// 			operationOptions,
// 			fileOptions
// 		);
// 	};
// }

export function compositeTestFromJpegFile(
	fileManager: IFileManager,
	srcFilePath: string,
	dstFilePath: string
): void {
	const srcImage = fileManager.load(srcFilePath);
	const dstImage = compositeTest(srcImage);

	fileManager.save(dstImage, dstFilePath);
}

export function convolveImageFromJpegFile(
	fileManager: IFileManager,
	srcFilePath: string,
	dstFilePath: string,
	sigma: number,
	kernelSize: number
): void {
	const srcImage = fileManager.load(srcFilePath);
	const dstImage = convolveImageFromBuffer(srcImage, sigma, kernelSize);

	fileManager.save(dstImage, dstFilePath);
}

export function flipImageFromJpegFile(
	fileManager: IFileManager,
	srcFilePath: string,
	dstFilePath: string
): void {
	const srcImage = fileManager.load(srcFilePath);
	const dstImage = flipImage(srcImage);

	fileManager.save(dstImage, dstFilePath);
}

// Used by Desaturate:

export function mapColoursInImageFromJpegFile(
	fileManager: IFileManager,
	srcFilePath: string,
	dstFilePath: string,
	fnColourMapper: ColourMapperType
): void {
	const srcImage = fileManager.load(srcFilePath);
	const dstImage = mapColoursInImageFromBuffer(srcImage, fnColourMapper);

	fileManager.save(dstImage, dstFilePath);
}

export function mirrorImageFromJpegFile(
	fileManager: IFileManager,
	srcFilePath: string,
	dstFilePath: string
): void {
	const srcImage = fileManager.load(srcFilePath);
	const dstImage = mirrorImage(srcImage);

	fileManager.save(dstImage, dstFilePath);
}

export function pixelateImageFromJpegFile(
	fileManager: IFileManager,
	srcFilePath: string,
	dstFilePath: string,
	dstWidth: number,
	dstHeight: number
): void {
	const srcImage = fileManager.load(srcFilePath);
	const dstImage = pixelateImageFromBuffer(srcImage, dstWidth, dstHeight);

	fileManager.save(dstImage, dstFilePath);
}

export function resampleImageFromJpegFile(
	fileManager: IFileManager,
	srcFilePath: string,
	dstFilePath: string,
	dstWidth: number,
	dstHeight: number,
	mode: number
): void {
	const srcImage = fileManager.load(srcFilePath);
	const dstImage = resampleImageFromBuffer(
		srcImage,
		dstWidth,
		dstHeight,
		mode
	);

	fileManager.save(dstImage, dstFilePath);
}
