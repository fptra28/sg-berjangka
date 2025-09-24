import { useState, useEffect } from "react";
import CountryFlag from "react-country-flag";

const filters = ["Today", "This Week", "Previous Week", "Next Week"];

const currencyToCountry: Record<string, string> = {
  US: "US",
  EUR: "EU",
  JPY: "JP",
  GBP: "GB",
  AUD: "AU",
  CAD: "CA",
  CHF: "CH",
  CHN: "CN",
  HKD: "HK",
  IDN: "ID",
};

export default function KalenderEkonomi() {
  const [activeFilter, setActiveFilter] = useState("Today");
  const [searchQuery, setSearchQuery] = useState("");
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch("https://portalnews.newsmaker.id/api/kalender-ekonomi");
      if (!res.ok) throw new Error("Gagal mengambil data");
      const json = await res.json();

      // Memastikan data berada dalam format array di dalam json.data
      if (Array.isArray(json.data)) {
        setData(json.data); // Menyimpan data kalender ekonomi ke state
      } else {
        console.error("Data yang diterima tidak sesuai format:", json);
        setData([]);
      }
    } catch (error) {
      console.error(error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };
  fetchData();
}, []);

  const getCountryCode = (code: string) => {
    return currencyToCountry[code?.toUpperCase()] || "unknown";
  };

  const getActualClass = (actual: string, forecast: string) => {
    const actualNum = parseFloat(actual?.replace(/[^0-9.-]+/g, ""));
    const forecastNum = parseFloat(forecast?.replace(/[^0-9.-]+/g, ""));
    if (isNaN(actualNum) || isNaN(forecastNum)) return "text-neutral-100";
    if (actualNum > forecastNum) return "text-green-500";
    if (actualNum < forecastNum) return "text-red-500";
    return "text-neutral-100";
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "Mei",
      "Jun",
      "Jul",
      "Agu",
      "Sep",
      "Okt",
      "Nov",
      "Des",
    ];
    const day = d.getDate();
    const month = monthNames[d.getMonth()];
    const year = d.getFullYear();
    return `${day} ${month} ${year}`;
  };

  const parseTimeToMinutes = (timeStr: string) => {
    if (!timeStr) return 0;
    const [h, m] = timeStr.split(":").map((n) => parseInt(n) || 0);
    return h * 60 + m;
  };

  let filteredData = data
    .filter((item) => {
      const q = searchQuery.toLowerCase();
      const country = (item.country || "").toLowerCase();
      const impact = (item.impact || "").toLowerCase();
      const figures = (item.figures || "").toLowerCase();
      const forecast = (item.forecast || "").toLowerCase();
      const previous = (item.previous || "").toLowerCase();
      const actual = (item.actual || "").toLowerCase();
      return (
        country.includes(q) ||
        impact.includes(q) ||
        figures.includes(q) ||
        forecast.includes(q) ||
        previous.includes(q) ||
        actual.includes(q)
      );
    })
    .filter((item) => {
      if (!item.date) return false;

      const itemDate = new Date(item.date);
      const now = new Date();
      const itemDay = new Date(
        itemDate.getFullYear(),
        itemDate.getMonth(),
        itemDate.getDate()
      );
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      if (activeFilter === "Today")
        return itemDay.getTime() === today.getTime();

      const getWeekRange = (startOffset: number) => {
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - today.getDay() + startOffset);
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        return [weekStart, weekEnd];
      };

      if (activeFilter === "This Week") {
        const [start, end] = getWeekRange(0);
        return itemDay >= start && itemDay <= end;
      }
      if (activeFilter === "Previous Week") {
        const [start, end] = getWeekRange(-7);
        return itemDay >= start && itemDay <= end;
      }
      if (activeFilter === "Next Week") {
        const [start, end] = getWeekRange(7);
        return itemDay >= start && itemDay <= end;
      }

      return true;
    });

  filteredData = filteredData.sort((a, b) => {
    if (activeFilter === "Today") {
      return parseTimeToMinutes(a.time) - parseTimeToMinutes(b.time);
    } else {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      if (dateA !== dateB) {
        return dateA - dateB;
      }
      return parseTimeToMinutes(a.time) - parseTimeToMinutes(b.time);
    }
  });

  return (
    <div className="space-y-5">
      {/* Filter + Search */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div className="flex flex-wrap gap-3">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`uppercase border text-white border-yellow-500 px-3 py-2 rounded-lg transition-all duration-300 ${activeFilter === filter
                  ? "bg-yellow-500 text-white font-semibold"
                  : "bg-gray-100/5 hover:bg-gray-100/10"
                }`}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="w-full md:w-1/2">
          <input
            type="text"
            placeholder="Cari data..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 text-white border border-yellow-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:flex flex-col">
        <div className="-m-1.5 overflow-x-auto">
          <div className="p-1.5 min-w-full inline-block align-middle">
            <div className="border border-yellow-500 rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-yellow-500">
                <thead className="bg-yellow-500">
                  <tr>
                    <th className="px-6 py-3 text-start text-xs font-medium text-neutral-900 uppercase">
                      Date
                    </th>
                    <th className="px-6 py-3 text-start text-xs font-medium text-neutral-900 uppercase">
                      Time
                    </th>
                    <th className="px-6 py-3 text-start text-xs font-medium text-neutral-900 uppercase">
                      Country
                    </th>
                    <th className="px-6 py-3 text-start text-xs font-medium text-neutral-900 uppercase">
                      Impact
                    </th>
                    <th className="px-6 py-3 text-start text-xs font-medium text-neutral-900 uppercase">
                      Figures
                    </th>
                    <th className="px-6 py-3 text-start text-xs font-medium text-neutral-900 uppercase">
                      Previous
                    </th>
                    <th className="px-6 py-3 text-start text-xs font-medium text-neutral-900 uppercase">
                      Forecast
                    </th>
                    <th className="px-6 py-3 text-start text-xs font-medium text-neutral-900 uppercase">
                      Actual
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td
                        colSpan={8}
                        className="text-center py-4 text-neutral-100"
                      >
                        Loading...
                      </td>
                    </tr>
                  ) : filteredData.length > 0 ? (
                    filteredData.map((item, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-100">
                          {formatDate(item.date)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-neutral-100">
                          {item.time || "-"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-100 flex items-center gap-2">
                          <CountryFlag
                            countryCode={getCountryCode(item.country)}
                            svg
                            style={{ width: "1.5em", height: "1.5em" }}
                            title={item.country || ""}
                          />
                          {item.country || "-"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-100">
                          {item.impact || "-"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-100">
                          {item.figures || "-"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-100">
                          {item.previous || "-"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-100">
                          {item.forecast || "-"}
                        </td>
                        <td
                          className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${getActualClass(
                            item.actual,
                            item.forecast
                          )}`}
                        >
                          {item.actual || "-"}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={8}
                        className="text-center py-4 text-neutral-100"
                      >
                        Tidak ada data
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Cards */}
      <div className="flex flex-col md:hidden space-y-3">
        {loading ? (
          <div className="text-center py-4 text-neutral-100">Loading...</div>
        ) : filteredData.length > 0 ? (
          filteredData.map((item, index) => (
            <div
              key={index}
              className="border border-yellow-500 rounded-lg p-4 bg-gray-900/10 flex flex-col gap-2"
            >
              <div className="flex justify-between items-center">
                <div className="flex flex-row items-center gap-1">
                  <span className="text-sm text-neutral-100 font-medium">
                    {formatDate(item.date)}
                  </span>
                  <span className="text-sm text-neutral-100 font-medium">-</span>
                  <span className="text-sm text-neutral-100 font-medium">
                    {item.time || "-"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CountryFlag
                    countryCode={getCountryCode(item.country)}
                    svg
                    style={{ width: "1.5em", height: "1.5em" }}
                    title={item.country || ""}
                  />
                  <span className="text-sm text-neutral-100">
                    {item.country || "-"}
                  </span>
                </div>
              </div>
              <div className="flex justify-between text-sm text-neutral-100">
                <span>Impact:</span>
                <span>{item.impact || "-"}</span>
              </div>
              <div className="flex justify-between text-sm text-neutral-100">
                <span>Figures:</span>
                <span>{item.figures || "-"}</span>
              </div>
              <div className="flex justify-between text-sm text-neutral-100">
                <span>Previous:</span>
                <span>{item.previous || "-"}</span>
              </div>
              <div className="flex justify-between text-sm text-neutral-100">
                <span>Forecast:</span>
                <span>{item.forecast || "-"}</span>
              </div>
              <div className="flex justify-between text-sm text-neutral-100">
                <span>Actual:</span>
                <span className={getActualClass(item.actual, item.forecast)}>
                  {item.actual || "-"}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-4 text-neutral-100">Tidak ada data</div>
        )}
      </div>
    </div>
  );
}
