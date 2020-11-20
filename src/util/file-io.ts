// // thaw-image-processing.ts/src/util/file-io.ts

import * as fs from 'fs'; // Used only as a type, so Angular is OK.

import * as jpg from 'jpeg-js';
import * as png from '@vivaxy/png';

import { createThAWImage, IThAWImage } from './image';

export interface IFileIOManager {
	load(path: string): Promise<IThAWImage>;
	save(image: IThAWImage, path: string): Promise<void>;
}

export function getExtensionFromFilePath(path: string): string {
	const i = path.toLowerCase().lastIndexOf('.');

	if (i < 0) {
		return '';
	}

	const extension = path.substring(i + 1);

	if (extension === 'jpeg') {
		return 'jpg';
	}

	return extension;
}

// Return an IThAWImage or a standard ImageData?

async function loadFile(
	fsInjected: typeof fs,
	path: string
): Promise<IThAWImage> {
	const extension = getExtensionFromFilePath(path);
	const srcData = await fsInjected.promises.readFile(path);
	let srcImage;

	switch (extension) {
		case 'jpg':
			srcImage = jpg.decode(srcData, { useTArray: true });
			break;

		case 'png':
			srcImage = png.decode(srcData);
			break;

		default:
			throw new Error(
				`loadFile() : Unsupported extension in path '${path}'`
			);
	}

	return createThAWImage(
		srcImage.width,
		srcImage.height,
		undefined,
		undefined,
		Uint8ClampedArray.from(srcImage.data)
	);
}

async function saveFile(
	fsInjected: typeof fs,
	image: IThAWImage,
	path: string
): Promise<void> {
	const defaultJpegQuality = 90;
	const extension = getExtensionFromFilePath(path);
	// const srcData = await fsInjected.promises.readFile(path);
	let dstData;

	switch (extension) {
		case 'jpg':
			dstData = jpg.encode(image, defaultJpegQuality).data;
			break;

		case 'png':
			dstData = png.encode({
				// 	data: number[],
				data: Array.from(image.data),
				width: image.width,
				height: image.height,
				// 	colorType: COLOR_TYPES,
				colorType: 2, // TRUE_COLOR; 3 channels
				depth: 8, // 8 bits per channel
				interlace: 0,
				compression: 0,
				filter: 0
				// , palette?: [number, number, number, number][]
			});
			break;

		default:
			throw new Error(
				`loadFile() : Unsupported extension in path '${path}'`
			);
	}

	await fsInjected.promises.writeFile(path, dstData);
}

export function createFileIOManager(fsInjected: typeof fs): IFileIOManager {
	// let dstImageQuality = defaultJpegQuality;

	return {
		load: (path: string) => loadFile(fsInjected, path),
		save: (image: IThAWImage, path: string) =>
			saveFile(fsInjected, image, path)
		// ,
		// getDstImageQuality: () => dstImageQuality,
		// setDstImageQuality: (newDstImageQuality: number) => {
		// 	if (isLegalJpegImageQuality(newDstImageQuality)) {
		// 		dstImageQuality = newDstImageQuality;
		// 	}
		// }
	};
}
