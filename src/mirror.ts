// thaw-image-processing.ts/src/mirror.ts

// import { IOperationOptions } from './file-types/jpeg';

import {
	createAffineTransformationMatrix,
	doAffineTransformation
} from './affine';

import { createThAWImage, IThAWImage } from './thawimage';

export function mirrorImage(
	srcImage: IThAWImage // ,
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	// operationOptions?: IOperationOptions
): IThAWImage {
	const dstImage = createThAWImage(
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
