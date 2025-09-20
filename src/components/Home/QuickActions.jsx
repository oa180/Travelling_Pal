import React from "react";
import { MapPin, DollarSign, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const quickActions = [
  {
    id: "destinations",
    label: "Suggested Destinations",
    icon: MapPin,
    description: "Popular places to visit",
    gradient: "from-blue-500 to-cyan-500"
  },
  {
    id: "budget",
    label: "Search by Budget",
    icon: DollarSign,
    description: "Find trips within your budget",
    gradient: "from-green-500 to-emerald-500"
  },
  {
    id: "deals",
    label: "Best Deals",
    icon: Sparkles,
    description: "Limited time offers",
    gradient: "from-purple-500 to-pink-500"
  }
];

export default function QuickActions({ onQuickAction }) {
  return (
    <div className="mt-16">
      <p className="text-center text-blue-100 mb-8 text-lg">
        Or get started with these quick options:
      </p>
      <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        {quickActions.map((action, index) => (
          <motion.div
            key={action.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Button
              variant="outline"
              className="w-full h-auto p-6 bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 transition-all duration-300 group"
              onClick={() => onQuickAction(action.id)}
            >
              <div className="text-center">
                <div className={`w-12 h-12 bg-gradient-to-br ${action.gradient} rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200`}>
                  <action.icon className="w-6 h-6 text-white" />
                </div>
                <div className="font-semibold text-lg mb-2">{action.label}</div>
                <div className="text-sm text-blue-200">{action.description}</div>
              </div>
            </Button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}