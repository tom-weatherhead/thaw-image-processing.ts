// thaw-image-processing.ts/src/mirror.ts

'use strict';

import { IOperationOptions } from './file-types/jpeg';

import {
	createAffineTransformationMatrix,
	doAffineTransformation
} from './affine';

import { CreateThAWImage, IThAWImage } from './thawimage';

export function mirrorImage(
	srcImage: IThAWImage,
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	operationOptions?: IOperationOptions
): IThAWImage {
	const dstImage = CreateThAWImage(
		srcImage.width,
		srcImage.height,
		srcImage.bytesPerPixel
	);
	const mirrorMatrix = createAffineTransformationMatrix(
		-1,
		0,
		srcImage.width - 1,
		0,
		1,
		0
	);

	doAffineTransformation(dstImage, srcImage, mirrorMatrix);

	return dstImage;
}
