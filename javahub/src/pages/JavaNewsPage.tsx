import timelineData from '@/content/java-news/timeline.json'
import type { JavaTimeline } from '@/types/content'
import JepCardComponent from '@/components/news/JepCardComponent'

const timeline = timelineData as JavaTimeline
const releases = [...timeline.releases].sort((a, b) => b.version - a.version)
const latest = releases[0]

export default function JavaNewsPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-10">
      {/* Page header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-100">Java News</h1>
          <p className="text-gray-500 text-sm mt-1">What's new across Java 8–21 with plain-English explanations</p>
        </div>
        <span className="text-xs text-gray-600 flex-shrink-0 mt-1">
          Last updated: {new Date(timeline.lastUpdated).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
        </span>
      </div>

      {/* Latest release banner */}
      <section>
        <h2 className="text-[11px] font-semibold uppercase tracking-[0.07em] text-gray-600 mb-3">Latest Release</h2>
        <div className="bg-indigo-950/40 border border-indigo-800/40 rounded-xl p-5 flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-2xl font-bold text-indigo-300">Java {latest.version}</span>
              {latest.isLts && (
                <span className="text-xs px-2 py-0.5 bg-indigo-600/30 text-indigo-300 border border-indigo-700/40 rounded-full font-medium">LTS</span>
              )}
            </div>
            <p className="text-sm text-gray-300">{latest.summary}</p>
            <p className="text-xs text-gray-600">
              Released {new Date(latest.releaseDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </div>
      </section>

      {/* What's new in latest (JEPs) */}
      {latest.jeps.length > 0 && (
        <section>
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.07em] text-gray-600 mb-3">
            What's New in Java {latest.version}
          </h2>
          <div className="space-y-4">
            {latest.jeps.map(jep => (
              <JepCardComponent key={jep.jepNumber} jep={jep} />
            ))}
          </div>
        </section>
      )}

      {/* Version timeline */}
      <section>
        <h2 className="text-[11px] font-semibold uppercase tracking-[0.07em] text-gray-600 mb-4">Version Timeline</h2>
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-6 top-0 bottom-0 w-px bg-gray-800" />

          <div className="space-y-6">
            {releases.map((release, idx) => (
              <div key={release.version} className="relative flex gap-5">
                {/* Version circle */}
                <div className={`relative z-10 flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-xs font-bold ${
                  release.isLts
                    ? 'bg-indigo-600 text-white border-2 border-indigo-400'
                    : 'bg-gray-800 text-gray-300 border border-gray-700'
                }`}>
                  {release.version}
                </div>

                {/* Content */}
                <div className={`flex-1 pb-2 ${idx < releases.length - 1 ? '' : ''}`}>
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="font-semibold text-gray-100">Java {release.version}</span>
                    {release.isLts && (
                      <span className="text-[10px] px-1.5 py-0.5 bg-indigo-600/20 text-indigo-400 border border-indigo-700/30 rounded font-medium">LTS</span>
                    )}
                    <span className="text-xs text-gray-600">
                      {new Date(release.releaseDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 mb-2">{release.summary}</p>
                  <ul className="space-y-0.5">
                    {release.majorFeatures.map((f, i) => (
                      <li key={i} className="flex items-start gap-1.5 text-xs text-gray-500">
                        <span className="text-gray-700 flex-shrink-0 mt-0.5">•</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}

            {/* Coming next */}
            <div className="relative flex gap-5">
              <div className="relative z-10 flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center bg-gray-900 border border-dashed border-gray-700 text-gray-600 text-xs">
                ?
              </div>
              <div className="flex-1 pt-2">
                <p className="text-sm text-gray-500">
                  Coming next —{' '}
                  <a
                    href="https://openjdk.org/jeps/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-400 hover:text-indigo-300 transition-colors"
                  >
                    browse JEPs on OpenJDK.org ↗
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
