import { useState } from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { ShieldAlert, Github } from "lucide-react"

import NewsInputForm     from './components/NewsInputForm'
import HistoryTable      from './components/HistoryTable'
import StatsPanel        from './components/StatsPanel'
import ModelSelector     from './components/ModelSelector'
import SystemParameters  from './components/SystemParameters'
import SemanticNodes     from './components/SemanticNodes'

import './App.css'

const Header = () => (
  <header className="bg-white border-b sticky top-0 z-10">
    <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <ShieldAlert className="text-blue-600" size={24} />
        <h1 className="text-xl font-bold tracking-tight text-gray-900">
          Fake News Detector
        </h1>
      </div>
      <a
        href="https://github.com"
        target="_blank"
        rel="noreferrer"
        className="text-muted-foreground hover:text-gray-900 transition-colors"
      >
        <Github size={20} />
      </a>
    </div>
  </header>
);

export default function App() {
  const [activeTab, setActiveTab] = useState('analyse')
  const [selectedModel, setSelectedModel] = useState('roberta-base')
  const [analysisResult, setAnalysisResult] = useState(null)
  const [analyzedText, setAnalyzedText] = useState('')

  const handleResult = (result, inputText) => {
    setAnalysisResult(result)
    setAnalyzedText(inputText)
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      <Header />

      <main className="max-w-6xl mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full flex-col">
          <div className="flex justify-center mb-8">
            <TabsList className="flex h-12 w-full max-w-[400px] items-center justify-between rounded-full bg-gray-200/50 border shadow-sm p-1">
              <TabsTrigger
                value="analyse"
                className="w-full rounded-full py-2 text-sm font-medium transition-all data-[state=active]:bg-white data-[state=active]:text-blue-700 data-[state=active]:shadow-md"
              >
                Analyse
              </TabsTrigger>
              <TabsTrigger
                value="history"
                className="w-full rounded-full py-2 text-sm font-medium transition-all data-[state=active]:bg-white data-[state=active]:text-blue-700 data-[state=active]:shadow-md"
              >
                History
              </TabsTrigger>
              <TabsTrigger
                value="stats"
                className="w-full rounded-full py-2 text-sm font-medium transition-all data-[state=active]:bg-white data-[state=active]:text-blue-700 data-[state=active]:shadow-md"
              >
                Stats
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="analyse" className="focus-visible:outline-none">
            <div className="w-full grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 pt-2 items-start">
              {/* Left column — model picker + main form */}
              <div className="space-y-6">
                <ModelSelector
                  selectedModel={selectedModel}
                  onModelChange={setSelectedModel}
                />
                <NewsInputForm
                  selectedModel={selectedModel}
                  onResult={handleResult}
                />
              </div>

              {/* Right column — live analysis panels */}
              <div className="space-y-4">
                <SystemParameters result={analysisResult} />
                <SemanticNodes text={analyzedText} result={analysisResult} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="history" className="focus-visible:outline-none">
            <HistoryTable />
          </TabsContent>

          <TabsContent value="stats" className="focus-visible:outline-none">
            <StatsPanel />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
