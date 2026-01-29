"use client";

import React from "react";
import { motion } from "framer-motion";
import { Briefcase, TrendingUp, ShieldCheck, Users, Lightbulb, BarChart3, Target, ArrowRight, BookOpen, Clock } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import NewsletterForm from "@/components/Update";

const Business = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const services = [
    {
      icon: <Briefcase className="w-8 h-8 text-primary" />,
      title: "Investment Consulting",
      description: "Tailored advisory for businesses, founders, and high-net-worth individuals seeking clarity and direction.",
      points: ["Portfolio structuring", "Asset allocation", "Cash management", "Wealth planning"],
      outcome: "Clear strategy. Fewer mistakes. Better returns."
    },
    {
      icon: <BarChart3 className="w-8 h-8 text-primary" />,
      title: "Premium Research & Reports",
      description: "Actionable intelligence, not recycled headlines.",
      points: ["Weekly market reports", "Equity research", "Sector outlooks", "Opportunity briefs"],
      outcome: "Informed decisions before the market reacts."
    },
    {
      icon: <ShieldCheck className="w-8 h-8 text-primary" />,
      title: "Portfolio Monitoring",
      description: "We stay with you, not just advise once.",
      points: ["Ongoing review", "Risk monitoring", "Rebalancing guidance", "Market alerts"],
      outcome: "Discipline through cycles. Calm in volatility."
    },
    {
      icon: <Lightbulb className="w-8 h-8 text-primary" />,
      title: "Investor Education",
      description: "Knowledge compounds faster than money.",
      points: ["Strategy sessions", "Treasury management", "Investment frameworks", "Founder guidance"],
      outcome: "Strong thinking. Stronger execution."
    }
  ];

  const philosophy = [
    { title: "Discipline beats prediction", description: "We rely on proven systems, not crystal balls." },
    { title: "Risk management first", description: "Protecting capital is the first step to growing it." },
    { title: "Consistency outperforms brilliance", description: "Steady compounding wins the race." }
  ];

  return (
    <main className="bg-white dark:bg-slate-950 min-h-screen transition-colors duration-300">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 md:px-14 overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-green-50/50 dark:bg-green-900/10 -z-10 rounded-l-[100px]" />
        <motion.div
          className="max-w-4xl mx-auto text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-extrabold font-rowdies mb-6 dark:text-white">
            Building Wealth. <br />
            <span className="text-primary">One Smart Decision at a Time.</span>
          </motion.h1>
          <motion.p variants={itemVariants} className="text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
            InvestNaira is a Nigeria-focused investment advisory and research platform built to help individuals and businesses grow, protect, and compound capital intelligently.
          </motion.p>
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="mailto:info@investnaira.com" className="px-8 py-4 bg-primary text-white rounded-xl font-bold text-lg hover:bg-green-600 transition shadow-lg hover:shadow-green-500/25">
              Consult with Us
            </Link>
            <Link href="#services" className="px-8 py-4 bg-gray-100 dark:bg-slate-800 text-gray-900 dark:text-white rounded-xl font-bold text-lg hover:bg-gray-200 dark:hover:bg-slate-700 transition">
              Explore Services
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Philosophy Section */}
      <section className="py-20 px-6 md:px-14 bg-gray-50 dark:bg-slate-900 border-y dark:border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold font-rowdies mb-4 dark:text-white">Our Philosophy</h2>
            <p className="text-gray-600 dark:text-gray-400">Markets reward patience, structure, and preparation. We design for all three.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {philosophy.map((item, idx) => (
              <motion.div
                key={idx}
                className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-white/5"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2 }}
              >
                <Target className="w-10 h-10 text-tertiary mb-6" />
                <h3 className="text-xl font-bold mb-3 dark:text-white">{item.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 px-6 md:px-14">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <span className="text-primary font-bold tracking-wider uppercase text-sm">What We Do</span>
            <h2 className="text-4xl md:text-5xl font-bold font-rowdies mt-2 mb-6 dark:text-white">Structured Advisory & Execution</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl">
              We help businesses and serious investors grow their investment pot through structured advisory, recurring intelligence, and execution support.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {services.map((service, idx) => (
              <motion.div
                key={idx}
                className="group bg-gray-50 dark:bg-slate-800/50 p-8 md:p-10 rounded-[2rem] hover:bg-white dark:hover:bg-slate-800 border border-transparent hover:border-gray-200 dark:hover:border-white/10 transition-all duration-300 shadow-sm hover:shadow-xl"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <div className="mb-6 p-4 bg-white dark:bg-slate-700/50 rounded-2xl w-fit shadow-sm group-hover:scale-110 transition-transform duration-300">
                  {service.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4 dark:text-white">{service.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                  {service.description}
                </p>
                <ul className="space-y-3 mb-8">
                  {service.points.map((point, pIdx) => (
                    <li key={pIdx} className="flex items-center gap-3 text-gray-700 dark:text-gray-400 text-sm font-medium">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      {point}
                    </li>
                  ))}
                </ul>
                <div className="pt-6 border-t border-gray-200 dark:border-white/10">
                  <p className="text-sm font-bold text-tertiary dark:text-pink-400">Outcome: {service.outcome}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Who We Serve */}
      <section className="py-20 px-6 md:px-14 bg-dark text-white rounded-3xl mx-4 md:mx-14 mb-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-green-900/20 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-5xl font-bold font-rowdies mb-6">Who We Serve</h2>
            <p className="text-xl text-gray-300 mb-8">If capital matters to you, we’re built for you.</p>
            <div className="space-y-4">
              {[
                "Small and mid-sized businesses",
                "Founders and entrepreneurs",
                "Corporate treasury teams",
                "Long-term individual investors",
                "Professionals building generational wealth"
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  className="flex items-center gap-4 bg-white/5 p-4 rounded-xl backdrop-blur-sm border border-white/10"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Users className="text-primary w-5 h-5" />
                  <span className="font-semibold">{item}</span>
                </motion.div>
              ))}
            </div>
          </div>
          <div className="bg-white/10 p-10 rounded-3xl border border-white/10">
            <h3 className="text-2xl font-bold mb-6">Why InvestNaira?</h3>
            <ul className="space-y-6">
              <li className="flex gap-4">
                <div className="bg-primary/20 p-2 rounded-lg h-fit"><TrendingUp className="text-primary w-5 h-5" /></div>
                <div>
                  <h4 className="font-bold mb-1">Nigeria-Focused Expertise</h4>
                  <p className="text-sm text-gray-400">Deep understanding of local market dynamics.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="bg-primary/20 p-2 rounded-lg h-fit"><BookOpen className="text-primary w-5 h-5" /></div>
                <div>
                  <h4 className="font-bold mb-1">Research-First Decision Making</h4>
                  <p className="text-sm text-gray-400">Data-driven insights, not emotional guessing.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="bg-primary/20 p-2 rounded-lg h-fit"><Clock className="text-primary w-5 h-5" /></div>
                <div>
                  <h4 className="font-bold mb-1">Transparent Thinking</h4>
                  <p className="text-sm text-gray-400">No hype. Just clear, honest execution.</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 px-6 md:px-14">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold font-rowdies mb-4 dark:text-white">How We Work</h2>
          <p className="text-gray-600 dark:text-gray-400">Simple. Serious. Sustainable.</p>
        </div>
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          {["Understand Goals", "Design Framework", "Deploy Capital", "Monitor & Adjust"].map((step, idx) => (
            <div key={idx} className="relative text-center">
              <div className="w-16 h-16 mx-auto bg-primary text-white rounded-2xl flex items-center justify-center text-2xl font-bold mb-6 shadow-lg shadow-green-500/20 transform rotate-3">
                {idx + 1}
              </div>
              <h4 className="font-bold dark:text-white">{step}</h4>
              {idx !== 3 && <div className="hidden md:block absolute top-8 left-1/2 w-full h-[2px] bg-gray-200 dark:bg-gray-800 -z-10" />}
            </div>
          ))}
        </div>
      </section>

      <NewsletterForm />

      <Footer />
    </main>
  );
};

export default Business;