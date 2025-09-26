import React, { useRef, useEffect } from "react";
import { Send, Mic, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { motion, AnimatePresence } from "framer-motion";
import PackageCard from "@/components/Search/PackageCard";

export default function ChatInterface({ 
  messages, 
  onSendMessage, 
  currentMessage, 
  setCurrentMessage, 
  isLoading 
}) {
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (currentMessage.trim() && !isLoading) {
      onSendMessage(currentMessage);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <Card className="w-full bg-white/95 backdrop-blur-sm shadow-xl border-0">
      <CardContent className="p-0">
        {/* Messages Area */}
        <div className="h-96 overflow-y-auto p-6 space-y-6">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`flex items-start space-x-3 ${
                  message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                }`}
              >
                <Avatar className="w-8 h-8 flex-shrink-0">
                  <AvatarFallback className={
                    message.type === 'user' 
                      ? 'bg-blue-500 text-white'
                      : 'bg-gradient-to-br from-green-500 to-blue-600 text-white'
                  }>
                    {message.type === 'user' ? 'U' : 'AI'}
                  </AvatarFallback>
                </Avatar>
                <div className={`max-w-[75%] ${
                  message.type === 'user' ? 'text-right' : 'text-left'
                }`}>
                  <div className={`inline-block p-4 rounded-2xl ${
                    message.type === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}>
                    <p className="text-sm leading-relaxed">{message.content}</p>
                  </div>
                  {/* Offer cards (assistant only) */}
                  {message.type !== 'user' && Array.isArray(message.offers) && message.offers.length > 0 && (
                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                      {message.offers.map((pkg) => (
                        <motion.div
                          key={pkg.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <PackageCard package={pkg} />
                        </motion.div>
                      ))}
                    </div>
                  )}
                  <div className="text-xs text-gray-400 mt-2">
                    {message.timestamp.toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Loading indicator */}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-start space-x-3"
            >
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-gradient-to-br from-green-500 to-blue-600 text-white">
                  AI
                </AvatarFallback>
              </Avatar>
              <div className="bg-gray-100 p-4 rounded-2xl">
                <div className="flex items-center space-x-2">
                  <Loader2 className="w-4 h-4 animate-spin text-gray-500" />
                  <span className="text-sm text-gray-500">Thinking...</span>
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t border-gray-200 p-6">
          <form onSubmit={handleSubmit} className="flex items-end space-x-4">
            <div className="flex-1">
              <Input
                ref={inputRef}
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Tell me about your dream trip... (budget, destination, dates)"
                className="resize-none border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-xl text-sm"
                disabled={isLoading}
              />
            </div>
            <div className="flex space-x-2">
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="rounded-xl"
                disabled={isLoading}
              >
                <Mic className="w-4 h-4" />
              </Button>
              <Button
                type="submit"
                disabled={!currentMessage.trim() || isLoading}
                className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 rounded-xl"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </form>
          <p className="text-xs text-gray-500 mt-3 text-center">
            Try: "I have $1500 for a beach vacation in March" or "Show me adventure trips in Europe"
          </p>
        </div>
      </CardContent>
    </Card>
  );
}