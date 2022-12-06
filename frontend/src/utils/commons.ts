// 날짜 계산
export const timeForToday = (dateInput: any) => {
  const today = new Date();
  const computeDate = new Date(dateInput);

  const betweenTime = Math.floor(
    (today.getTime() - computeDate.getTime()) / 1000 / 60,
  );
  if (betweenTime < 1) return '방금전';
  if (betweenTime < 60) {
    return `${betweenTime}분전`;
  }

  const betweenTimeHour = Math.floor(betweenTime / 60);
  if (betweenTimeHour < 24) {
    return `${betweenTimeHour}시간전`;
  }

  const betweenTimeDay = Math.floor(betweenTime / 60 / 24);
  if (betweenTimeDay < 7) {
    return `${betweenTimeDay}일전`;
  }

  return `${computeDate.getMonth() + 1}월 ${computeDate.getDate()}일`;
};
