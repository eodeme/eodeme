type Coord = number[];

// MapCoordsToLatLng utility type
type MapCoordsToLatLng<T> = T extends Coord
	? kakao.maps.LatLng
	: T extends (infer U)[]
		? MapCoordsToLatLng<U>[]
		: never;

/**
 * Recursively converts a nested array of coordinates into
 * kakao.maps.LatLng objects (handles 2D or 3D coordinate arrays).
 */
export function mapCoordsToLatLng<T>(coords: T): MapCoordsToLatLng<T> {
	if (!Array.isArray(coords)) throw new TypeError('Input must be an array');

	// If coords is Coord[] (i.e., array of [lng, lat])
	if (
		coords.length > 0 &&
		Array.isArray(coords[0]) &&
		typeof coords[0][0] === 'number' &&
		typeof coords[0][1] === 'number'
	)
		// TS2322: Type 'LatLng[]' is not assignable to type 'MapCoordsToLatLng<T>'
		// @ts-expect-error: // TypeScript doesn't infer the type correctly here
		return (coords as Coord[]).map(([lng, lat]) => new kakao.maps.LatLng(lat, lng));

	// @ts-expect-error: // TypeScript doesn't infer the type correctly here
	return (coords as Array<unknown>).map(mapCoordsToLatLng);
}
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
