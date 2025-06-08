export function initializeMap(container: HTMLElement, options = retrieveDefaultLatLngAndLevel()) {
	const map = new kakao.maps.Map(container, options);

	const mapTypeControl = new kakao.maps.MapTypeControl();
	map.addControl(mapTypeControl, kakao.maps.ControlPosition.TOPRIGHT);

	const zoomControl = new kakao.maps.ZoomControl();
	map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);

	map.setCopyrightPosition(kakao.maps.CopyrightPosition.BOTTOMRIGHT, true);

	return map;
}

export function retrieveDefaultLatLngAndLevel() {
	return {
		center: new kakao.maps.LatLng(33.37766874532601, 126.54238118414199),
		level: 9
	};
}
