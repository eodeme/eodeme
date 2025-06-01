const markerSize = 32;
const yAnchor = 1.3;

const markerIconPath = {
	chequeredFlag: 'images/🏁.png',
	whiteFlag: 'images/🏳️.png'
};

interface MarkerOptions {
	finished: boolean;
	place: Place;
	coordinate: Coordinate;
}

export function createMarker(map: kakao.maps.Map, options: MarkerOptions) {
	const markerImage = new kakao.maps.MarkerImage(
		options.finished ? markerIconPath.chequeredFlag : markerIconPath.whiteFlag,
		new kakao.maps.Size(markerSize, markerSize),
		{
			offset: new kakao.maps.Point(markerSize / 2, markerSize)
		}
	);

	const position = new kakao.maps.LatLng(options.coordinate.latitude, options.coordinate.longitude);

	const marker = new kakao.maps.Marker({
		image: markerImage,
		position
	});
	marker.setMap(map);

	return new kakao.maps.CustomOverlay({
		map,
		content: `<article class="w-[128px] h-[139.6px] flex flex-col items-center bg-gray-200 rounded shadow-md">
			<img src="${options.place.start.picture}" alt="overlay image" class="w-full rounded-t-lg" />
			<div class="font-medium flex flex-col items-center p-[5px]">
				<div class="text-[10px] p-[2px]">${options.place.result.placeName}</div>
				<button class="text-[10px] p-[2px] bg-white w-[110px]">자세히보기</button>
			</div>
		</article>`,
		position,
		yAnchor
	});
}
