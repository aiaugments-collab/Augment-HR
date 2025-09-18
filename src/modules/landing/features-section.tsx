"use client";

import { motion } from "motion/react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Calendar,
  DollarSign,
  Clock,
  FileText,
  Briefcase,
  ArrowRight,
} from "lucide-react";

export function FeaturesSection() {
  const features = [
    {
      icon: Users,
      title: "Intelligent Workforce Orchestration",
      description:
        "Enterprise-grade human capital management with neural-powered profiling, automated compliance workflows, and dynamic organizational intelligence.",
      benefits: [
        "AI-driven talent mapping",
        "Predictive workforce analytics", 
        "Autonomous compliance monitoring",
      ],
    },
    {
      icon: Clock,
      title: "Cognitive Presence Intelligence",
      description:
        "Advanced biometric-enabled attendance with real-time behavioral analysis, anomaly detection, and predictive workforce optimization.",
      benefits: [
        "Biometric authentication",
        "Behavioral pattern analysis",
        "Predictive scheduling",
      ],
    },
    {
      icon: Calendar,
      title: "Autonomous Leave Orchestration",
      description:
        "Machine learning-powered absence management with intelligent policy enforcement, predictive approval algorithms, and dynamic resource allocation.",
      benefits: ["Neural approval engine", "Predictive policy adaptation", "Smart resource balancing"],
    },
    {
      icon: DollarSign,
      title: "Algorithmic Compensation Engine",
      description:
        "Next-generation payroll automation with real-time tax optimization, compliance intelligence, and dynamic compensation modeling.",
      benefits: [
        "Real-time tax optimization",
        "Compliance automation",
        "Dynamic compensation algorithms",
      ],
    },
    {
      icon: Briefcase,
      title: "Neural Talent Acquisition",
      description:
        "Revolutionary AI-driven recruitment with cognitive resume analysis, predictive candidate matching, and automated pipeline optimization.",
      benefits: [
        "Cognitive screening algorithms",
        "Predictive talent matching",
        "Autonomous pipeline management",
      ],
    },
    {
      icon: FileText,
      title: "Intelligent Knowledge Repository",
      description:
        "Enterprise document intelligence with natural language processing, contextual search algorithms, and automated knowledge extraction.",
      benefits: ["NLP-powered search", "Contextual knowledge graphs", "Automated content analysis"],
    },
  ];

  return (
    <section
      id="features"
      className="bg-muted/30 px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-24"
    >
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="mb-12 text-center sm:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-4"
          >
            <Badge variant="secondary" className="px-4 py-2">
              Enterprise AI Capabilities
            </Badge>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-foreground mb-4 text-3xl font-bold sm:text-4xl lg:text-5xl"
          >
            Advanced AI Infrastructure for Enterprise HR
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground mx-auto max-w-3xl text-lg"
          >
            Mission-critical workforce intelligence powered by cutting-edge machine learning algorithms. 
            Transform your organization with autonomous HR operations and predictive analytics.
          </motion.p>
        </div>

        {/* Features Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="group bg-background/60 hover:bg-background h-full border-0 backdrop-blur-sm transition-all duration-300 hover:shadow-lg">
                <CardContent className="p-6">
                  <div className="bg-primary/10 mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg">
                    <feature.icon className="text-primary h-6 w-6" />
                  </div>
                  <h3 className="text-foreground mb-3 text-xl font-semibold">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {feature.description}
                  </p>
                  <ul className="space-y-2">
                    {feature.benefits.map((benefit) => (
                      <li
                        key={benefit}
                        className="text-muted-foreground flex items-center text-sm"
                      >
                        <ArrowRight className="text-primary mr-2 h-3 w-3" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
