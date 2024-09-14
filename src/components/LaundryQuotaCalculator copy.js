import React from "react";
import useQuotaData from "../hooks/useQuotaData";

function LaundryQuotaCalculator({ selectedService }) {
  const { capacity, quota, today, tomorrow, error } = useQuotaData();
  const [unit, setUnit] = React.useState(selectedService?.unit || "null"); // Default to selectedService unit
  const [result, setResult] = React.useState(null); // Calculation result

  // Get processing time from selectedService
  const processingTime = selectedService?.processing_time || 24; // Default is 24 hours if not available

  // Get the request quantity from selectedService
  const request = selectedService?.quantity || 0;

  // Function to determine the value of 1 quota based on the unit
  const getQuotaValue = () => {
    return unit === "pcs" ? 1 : quota;
  };

  // Function to calculate the required quota and finish date
  const calculateQuota = () => {
    const quotaValue = getQuotaValue();
    const quotasNeeded =
      request <= quotaValue ? 1 : Math.ceil(request / quotaValue); // Ensure quotasNeeded is at least 1

    // Determine the available capacity for today
    let availableToday = capacity - today;
    let availableTomorrow = capacity - tomorrow;
    let totalQuotasNeeded = quotasNeeded; // Total quotas that need to be processed
    let extraDays = 0; // Number of extra days needed

    // Get the current date and add processing time (in hours)
    const currentDate = new Date();
    let finishDate = new Date(
      currentDate.getTime() + processingTime * 60 * 60 * 1000
    ); // processing_time in hours

    if (quotasNeeded <= availableToday) {
      // If the needed quotas fit within today's available quota
      setResult({
        remainingCapacity: availableToday - quotasNeeded, // Remaining capacity for today
        quotaTomorrow: tomorrow, // Quota for tomorrow remains the same
        finishDate: finishDate.toLocaleDateString(), // Estimated finish date
      });
    } else {
      // If today's capacity is not enough, we move to tomorrow
      totalQuotasNeeded -= availableToday; // Subtract today's available quota
      availableToday = 0; // Today is fully booked

      if (totalQuotasNeeded <= availableTomorrow) {
        // If tomorrow's quota can handle the remaining request
        setResult({
          remainingCapacity: availableToday, // No more capacity today
          quotaTomorrow: tomorrow + totalQuotasNeeded, // Updated quota for tomorrow
          finishDate: finishDate.toLocaleDateString(), // Finish date remains the same
        });
      } else {
        // If tomorrow's capacity is also not enough
        totalQuotasNeeded -= availableTomorrow; // Subtract tomorrow's available quota
        availableTomorrow = 0; // Tomorrow is fully booked

        // Continue adding extra days until all quotas are handled
        while (totalQuotasNeeded > 0) {
          extraDays++; // Add 1 extra day
          totalQuotasNeeded -= capacity; // Subtract the max capacity per day
        }

        // Calculate the final finish date after adding extra days
        finishDate.setDate(finishDate.getDate() + extraDays);

        setResult({
          remainingCapacity: availableToday, // No capacity today
          quotaTomorrow: capacity, // Tomorrow is fully booked
          extraDays: extraDays, // Number of extra days needed
          finishDate: finishDate.toLocaleDateString(), // Estimated finish date with extra days
        });
      }
    }
  };

  return (
    <div>
      <h1>Kalkulator Quota Laundry</h1>

      <div>
        <label>Unit Pengukuran:</label>
        <select value={unit} onChange={(e) => setUnit(e.target.value)}>
          <option value="kg">Kg</option>
          <option value="pcs">Satuan</option>
        </select>
      </div>

      <div>
        <label>
          Total Quota yang Dapat Dikerjakan dalam Sehari: {capacity}
        </label>
        <input
          type="number"
          value={capacity}
          disabled // Disable input as it's for display only
          placeholder="Kapasitas quota per hari"
        />
      </div>

      <div>
        <label>
          {unit === "pcs" ? "1 Quota = 1 pcs" : `1 Quota = ${quota} kg`}
        </label>
      </div>

      <div>
        <label>Kuota Terpakai Hari Ini:</label>
        <input
          type="number"
          value={today}
          disabled // Disable input as it's for display only
          placeholder="Kuota terpakai hari ini"
        />
      </div>

      <div>
        <label>Kuota Terpakai Besok:</label>
        <input
          type="number"
          value={tomorrow}
          disabled // Disable input as it's for display only
          placeholder="Kuota terpakai besok"
        />
      </div>

      <button onClick={calculateQuota}>Hitung Quota</button>

      {result && (
        <div>
          <h2>Hasil:</h2>
          <p>Sisa Kapasitas Hari Ini: {result.remainingCapacity}</p>
          <p>Kuota Terpakai Besok: {result.quotaTomorrow}</p>
          {result.extraDays && <p>Hari Tambahan: {result.extraDays} hari</p>}
          <p>Estimasi Selesai: {result.finishDate}</p>
        </div>
      )}

      {error && <p>{error}</p>}
    </div>
  );
}

export default LaundryQuotaCalculator;
