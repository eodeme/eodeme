interface Place {
	start: {
		picture: string;
		description: string;
		keywords: string[];
		hints: string[];
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
