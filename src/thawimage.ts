// thaw-image-utilities.ts/src/thawimage.ts

'use strict';

export const defaultBytesPerPixel = 4;

function getBytesPerLine(width: number, bytesPerPixel: number): number {
	return width * bytesPerPixel;
	// return Math.ceil(width * bytesPerPixel / byteAlignmentOfLines) * byteAlignmentOfLines;
}

export interface IThAWImage {
	width: number;
	height: number;
	bytesPerPixel: number;
	bytesPerLine: number;
	data: Buffer;
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
	public width: number;
	public height: number;
	public bytesPerPixel: number;
	public bytesPerLine: number;
	public data: Buffer;

	// TODO: How to make some parameters optional in TypeScript?
	constructor(
		width: number,
		height: number,
		bytesPerPixel: number,
		bytesPerLine: number,
		data: Buffer | null
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
			? (data as Buffer)
			: Buffer.alloc(this.bytesPerLine * this.height); // Buffer.unsafealloc() ?
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
	data?: Buffer | null
): IThAWImage {
	if (typeof bytesPerPixel === 'undefined' || bytesPerPixel <= 0) {
		bytesPerPixel = defaultBytesPerPixel;
	}

	if (typeof bytesPerLine === 'undefined' || bytesPerLine <= 0) {
		bytesPerLine = width * bytesPerPixel;
	}

	if (typeof data === 'undefined') {
		data = null;
	}

	return new ThAWImage(width, height, bytesPerPixel, bytesPerLine, data);
}
