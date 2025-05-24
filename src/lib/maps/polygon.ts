interface displayPolygonProps {
	map: kakao.maps.Map;
	area: {
		name: string;
		path: kakao.maps.LatLng[] | kakao.maps.LatLng[][];
	};
	overlay: kakao.maps.CustomOverlay;
}

export function drawPolygon({ map, area, overlay }: displayPolygonProps) {
	const polygon = new kakao.maps.Polygon({
		map,
		path: area.path,
		strokeWeight: 2,
		strokeColor: '#004c80',
		strokeOpacity: 0.8,
		fillColor: '#fff',
		fillOpacity: 0.7
	});

	function mouseOverEvent(mouseEvent: kakao.maps.event.MouseEvent) {
		polygon.setOptions({ fillColor: '#09f' });

		overlay.setContent('<div class="area">' + area.name + '</div>');

		overlay.setPosition(mouseEvent.latLng);
		overlay.setMap(map);
	}
	function mouseClickEvent(mouseEvent: kakao.maps.event.MouseEvent) {
		const latlng = mouseEvent.latLng;

		const message = `${area.name} 위도와 경도 : ${latlng.getLat()}, + ${latlng.getLng()}`;
		console.log(message, map.getLevel());
	}
	function mouseOutEvent() {
		overlay.setMap(null);
	}

	kakao.maps.event.addListener(polygon, 'mouseover', mouseOverEvent);
	kakao.maps.event.addListener(polygon, 'click', mouseClickEvent);
	kakao.maps.event.addListener(polygon, 'mouseout', mouseOutEvent);

	return [polygon, [mouseOverEvent, mouseOutEvent]] as const;
}
