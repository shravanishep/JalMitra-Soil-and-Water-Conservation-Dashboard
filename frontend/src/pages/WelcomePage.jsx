import { useMemo, useRef, useState } from 'react'
import {
  Line,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import {
  FaTree,
  FaPaw,
  FaMapMarkedAlt,
  FaTint,
  FaClipboardCheck,
  FaChartLine,
  FaFilter,
  FaHandshake,
  FaFilePdf,
  FaCamera,
  FaUserShield,
  FaUsersCog,
} from 'react-icons/fa'
import { MdConstruction } from 'react-icons/md'
import impactData from '../data/impactData'
import goat1 from '../assets/images/goat_1.svg'
import goat2 from '../assets/images/goat_2.svg'
import plantation1 from '../assets/images/plantation_1.svg'
import plantation2 from '../assets/images/plantation_2.svg'
import water1 from '../assets/images/water_1.svg'
import water2 from '../assets/images/water_2.svg'
import soil1 from '../assets/images/soil_1.svg'
import soil2 from '../assets/images/soil_2.svg'
import project1 from '../assets/images/project_1.svg'
import project2 from '../assets/images/project_2.svg'
import project3 from '../assets/images/project_3.svg'
import gallery1 from '../assets/images/gallery_1.svg'
import gallery2 from '../assets/images/gallery_2.svg'
import gallery3 from '../assets/images/gallery_3.svg'
import gallery4 from '../assets/images/gallery_4.svg'
import gallery5 from '../assets/images/gallery_5.svg'
import gallery6 from '../assets/images/gallery_6.svg'
import gallery7 from '../assets/images/gallery_7.svg'
import gallery8 from '../assets/images/gallery_8.svg'
import gallery9 from '../assets/images/gallery_9.svg'

const formatNumber = (value) => new Intl.NumberFormat('en-IN').format(Number(value || 0))
const years = [2018, 2019, 2020, 2021, 2022, 2023, 2024]
const months = ['All Months', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const scaleToHundred = (values) => {
  const safeValues = values.map((value) => Number(value) || 0)
  const min = Math.min(...safeValues)
  const max = Math.max(...safeValues)
  if (max === min) {
    return safeValues.map(() => 50)
  }
  return safeValues.map((value) => Number((((value - min) / (max - min)) * 100).toFixed(1)))
}

const storyFeed = [
  {
    projectType: 'Goat Distribution',
    donor: 'SVR Foundation',
    location: 'Nandpur, Nashik',
    years: '2019-2024',
    description:
      'This livelihood initiative supported women-led households through goat distribution, improving income stability over time.',
    image: goat1,
  },
  {
    projectType: 'Plantation',
    donor: 'Sahyadri Rural Trust',
    location: 'Wadgaon, Pune',
    years: '2020-2024',
    description:
      'Fruit saplings and field mentoring helped families build long-term farm resilience and better seasonal outcomes.',
    image: plantation1,
  },
  {
    projectType: 'Water Conservation',
    donor: 'Community Water Alliance',
    location: 'Khedi, Ahmednagar',
    years: '2018-2024',
    description:
      'Recharge and storage structures improved water availability and reduced stress for farms during dry months.',
    image: water1,
  },
  {
    projectType: 'Soil Conservation',
    donor: 'Green Earth Collective',
    location: 'Sonwadi, Satara',
    years: '2019-2024',
    description:
      'Soil treatment and bund strengthening improved land health and supported better crop outcomes over time.',
    image: soil1,
  },
  {
    projectType: 'Water Conservation',
    donor: 'Pragati Development Fund',
    location: 'Kasheli, Solapur',
    years: '2021-2024',
    description:
      'Desilting and flow restoration were completed with strong village participation and local ownership.',
    image: water2,
  },
  {
    projectType: 'Plantation',
    donor: 'JanVikas Partners',
    location: 'Mhasla, Raigad',
    years: '2020-2024',
    description:
      'Farmers entered fruit-bearing stages and improved household earning confidence through plantation support.',
    image: plantation2,
  },
]

const liveProjects = [
  {
    projectName: 'Kundal Check Dam Revival',
    location: 'Kundal, Sangli',
    status: 'Active',
    note: 'Silt removal completed, plantation ongoing along catchment area.',
    images: [water1, project1, plantation1],
  },
  {
    projectName: 'Women Goat Support Cluster',
    location: 'Borgaon, Beed',
    status: 'Active',
    note: 'Household support completed in phase 1, veterinary follow-up in progress.',
    images: [goat1, goat2, project2],
  },
  {
    projectName: 'Orchard Support Program',
    location: 'Pimpri, Jalgaon',
    status: 'Active',
    note: 'Pit preparation and plantation completed, drip setup underway.',
    images: [plantation1, plantation2, project3],
  },
  {
    projectName: 'Soil Bund Strengthening Drive',
    location: 'Harali, Osmanabad',
    status: 'Active',
    note: 'Bund reinforcement work progressing before monsoon season.',
    images: [soil1, soil2, project1],
  },
]

const galleryImages = [
  { src: gallery1, label: 'Check dam restoration - Ahmednagar' },
  { src: gallery2, label: 'Women-led goat livelihood - Beed' },
  { src: gallery3, label: 'Fruit plantation support - Jalgaon' },
  { src: gallery4, label: 'Soil treatment planning - Satara' },
  { src: gallery5, label: 'Village water body renewal - Nashik' },
  { src: gallery6, label: 'Community plantation day - Pune' },
  { src: gallery7, label: 'Field team in village review - Solapur' },
  { src: gallery8, label: 'Water channel restoration - Sangli' },
  { src: gallery9, label: 'Livelihood support visits - Raigad' },
]

function WelcomePage({ summaryData, yearlyWaterData = [] }) {
  const [activeStoryIndex, setActiveStoryIndex] = useState(0)
  const [startYear, setStartYear] = useState(2018)
  const [endYear, setEndYear] = useState(2024)
  const [selectedMonth, setSelectedMonth] = useState('All Months')
  const [isExporting, setIsExporting] = useState(false)
  const reportRef = useRef(null)

  const goatByYear = Object.fromEntries(impactData.livelihoodGoatDistribution.map((row) => [row.year, row]))
  const plantationByYear = Object.fromEntries(impactData.plantationFruitPlants.map((row) => [row.year, row]))
  const soilByYear = Object.fromEntries(impactData.soilConservation.map((row) => [row.year, row]))

  const yearlyWaterFromApi = Object.fromEntries(
    yearlyWaterData
      .filter((row) => Number.isFinite(Number(row?.year)) && Number.isFinite(Number(row?.water_conserved_lakh_liters)))
      .map((row) => [Number(row.year), Number(row.water_conserved_lakh_liters)]),
  )

  const fallbackWaterByYear = Object.fromEntries(
    impactData.waterConservation.map((row) => [row.year, Number(row.impact_index) || 0]),
  )

  const totalGoatsDistributed = impactData.livelihoodGoatDistribution.reduce((total, row) => total + row.goats_distributed, 0)
  const totalWomenBenefited = impactData.livelihoodGoatDistribution.reduce((total, row) => total + row.women_benefited, 0)
  const totalPlantsDistributed = impactData.plantationFruitPlants.reduce((total, row) => total + row.plants_distributed, 0)
  const totalFarmersBenefited = impactData.plantationFruitPlants.reduce((total, row) => total + row.farmers_benefited, 0)

  const filteredYears = years.filter((year) => year >= Number(startYear) && year <= Number(endYear))

  const waterBase = filteredYears.map((year) => yearlyWaterFromApi[year] ?? fallbackWaterByYear[year] ?? 0)
  const waterSeries = scaleToHundred(selectedMonth === 'All Months' ? waterBase : waterBase.map((value) => value / 12))
  const soilSeries = scaleToHundred(
    filteredYears.map((year) => {
      const value = (soilByYear[year]?.area_treated_hectares || 0) + (soilByYear[year]?.productivity_improvement_index || 0) * 10
      return selectedMonth === 'All Months' ? value : value / 12
    }),
  )
  const livelihoodSeries = scaleToHundred(
    filteredYears.map((year) => {
      const value = (goatByYear[year]?.goats_current || 0) + (goatByYear[year]?.women_benefited || 0) * 1.5
      return selectedMonth === 'All Months' ? value : value / 12
    }),
  )
  const plantationSeries = scaleToHundred(
    filteredYears.map((year) => {
      const value = (plantationByYear[year]?.plants_alive || 0) + (plantationByYear[year]?.farmers_benefited || 0) * 4
      return selectedMonth === 'All Months' ? value : value / 12
    }),
  )

  const chartData = filteredYears.map((year, index) => ({
    period: selectedMonth === 'All Months' ? `${year}` : `${selectedMonth} ${year}`,
    waterConservation: waterSeries[index],
    soilConservation: soilSeries[index],
    livelihoodGoat: livelihoodSeries[index],
    plantation: plantationSeries[index],
  }))

  const chartSummary = useMemo(
    () => ({
      goats: impactData.livelihoodGoatDistribution
        .filter((row) => row.year >= Number(startYear) && row.year <= Number(endYear))
        .reduce((sum, row) => sum + row.goats_distributed, 0),
      women: impactData.livelihoodGoatDistribution
        .filter((row) => row.year >= Number(startYear) && row.year <= Number(endYear))
        .reduce((sum, row) => sum + row.women_benefited, 0),
      plants: impactData.plantationFruitPlants
        .filter((row) => row.year >= Number(startYear) && row.year <= Number(endYear))
        .reduce((sum, row) => sum + row.plants_distributed, 0),
      farmers: impactData.plantationFruitPlants
        .filter((row) => row.year >= Number(startYear) && row.year <= Number(endYear))
        .reduce((sum, row) => sum + row.farmers_benefited, 0),
    }),
    [startYear, endYear],
  )

  const featureCards = useMemo(
    () => [
      { title: 'Total Sludge Removed (tons)', value: '8,640', tone: 'bg-[#fff7ee]', icon: MdConstruction, iconTone: 'text-orange-700' },
      { title: 'Trees Distributed', value: formatNumber(totalPlantsDistributed), tone: 'bg-[#f2fbef]', icon: FaTree, iconTone: 'text-green-700' },
      { title: 'Goat Beneficiaries', value: formatNumber(totalWomenBenefited), tone: 'bg-[#eef8ff]', icon: FaPaw, iconTone: 'text-blue-700' },
      { title: 'Villages Covered', value: '38', tone: 'bg-[#f8f5ff]', icon: FaMapMarkedAlt, iconTone: 'text-violet-700' },
      { title: 'Water Conserved (Lakh Liters)', value: formatNumber(summaryData?.total_water_conserved), tone: 'bg-[#ecfbfc]', icon: FaTint, iconTone: 'text-cyan-700' },
      { title: 'Projects Executed', value: formatNumber(summaryData?.total_projects), tone: 'bg-[#eefbef]', icon: FaClipboardCheck, iconTone: 'text-emerald-700' },
    ],
    [summaryData?.total_projects, summaryData?.total_water_conserved, totalPlantsDistributed, totalWomenBenefited],
  )

  const capabilities = [
    { title: 'Interactive impact analytics', description: 'Track water, soil, livelihood, and plantation outcomes in one dashboard view.', icon: FaChartLine, tone: 'bg-[#eef8ff]' },
    { title: 'Year and month-based filtering', description: 'Review impact by timeline with clear filters and instant chart updates.', icon: FaFilter, tone: 'bg-[#f2fbef]' },
    { title: 'Transparent donor visibility', description: 'Every field story highlights who supported the project and where.', icon: FaHandshake, tone: 'bg-[#fff7ee]' },
    { title: 'Exportable impact reports', description: 'Generate shareable PDF reports with selected chart filters and totals.', icon: FaFilePdf, tone: 'bg-[#f8f5ff]' },
    { title: 'Photo-verified field work', description: 'Visual records from villages strengthen trust and progress tracking.', icon: FaCamera, tone: 'bg-[#ecfbfc]' },
    { title: 'Supervisor-only data entry (future-ready)', description: 'Field supervisors can submit verified updates in a controlled workflow.', icon: FaUserShield, tone: 'bg-[#eefbef]' },
    { title: 'Role-based access and governance', description: 'Supervisors can add verified field data, while administrators can review, edit, and analyze records for accurate impact reporting.', icon: FaUsersCog, tone: 'bg-[#fef3c7]' },
  ]

  const previousStory = () => {
    setActiveStoryIndex((current) => (current === 0 ? storyFeed.length - 1 : current - 1))
  }

  const nextStory = () => {
    setActiveStoryIndex((current) => (current === storyFeed.length - 1 ? 0 : current + 1))
  }

  const resetFilters = () => {
    setStartYear(2018)
    setEndYear(2024)
    setSelectedMonth('All Months')
  }

  const exportPdf = async () => {
    if (!reportRef.current || isExporting) {
      return
    }

    setIsExporting(true)
    try {
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
      })
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
      const pageWidth = pdf.internal.pageSize.getWidth()
      const margin = 10
      const contentWidth = pageWidth - margin * 2
      const imgHeight = (canvas.height * contentWidth) / canvas.width

      pdf.setFontSize(16)
      pdf.text('SevaMitra Impact Report', margin, 12)
      pdf.setFontSize(11)
      pdf.text(`Year Range: ${startYear} - ${endYear}`, margin, 19)
      pdf.text(`Month: ${selectedMonth}`, margin, 25)
      pdf.text(
        `Summary: Goats ${formatNumber(chartSummary.goats)} | Women ${formatNumber(chartSummary.women)} | Plants ${formatNumber(chartSummary.plants)} | Farmers ${formatNumber(chartSummary.farmers)}`,
        margin,
        31,
      )
      pdf.addImage(imgData, 'PNG', margin, 36, contentWidth, imgHeight)
      pdf.setFontSize(10)
      pdf.text('Generated by SevaSahayog Dashboard', margin, 290)
      pdf.save(`SevaMitra_Impact_Report_${startYear}_${endYear}.pdf`)
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <>
      <section className="mt-10 rounded-3xl bg-white/90 p-6 md:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Aggregated Impact (Illustrative)</p>
        <h3 className="mt-2 text-2xl font-extrabold text-slate-900 md:text-3xl">What We've Achieved Together</h3>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featureCards.map((card) => {
            const Icon = card.icon
            return (
              <article key={card.title} className={`rounded-2xl p-5 ${card.tone}`}>
                <div className={`mb-3 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-white ${card.iconTone}`}>
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-600">{card.title}</p>
                <p className="mt-2 text-3xl font-bold text-slate-900">{card.value}</p>
              </article>
            )
          })}
        </div>
      </section>

      <section className="mt-8 rounded-3xl bg-white/90 p-6 md:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Aggregated Impact (Illustrative)</p>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <article className="rounded-2xl bg-emerald-50 p-5"><h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-emerald-800">Total Goats Distributed</h3><p className="mt-2 text-3xl font-bold text-emerald-900">{formatNumber(totalGoatsDistributed)}</p></article>
          <article className="rounded-2xl bg-cyan-50 p-5"><h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-cyan-800">Total Women Benefited</h3><p className="mt-2 text-3xl font-bold text-cyan-900">{formatNumber(totalWomenBenefited)}</p></article>
          <article className="rounded-2xl bg-orange-50 p-5"><h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-orange-800">Total Plants Distributed</h3><p className="mt-2 text-3xl font-bold text-orange-900">{formatNumber(totalPlantsDistributed)}</p></article>
          <article className="rounded-2xl bg-lime-50 p-5"><h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-lime-800">Total Farmers Benefited</h3><p className="mt-2 text-3xl font-bold text-lime-900">{formatNumber(totalFarmersBenefited)}</p></article>
        </div>
      </section>

      <section className="mt-10 rounded-3xl bg-white/90 p-6 md:p-8">
        <h3 className="text-2xl font-extrabold text-slate-900 md:text-3xl">Platform Capabilities</h3>
        <p className="mt-2 text-sm text-slate-600">Built for trusted reporting, verified updates, and donor-ready transparency.</p>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {capabilities.map((item) => {
            const Icon = item.icon
            return (
              <article key={item.title} className={`rounded-2xl p-5 ${item.tone}`}>
                <div className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-white text-slate-700">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <p className="text-lg font-bold text-slate-900">{item.title}</p>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.description}</p>
              </article>
            )
          })}
        </div>
      </section>

      <section id="stories" className="mt-10 rounded-3xl bg-white/90 p-6 md:p-8">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className="text-2xl font-bold text-slate-900 md:text-3xl">Stories from the Field</h3>
            <p className="mt-2 text-sm text-slate-600">Verified, on-ground stories of change across villages.</p>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" onClick={previousStory} className="rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-800 hover:bg-emerald-100">{'<'}</button>
            <button type="button" onClick={nextStory} className="rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-800 hover:bg-emerald-100">{'>'}</button>
          </div>
        </div>

        <div className="mt-6 overflow-hidden">
          <div className="flex transition-transform duration-500 ease-out" style={{ transform: `translateX(-${activeStoryIndex * 100}%)` }}>
            {storyFeed.map((story) => (
              <article key={`${story.projectType}-${story.location}`} className="w-full shrink-0">
                <div className="grid grid-cols-1 gap-5 md:grid-cols-[1.25fr_1fr]">
                  <img className="h-72 w-full rounded-2xl object-cover md:h-96" src={story.image} alt={`${story.projectType} story in ${story.location}`} loading="lazy" />
                  <div className="rounded-2xl bg-[#f8fbf8] p-6">
                    <p className="text-xs font-semibold uppercase tracking-[0.15em] text-emerald-700">{story.projectType}</p>
                    <p className="mt-3 text-sm font-semibold text-slate-900">Supported by: {story.donor}</p>
                    <p className="mt-2 text-sm text-slate-600">Village / District: {story.location}</p>
                    <p className="mt-1 text-sm text-slate-600">Year(s): {story.years}</p>
                    <p className="mt-4 text-sm leading-relaxed text-slate-700">{story.description}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="live-projects" className="mt-10 rounded-3xl bg-white/90 p-6 md:p-8">
        <h3 className="text-2xl font-bold text-slate-900 md:text-3xl">Live Projects (Illustrative)</h3>
        <p className="mt-2 text-sm text-slate-600">Sample live project data for demonstration purposes.</p>
        <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
          {liveProjects.map((project) => (
            <article key={project.projectName} className="rounded-2xl bg-[#f8fbf8] p-4">
              <div className="flex items-start justify-between gap-3">
                <div><h4 className="text-lg font-semibold text-slate-900">{project.projectName}</h4><p className="text-sm text-slate-600">{project.location}</p></div>
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">{project.status}</span>
              </div>
              <div className="mt-4 flex snap-x gap-2 overflow-x-auto pb-1">
                {project.images.map((imageUrl, index) => (
                  <img key={`${project.projectName}-img-${index + 1}`} src={imageUrl} alt={`${project.projectName} proof ${index + 1}`} loading="lazy" className="h-24 w-36 shrink-0 snap-start rounded-lg object-cover" />
                ))}
              </div>
              <p className="mt-4 text-sm text-slate-700">{project.note}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="impact-trends" className="mt-10 rounded-3xl bg-white/90 p-6 md:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Aggregated Impact (Illustrative)</p>
            <h3 className="mt-2 text-2xl font-bold text-slate-900 md:text-3xl">Multi-Domain Impact Trends</h3>
            <p className="mt-2 text-sm text-slate-600">Filters apply only to this chart and report export.</p>
          </div>
          <button type="button" onClick={exportPdf} disabled={isExporting} className="rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70">
            {isExporting ? 'Exporting...' : 'Export Impact Report (PDF)'}
          </button>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-3 rounded-2xl bg-[#f8fbff] p-4 md:grid-cols-4">
          <label className="text-sm text-slate-700">Start Year
            <select value={startYear} onChange={(event) => { const nextStart = Number(event.target.value); setStartYear(nextStart); if (nextStart > endYear) setEndYear(nextStart) }} className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2">
              {years.map((year) => <option key={`start-${year}`} value={year}>{year}</option>)}
            </select>
          </label>
          <label className="text-sm text-slate-700">End Year
            <select value={endYear} onChange={(event) => setEndYear(Number(event.target.value))} className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2">
              {years.filter((year) => year >= startYear).map((year) => <option key={`end-${year}`} value={year}>{year}</option>)}
            </select>
          </label>
          <label className="text-sm text-slate-700">Month (Optional)
            <select value={selectedMonth} onChange={(event) => setSelectedMonth(event.target.value)} className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2">
              {months.map((month) => <option key={month} value={month}>{month}</option>)}
            </select>
          </label>
          <div className="flex items-end"><button type="button" onClick={resetFilters} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100">Reset Filters</button></div>
        </div>

        <div ref={reportRef} className="mt-5 rounded-2xl bg-white p-4">
          <p className="text-sm text-slate-600">Selected range: {startYear} - {endYear} | {selectedMonth}</p>
          <div className="mt-2 grid grid-cols-2 gap-3 text-sm text-slate-700 md:grid-cols-4">
            <p>Goats: <span className="font-semibold">{formatNumber(chartSummary.goats)}</span></p>
            <p>Women: <span className="font-semibold">{formatNumber(chartSummary.women)}</span></p>
            <p>Plants: <span className="font-semibold">{formatNumber(chartSummary.plants)}</span></p>
            <p>Farmers: <span className="font-semibold">{formatNumber(chartSummary.farmers)}</span></p>
          </div>
          <div className="mt-4 h-[24rem] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 20, left: 5, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="period" />
                <YAxis domain={[0, 100]} />
                <Tooltip formatter={(value, name) => [`${Number(value).toFixed(1)}`, name]} />
                <Legend />
                <Line type="monotone" dataKey="waterConservation" name="Water" stroke="#0284c7" strokeWidth={3} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="soilConservation" name="Soil" stroke="#16a34a" strokeWidth={3} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="livelihoodGoat" name="Livelihood (Goat)" stroke="#ea580c" strokeWidth={3} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="plantation" name="Plantation" stroke="#7c3aed" strokeWidth={3} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      <section id="gallery" className="mt-10 rounded-3xl bg-white/90 p-6 md:p-8">
        <h3 className="text-2xl font-bold text-slate-900 md:text-3xl">Photo Gallery</h3>
        <p className="mt-2 text-sm text-slate-600">Field moments that reflect community effort and outcomes.</p>
        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {galleryImages.map((item) => (
            <figure key={item.label} className="group relative overflow-hidden rounded-2xl">
              <img src={item.src} alt={item.label} loading="lazy" className="h-56 w-full object-cover" />
              <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3 text-sm text-white opacity-90 transition-opacity group-hover:opacity-100">{item.label}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section id="about-us" className="mt-10 rounded-3xl bg-white/90 p-6 md:p-8">
        <h3 className="text-2xl font-bold text-slate-900 md:text-3xl">About SevaSahayog</h3>
        <p className="mt-3 max-w-4xl text-sm leading-relaxed text-slate-700">
          SevaSahayog is a grassroots organization working closely with rural communities to strengthen water security, soil health, and sustainable livelihoods. Our approach combines on-ground implementation with long-term monitoring to ensure every intervention delivers lasting value.
        </p>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-slate-700">
          <li>Community-led conservation initiatives</li>
          <li>Focus on long-term outcomes, not short-term metrics</li>
          <li>Transparent reporting for donors and partners</li>
          <li>Proven work across water, soil, plantation, and livelihoods</li>
        </ul>
        <button type="button" className="mt-5 rounded-full border border-emerald-700 bg-white px-5 py-2.5 text-sm font-semibold text-emerald-700 hover:bg-emerald-50">Know More About Us</button>
      </section>

      <section className="mt-10 rounded-3xl bg-white/90 p-6 md:p-8">
        <h3 className="text-2xl font-bold text-slate-900 md:text-3xl">How the System Is Used</h3>
        <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
          <article className="rounded-2xl bg-[#eef8ff] p-5">
            <p className="text-lg font-bold text-slate-900">Supervisor Role</p>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-700">
              <li>Upload field updates</li>
              <li>Add project progress</li>
              <li>Attach geo-tagged photos</li>
              <li>Submit verified data from villages</li>
            </ul>
          </article>
          <article className="rounded-2xl bg-[#f2fbef] p-5">
            <p className="text-lg font-bold text-slate-900">Admin Role</p>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-700">
              <li>Review and edit submitted data</li>
              <li>Analyze trends across years and regions</li>
              <li>Generate impact insights for donors</li>
              <li>Maintain data quality and transparency</li>
            </ul>
          </article>
        </div>
      </section>

      <section className="mt-10 rounded-3xl bg-[linear-gradient(120deg,#fdf4d9_0%,#f7fbe9_60%,#eef7ff_100%)] p-7 md:p-10">
        <h3 className="text-3xl font-bold text-slate-900 md:text-4xl">Your contribution creates visible change</h3>
        <p className="mt-3 max-w-3xl text-base text-slate-700">Every donation supports on-ground action and transparent impact tracking.</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <button type="button" className="rounded-full bg-amber-500 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-amber-600">Donate Now</button>
          <button type="button" className="rounded-full border border-emerald-700 bg-white px-6 py-3 text-sm font-semibold text-emerald-700 hover:bg-emerald-50">Partner With Us</button>
        </div>
      </section>
    </>
  )
}

export default WelcomePage
