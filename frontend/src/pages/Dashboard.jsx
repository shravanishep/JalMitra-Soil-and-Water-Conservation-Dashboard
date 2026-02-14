import { useEffect, useState } from 'react'
import WelcomePage from './WelcomePage'
import logoImg from '../assets/images/logo.svg'

const DEFAULT_API_BASE_URL = 'http://127.0.0.1:5000/api/v1'
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE_URL

const formatNumber = (value) => new Intl.NumberFormat('en-IN').format(Number(value || 0))

function Dashboard() {
  const [summaryData, setSummaryData] = useState(null)
  const [yearlyWaterData, setYearlyWaterData] = useState([])
  const [loading, setLoading] = useState(true)
  const [summaryError, setSummaryError] = useState(null)

  useEffect(() => {
    const loadData = async () => {
      const summaryUrl = `${apiBaseUrl}/summary`
      const yearlyWaterUrl = `${apiBaseUrl}/yearly-water`

      try {
        const [summaryResponse, yearlyWaterResponse] = await Promise.all([
          fetch(summaryUrl),
          fetch(yearlyWaterUrl),
        ])

        if (!summaryResponse.ok) {
          throw new Error(`API call ${summaryUrl} failed with status ${summaryResponse.status}`)
        }
        if (!yearlyWaterResponse.ok) {
          throw new Error(`API call ${yearlyWaterUrl} failed with status ${yearlyWaterResponse.status}`)
        }

        const [summaryResult, yearlyWaterResult] = await Promise.all([
          summaryResponse.json(),
          yearlyWaterResponse.json(),
        ])

        setSummaryData(summaryResult)
        setYearlyWaterData(Array.isArray(yearlyWaterResult) ? yearlyWaterResult : [])
        setSummaryError(null)
      } catch (error) {
        setSummaryError('Unable to load impact snapshot from API.')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f7f4ed]">
        <p className="text-lg text-slate-700">Preparing impact story...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f6f8f3_0%,#f4faf8_38%,#f7f2ea_100%)] text-slate-900">
      <header className="fixed inset-x-0 top-0 z-30 border-b border-emerald-100/80 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
          <div className="flex items-center gap-3">
            <img
              src={logoImg}
              alt="SevaMitra logo"
              className="h-10 w-10 rounded-full object-cover ring-2 ring-emerald-100"
              loading="lazy"
            />
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-700">SevaSahayog</p>
              <h1 className="text-base font-bold text-slate-900 md:text-lg">SevaMitra Impact Dashboard</h1>
            </div>
          </div>

          <nav className="hidden items-center gap-6 text-sm font-medium text-slate-700 md:flex">
            <a href="#impact-trends" className="hover:text-emerald-700">Impact</a>
            <a href="#stories" className="hover:text-emerald-700">Stories</a>
            <a href="#live-projects" className="hover:text-emerald-700">Live Projects</a>
            <a href="#gallery" className="hover:text-emerald-700">Gallery</a>
            <a href="#about-us" className="hover:text-emerald-700">About Us</a>
          </nav>

          <div className="flex items-center gap-2">
            <button
              type="button"
              className="rounded-full bg-amber-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-amber-600"
            >
              Donate Now
            </button>
            <button
              type="button"
              className="rounded-full border border-emerald-600 bg-white px-4 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-50"
            >
              Contribute
            </button>
            <button
              type="button"
              className="hidden rounded-full bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800 lg:block"
            >
              Login as Supervisor
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 pb-10 pt-24">
        <section className="rounded-3xl bg-[linear-gradient(130deg,#fffdf8_0%,#f2faf5_55%,#eef7ff_100%)] p-7 md:p-10">
          <h2 className="text-3xl font-bold leading-tight text-slate-900 md:text-5xl">
            Turning conservation into lasting community livelihoods
          </h2>
          <p className="mt-4 max-w-4xl text-base leading-relaxed text-slate-700 md:text-lg">
            From soil and water restoration to livestock and plantation support, SevaSahayog ensures every contribution creates
            measurable impact.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              className="rounded-full bg-amber-500 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-amber-600"
            >
              Donate Now
            </button>
            <button
              type="button"
              className="rounded-full border border-emerald-700 bg-white px-6 py-3 text-sm font-semibold text-emerald-700 hover:bg-emerald-50"
            >
              Know More About Us
            </button>
          </div>
        </section>

        <WelcomePage summaryData={summaryData} yearlyWaterData={yearlyWaterData} />

        <section id="journey" className="mt-12 rounded-3xl bg-white/85 p-6 md:p-8">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Program Snapshot</p>
              <h2 className="mt-1 text-2xl font-bold text-slate-900 md:text-3xl">Current scale of work</h2>
            </div>
            <p className="text-sm text-slate-600">These figures come from existing backend APIs.</p>
          </div>

          {summaryError && (
            <div className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
              {summaryError}
            </div>
          )}

          {!summaryError && (
            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
              <article className="rounded-2xl bg-[#edf7ff] p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-blue-800">People Reached</p>
                <p className="mt-2 text-4xl font-bold text-blue-900">{formatNumber(summaryData?.total_beneficiaries)}</p>
              </article>
              <article className="rounded-2xl bg-[#eefbef] p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-emerald-800">Projects Delivered</p>
                <p className="mt-2 text-4xl font-bold text-emerald-900">{formatNumber(summaryData?.total_projects)}</p>
              </article>
              <article className="rounded-2xl bg-[#ecfbfc] p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-cyan-800">Water Conserved</p>
                <p className="mt-2 text-4xl font-bold text-cyan-900">{formatNumber(summaryData?.total_water_conserved)}</p>
                <p className="mt-1 text-sm text-cyan-800">Lakh liters</p>
              </article>
            </div>
          )}
        </section>
      </main>

      <footer className="mt-14 border-t border-emerald-100/80 bg-white/80">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 py-8 md:grid-cols-3">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <img
                src={logoImg}
                alt="SevaMitra footer logo"
                className="h-9 w-9 rounded-full object-cover ring-2 ring-emerald-100"
                loading="lazy"
              />
              <p className="font-semibold text-slate-900">SevaMitra Impact Dashboard</p>
            </div>
            <p className="text-sm text-slate-600">
              Supporting village resilience through soil, water, and livelihood initiatives with transparent public reporting.
            </p>
          </div>

          <div className="text-sm text-slate-600">
            <p className="font-semibold text-slate-900">Contact</p>
            <p className="mt-2">Email: contact@sevamitra.org</p>
            <p>Phone: +91 90000 00000</p>
          </div>

          <div className="text-sm text-slate-600">
            <p className="font-semibold text-slate-900">Follow</p>
            <div className="mt-2 flex items-center gap-3">
              <a href="#" aria-label="Facebook" className="rounded-full bg-emerald-50 p-2 text-emerald-700 hover:bg-emerald-100">
                <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
                  <path d="M13.5 9H16V6h-2.5C11.57 6 10 7.57 10 9.5V12H8v3h2v6h3v-6h2.2l.3-3H13v-2.2c0-.5.4-.8.5-.8z" />
                </svg>
              </a>
              <a href="#" aria-label="Instagram" className="rounded-full bg-emerald-50 p-2 text-emerald-700 hover:bg-emerald-100">
                <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
                  <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7zm5 3.5A4.5 4.5 0 1 1 7.5 12 4.5 4.5 0 0 1 12 7.5zm0 2A2.5 2.5 0 1 0 14.5 12 2.5 2.5 0 0 0 12 9.5zm5-3.25a1.25 1.25 0 1 1-1.25 1.25A1.25 1.25 0 0 1 17 6.25z" />
                </svg>
              </a>
              <a href="#" aria-label="LinkedIn" className="rounded-full bg-emerald-50 p-2 text-emerald-700 hover:bg-emerald-100">
                <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
                  <path d="M5 8h3v11H5zM6.5 3A1.75 1.75 0 1 1 4.75 4.75 1.75 1.75 0 0 1 6.5 3zM10 8h2.88v1.5h.04A3.15 3.15 0 0 1 15.76 8c3 0 3.24 1.98 3.24 4.56V19h-3v-5.58c0-1.33-.02-3.05-1.86-3.05s-2.14 1.45-2.14 2.95V19h-3z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-emerald-100/80 px-4 py-4 text-center text-xs text-slate-500">
          © 2026 SevaSahayog
        </div>
      </footer>
    </div>
  )
}

export default Dashboard


