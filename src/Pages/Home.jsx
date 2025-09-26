import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  Send,
  Mic,
  MapPin,
  DollarSign,
  Sparkles,
  Plane,
  MessageSquare,
  Search,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ChatMessage } from "@/entities/ChatMessage";
import { ChatAPI } from "@/api";
import { mapOffersListToTravelPackages } from "@/api/mappers";

import ChatInterface from "../components/Chat/ChatInterface";
import QuickActions from "../components/Home/QuickActions";
import DestinationSuggestions from "../components/Home/DestinationSuggestions";

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(() => `session_${Date.now()}`);

  // Initial welcome message
  useEffect(() => {
    const welcomeMessage = {
      id: "welcome",
      type: "assistant",
      content:
        "Hi there! 👋 I'm your personal travel assistant. Tell me about your dream trip - your budget, destination preferences, or travel dates - and I'll help you find the perfect package!",
      timestamp: new Date(),
    };
    setMessages([welcomeMessage]);
  }, []);

  const handleSendMessage = async (message) => {
    if (!message.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: "user",
      content: message,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setCurrentMessage("");
    setIsLoading(true);

    try {
      // Call backend chat suggestion API
      const payload = { prompt: message, limit: 10, sort: "price:asc" };
      const suggest = await ChatAPI.suggest(payload);
      const mappedOffers = Array.isArray(suggest?.offers)
        ? mapOffersListToTravelPackages({ items: suggest.offers })
        : [];

      const summaryParts = [];
      if (suggest?.extracted?.destination) summaryParts.push(`Destination: ${suggest.extracted.destination}`);
      if (suggest?.extracted?.budgetMin != null) summaryParts.push(`Budget: ${suggest.extracted.budgetMin}`);
      if (suggest?.extracted?.month && suggest?.extracted?.year) summaryParts.push(`When: ${suggest.extracted.month}/${suggest.extracted.year}`);
      const summary = summaryParts.length ? `I parsed your request. ${summaryParts.join(" · ")}.` : "Here are some options based on your request.";

      const assistantMessage = {
        id: Date.now() + 1,
        type: "assistant",
        content: mappedOffers.length ? `${summary} I found ${mappedOffers.length} matching offer${mappedOffers.length>1?"s":""}.` : `${summary} I couldn't find matching offers right now. Try adjusting budget or dates.`,
        timestamp: new Date(),
        intent: "search",
        extractedData: suggest?.extracted,
        offers: mappedOffers,
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // Save to database (best-effort)
      await ChatMessage.create({
        message: message,
        response: assistantMessage.content,
        intent: assistantMessage.intent,
        extracted_data: assistantMessage.extractedData,
        session_id: sessionId,
      });
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage = {
        id: Date.now() + 1,
        type: "assistant",
        content:
          "I'm sorry, I'm having trouble connecting right now. Please try again in a moment!",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    }

    setIsLoading(false);
  };

  const handleQuickAction = (action) => {
    const quickMessages = {
      destinations:
        "Can you suggest some popular destinations for my next trip?",
      budget:
        "I'd like to plan a trip with a budget of around $1000-2000. What options do you have?",
      deals: "What are the best travel deals available right now?",
    };

    if (quickMessages[action]) {
      handleSendMessage(quickMessages[action]);
    }
  };

  return (
    <div className="dark">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-background">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
              Plan and book your trip
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                in one chat
              </span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
              Skip the endless browsing. Just tell us what you want, and our AI
              will find the perfect travel packages tailored to your budget and
              preferences.
            </p>
          </div>

          {/* Main Chat Interface */}
          <div className="max-w-4xl mx-auto">
            <ChatInterface
              messages={messages}
              onSendMessage={handleSendMessage}
              currentMessage={currentMessage}
              setCurrentMessage={setCurrentMessage}
              isLoading={isLoading}
            />
          </div>

          {/* Quick Actions */}
          <QuickActions onQuickAction={handleQuickAction} />
        </div>
      </section>

      {/* Destination Suggestions */}
      <DestinationSuggestions />

      {/* Features Section */}
      <section className="py-24 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Why Choose TravelChat?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We're revolutionizing travel planning with AI-powered
              conversations
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 transform group-hover:scale-110 transition-transform duration-200">
                <MessageSquare className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-4">
                Chat-Based Planning
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Simply chat about your travel dreams. Our AI understands natural
                language and finds exactly what you're looking for.
              </p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 transform group-hover:scale-110 transition-transform duration-200">
                <Search className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-4">
                Smart Matching
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                We analyze thousands of packages from verified providers to
                match your budget, dates, and preferences perfectly.
              </p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 transform group-hover:scale-110 transition-transform duration-200">
                <Sparkles className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-4">
                Instant Booking
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Found the perfect trip? Book instantly with secure payment
                options and get confirmation in seconds.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
