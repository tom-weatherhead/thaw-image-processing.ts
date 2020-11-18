// thaw-image-utilities.ts/src/thawimage.ts

import {
	ifDefinedThenElse,
	isPositiveInteger
} from 'thaw-common-utilities.ts';

export enum ColourModel {
	RGBA32 // 4 channels * 8 bits per channel
}

export const defaultBytesPerPixel = 4;

function getAlignedBytesPerLine(rawBytesPerLine: number): number {
	const byteAlignmentOfLines = 4;
	// const byteAlignmentOfLines = 8;

	return (
		Math.ceil(rawBytesPerLine / byteAlignmentOfLines) *
		byteAlignmentOfLines
	);
}

// From https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8ClampedArray :

// The Uint8ClampedArray typed array represents an array of 8-bit unsigned integers clamped to 0-255; if you specified a value that is out of the range of [0,255], 0 or 255 will be set instead; if you specify a non-integer, the nearest integer will be set. The contents are initialized to 0. Once established, you can reference elements in the array using the object's methods, or using standard array index syntax (that is, using bracket notation).

// export type ThAWImageBufferType = Buffer;
export type ThAWImageBufferType = Uint8ClampedArray;

export function createImageBuffer(size: number): ThAWImageBufferType {
	// return Buffer.alloc(size);

	// // return Uint8ClampedArray.from(Buffer.alloc(size));
	return new Uint8ClampedArray(size);
}

// interface ImageData is defined in node_modules/typescript/lib/lib.dom.d.ts line 9552

// interface ImageData {
// 	readonly width: number;
// 	readonly height: number;
// 	readonly data: Uint8ClampedArray;
// }

export interface IThAWImage extends ImageData {
	// readonly width: number;
	// readonly height: number;
	// readonly data: ThAWImageBufferType;
	readonly bytesPerPixel: number;
	readonly bytesPerLine: number;
	readonly colourModel: ColourModel;

	getPixelAsArray(row: number, column: number): number[];
	// copy(dstRow: number, dstColumn: number, width: number, height: number, srcImage: IThAWImage, srcRow: number, srcColumn: number): IThAWImage;
	fill(
		dstRow: number,
		dstColumn: number,
		width: number,
		height: number,
		srcColour: number[]
	): IThAWImage;
}

class ThAWImage implements IThAWImage {
	public readonly width: number;
	public readonly height: number;
	public readonly data: ThAWImageBufferType;
	public readonly bytesPerPixel: number;
	public readonly bytesPerLine: number;
	public readonly colourModel = ColourModel.RGBA32;

	// constructor(
	// 	width: number,
	// 	height: number,
	// 	options: {
	// 		bytesPerPixel?: number;
	// 		bytesPerLine?: number;
	// 		colourModel?: ColourModel;
	// 		data?: ThAWImageBufferType;
	// 	} = {}
	// ) {
	// 	...
	// }

	constructor(
		width: number,
		height: number,
		bytesPerPixel?: number,
		bytesPerLine?: number,
		// colourModel?: ColourModel,
		data?: ThAWImageBufferType
	) {
		if (!isPositiveInteger(width) || !isPositiveInteger(height)) {
			throw new Error(
				'ThAWImage constructor: width or height is not a positive integer'
			);
		}

		if (typeof bytesPerPixel === 'undefined') {
			bytesPerPixel = defaultBytesPerPixel;
		} else if (!isPositiveInteger(bytesPerPixel)) {
			throw new Error(
				'ThAWImage constructor: bytesPerPixel is not a positive integer'
			);
		}

		if (typeof bytesPerLine === 'undefined') {
			bytesPerLine = width * bytesPerPixel;
		} else if (!isPositiveInteger(bytesPerPixel)) {
			throw new Error(
				'ThAWImage constructor: bytesPerLine is not a positive integer'
			);
		}

		this.width = width;
		this.height = height;
		this.bytesPerPixel = bytesPerPixel;
		this.bytesPerLine = getAlignedBytesPerLine(bytesPerLine);
		// this.colourModel = colourModel;
		this.data = ifDefinedThenElse(
			data,
			createImageBuffer(this.bytesPerLine * this.height)
		);
	}

	public getPixelAsArray(row: number, column: number): number[] {
		const result: number[] = [];

		if (
			row < 0 ||
			row >= this.height ||
			column < 0 ||
			column >= this.width
		) {
			return result;
		}

		const offset = row * this.bytesPerLine + column * this.bytesPerPixel;

		for (let i = 0; i < this.bytesPerPixel; i++) {
			result.push(this.data[offset + i]);
		}

		return result;
	}

	// public copy(dstRow: number, dstColumn: number, width: number, height: number, srcImage: IThAWImage, srcRow: number, srcColumn: number): IThAWImage {
	// 	return this;
	// }

	public fill(
		dstRow: number,
		dstColumn: number,
		width: number,
		height: number,
		srcColour: number[]
	): IThAWImage {
		// Crop the region of interest, if necessary.

		if (dstRow < 0) {
			dstRow = 0;
		}

		if (dstColumn < 0) {
			dstColumn = 0;
		}

		if (dstColumn + width > this.width) {
			width = this.width - dstColumn;
		}

		if (dstRow + height > this.height) {
			height = this.height - dstRow;
		}

		if (
			width < 0 ||
			height < 0 ||
			srcColour.length < this.bytesPerPixel
		) {
			// No-op. Nothing to do.
			return this;
		}

		let rowOffset =
			dstRow * this.bytesPerLine + dstColumn * this.bytesPerPixel;

		for (let y = 0; y < height; y++) {
			let pixelOffset = rowOffset;

			for (let x = 0; x < width; x++) {
				for (let i = 0; i < this.bytesPerPixel; i++) {
					this.data[pixelOffset + i] = srcColour[i];
				}

				pixelOffset += this.bytesPerPixel;
			}

			rowOffset += this.bytesPerLine;
		}

		return this;
	}
}

export function createThAWImage(
	width: number,
	height: number,
	bytesPerPixel?: number,
	bytesPerLine?: number,
	// colourModel?: ColourModel,
	data?: ThAWImageBufferType
): IThAWImage {
	return new ThAWImage(
		width,
		height,
		bytesPerPixel,
		bytesPerLine,
		/* colourModel, */ data
	);
}

// export function createThAWImage(
// 	width: number,
// 	height: number,
// 	options: {
// 		bytesPerPixel?: number;
// 		bytesPerLine?: number;
// 		colourModel?: ColourModel;
// 		data?: ThAWImageBufferType;
// 	} = {}
// ): IThAWImage {
// 	return new ThAWImage(
// 		width,
// 		height,
// 		options
// 	);
// }
