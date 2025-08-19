'use client'

import { useState, useRef, useEffect } from 'react'
import { useBrand } from './BrandProvider'
import { MessageCircle, X, Send, Bot, User, Shield, Phone } from 'lucide-react'

interface ChatMessage {
  id: string
  type: 'user' | 'bot'
  content: string
  timestamp: Date
  suggestions?: string[]
}

export default function AIChat() {
  const { brand, dynamicPhone } = useBrand()
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  // Initialize chat with welcome message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage: ChatMessage = {
        id: 'welcome',
        type: 'bot',
        content: `Hi! I'm your ${brand.name} security assistant. I can help you with:\n• Security system options\n• Pricing and packages\n• Local installation scheduling\n• Technical questions`,
        timestamp: new Date(),
        suggestions: [
          'What security packages do you offer?',
          'How much does monitoring cost?',
          'Schedule a free consultation',
          'Help with existing system'
        ]
      }
      setMessages([welcomeMessage])
    }
  }, [isOpen, messages.length, brand.name])

  const generateBotResponse = (userMessage: string): ChatMessage => {
    const lowerMessage = userMessage.toLowerCase()
    let content = ''
    let suggestions: string[] = []

    if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('package')) {
      content = `Our ${brand.name} security packages start at $39.99/month with professional monitoring. We offer:\n\n• Basic Home Security: $39.99/month\n• Smart Home Plus: $59.99/month  \n• Premium Protection: $79.99/month\n\nAll packages include 24/7 monitoring, mobile app, and local support in ${brand.states.join(', ')}. Would you like me to connect you with a local specialist?`
      suggestions = ['Tell me about Smart Home Plus', 'Schedule free consultation', `Call ${dynamicPhone}`]
    } else if (lowerMessage.includes('install') || lowerMessage.includes('schedule') || lowerMessage.includes('appointment')) {
      content = `Great! Our certified technicians in ${brand.states.join(', ')} can typically schedule installation within 1-3 business days. Installation includes:\n\n• Professional system setup\n• Complete walkthrough and training\n• Mobile app configuration\n• 30-day satisfaction guarantee\n\nWould you like to speak with our scheduling team or get a free quote first?`
      suggestions = [`Call ${dynamicPhone}`, 'Get free quote', 'Learn about equipment']
    } else if (lowerMessage.includes('monitor') || lowerMessage.includes('response') || lowerMessage.includes('emergency')) {
      content = `${brand.name} provides 24/7 professional monitoring from our certified security centers. When your alarm triggers:\n\n• Immediate verification within 30 seconds\n• Direct contact with local authorities\n• SMS and app notifications to you\n• Backup cellular communication\n\nOur average emergency response time is under 3 minutes in your area!`
      suggestions = ['How does verification work?', 'What about power outages?', 'Mobile app features']
    } else if (lowerMessage.includes('smart') || lowerMessage.includes('automation') || lowerMessage.includes('app')) {
      content = `Our smart home features include:\n\n• Remote arm/disarm via mobile app\n• Smart locks and garage door control\n• Automated lighting schedules\n• Video doorbell with 2-way audio\n• Energy management integration\n\nEverything works together seamlessly through one easy-to-use app!`
      suggestions = ['See smart lock options', 'Video doorbell features', 'Energy savings info']
    } else if (lowerMessage.includes('help') || lowerMessage.includes('support') || lowerMessage.includes('problem')) {
      content = `I'm here to help! Our ${brand.name} support team is available 24/7. For immediate assistance:\n\n• Call our support line: ${dynamicPhone}\n• Use the mobile app's help section\n• Schedule a service visit\n• Access online troubleshooting guides\n\nWhat specific issue can I help you with?`
      suggestions = ['Technical support', 'Billing questions', 'Schedule service visit']
    } else {
      content = `Thanks for your question! I'd be happy to help you learn more about ${brand.name} security solutions. Our local team specializes in:\n\n• Home security systems\n• Smart home automation\n• Business security solutions\n• 24/7 professional monitoring\n\nWhat aspect of home security interests you most?`
      suggestions = ['Security packages', 'Smart home features', `Call ${dynamicPhone}`, 'Get free quote']
    }

    return {
      id: `bot-${Date.now()}`,
      type: 'bot',
      content,
      timestamp: new Date(),
      suggestions
    }
  }

  const handleSendMessage = () => {
    if (!inputValue.trim()) return

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsTyping(true)

    // Simulate typing delay
    setTimeout(() => {
      const botResponse = generateBotResponse(inputValue)
      setMessages(prev => [...prev, botResponse])
      setIsTyping(false)
    }, 1500)
  }

  const handleSuggestionClick = (suggestion: string) => {
    if (suggestion.includes('Call')) {
      window.location.href = `tel:${dynamicPhone}`
      return
    }
    
    setInputValue(suggestion)
    handleSendMessage()
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const colorMap = {
    blue: 'bg-blue-600 hover:bg-blue-700',
    emerald: 'bg-emerald-600 hover:bg-emerald-700',
    orange: 'bg-orange-600 hover:bg-orange-700',
    red: 'bg-red-600 hover:bg-red-700'
  }

  const lightColorMap = {
    blue: 'bg-blue-50 text-blue-700',
    emerald: 'bg-emerald-50 text-emerald-700',
    orange: 'bg-orange-50 text-orange-700',
    red: 'bg-red-50 text-red-700'
  }

  return (
    <>
      {/* Chat Toggle Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 w-14 h-14 ${colorMap[brand.primaryColor as keyof typeof colorMap]} text-white rounded-full shadow-lg flex items-center justify-center transition-all z-40 ${isOpen ? 'hidden' : ''}`}
      >
        <MessageCircle size={24} />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col z-50 border border-gray-200">
          {/* Header */}
          <div className={`${colorMap[brand.primaryColor as keyof typeof colorMap]} text-white p-4 rounded-t-2xl flex items-center justify-between`}>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <Bot size={18} />
              </div>
              <div>
                <h3 className="font-semibold">{brand.name} Assistant</h3>
                <p className="text-xs opacity-90">Online now</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex gap-3 ${message.type === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.type === 'bot' 
                    ? `${lightColorMap[brand.primaryColor as keyof typeof lightColorMap]}`
                    : 'bg-gray-100'
                }`}>
                  {message.type === 'bot' ? <Bot size={16} /> : <User size={16} />}
                </div>
                <div className={`max-w-[80%] ${message.type === 'user' ? 'text-right' : ''}`}>
                  <div className={`rounded-xl p-3 ${
                    message.type === 'user' 
                      ? `${colorMap[brand.primaryColor as keyof typeof colorMap]} text-white`
                      : 'bg-gray-50 text-gray-900'
                  }`}>
                    <p className="text-sm whitespace-pre-line">{message.content}</p>
                  </div>
                  {message.suggestions && message.suggestions.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {message.suggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="block text-xs text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded-lg transition-colors w-full text-left"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${lightColorMap[brand.primaryColor as keyof typeof lightColorMap]}`}>
                  <Bot size={16} />
                </div>
                <div className="bg-gray-50 rounded-xl p-3">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-100">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about security options..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                disabled={isTyping}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isTyping}
                className={`w-10 h-10 ${colorMap[brand.primaryColor as keyof typeof colorMap]} disabled:bg-gray-300 text-white rounded-lg flex items-center justify-center transition-colors`}
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}