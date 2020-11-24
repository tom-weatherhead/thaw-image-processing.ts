// thaw-image-processing.ts/src/desaturate.ts

import { ColourModel, IThAWImage, ThAWImageBufferType } from '../util/image';

import { mapColoursInImageFromBuffer } from '../util/map-colours';

export function desaturateRGBA(
	buffer: ThAWImageBufferType,
	offset: number
): void {
	// Assuming that buffer[offset] is the red byte, buffer[offset + 1] is the green byte, and buffer[offset + 2] is the blue byte.
	const grey = Math.round(
		buffer[offset] * 0.3 +
			buffer[offset + 1] * 0.59 +
			buffer[offset + 2] * 0.11
	);

	buffer[offset + 2] = grey;
	buffer[offset + 1] = grey;
	buffer[offset] = grey;
}

export function desaturateImage(srcImage: IThAWImage): IThAWImage {
	if (srcImage.colourModel !== ColourModel.RGBA32) {
		throw new Error('desaturateImage: Unsupported colour model');
	}
	return mapColoursInImageFromBuffer(srcImage, desaturateRGBA);
}

export function rotateColourChannelsRGBA(
	buffer: ThAWImageBufferType,
	offset: number
): void {
	const temp = buffer[offset];

	buffer[offset] = buffer[offset + 1];
	buffer[offset + 1] = buffer[offset + 2];
	buffer[offset + 2] = temp;

	// buffer[offset + 3] is the alpha channel; do not change it.
}

export function rotateColourChannelsInImage(
	srcImage: IThAWImage
): IThAWImage {
	if (srcImage.colourModel !== ColourModel.RGBA32) {
		throw new Error(
			'rotateColourChannelsInImage: Unsupported colour model'
		);
	}
	return mapColoursInImageFromBuffer(srcImage, rotateColourChannelsRGBA);
}
