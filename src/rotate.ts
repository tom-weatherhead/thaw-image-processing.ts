// thaw-image-processing.ts/src/rotate.ts

'use strict';

import { MapCoordinatesFunction } from './map-coordinates';
import { createThAWImage, IThAWImage } from './thawimage';

export function rotate90DegreesClockwiseFromImage(
	srcImage: IThAWImage,
	// fnCreateImage,
	fnMapCoordinates: MapCoordinatesFunction
): IThAWImage {
	// Dependency injection.
	const dstImage = createThAWImage(
		srcImage.height,
		srcImage.width,
		srcImage.bytesPerPixel
	);

	fnMapCoordinates(
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
	srcImage: IThAWImage,
	// fnCreateImage,
	fnMapCoordinates: MapCoordinatesFunction
): IThAWImage {
	// Dependency injection.
	const dstImage = createThAWImage(
		srcImage.height,
		srcImage.width,
		srcImage.bytesPerPixel
	);

	fnMapCoordinates(
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

export function rotate180DegreesFromImage(
	srcImage: IThAWImage,
	// fnCreateImage,
	fnMapCoordinates: MapCoordinatesFunction
): IThAWImage {
	// Dependency injection.
	const dstImage = createThAWImage(
		srcImage.width,
		srcImage.height,
		srcImage.bytesPerPixel
	);

	fnMapCoordinates(
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

// module.exports = {
// 	rotate90DegreesClockwiseFromImage: rotate90DegreesClockwiseFromImage,
// 	rotate90DegreesCounterclockwiseFromImage: rotate90DegreesCounterclockwiseFromImage,
// 	rotate180DegreesFromImage: rotate180DegreesFromImage
// };
