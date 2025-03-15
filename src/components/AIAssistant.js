import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Send, Bot } from 'lucide-react'
import API from '@/utils/axiosInstance'

export default function AIAssistant() {
  const [messages, setMessages] = useState([
    { text: "Assalomu aleykum admin. Hosh nima qilamiz?", type: "ai" }
  ])
  const [input, setInput] = useState('')
  const [isOpen, setIsOpen] = useState(false) // ✅ AI chat oynasini ochish/yopish uchun state

  const sendMessage = async () => {
    if (!input.trim()) return

    const userMessage = { text: input, type: 'user' }
    setMessages((prev) => [...prev, userMessage])
    setInput('')

    try {
      const response = await API.post("/ai-assistant", { message: input })

      if (!response.data || !response.data.message) {
        throw new Error("No reply from AI")
      }

      const aiMessage = { text: response.data.message, type: 'ai' }
      setMessages((prev) => [...prev, aiMessage])
      
    } catch (error) {
      console.error("Error sending message:", error)
      setMessages((prev) => [...prev, { text: "❌ Xatolik yuz berdi, qayta urinib ko‘ring.", type: 'ai' }])
    }
  }

  return (
    <div className="fixed bottom-4 right-4 flex flex-col items-end">
      {/* ✅ AI Iconchasi */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-3 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition-all"
      >
        <Bot size={24} />
      </button>

      {/* ✅ AI chat oynasi */}
      {isOpen && (
        <Card className="w-80 shadow-xl border border-gray-300 rounded-lg bg-white mt-2 animate-fade-in">
          <div className="bg-blue-500 text-white font-semibold px-4 py-2 rounded-t-lg flex justify-between">
            AI Assistant
            <button onClick={() => setIsOpen(false)} className="text-white hover:opacity-75">
              ✖
            </button>
          </div>
          <div className="p-3 h-60 overflow-y-auto space-y-2">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <p
                  className={`inline-block p-2 rounded-lg max-w-[75%] ${
                    msg.type === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-black'
                  }`}
                >
                  {msg.text}
                </p>
              </div>
            ))}
          </div>
          <div className="flex p-2 border-t border-gray-200">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Xabar yozing..."
              className="flex-1 text-black"
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            />
            <Button onClick={sendMessage} className="ml-2">
              <Send size={18} />
            </Button>
          </div>
        </Card>
      )}
    </div>
  )
}
