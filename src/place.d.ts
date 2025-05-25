interface Place {
	start: {
		picture: string;
		description: string;
		keywords: string[];
		hints: string[];
    EMD_CD: string; // 행정동 코드
	  COL_ADM_SE: string; // 도시 코드
	};
	result: {
		placeName: string;
		coordinate: {
			latitude: number;
			longitude: number;
		};
		address: string;
		outlink: {
			visitjeju: string;
			naverMap: string;
			kakaoMap: string;
		};
	};
}

interface Coordinate {
	latitude: number;
	longitude: number;
}
