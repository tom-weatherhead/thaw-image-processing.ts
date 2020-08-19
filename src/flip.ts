// thaw-image-processing.ts/src/flip.ts

'use strict';

import { IOperationOptions } from './file-types/jpeg';

import {
	createAffineTransformationMatrix,
	doAffineTransformation
} from './affine';

import { CreateThAWImage, IThAWImage } from './thawimage';

export function flipImage(
	srcImage: IThAWImage,
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	operationOptions?: IOperationOptions
): IThAWImage {
	const dstImage = CreateThAWImage(
		srcImage.width,
		srcImage.height,
		srcImage.bytesPerPixel
	);
	const flipMatrix = createAffineTransformationMatrix(
		1,
		0,
		0,
		0,
		-1,
		srcImage.height - 1
	);

	doAffineTransformation(dstImage, srcImage, flipMatrix);

	return dstImage;
}
