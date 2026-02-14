import { useState, useEffect } from 'react'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

const DEFAULT_API_BASE_URL = 'http://127.0.0.1:5000/api/v1'
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE_URL

const formatNumber = (value) => new Intl.NumberFormat('en-IN').format(Number(value || 0))

function Dashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [summaryError, setSummaryError] = useState(null)

  const [yearlyWaterData, setYearlyWaterData] = useState([])
  const [yearlyLoading, setYearlyLoading] = useState(true)
  const [yearlyError, setYearlyError] = useState(null)
  const [yearlySoilData, setYearlySoilData] = useState([])
  const [yearlySoilLoading, setYearlySoilLoading] = useState(true)
  const [yearlySoilError, setYearlySoilError] = useState(null)
  const [villageImpactData, setVillageImpactData] = useState([])
  const [villageImpactLoading, setVillageImpactLoading] = useState(true)
  const [villageImpactError, setVillageImpactError] = useState(null)
  const [projectTypeData, setProjectTypeData] = useState([])
  const [projectTypeLoading, setProjectTypeLoading] = useState(true)
  const [projectTypeError, setProjectTypeError] = useState(null)
  const [beneficiaryTrendData, setBeneficiaryTrendData] = useState([])
  const [beneficiaryTrendLoading, setBeneficiaryTrendLoading] = useState(true)
  const [beneficiaryTrendError, setBeneficiaryTrendError] = useState(null)

  useEffect(() => {
    console.log('Using API base URL:', apiBaseUrl)

    const fetchJson = async (url) => {
      try {
        const response = await fetch(url)
        if (!response.ok) {
          throw new Error(`API call ${url} failed with status ${response.status}`)
        }
        return response.json()
      } catch (error) {
        console.error('Fetch failed:', error)
        throw error
      }
    }

    const loadSummary = async () => {
      const url = `${apiBaseUrl}/summary`
      try {
        const result = await fetchJson(url)
        setData(result)
        setSummaryError(null)
      } catch (error) {
        setSummaryError(`Failed to load summary from ${url}`)
      } finally {
        setLoading(false)
      }
    }

    const loadYearlyWater = async () => {
      const url = `${apiBaseUrl}/yearly-water`
      try {
        const result = await fetchJson(url)
        setYearlyWaterData(result)
        setYearlyError(null)
      } catch (error) {
        setYearlyError(`Failed to load yearly water from ${url}`)
      } finally {
        setYearlyLoading(false)
      }
    }

    const loadYearlySoil = async () => {
      const url = `${apiBaseUrl}/yearly-soil`
      try {
        const result = await fetchJson(url)
        setYearlySoilData(result)
        setYearlySoilError(null)
      } catch (error) {
        setYearlySoilError(`Failed to load yearly soil from ${url}`)
      } finally {
        setYearlySoilLoading(false)
      }
    }

    const loadVillageImpact = async () => {
      const url = `${apiBaseUrl}/village-impact`
      try {
        const result = await fetchJson(url)
        setVillageImpactData(result.slice(0, 10))
        setVillageImpactError(null)
      } catch (error) {
        setVillageImpactError(`Failed to load village impact from ${url}`)
      } finally {
        setVillageImpactLoading(false)
      }
    }

    const loadProjectTypeImpact = async () => {
      const url = `${apiBaseUrl}/project-type-impact`
      try {
        const result = await fetchJson(url)
        setProjectTypeData(result)
        setProjectTypeError(null)
      } catch (error) {
        setProjectTypeError(`Failed to load project type impact from ${url}`)
      } finally {
        setProjectTypeLoading(false)
      }
    }

    const loadBeneficiaryTrend = async () => {
      const url = `${apiBaseUrl}/yearly-beneficiaries`
      try {
        const result = await fetchJson(url)
        setBeneficiaryTrendData(result)
        setBeneficiaryTrendError(null)
      } catch (error) {
        setBeneficiaryTrendError(`Failed to load beneficiary trend from ${url}`)
      } finally {
        setBeneficiaryTrendLoading(false)
      }
    }

    loadSummary()
    loadYearlyWater()
    loadYearlySoil()
    loadVillageImpact()
    loadProjectTypeImpact()
    loadBeneficiaryTrend()
  }, [])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-xl text-slate-600">Loading dashboard...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f8fbff_0%,#eef7f2_45%,#f4efe8_100%)] text-slate-900">
      <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">SevaSahayog</p>
            <h1 className="text-xl font-bold text-slate-900 md:text-2xl">JalMitra Impact Dashboard</h1>
          </div>
          <nav className="hidden items-center gap-6 text-sm font-medium text-slate-700 md:flex">
            <a href="#journey" className="hover:text-emerald-700">Journey</a>
            <a href="#analytics" className="hover:text-emerald-700">Analytics</a>
            <a href="#supervisor" className="hover:text-emerald-700">Supervisor</a>
          </nav>
          <button className="rounded-md bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800" type="button">
            Login as Supervisor
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-8">
        <section className="rounded-2xl border border-emerald-200/80 bg-white/90 p-6 shadow-sm md:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">About the initiative</p>
          <h2 className="mt-2 text-3xl font-bold leading-tight text-slate-900 md:text-4xl">
            Tracking long-term soil and water outcomes village by village
          </h2>
          <p className="mt-4 max-w-4xl text-base leading-relaxed text-slate-600">
            SevaSahayog executes conservation work on the ground, but data often stays in scattered registers and spreadsheets.
            This dashboard centralizes project, beneficiary, soil, and water records to monitor progress over time and report
            clear impact to donors and partners.
          </p>
        </section>

        <section id="journey" className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Collect</p>
            <p className="mt-2 text-sm text-slate-600">Field entries from registers are digitized into structured village and project records.</p>
          </div>
          <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Analyze</p>
            <p className="mt-2 text-sm text-slate-600">Year-wise and location-wise trends for soil and water are computed for planning reviews.</p>
          </div>
          <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Demonstrate</p>
            <p className="mt-2 text-sm text-slate-600">Clear visual outputs help communicate measurable outcomes to stakeholders and partners.</p>
          </div>
        </section>

        {summaryError && (
          <div className="mt-8 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
            {summaryError}
          </div>
        )}

        <section id="analytics" className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">Total Beneficiaries</p>
            <p className="mt-3 text-4xl font-bold text-blue-700">{formatNumber(data?.total_beneficiaries)}</p>
          </div>
          <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">Total Projects</p>
            <p className="mt-3 text-4xl font-bold text-emerald-700">{formatNumber(data?.total_projects)}</p>
          </div>
          <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">Water Conserved</p>
            <p className="mt-3 text-4xl font-bold text-cyan-700">{formatNumber(data?.total_water_conserved)}</p>
            <p className="mt-1 text-sm text-slate-500">Lakh Liters</p>
          </div>
        </section>

        <section className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-2">
          <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
            <h3 className="mb-4 text-lg font-semibold text-slate-900">Year-wise Water Conserved</h3>
            {yearlyLoading && <p className="text-slate-600">Loading chart data...</p>}
            {yearlyError && !yearlyLoading && <p className="text-red-700">{yearlyError}</p>}
            {!yearlyLoading && !yearlyError && (
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={yearlyWaterData} margin={{ top: 10, right: 20, left: 10, bottom: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" allowDecimals={false} label={{ value: 'Year', position: 'insideBottom', offset: -5 }} />
                    <YAxis tickFormatter={formatNumber} width={75} label={{ value: 'Water (Lakh Liters)', angle: -90, position: 'insideLeft' }} />
                    <Tooltip formatter={(value) => [`${formatNumber(value)} lakh L`, 'Water']} />
                    <Line type="monotone" dataKey="water_conserved_lakh_liters" stroke="#0369a1" strokeWidth={3} dot={{ r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
            <h3 className="mb-4 text-lg font-semibold text-slate-900">Year-wise Soil Conserved</h3>
            {yearlySoilLoading && <p className="text-slate-600">Loading soil data...</p>}
            {yearlySoilError && !yearlySoilLoading && <p className="text-red-700">{yearlySoilError}</p>}
            {!yearlySoilLoading && !yearlySoilError && (
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={yearlySoilData} margin={{ top: 10, right: 20, left: 10, bottom: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" allowDecimals={false} label={{ value: 'Year', position: 'insideBottom', offset: -5 }} />
                    <YAxis tickFormatter={formatNumber} width={75} label={{ value: 'Land Treated (ha)', angle: -90, position: 'insideLeft' }} />
                    <Tooltip formatter={(value) => [`${formatNumber(value)} ha`, 'Land Treated']} />
                    <Line type="monotone" dataKey="land_treated_hectares" stroke="#15803d" strokeWidth={3} dot={{ r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </section>

        <section className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-2">
          <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
            <h3 className="mb-4 text-lg font-semibold text-slate-900">Village-wise Impact (Top 10)</h3>
            {villageImpactLoading && <p className="text-slate-600">Loading village impact...</p>}
            {villageImpactError && !villageImpactLoading && <p className="text-red-700">{villageImpactError}</p>}
            {!villageImpactLoading && !villageImpactError && (
              <div className="h-96 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={villageImpactData} margin={{ top: 10, right: 10, left: 10, bottom: 80 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="village" angle={-35} textAnchor="end" interval={0} height={90} />
                    <YAxis width={70} tickFormatter={formatNumber} />
                    <Tooltip formatter={(value) => formatNumber(value)} />
                    <Legend />
                    <Bar dataKey="water_conserved_lakh_liters" name="Water (Lakh Liters)" fill="#0284c7" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="land_treated_hectares" name="Land Treated (ha)" fill="#22c55e" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
            <h3 className="mb-4 text-lg font-semibold text-slate-900">Project Type Impact</h3>
            {projectTypeLoading && <p className="text-slate-600">Loading project type impact...</p>}
            {projectTypeError && !projectTypeLoading && <p className="text-red-700">{projectTypeError}</p>}
            {!projectTypeLoading && !projectTypeError && (
              <div className="h-96 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={projectTypeData} margin={{ top: 10, right: 10, left: 10, bottom: 70 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="activity_type" angle={-30} textAnchor="end" interval={0} height={80} />
                    <YAxis width={70} tickFormatter={formatNumber} />
                    <Tooltip formatter={(value) => formatNumber(value)} />
                    <Legend />
                    <Bar dataKey="water_conserved_lakh_liters" name="Water (Lakh Liters)" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="land_treated_hectares" name="Land Treated (ha)" fill="#16a34a" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </section>

        <section className="mt-8 rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
          <h3 className="mb-4 text-lg font-semibold text-slate-900">Year-wise Beneficiary Coverage</h3>
          {beneficiaryTrendLoading && <p className="text-slate-600">Loading beneficiary trend...</p>}
          {beneficiaryTrendError && !beneficiaryTrendLoading && <p className="text-red-700">{beneficiaryTrendError}</p>}
          {!beneficiaryTrendLoading && !beneficiaryTrendError && (
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={beneficiaryTrendData} margin={{ top: 10, right: 20, left: 10, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" allowDecimals={false} label={{ value: 'Year', position: 'insideBottom', offset: -5 }} />
                  <YAxis width={70} tickFormatter={formatNumber} label={{ value: 'People', angle: -90, position: 'insideLeft' }} />
                  <Tooltip formatter={(value) => [`${formatNumber(value)} people`, 'Enrolled']} />
                  <Line type="monotone" dataKey="people_enrolled" stroke="#ea580c" strokeWidth={3} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </section>

        <section id="supervisor" className="mt-8 rounded-2xl bg-slate-900 p-6 text-white md:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-300">Supervisor Workflow</p>
          <h3 className="mt-2 text-2xl font-bold">Upcoming field-entry module</h3>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-200">
            Next phase will allow supervisors to log in, add daily progress entries, and upload geotagged photos from site visits.
            Current dashboard is already structured to consume those future records without changing analytics logic.
          </p>
          <div className="mt-5">
            <button className="rounded-md bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-emerald-400" type="button">
              Supervisor Login (Coming Soon)
            </button>
          </div>
        </section>
      </div>

      <footer className="mt-10 border-t border-slate-200 bg-white/80">
        <div className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-6 text-sm text-slate-600 md:flex-row md:items-center md:justify-between">
          <p>SevaSahayog JalMitra Dashboard</p>
          <p>Soil and Water Conservation Monitoring | Data-driven reporting for donors and partners</p>
        </div>
      </footer>
    </div>
  )
}

export default Dashboard
