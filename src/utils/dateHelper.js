export const formatDate = (dateString) => {
  const date = new Date(dateString);
  const dayNames = [
    "Minggu",
    "Senin",
    "Selasa",
    "Rabu",
    "Kamis",
    "Jumat",
    "Sabtu",
  ];
  const monthNames = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  const dayName = dayNames[date.getDay()];
  const day = date.getDate();
  const monthName = monthNames[date.getMonth()];
  const year = date.getFullYear();

  // Format time as HH:MM
  const hours = String(date.getHours()).padStart(2, "0"); // pad with leading zero if needed
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${dayName}, ${day} ${monthName} ${year} ${hours}:${minutes}`;
};
