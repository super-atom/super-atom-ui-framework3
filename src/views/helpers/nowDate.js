/**
 * 현재 날짜를 YYYY-MM-DD 형식으로 반환하는 핸들바스 헬퍼
 * data-calendar-target 속성에 사용하기 위한 현재 날짜 문자열을 제공
 * @returns {string} YYYY-MM-DD 형식의 현재 날짜 문자열
 */
export default function nowDate() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}
