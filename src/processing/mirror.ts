// thaw-image-processing.ts/src/mirror.ts

// import { IOperationOptio../util/imagens } from './file-types/jpeg';

import {
	createAffineTransformationMatrix,
	doAffineTransformation
} from './affine';

import { createThAWImage, IThAWImage } from '../util/image';

export function mirrorImage(srcImage: IThAWImage): IThAWImage {
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
