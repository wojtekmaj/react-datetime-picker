export function convert12to24(hour12, amPm) {
  let hour24 = parseInt(hour12, 10);

  if (amPm === 'am' && hour24 === 12) {
    hour24 = 0;
  } else if (amPm === 'pm' && hour24 < 12) {
    hour24 += 12;
  }

  return hour24;
}

export function convert24to12(hour24) {
  const hour12 = hour24 % 12 || 12;

  return [hour12, hour24 < 12 ? 'am' : 'pm'];
}
