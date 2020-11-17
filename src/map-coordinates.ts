// thaw-image-processing.ts/src/map-coordinates.ts

/* eslint-disable no-fallthrough */

import { ThAWImageBufferType } from './thawimage';

export type CoordinatesMapperType = (
	dstBuffer: ThAWImageBufferType,
	dstWidth: number,
	dstHeight: number,
	dstInitialRowOffset: number,
	dstRowStride: number,
	dstPixelStride: number,
	srcBuffer: ThAWImageBufferType,
	srcInitialRowOffset: number,
	srcRowStride: number,
	srcPixelStride: number,
	numBytesPerPixel: number
) => void;

export function mapImageByCoordinatesFromBuffer(
	dstBuffer: ThAWImageBufferType,
	dstWidth: number,
	dstHeight: number,
	dstInitialRowOffset: number,
	dstRowStride: number,
	dstPixelStride: number,
	srcBuffer: ThAWImageBufferType,
	srcInitialRowOffset: number,
	srcRowStride: number,
	srcPixelStride: number,
	numBytesPerPixel: number
): void {
	let dstRowOffset = dstInitialRowOffset;
	let srcRowOffset = srcInitialRowOffset;

	for (let row = 0; row < dstHeight; row++) {
		let dstPixelOffset = dstRowOffset;
		let srcPixelOffset = srcRowOffset;

		for (let col = 0; col < dstWidth; col++) {
			switch (numBytesPerPixel) {
				case 4:
					dstBuffer[dstPixelOffset + 3] =
						srcBuffer[srcPixelOffset + 3];
				case 3: // eslint-disable-line
					dstBuffer[dstPixelOffset + 2] =
						srcBuffer[srcPixelOffset + 2];
					dstBuffer[dstPixelOffset + 1] =
						srcBuffer[srcPixelOffset + 1];
				case 1: // eslint-disable-line
					dstBuffer[dstPixelOffset + 0] =
						srcBuffer[srcPixelOffset + 0];
				default:
					// eslint-disable-line
					break;
			}

			dstPixelOffset += dstPixelStride;
			srcPixelOffset += srcPixelStride;
		}

		dstRowOffset += dstRowStride;
		srcRowOffset += srcRowStride;
	}
}
