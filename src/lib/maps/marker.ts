const markerSize = 32;
const yAnchor = 1.3;

const markerIconPath = {
	chequeredFlag: 'images/🏁.png',
	whiteFlag: 'images/🏳️.png'
};

type MarkerOptions =
	| {
			finished: true;
			leftTime: number;
			place: Place;
			onClickOverlay: () => void;
			coordinate: Coordinate;
	  }
	| {
			finished: false;
			place: Place;
			onClickOverlay: () => void;
			coordinate: Coordinate;
	  };

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
		map,
		image: markerImage,
		position
	});

	const content = document.createElement('article');
	content.className = 'w-[128px] bg-gray-200 rounded shadow-md cursor-pointer';
	content.innerHTML = `
  <img src="${options.place.start.picture}" alt="marker image" class="w-full h-[100px] object-cover rounded-t-lg" />
  <div class="font-medium p-[5px]">
    <div class="text-[10px] text-center p-[2px]">${options.place.result.placeName}</div>
  </div>
  `;
	content.addEventListener('click', options.onClickOverlay);

	const overlay = new kakao.maps.CustomOverlay({
		content,
		position,
		yAnchor
	});

	kakao.maps.event.addListener(marker, 'click', () => {
		if (overlay.getMap()) {
			overlay.setMap(null);
		} else {
			overlay.setMap(map);
		}
	});

	return {
		marker,
		overlay
	};
}
