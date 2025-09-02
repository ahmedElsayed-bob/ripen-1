export function isToday(date: string) {
  const today = new Date();
  const dateObj = new Date(date);
  return (
    dateObj.getDate() === today.getDate() &&
    dateObj.getMonth() === today.getMonth() &&
    dateObj.getFullYear() === today.getFullYear()
  );
}
