// thaw-image-processing.ts/test/utilities/create-test-images.ts

'use strict';

import * as engine from '../../lib/main';

export function createOnePixel8bitImage(): engine.IThAWImage {
	return engine.CreateThAWImage(1, 1, 1);
}

export function createOnePixel32bitImage(): engine.IThAWImage {
	return engine.CreateThAWImage(1, 1, 4);
}
