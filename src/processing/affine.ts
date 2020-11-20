// thaw-image-processing.ts/src/affine.ts

/* eslint-disable no-fallthrough */

// Other ESLint examples:
// eslint-disable-line no-fallthrough
// eslint-disable-next-line no-fallthrough

// srcX = dstX * a + dstY * b + c
// srcY = dstX * d + dstY * e + f

import { ifDefinedThenElse } from 'thaw-common-utilities.ts';

import { IThAWImage } from '../util/image';

export interface IAffineTransformationMatrix {
	a: number;
	b: number;
	c: number;
	d: number;
	e: number;
	f: number;
}

export function createAffineTransformationMatrix(
	a: number,
	b: number,
	c: number,
	d: number,
	e: number,
	f: number
): IAffineTransformationMatrix {
	return { a, b, c, d, e, f };
}

export function doAffineTransformation(
	dstImage: IThAWImage,
	srcImage: IThAWImage,
	matrix: IAffineTransformationMatrix,
	dstLeft?: number,
	dstRight?: number,
	dstBottom?: number,
	dstTop?: number
): void {
	if (dstImage.bytesPerPixel !== srcImage.bytesPerPixel) {
		throw new Error(
			'doAffineTransformation() : dstImage.bytesPerPixel !== srcImage.bytesPerPixel'
		);
	}

	dstLeft = ifDefinedThenElse(dstLeft, 0);
	dstRight = ifDefinedThenElse(dstRight, dstImage.width - 1);
	dstBottom = ifDefinedThenElse(dstBottom, 0);
	dstTop = ifDefinedThenElse(dstTop, dstImage.height - 1);

	let dstRowOffset =
		dstImage.bytesPerLine * dstBottom + dstImage.bytesPerPixel * dstLeft;

	for (let dstY = dstBottom; dstY <= dstTop; dstY++) {
		// For each dstY++, srcX += b  and srcY += e
		let dstPixelOffset = dstRowOffset;

		for (let dstX = dstLeft; dstX <= dstRight; dstX++) {
			// For each dstX++, srcX += a  and srcY += d
			const srcX = Math.trunc(
				dstX * matrix.a + dstY * matrix.b + matrix.c
			);
			const srcY = Math.trunc(
				dstX * matrix.d + dstY * matrix.e + matrix.f
			);

			if (
				srcX >= 0 &&
				srcX < srcImage.width &&
				srcY >= 0 &&
				srcY < srcImage.height
			) {
				const srcPixelOffset =
					srcImage.bytesPerLine * srcY +
					srcImage.bytesPerPixel * srcX;

				switch (dstImage.bytesPerPixel) {
					case 4:
						dstImage.data[dstPixelOffset + 3] =
							srcImage.data[srcPixelOffset + 3];
					case 3:
						dstImage.data[dstPixelOffset + 2] =
							srcImage.data[srcPixelOffset + 2];
						dstImage.data[dstPixelOffset + 1] =
							srcImage.data[srcPixelOffset + 1];
					case 1:
						dstImage.data[dstPixelOffset + 0] =
							srcImage.data[srcPixelOffset + 0];
					default:
						break;
				}
			}

			dstPixelOffset += dstImage.bytesPerPixel;
		}

		dstRowOffset += dstImage.bytesPerLine;
	}
}
