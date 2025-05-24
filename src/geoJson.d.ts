interface GeoJson {
	type: string;
	features: Feature[];
}

interface Feature {
	type: string;
	geometry: Geometry;
	properties: Properties;
}

interface Geometry {
	type: string;
	coordinates: number[][] | number[][][];
}

interface Properties {
	EMD_CD: string;
	COL_ADM_SE: string; //
	EMD_NM: string; // 읍면동명
	SGG_OID: number;
	// extends properties
	extends: {
		middlePoint: Coordinate;
		zoomLevel: number;
	};
}
