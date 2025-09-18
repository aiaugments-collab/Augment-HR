"use client";

import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  Brain,
  Users,
  TrendingUp,
  Shield,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";

const features = [
  "Neural-Powered Talent Acquisition",
  "Cognitive Workforce Analytics",
  "Autonomous HR Operations",
  "Predictive Employee Intelligence",
];

export function HeroSection() {
  return (
    <section
      id="home"
      className="relative overflow-hidden px-6 pt-24 pb-16 sm:px-8 sm:pt-32 sm:pb-20 lg:px-12 lg:pt-40 lg:pb-24"
    >
      {/* Background Elements */}
      <div className="from-background via-background to-muted/10 absolute inset-0 bg-gradient-to-br" />
      <div className="bg-primary/5 absolute top-20 -left-20 h-40 w-40 rounded-full blur-3xl sm:h-60 sm:w-60 lg:h-80 lg:w-80" />
      <div className="bg-primary/8 absolute -right-20 -bottom-20 h-40 w-40 rounded-full blur-3xl sm:h-60 sm:w-60 lg:h-80 lg:w-80" />

      <div className="relative mx-auto max-w-7xl">
        <div className="text-center">
          {/* Announcement Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 inline-flex items-center sm:mb-10"
          >
            <Badge
              variant="secondary"
              className="border-primary/20 bg-primary/5 border px-4 py-2 text-sm"
            >
              <Brain className="mr-2 h-4 w-4" />
              Enterprise AI Workforce Intelligence
            </Badge>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-foreground mb-6 text-4xl leading-[1.1] font-bold tracking-tight sm:mb-8 sm:text-5xl lg:text-6xl xl:text-7xl"
          >
            Next-Generation{" "}
            <span className="from-primary bg-gradient-to-r via-blue-600 to-purple-600 bg-clip-text text-transparent">
              AI HR Agent
            </span>{" "}
            Platform
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground mx-auto mb-10 max-w-2xl text-lg leading-relaxed sm:mb-12 sm:text-xl"
          >
            Revolutionary autonomous HR intelligence that transforms workforce management through advanced machine learning, predictive analytics, and cognitive automation. Deliver enterprise-grade scalability with zero-touch operations.
          </motion.p>

          {/* Feature List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mx-auto mb-10 hidden max-w-3xl flex-wrap justify-center gap-4 sm:mb-16 sm:flex"
          >
            {features.map((feature) => (
              <div
                key={feature}
                className="border-primary/20 bg-background/50 flex items-center space-x-3 rounded-full border px-5 py-3 shadow-sm backdrop-blur-sm"
              >
                <CheckCircle className="text-primary h-4 w-4" />
                <span className="text-foreground text-sm font-medium">
                  {feature}
                </span>
              </div>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-12 flex flex-col items-center justify-center gap-4 sm:mb-20 sm:flex-row sm:gap-6"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <Link href="/sign-up">
                <Button
                  size="lg"
                  className="group from-primary via-primary to-primary/80 shadow-primary/25 hover:shadow-primary/30 relative h-14 overflow-hidden bg-gradient-to-r px-8 text-base font-semibold shadow-lg transition-all duration-300 hover:shadow-xl sm:h-16 sm:px-10 sm:text-lg"
                >
                  <span className="relative z-10 flex items-center">
                    Deploy AI Agent
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                  <div className="from-primary/10 absolute inset-0 bg-gradient-to-r to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mx-auto grid max-w-4xl grid-cols-2 gap-8 lg:grid-cols-4"
          >
            {[
              { icon: Users, stat: "10x", label: "Workforce Efficiency" },
              { icon: TrendingUp, stat: "95%", label: "Process Automation" },
              { icon: Brain, stat: "24/7", label: "Cognitive Intelligence" },
              { icon: Shield, stat: "99.99%", label: "Enterprise SLA" },
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="bg-muted mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl">
                  <item.icon className="text-primary h-6 w-6" />
                </div>
                <div className="text-foreground mb-1 text-2xl font-bold">
                  {item.stat}
                </div>
                <div className="text-muted-foreground text-sm">
                  {item.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Floating Elements - Simplified */}
      <motion.div
        animate={{
          y: [0, -10, 0],
          rotate: [0, 3, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-1/4 left-8 hidden opacity-40 lg:block"
      >
        <div className="bg-primary/20 h-8 w-8 rounded-lg" />
      </motion.div>

      <motion.div
        animate={{
          y: [0, 15, 0],
          rotate: [0, -3, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
        className="absolute right-12 bottom-1/3 hidden opacity-40 lg:block"
      >
        <div className="bg-primary/30 h-6 w-6 rounded-md" />
      </motion.div>
    </section>
  );
}
