// thaw-image-utilities.ts/src/thawimage.ts

'use strict';

export const defaultBytesPerPixel = 4;

function getBytesPerLine(width: number, bytesPerPixel: number): number {
	return width * bytesPerPixel;
	// return Math.ceil(width * bytesPerPixel / byteAlignmentOfLines) * byteAlignmentOfLines;
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

export interface IThAWImage {
	readonly width: number;
	readonly height: number;
	readonly bytesPerPixel: number;
	readonly bytesPerLine: number;
	readonly data: ThAWImageBufferType;
	// colourModel: ???;

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
	public readonly bytesPerPixel: number;
	public readonly bytesPerLine: number;
	public readonly data: ThAWImageBufferType;

	// TODO: How to make some parameters optional in TypeScript?
	// -> data?: ThAWImageBufferType
	constructor(
		width: number,
		height: number,
		bytesPerPixel?: number,
		bytesPerLine?: number,
		data?: ThAWImageBufferType
	) {
		this.width = width;
		this.height = height;
		this.bytesPerPixel = bytesPerPixel
			? bytesPerPixel
			: defaultBytesPerPixel;
		this.bytesPerLine = bytesPerLine
			? bytesPerLine
			: getBytesPerLine(this.width, this.bytesPerPixel);
		this.data = data
			? (data as ThAWImageBufferType)
			: createImageBuffer(this.bytesPerLine * this.height); // Buffer.unsafealloc() ?
		// console.log('this.width is', this.width);
		// console.log('this.height is', this.height);
		// console.log('this.bytesPerPixel is', this.bytesPerPixel);
		// console.log('this.bytesPerLine is', this.bytesPerLine);
		// console.log('this.data is', this.data);
	}

	// test () {
	// 	console.log('Success!');
	// }

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

export function CreateThAWImage(
	width: number,
	height: number,
	bytesPerPixel?: number,
	bytesPerLine?: number,
	data?: ThAWImageBufferType
): IThAWImage {
	if (typeof bytesPerPixel === 'undefined' || bytesPerPixel <= 0) {
		bytesPerPixel = defaultBytesPerPixel;
	}

	if (typeof bytesPerLine === 'undefined' || bytesPerLine <= 0) {
		bytesPerLine = width * bytesPerPixel;
	}

	// if (typeof data === 'undefined') {
	// 	data = null;
	// }

	return new ThAWImage(width, height, bytesPerPixel, bytesPerLine, data);
}
