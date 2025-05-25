interface displayPolygonProps {
	map: kakao.maps.Map;
	path: kakao.maps.LatLng[] | kakao.maps.LatLng[][];
}

export function drawPolygon({ map, path }: displayPolygonProps) {
	return new kakao.maps.Polygon({
		map,
		path,
		strokeWeight: 2,
		strokeColor: '#004c80',
		strokeOpacity: 0.8
	});
}
