import React from 'react'

export const KnativeSection: React.FC = () => {
  return (
    <section className="flex flex-col gap-8 px-4 sm:px-8 md:px-20 lg:px-40 py-16 sm:py-20 md:py-24 relative bg-gradient-to-b from-blue-500/10 to-transparent border-t border-white/10">
      <div className="flex flex-col items-center gap-8 max-w-4xl mx-auto text-center">
        {/* Knative Logo */}
        <div className="flex items-center justify-center">
          <img 
            src="/knative_logo.png" 
            alt="Knative Logo" 
            className="h-16 sm:h-20 md:h-24 w-auto opacity-90"
          />
        </div>

        {/* Heading */}
        <h2 className="font-pixel text-blue-400 text-3xl sm:text-4xl md:text-5xl leading-tight">
          Powered by Knative
        </h2>

        {/* Description */}
        <div className="flex flex-col gap-4 max-w-2xl">
          <p className="text-white/80 text-base sm:text-lg font-normal leading-relaxed">
            GCP Cloud Run의 기반인 Knative 오픈소스와 Kubernetes를 활용하여 개발되었습니다.
          </p>
          <p className="text-white/60 text-sm sm:text-base font-normal leading-relaxed">
            GCP Cloud Runの基盤であるKnative オープンソースとKubernetesを活用して開発されました。
          </p>
        </div>

        {/* Learn More Link */}
        <a
          href="https://knative.dev"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-blue-400/30 bg-blue-400/10 text-blue-400 hover:bg-blue-400/20 hover:border-blue-400/50 transition-all duration-300 text-sm font-medium"
        >
          <span>Learn more about Knative</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      </div>
    </section>
  )
}
