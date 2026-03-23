import { useState } from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { ShieldAlert, Github } from "lucide-react"

import NewsInputForm  from './components/NewsInputForm'
import HistoryTable   from './components/HistoryTable'
import StatsPanel     from './components/StatsPanel'
import ModelSelector  from './components/ModelSelector'

import './App.css'

const Header = () => (
  <header className="bg-white border-b sticky top-0 z-10">
    <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
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

  return (
    <div className='min-h-screen bg-gray-50'>
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 py-8">
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
            <div className="max-w-3xl mx-auto w-full space-y-8 pt-2">
              <ModelSelector 
                selectedModel={selectedModel} 
                onModelChange={setSelectedModel} 
              />
              <NewsInputForm selectedModel={selectedModel} />
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
