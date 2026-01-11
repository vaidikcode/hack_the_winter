import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

export default function Research() {
	const loc = useLocation()
	const navigate = useNavigate()
	const [researchData, setResearchData] = useState(loc.state?.researchData || null)

	useEffect(() => {
		if (!researchData) {
			try {
				const stored = localStorage.getItem('campaign_research')
				if (stored) {
					const parsed = JSON.parse(stored)
					if (parsed?.researchData) setResearchData(parsed.researchData)
				}
			} catch (e) {
				console.error('Failed loading research from storage', e)
			}
		}
	}, [researchData])

	return (
		<div className="w-full min-h-screen p-6 pt-20 relative" style={{background:'#FFFFFF'}}>
			{/* Back button */}
			<div className="absolute top-6 left-6 z-50">
				<button
					onClick={() => navigate("/")}
					title="Back to Home"
					className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-gray-50 shadow-lg hover:shadow-xl transition-all border border-gray-200 group"
				>
					<ArrowLeft className="w-5 h-5 text-gray-700 group-hover:text-purple-600 transition-colors" />
					<span className="text-sm font-medium text-gray-700 group-hover:text-purple-600 transition-colors">
						Back
					</span>
				</button>
			</div>
			
			<h1 className="text-3xl font-bold mb-6 text-gray-800" style={{fontFamily: 'Urbanist, sans-serif', fontWeight: 800}}>Research Analytics</h1>
			<div className="rounded-2xl p-7 border border-gray-200 shadow-lg" style={{background:'linear-gradient(135deg, #f5f3ff 0%, #ede9fe 50%, #e9d5ff 100%)'}}>
				<h2 className="text-gray-800 mb-5 text-2xl font-bold" style={{fontFamily: 'Urbanist, sans-serif', fontWeight: 800}}>Research Insights</h2>
				{researchData ? (
					<div className="grid gap-6">
						<div>
							<h3 className="text-purple-700 text-lg font-semibold mb-4" style={{fontFamily: 'Urbanist, sans-serif', fontWeight: 800}}>Audience Persona</h3>
							<div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
								<div className="bg-white/60 backdrop-blur-sm border border-purple-200 rounded-xl p-5 transition-all duration-300 shadow-sm">
									<div className="text-xs font-bold uppercase tracking-wider text-purple-600 mb-2" style={{fontFamily: 'Urbanist, sans-serif', fontWeight: 800}}>Pain Point</div>
									<div className="text-gray-700 text-sm leading-relaxed">{researchData.audience_persona.pain_point || '—'}</div>
								</div>
								<div className="bg-white/60 backdrop-blur-sm border border-purple-200 rounded-xl p-5 transition-all duration-300 shadow-sm">
									<div className="text-xs font-bold uppercase tracking-wider text-purple-600 mb-2" style={{fontFamily: 'Urbanist, sans-serif', fontWeight: 800}}>Motivation</div>
									<div className="text-gray-700 text-sm leading-relaxed">{researchData.audience_persona.motivation || '—'}</div>
								</div>
								<div className="bg-white/60 backdrop-blur-sm border border-purple-200 rounded-xl p-5 transition-all duration-300 shadow-sm">
									<div className="text-xs font-bold uppercase tracking-wider text-purple-600 mb-2" style={{fontFamily: 'Urbanist, sans-serif', fontWeight: 800}}>Channel</div>
									<div className="text-gray-700 text-sm leading-relaxed">{researchData.audience_persona.preferred_channel || '—'}</div>
								</div>
							</div>
						</div>
						<div>
							<h3 className="text-purple-700 text-lg font-semibold mb-4" style={{fontFamily: 'Urbanist, sans-serif', fontWeight: 800}}>Core Messaging</h3>
							<div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
								<div className="bg-gradient-to-br from-purple-100 to-purple-50 border-purple-200 backdrop-blur-sm border rounded-xl p-5 transition-all duration-300 shadow-sm">
									<div className="text-xs font-bold uppercase tracking-wider text-purple-600 mb-2" style={{fontFamily: 'Urbanist, sans-serif', fontWeight: 800}}>Value Prop</div>
									<div className="text-gray-700 text-sm leading-relaxed">{researchData.core_messaging.value_proposition || '—'}</div>
								</div>
								<div className="bg-white/60 backdrop-blur-sm border border-purple-200 rounded-xl p-5 transition-all duration-300 shadow-sm">
									<div className="text-xs font-bold uppercase tracking-wider text-purple-600 mb-2" style={{fontFamily: 'Urbanist, sans-serif', fontWeight: 800}}>Tone</div>
									<div className="text-gray-700 text-sm leading-relaxed">{researchData.core_messaging.tone_of_voice || '—'}</div>
								</div>
								<div className="bg-white/60 backdrop-blur-sm border border-purple-200 rounded-xl p-5 transition-all duration-300 shadow-sm">
									<div className="text-xs font-bold uppercase tracking-wider text-purple-600 mb-2" style={{fontFamily: 'Urbanist, sans-serif', fontWeight: 800}}>CTA</div>
									<div className="text-gray-700 text-sm leading-relaxed">{researchData.core_messaging.call_to_action || '—'}</div>
								</div>
							</div>
						</div>
					</div>
				) : (
					<div className="text-gray-400 italic py-10 text-center">No research data passed. Return to Foundry and run the Research Agent.</div>
				)}
			</div>
		</div>
	)
}
