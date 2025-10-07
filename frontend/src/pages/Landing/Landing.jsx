import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useTheme } from "../../hooks/useTheme";
import { ThemeSwitcher } from "../../components/common/ThemeToggle/ThemeToggle";

const Landing = () => {
  const [currentFeature, setCurrentFeature] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const { theme, isDark } = useTheme();

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const features = [
    {
      icon: "🤖",
      title: "AI-Powered Tutor",
      description:
        "Get instant explanations and personalized learning guidance",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: "📚",
      title: "Smart PDF Analysis",
      description: "Upload any textbook and let AI extract key concepts",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      icon: "🎯",
      title: "Adaptive Quizzes",
      description: "AI-generated quizzes that adapt to your learning pace",
      gradient: "from-green-500 to-teal-500",
    },
    {
      icon: "📊",
      title: "Progress Tracking",
      description: "Monitor your improvement with detailed analytics",
      gradient: "from-orange-500 to-red-500",
    },
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Class XI Student",
      content:
        "SmartLearnAI helped me improve my physics scores by 40% in just 2 months!",
      avatar: "👩‍🎓",
      score: "92%",
    },
    {
      name: "Raj Patel",
      role: "Class XII Student",
      content:
        "The AI tutor explains complex concepts in a way that actually makes sense.",
      avatar: "👨‍🎓",
      score: "88%",
    },
    {
      name: "Priya Sharma",
      role: "Competitive Exam Aspirant",
      content:
        "Personalized quizzes and progress tracking made my preparation so efficient.",
      avatar: "👩‍💼",
      score: "95%",
    },
  ];

  const stats = [
    { number: "10,000+", label: "Active Students", icon: "👥" },
    { number: "40%", label: "Average Score Improvement", icon: "📈" },
    { number: "24/7", label: "AI Tutor Availability", icon: "⏰" },
    { number: "50+", label: "Subjects Covered", icon: "📚" },
  ];

  // Auto-rotate features
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 flex items-center justify-center transition-colors duration-500">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-center text-white"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-20 h-20 border-4 border-white border-t-transparent rounded-full mx-auto mb-4"
          />
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-4xl font-bold"
          >
            SmartLearnAI
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-xl mt-2"
          >
            Preparing your learning journey...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen transition-colors duration-500 ${
        isDark
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
          : "bg-gradient-to-br from-blue-50 via-white to-purple-50"
      }`}
    >
      {/* Navigation */}
      <nav
        className={`fixed top-0 w-full backdrop-blur-md z-50 border-b transition-colors duration-500 ${
          isDark
            ? "bg-gray-900/80 border-gray-800"
            : "bg-white/80 border-gray-200"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-2"
            >
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">AI</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                SmartLearnAI
              </span>
            </motion.div>

            <div className="hidden md:flex items-center space-x-8">
              {["Features", "How It Works", "Testimonials", "Pricing"].map(
                (item) => (
                  <motion.a
                    key={item}
                    href={`#${item.toLowerCase()}`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`font-medium transition-colors duration-200 ${
                      isDark
                        ? "text-gray-300 hover:text-white"
                        : "text-gray-700 hover:text-blue-600"
                    }`}
                  >
                    {item}
                  </motion.a>
                )
              )}
            </div>

            <div className="flex items-center space-x-4">
              <ThemeSwitcher />
              <Link to="/login">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-6 py-2 font-medium rounded-lg transition-colors duration-200 ${
                    isDark
                      ? "text-gray-300 hover:text-white hover:bg-gray-800"
                      : "text-blue-600 hover:bg-blue-50"
                  }`}
                >
                  Sign In
                </motion.button>
              </Link>
              <Link to="/register">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:shadow-lg transition-all duration-200"
                >
                  Get Started Free
                </motion.button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.h1
                className={`text-5xl lg:text-6xl font-bold leading-tight transition-colors duration-500 ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                Learn Smarter with{" "}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  AI Power
                </span>
              </motion.h1>

              <motion.p
                className={`text-xl mt-6 leading-relaxed transition-colors duration-500 ${
                  isDark ? "text-gray-300" : "text-gray-600"
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                Transform your study sessions with our intelligent learning
                companion. Upload textbooks, get instant explanations, and
                master concepts with personalized AI-generated quizzes.
              </motion.p>

              <motion.div
                className="flex flex-col sm:flex-row gap-4 mt-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Link to="/register" className="flex-1">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-8 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    Start Learning Free
                  </motion.button>
                </Link>
                <Link to="/login" className="flex-1">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full border-2 py-4 px-8 rounded-xl font-semibold text-lg transition-all duration-200 ${
                      isDark
                        ? "border-gray-600 text-gray-300 hover:border-blue-500 hover:text-blue-400"
                        : "border-gray-300 text-gray-700 hover:border-blue-500 hover:text-blue-600"
                    }`}
                  >
                    I Have an Account
                  </motion.button>
                </Link>
              </motion.div>

              <motion.div
                className={`flex items-center mt-8 space-x-4 text-sm transition-colors duration-500 ${
                  isDark ? "text-gray-400" : "text-gray-500"
                }`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <div className="flex -space-x-2">
                  {["👩‍🎓", "👨‍🎓", "👩‍💼", "👨‍💼"].map((emoji, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.8 + index * 0.1 }}
                      className={`w-8 h-8 rounded-full flex items-center justify-center shadow-sm border-2 transition-colors duration-200 ${
                        isDark
                          ? "bg-gray-800 border-gray-700"
                          : "bg-white border-white"
                      }`}
                    >
                      {emoji}
                    </motion.div>
                  ))}
                </div>
                <span>Join 10,000+ students already learning smarter</span>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div
                className={`relative z-10 rounded-2xl shadow-2xl p-8 transition-colors duration-500 ${
                  isDark ? "bg-gray-800" : "bg-white"
                }`}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentFeature}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                    className="text-center"
                  >
                    <div
                      className={`text-6xl mb-4 bg-gradient-to-r ${features[currentFeature].gradient} bg-clip-text text-transparent`}
                    >
                      {features[currentFeature].icon}
                    </div>
                    <h3
                      className={`text-2xl font-bold mb-2 transition-colors duration-500 ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {features[currentFeature].title}
                    </h3>
                    <p
                      className={`transition-colors duration-500 ${
                        isDark ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      {features[currentFeature].description}
                    </p>
                  </motion.div>
                </AnimatePresence>

                <div className="flex justify-center space-x-2 mt-6">
                  {features.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentFeature(index)}
                      className={`w-3 h-3 rounded-full transition-all duration-200 ${
                        index === currentFeature
                          ? "bg-blue-600"
                          : isDark
                            ? "bg-gray-600"
                            : "bg-gray-300"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Floating elements */}
              <motion.div
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute -top-4 -left-4 w-8 h-8 bg-yellow-400 rounded-full opacity-20"
              />
              <motion.div
                animate={{ y: [0, 20, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                className="absolute -bottom-4 -right-4 w-6 h-6 bg-green-400 rounded-full opacity-20"
              />
              <motion.div
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, delay: 0.5 }}
                className="absolute top-1/2 -right-6 w-4 h-4 bg-red-400 rounded-full opacity-20"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`text-center p-6 rounded-2xl transition-colors duration-500 ${
                  isDark ? "bg-gray-800" : "bg-white"
                } shadow-lg`}
              >
                <div className="text-3xl mb-2">{stat.icon}</div>
                <div
                  className={`text-3xl font-bold mb-2 transition-colors duration-500 ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  {stat.number}
                </div>
                <div
                  className={`transition-colors duration-500 ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <Section id="features" title="Powerful Learning Features" isDark={isDark}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              feature={feature}
              index={index}
              isDark={isDark}
            />
          ))}
        </div>
      </Section>

      {/* How It Works Section */}
      <Section
        id="how-it-works"
        title="How SmartLearnAI Works"
        bg="gray"
        isDark={isDark}
      >
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Upload & Analyze",
                description:
                  "Upload your PDF textbooks and let AI extract key concepts",
                icon: "📄",
                gradient: "from-blue-500 to-cyan-500",
              },
              {
                step: "02",
                title: "Learn with AI Tutor",
                description:
                  "Chat with AI to get explanations and clear your doubts",
                icon: "🤖",
                gradient: "from-purple-500 to-pink-500",
              },
              {
                step: "03",
                title: "Practice & Track",
                description: "Take adaptive quizzes and monitor your progress",
                icon: "📊",
                gradient: "from-green-500 to-teal-500",
              },
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div
                  className={`w-20 h-20 bg-gradient-to-r ${step.gradient} rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4 shadow-lg`}
                >
                  {step.step}
                </div>
                <div
                  className={`text-4xl mb-4 bg-gradient-to-r ${step.gradient} bg-clip-text text-transparent`}
                >
                  {step.icon}
                </div>
                <h3
                  className={`text-xl font-bold mb-2 transition-colors duration-500 ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  {step.title}
                </h3>
                <p
                  className={`transition-colors duration-500 ${
                    isDark ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* Testimonials Section */}
      <Section id="testimonials" title="What Students Say" isDark={isDark}>
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard
                key={index}
                testimonial={testimonial}
                index={index}
                isDark={isDark}
              />
            ))}
          </div>
        </div>
      </Section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-700">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-white mb-4"
          >
            Ready to Transform Your Learning?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
            className="text-xl text-blue-100 mb-8"
          >
            Join thousands of students already learning smarter with AI
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link to="/register">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-blue-600 px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all"
              >
                Start Free Today
              </motion.button>
            </Link>
            <Link to="/login">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white hover:text-blue-600 transition-all"
              >
                Sign In
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer
        className={`py-12 transition-colors duration-500 ${
          isDark ? "bg-gray-900 text-white" : "bg-gray-900 text-white"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">AI</span>
                </div>
                <span className="text-xl font-bold">SmartLearnAI</span>
              </div>
              <p className="text-gray-400">
                AI-powered learning platform helping students learn smarter and
                faster.
              </p>
            </div>

            {["Product", "Company", "Support", "Legal"].map((category) => (
              <div key={category}>
                <h4 className="font-semibold mb-4">{category}</h4>
                <ul className="space-y-2 text-gray-400">
                  {["Features", "Pricing", "Case Studies", "Updates"].map(
                    (item) => (
                      <li key={item}>
                        <a
                          href="#"
                          className="hover:text-white transition-colors duration-200"
                        >
                          {item}
                        </a>
                      </li>
                    )
                  )}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 SmartLearnAI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Reusable Section Component
const Section = ({ id, title, children, bg = "white", isDark }) => {
  const bgClass =
    bg === "gray"
      ? isDark
        ? "bg-gray-800"
        : "bg-gray-50"
      : isDark
        ? "bg-gray-900"
        : "bg-white";

  return (
    <section
      id={id}
      className={`py-20 px-4 sm:px-6 lg:px-8 transition-colors duration-500 ${bgClass}`}
    >
      <div className="max-w-7xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={`text-4xl font-bold text-center mb-12 transition-colors duration-500 ${
            isDark ? "text-white" : "text-gray-900"
          }`}
        >
          {title}
        </motion.h2>
        {children}
      </div>
    </section>
  );
};

// Feature Card Component
const FeatureCard = ({ feature, index, isDark }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ y: -5 }}
      className={`p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border ${
        isDark
          ? "bg-gray-800 border-gray-700 hover:border-gray-600"
          : "bg-white border-gray-100 hover:border-gray-200"
      }`}
    >
      <div
        className={`text-4xl mb-4 bg-gradient-to-r ${feature.gradient} bg-clip-text text-transparent`}
      >
        {feature.icon}
      </div>
      <h3
        className={`text-xl font-bold mb-2 transition-colors duration-500 ${
          isDark ? "text-white" : "text-gray-900"
        }`}
      >
        {feature.title}
      </h3>
      <p
        className={`transition-colors duration-500 ${
          isDark ? "text-gray-300" : "text-gray-600"
        }`}
      >
        {feature.description}
      </p>
    </motion.div>
  );
};

// Testimonial Card Component
const TestimonialCard = ({ testimonial, index, isDark }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.2 }}
      className={`p-6 rounded-2xl shadow-lg border transition-colors duration-500 ${
        isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xl">
            {testimonial.avatar}
          </div>
          <div>
            <h4
              className={`font-bold transition-colors duration-500 ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              {testimonial.name}
            </h4>
            <p
              className={`text-sm transition-colors duration-500 ${
                isDark ? "text-gray-400" : "text-gray-600"
              }`}
            >
              {testimonial.role}
            </p>
          </div>
        </div>
        <div
          className={`px-3 py-1 rounded-full text-sm font-bold ${
            isDark
              ? "bg-green-900/30 text-green-400"
              : "bg-green-100 text-green-800"
          }`}
        >
          {testimonial.score}
        </div>
      </div>
      <p
        className={`italic transition-colors duration-500 ${
          isDark ? "text-gray-300" : "text-gray-700"
        }`}
      >
        "{testimonial.content}"
      </p>

      {/* Rating Stars */}
      <div className="flex mt-4">
        {[1, 2, 3, 4, 5].map((star) => (
          <motion.svg
            key={star}
            initial={{ scale: 0 }}
            animate={inView ? { scale: 1 } : {}}
            transition={{ delay: index * 0.2 + star * 0.1 }}
            className="w-5 h-5 text-yellow-400"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </motion.svg>
        ))}
      </div>
    </motion.div>
  );
};

export default Landing;
