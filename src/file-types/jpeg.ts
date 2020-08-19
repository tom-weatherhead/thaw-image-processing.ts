// thaw-image-processing.ts/src/file-types/jpeg.ts

'use strict';

import { readFileSync, writeFileSync } from 'fs';

// import * as jpegJs from 'jpeg-js';
import { decode, encode } from 'jpeg-js';

import { ifDefinedThenElse } from 'thaw-common-utilities.ts';

import { CreateThAWImage, IThAWImage } from '../thawimage';

import { flipImage } from '../flip';
import { mirrorImage } from '../mirror';

const defaultJpegQuality = 90;

// **** 1) The JPEG File Manager ****

// 1a) Types

export interface IFileOptions {
	quality?: number;
}

export interface IFileManager {
	load(path: string): IThAWImage;
	save(image: IThAWImage, path: string, options?: IFileOptions): void;
}

// 1b) Code

function loadJpegFile(path: string): IThAWImage {
	const srcJpegData = readFileSync(path);
	const srcImage = decode(srcJpegData);

	return CreateThAWImage(
		srcImage.width,
		srcImage.height,
		0,
		0,
		srcImage.data
	);
}

function saveJpegFile(
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

	writeFileSync(path, dstJpegData.data);
}

export function createJpegFileManager(): IFileManager {
	return {
		load: loadJpegFile,
		save: saveJpegFile
	};
}

// **** 2) ****

// 2a) Types

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IOperationOptions {
	// quality?: number;
}

type ImageOperation = (
	srcImage: IThAWImage,
	operationOptions?: IOperationOptions
) => IThAWImage;

type ImageOperationOnJpegFile = (
	srcFilePath: string,
	dstFilePath: string,
	fileManager?: IFileManager,
	operationOptions?: IOperationOptions,
	fileOptions?: IFileOptions
) => void;

// 2b) Code

function doOperationOnImageFromFile(
	srcFilePath: string,
	dstFilePath: string,
	operation: ImageOperation,
	fileManager: IFileManager,
	operationOptions?: IOperationOptions,
	fileOptions?: IFileOptions
): void {
	const srcImage = fileManager.load(srcFilePath);
	const dstImage = operation(srcImage, operationOptions);

	fileManager.save(dstImage, dstFilePath, fileOptions);
}

function makeImageOperationOnJpegFile(
	operation: ImageOperation
): ImageOperationOnJpegFile {
	return (
		srcFilePath: string,
		dstFilePath: string,
		fileManager?: IFileManager,
		operationOptions?: IOperationOptions,
		fileOptions?: IFileOptions
	) => {
		doOperationOnImageFromFile(
			srcFilePath,
			dstFilePath,
			operation,
			ifDefinedThenElse(fileManager, createJpegFileManager()),
			operationOptions,
			fileOptions
		);
	};
}

export const flipImageFromJpegFile: ImageOperationOnJpegFile = makeImageOperationOnJpegFile(
	flipImage
);

export const mirrorImageFromJpegFile: ImageOperationOnJpegFile = makeImageOperationOnJpegFile(
	mirrorImage
);
