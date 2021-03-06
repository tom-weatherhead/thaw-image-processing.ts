// thaw-image-processing.ts/src/rotate.ts

import { mapImageByCoordinatesFromBuffer } from '../util/map-coordinates';
import { createThAWImage, IThAWImage } from '../util/image';

export function rotate90DegreesClockwiseFromImage(
	srcImage: IThAWImage
): IThAWImage {
	const dstImage = createThAWImage(
		srcImage.height,
		srcImage.width,
		srcImage.bytesPerPixel
	);

	mapImageByCoordinatesFromBuffer(
		dstImage.data,
		dstImage.width,
		dstImage.height,
		0,
		dstImage.bytesPerLine,
		dstImage.bytesPerPixel,
		srcImage.data,
		(srcImage.height - 1) * srcImage.bytesPerLine,
		srcImage.bytesPerPixel,
		-srcImage.bytesPerLine,
		srcImage.bytesPerPixel
	);

	return dstImage;
}

export function rotate90DegreesCounterclockwiseFromImage(
	srcImage: IThAWImage
): IThAWImage {
	const dstImage = createThAWImage(
		srcImage.height,
		srcImage.width,
		srcImage.bytesPerPixel
	);

	mapImageByCoordinatesFromBuffer(
		dstImage.data,
		dstImage.width,
		dstImage.height,
		0,
		dstImage.bytesPerLine,
		dstImage.bytesPerPixel,
		srcImage.data,
		(srcImage.width - 1) * srcImage.bytesPerPixel,
		-srcImage.bytesPerPixel,
		srcImage.bytesPerLine,
		srcImage.bytesPerPixel
	);

	return dstImage;
}

export function rotate180DegreesFromImage(srcImage: IThAWImage): IThAWImage {
	const dstImage = createThAWImage(
		srcImage.width,
		srcImage.height,
		srcImage.bytesPerPixel
	);

	mapImageByCoordinatesFromBuffer(
		dstImage.data,
		dstImage.width,
		dstImage.height,
		0,
		dstImage.bytesPerLine,
		dstImage.bytesPerPixel,
		srcImage.data,
		(srcImage.height - 1) * srcImage.bytesPerLine +
			(srcImage.width - 1) * srcImage.bytesPerPixel,
		-srcImage.bytesPerLine,
		-srcImage.bytesPerPixel,
		srcImage.bytesPerPixel
	);

	return dstImage;
}
