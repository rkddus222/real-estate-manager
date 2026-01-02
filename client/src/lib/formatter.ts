/**
 * 숫자를 한글 금액 단위(억, 만)로 변환합니다.
 * 예: 120000000 -> 1억 2000만원
 */
export function formatKoreanPrice(price: number): string {
    if (price === 0) return '0원';

    const units = ['', '만', '억', '조'];
    const splitUnit = 10000;
    const result = [];
    let tempPrice = price;

    for (let i = 0; tempPrice > 0 && i < units.length; i++) {
        const value = tempPrice % splitUnit;
        if (value > 0) {
            result.push(`${value.toLocaleString()}${units[i]}`);
        }
        tempPrice = Math.floor(tempPrice / splitUnit);
    }

    return result.reverse().join(' ') + (result.length > 0 ? '원' : '');
}

/**
 * m² 단위를 평수로 변환하여 문자열로 반환합니다.
 */
export function formatToPyeong(m2: number): string {
    if (!m2 || m2 <= 0) return '';
    const pyeong = (m2 * 0.3025).toFixed(2);
    return `약 ${pyeong}평`;
}
