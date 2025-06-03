export function computeDistanceBetween(coord1: Coordinate, coord2: Coordinate): number {
	const R = 6371e3; // 지구의 반지름 (미터 단위)
	const φ1 = coord1.latitude * (Math.PI / 180);
	const φ2 = coord2.latitude * (Math.PI / 180);
	const Δφ = (coord2.latitude - coord1.latitude) * (Math.PI / 180);
	const Δλ = (coord2.longitude - coord1.longitude) * (Math.PI / 180);

	const a =
		Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
		Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

	return R * c; // 거리 (미터 단위)
}

/**
 * 주어진 중심 좌표에서 왼쪽으로 오프셋된 좌표를 반환합니다.
 * @param center 중심 좌표
 * @param bounds 지도 경계
 * @param ratio 오프셋 비율 (기본값: 0.3)
 * @returns 오프셋된 좌표
 * */
export function getOffsetCenterRight(
	center: kakao.maps.LatLng,
	bounds: kakao.maps.LatLngBounds,
	ratio: number = 0.3
): kakao.maps.LatLng {
	const sw = bounds.getSouthWest();
	const ne = bounds.getNorthEast();
	const lngSpan = Math.abs(ne.getLng() - sw.getLng());
	const offsetLng = lngSpan * ratio;
	return new kakao.maps.LatLng(center.getLat(), center.getLng() - offsetLng);
}
