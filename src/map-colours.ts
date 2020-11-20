// thaw-image-processing.ts/src/map-colours.ts

import { IThAWImage, ThAWImageBufferType } from './thawimage';

export type ColourMapperType = (
	buffer: ThAWImageBufferType,
	offset: number
) => void;

export function seeingRedRGBA( // ColourMapperType
	buffer: ThAWImageBufferType,
	offset: number
): void {
	buffer[offset + 2] = 0;
	buffer[offset + 1] = 0;
}

export function mapColoursInImageFromBuffer(
	srcImage: IThAWImage,
	fnMapColours: ColourMapperType
): IThAWImage {
	const bytesPerPixel = 4; // Assume that the pixel format is RGBA.

	const width = srcImage.width;
	const height = srcImage.height;
	const bytesPerLine = width * bytesPerPixel;
	const buffer = srcImage.data;
	let rowOffset = 0;

	for (let row = 0; row < height; row++) {
		let pixelOffset = rowOffset;

		for (let col = 0; col < width; col++) {
			fnMapColours(buffer, pixelOffset);
			pixelOffset += bytesPerPixel;
		}

		rowOffset += bytesPerLine;
	}

	return srcImage;
}
