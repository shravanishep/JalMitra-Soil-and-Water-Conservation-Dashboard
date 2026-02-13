import { useState, useEffect } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

const DEFAULT_API_BASE_URL = "http://127.0.0.1:5000/api/v1";
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE_URL;

function Dashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [summaryError, setSummaryError] = useState(null)
  const [yearlyWaterData, setYearlyWaterData] = useState([])
  const [yearlyLoading, setYearlyLoading] = useState(true)
  const [yearlyError, setYearlyError] = useState(null)

  useEffect(() => {
    console.log("Using API base URL:", apiBaseUrl);

    const fetchJson = async (url) => {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`API call ${url} failed with status ${response.status}`);
        }
        return response.json();
      } catch (error) {
        console.error("Fetch failed:", error);
        throw error;
      }
    };

    const loadSummary = async () => {
      const url = `${apiBaseUrl}/summary`;
      try {
        const result = await fetchJson(url);
        setData(result);
        setSummaryError(null);
      } catch (error) {
        setSummaryError(`Failed to load summary from ${url}`);
      } finally {
        setLoading(false);
      }
    };

    const loadYearlyWater = async () => {
      const url = `${apiBaseUrl}/yearly-water`;
      try {
        const result = await fetchJson(url);
        setYearlyWaterData(result);
        setYearlyError(null);
      } catch (error) {
        setYearlyError(`Failed to load yearly water from ${url}`);
      } finally {
        setYearlyLoading(false);
      }
    };

    loadSummary();
    loadYearlyWater();
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">JalMitra Dashboard</h1>
          <p className="text-gray-600">Soil & Water Conservation Monitoring</p>
        </header>

        {summaryError && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
            {summaryError}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-lg p-6 border-t-4 border-blue-500 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium uppercase mb-2">Total Beneficiaries</p>
                <p className="text-4xl font-bold text-blue-600">{data?.total_beneficiaries || 0}</p>
              </div>
              <div className="bg-blue-100 rounded-full p-4">
                <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 border-t-4 border-green-500 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium uppercase mb-2">Total Projects</p>
                <p className="text-4xl font-bold text-green-600">{data?.total_projects || 0}</p>
              </div>
              <div className="bg-green-100 rounded-full p-4">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 border-t-4 border-cyan-500 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium uppercase mb-2">Water Conserved</p>
                <p className="text-4xl font-bold text-cyan-600">{data?.total_water_conserved || 0}</p>
                <p className="text-sm text-gray-500 mt-1">Lakh Liters</p>
              </div>
              <div className="bg-cyan-100 rounded-full p-4">
                <svg className="w-8 h-8 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <section className="mt-10 rounded-lg bg-white p-6 shadow-lg">
          <h2 className="mb-4 text-xl font-semibold text-gray-800">Year-wise Water Conserved</h2>

          {yearlyLoading && <p className="text-gray-600">Loading chart data...</p>}

          {yearlyError && !yearlyLoading && (
            <p className="text-red-700">{yearlyError}</p>
          )}

          {!yearlyLoading && !yearlyError && (
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={yearlyWaterData} margin={{ top: 10, right: 20, left: 20, bottom: 30 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="year"
                    allowDecimals={false}
                    label={{ value: 'Year', position: 'insideBottom', offset: -15 }}
                  />
                  <YAxis
                    label={{
                      value: 'Water Conserved (Lakh Liters)',
                      angle: -90,
                      position: 'insideLeft',
                    }}
                  />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="water_conserved_lakh_liters"
                    stroke="#0284c7"
                    strokeWidth={2}
                    dot
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

export default Dashboard
