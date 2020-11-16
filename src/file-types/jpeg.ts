// thaw-image-processing.ts/src/file-types/jpeg.ts

'use strict';

// import { readFileSync, writeFileSync } from 'fs';
import * as fs from 'fs';

// import * as jpegJs from 'jpeg-js';
import { decode, encode } from 'jpeg-js';

// import { ifDefinedThenElse } from 'thaw-common-utilities.ts';

import { createThAWImage, IThAWImage } from '../thawimage';

// import { flipImage } from '../flip';
// import { mirrorImage } from '../mirror';
import { resampleImageFromBuffer } from '../resample';

const defaultJpegQuality = 90;

// **** 1) The JPEG File Manager ****

// 1a) Types

export interface IFileOptions {
	quality?: number;
}

export interface IFileManager {
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

// export const flipImageFromJpegFile: ImageOperationOnJpegFile = makeImageOperationOnJpegFile(
// 	flipImage
// );

// export const mirrorImageFromJpegFile: ImageOperationOnJpegFile = makeImageOperationOnJpegFile(
// 	mirrorImage
// );

export function resampleImageFromJpegFile(
	fileManager: IFileManager,
	srcFilePath: string,
	dstFilePath: string,
	dstWidth: number,
	dstHeight: number,
	mode: number // ,
	// dstQuality: number
): void {
	// const fileManager = createJpegFileManager(fsInjected);
	const srcImage = fileManager.load(srcFilePath);
	const dstImage = resampleImageFromBuffer(
		srcImage,
		dstWidth,
		dstHeight,
		mode
	);
	// const dstFileOptions = { quality: dstQuality };

	// fileManager.save(dstImage, dstFilePath, dstFileOptions);
	fileManager.save(dstImage, dstFilePath);
}
