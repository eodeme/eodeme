interface GeoJson {
	type: string;
	features: Feature[];
}

interface Feature {
	type: string;
	geometry: Geometry;
	properties: CityProperties | LocalProperties;
}

interface Geometry {
	type: string;
	coordinates: number[][] | number[][][];
}

interface CityProperties {
	ADM_SEC_CD: string; // 행정구역 코드 = COL_ADM_SE
	SSG_NM: string; // 행정구역 이름
	SGG_OID: number;
	COL_ADM_SE: string; // 행정구역 코드
	// extends properties
	extends: {
		middlePoint: Coordinate;
		zoomLevel: number;
	};
}
interface LocalProperties {
	EMD_CD: string;
	COL_ADM_SE: string; // 행정구역 코드
	EMD_NM: string; // 읍면동명
	SGG_OID: number;
	// extends properties
	extends: {
		middlePoint: Coordinate;
		zoomLevel: number;
	};
}
