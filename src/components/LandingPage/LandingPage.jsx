import React, { useState, useEffect } from 'react';
import { 
  Globe, 
  Network, 
  Shield, 
  Zap, 
  Database, 
  Search, 
  ArrowRight,
  CheckCircle,
  Users,
  BarChart3,
  Activity,
  ChevronDown,
  Github,
  Twitter,
  Linkedin,
  Play,
  Star,
  Target,
  Layers,
  Server,
  Menu,
  X,
  User
} from 'lucide-react';
import genesisLogo from '../../assets/genesisnet-logo.png';
import './LandingPage.css';

const LandingPage = ({ onEnterDashboard }) => {
  const [currentFeature, setCurrentFeature] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const features = [
    {
      icon: <Database className="w-8 h-8" />,
      title: "Decentralized Data Marketplace",
      description: "Connect data providers and consumers on a decentralized marketplace. Transparent, secure computing.",
      bgColor: "bg-cyan-300"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Zero-Knowledge Proofs",
      description: "Advanced cryptographic protocols enable data validation without revealing sensitive information.",
      bgColor: "bg-pink-300"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Real-time Processing",
      description: "Lightning-fast data processing with minimal latency. Optimized for high-throughput scenarios.",
      bgColor: "bg-yellow-300"
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Global Network",
      description: "Worldwide distributed infrastructure ensuring reliability and performance.",
      bgColor: "bg-lime-300"
    }
  ];

  const stats = [
    { number: "12,847+", label: "Active Nodes", bgColor: "bg-cyan-300" },
    { number: "2.4M+", label: "Transactions", bgColor: "bg-pink-300" },
    { number: "89M+", label: "Data Points", bgColor: "bg-yellow-300" },
    { number: "99.9%", label: "Uptime", bgColor: "bg-lime-300" }
  ];

  const useCases = [
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Financial Data",
      description: "Real-time market data and financial insights for algorithmic trading.",
      bgColor: "bg-cyan-300"
    },
    {
      icon: <Activity className="w-6 h-6" />,
      title: "IoT & Sensors",
      description: "Collect and analyze sensor data from IoT devices across networks.",
      bgColor: "bg-yellow-300"
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "AI Training",
      description: "Access curated datasets for machine learning and AI model development.",
      bgColor: "bg-purple-300"
    },
    {
      icon: <Search className="w-6 h-6" />,
      title: "Research Data",
      description: "Scientific datasets for academic research and studies.",
      bgColor: "bg-pink-300"
    }
  ];

  const testimonials = [
    {
      rating: "★★★★★",
      text: "GenesisNet revolutionized how we access and monetize data. The quality and speed are unmatched.",
      author: "Sarah Chen",
      title: "Senior Data Engineer",
      bgColor: "bg-lime-300"
    },
    {
      rating: "★★★★★",
      text: "The zero-knowledge features and global reach make GenesisNet our go-to data marketplace.",
      author: "Michael Rodriguez",
      title: "CTO, DataFlow Systems",
      bgColor: "bg-cyan-300"
    },
    {
      rating: "★★★★★",
      text: "Finally, a platform that understands the value of scientific data and makes it accessible.",
      author: "Dr. Emily Watson",
      title: "Research Director",
      bgColor: "bg-purple-300"
    }
  ];

  const networkStats = [
    { number: "150+", label: "Countries" },
    { number: "5TB+", label: "Data Processed" },
    { number: "1M+", label: "API Calls" },
    { number: "24/7", label: "Support" }
  ];

  const aboutFeatures = [
    {
      title: "Privacy First",
      description: "Zero-knowledge proofs and advanced cryptography to keep your data secure and private.",
      bgColor: "bg-lime-300"
    },
    {
      title: "Global Scale",
      description: "Distributed across multiple continents with 99.99% uptime delivery.",
      bgColor: "bg-pink-300"
    },
    {
      title: "Lightning Fast",
      description: "Real-time data processing and distribution with minimal latency.",
      bgColor: "bg-yellow-300"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-yellow-100 text-black relative overflow-hidden">
      {/* Clean Decorative Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Subtle geometric shapes with softer colors */}
        <div className="absolute top-20 left-20 w-16 h-16 bg-pink-100 border-2 border-black/20 rounded-lg rotate-12 opacity-60 floating-decoration"></div>
        <div className="absolute top-1/3 right-20 w-12 h-12 bg-cyan-100 border-2 border-black/20 rounded-full opacity-50 floating-decoration"></div>
        <div className="absolute bottom-40 left-1/4 w-20 h-20 bg-yellow-200 border-2 border-black/20 transform rotate-45 opacity-40 floating-decoration"></div>
        <div className="absolute bottom-1/3 right-1/3 w-14 h-14 bg-lime-100 border-2 border-black/20 rounded-lg rotate-6 opacity-55 floating-decoration"></div>
        <div className="absolute top-1/2 left-10 w-10 h-10 bg-purple-100 border-2 border-black/20 rounded-full opacity-45 floating-decoration"></div>
        
        {/* Subtle dotted pattern overlay */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'radial-gradient(circle, black 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-50 bg-white border-b-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-16 h-16 rounded-lg bg-yellow-400 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-1.5 relative">
                <div className="w-full h-full rounded-lg bg-white border-2 border-black flex items-center justify-center">
                  <img src={genesisLogo} alt="GenesisNet" className="w-10 h-10 object-contain" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-black text-black">GenesisNet</h1>
                <p className="text-sm text-purple-600 font-bold">v1.0</p>
              </div>
            </div>
            
            <div className="hidden md:flex items-center space-x-4">
              <a href="#features" className="px-4 py-2 bg-cyan-300 text-black font-black border-2 border-black rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all">
                Features
              </a>
              <a href="#usecases" className="px-4 py-2 bg-pink-300 text-black font-black border-2 border-black rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all">
                Use Cases
              </a>
              <button 
                onClick={onEnterDashboard}
                className="px-6 py-3 bg-lime-300 text-black font-black border-4 border-black rounded-lg shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
              >
                LOGIN
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 bg-yellow-300 border-2 border-black rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
              <div className="absolute top-full left-0 right-0 bg-white border-4 border-black border-t-0 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] md:hidden">
                <div className="flex flex-col p-6 space-y-4">
                  <a href="#features" className="px-4 py-3 bg-cyan-300 text-black font-black border-2 border-black rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all text-center" onClick={() => setIsMobileMenuOpen(false)}>
                    Features
                  </a>
                  <a href="#usecases" className="px-4 py-3 bg-pink-300 text-black font-black border-2 border-black rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all text-center" onClick={() => setIsMobileMenuOpen(false)}>
                    Use Cases
                  </a>
                  <button 
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      onEnterDashboard();
                    }}
                    className="px-6 py-3 bg-lime-300 text-black font-black border-4 border-black rounded-lg shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
                  >
                    LOGIN
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 px-6 py-20 text-center">
        <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="mb-12">
            <div className="inline-flex items-center px-6 py-3 rounded-lg bg-yellow-300 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] mb-8">
              <Star className="w-6 h-6 text-black mr-3" />
              <span className="text-lg font-black text-black">Next-Generation Data Marketplace</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-8 leading-tight">
              <span className="text-black">The Future of</span><br />
              <span className="bg-purple-300 border-4 border-black px-4 py-2 inline-block transform -rotate-1 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                Data Exchange
              </span>
            </h1>
            
            <div className="bg-white border-4 border-black rounded-lg p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] max-w-4xl mx-auto mb-12">
              <p className="text-lg md:text-xl text-black font-bold leading-relaxed">
                GenesisNet is a revolutionary decentralized data marketplace built on 
                the Internet Computer, connecting data providers and consumers in a 
                secure, transparent, and efficient ecosystem.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <button 
              onClick={onEnterDashboard}
              className="group flex items-center px-10 py-5 bg-lime-300 border-4 border-black rounded-lg font-black text-xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-2 hover:translate-y-2 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
            >
              <User className="w-6 h-6 mr-3" />
              Login to Dashboard
              <ArrowRight className="w-6 h-6 ml-3 transform group-hover:translate-x-1 transition-transform" />
            </button>
            
            <button className="flex items-center px-10 py-5 bg-yellow-300 border-4 border-black rounded-lg font-black text-xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-2 hover:translate-y-2 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all">
              <Play className="w-6 h-6 mr-3" />
              Watch Demo
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto mb-12">
            {stats.map((stat, index) => (
              <div key={index} className={`${stat.bgColor} border-4 border-black rounded-lg p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-center`}>
                <div className="text-3xl md:text-4xl font-black text-black mb-2">
                  {stat.number}
                </div>
                <div className="text-black font-bold text-sm md:text-base uppercase">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Scroll Indicator */}
          <div className="flex justify-center">
            <div className="p-3 bg-yellow-300 border-4 border-black rounded-full shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] animate-bounce">
              <ChevronDown className="w-8 h-8 text-black" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 py-20 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-black mb-6 text-black">
              Powerful Features
            </h2>
            <div className="bg-cyan-300 border-4 border-black rounded-lg p-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] max-w-3xl mx-auto">
              <p className="text-lg font-bold text-black">
                Built with cutting-edge technology to provide unparalleled performance, 
                security, and scalability
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className={`${feature.bgColor} border-4 border-black rounded-lg p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-2 hover:translate-y-2 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 ${
                  currentFeature === index ? 'ring-4 ring-purple-500' : ''
                }`}
              >
                <div className="bg-white border-4 border-black rounded-lg p-3 w-fit mb-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-black mb-4 text-black">{feature.title}</h3>
                <p className="text-black font-bold">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="relative z-10 py-20 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-black mb-6 text-black">
              About <span className="bg-yellow-300 border-4 border-black px-4 py-2 inline-block shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">GenesisNet</span>
            </h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Left Column - About Text */}
            <div className="space-y-6">
              <div className="bg-lime-300 border-4 border-black rounded-lg p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <p className="text-black font-bold text-lg leading-relaxed">
                  GenesisNet represents the next evolution in data 
                  marketplaces, leveraging the Internet Computer Protocol 
                  to create a truly decentralized, secure, and efficient 
                  marketplace for data exchange.
                </p>
              </div>

              <div className="space-y-4">
                {aboutFeatures.map((feature, index) => (
                  <div key={index} className={`${feature.bgColor} border-4 border-black rounded-lg p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-2 hover:translate-y-2 hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all`}>
                    <h4 className="text-lg font-black text-black mb-2">{feature.title}</h4>
                    <p className="text-black font-bold">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column - Network Statistics */}
            <div className="bg-purple-300 border-4 border-black rounded-lg p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <h3 className="text-2xl font-black text-black mb-8 text-center">Network Statistics</h3>
              <div className="grid grid-cols-2 gap-6">
                {networkStats.map((stat, index) => (
                  <div key={index} className="bg-white border-4 border-black rounded-lg p-6 text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <div className="text-2xl md:text-3xl font-black text-purple-600 mb-2">
                      {stat.number}
                    </div>
                    <div className="text-black font-bold text-sm">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="relative z-10 py-20 px-6 lg:px-12 bg-purple-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-black mb-6 text-black">
              Trusted by Leaders
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className={`${testimonial.bgColor} border-4 border-black rounded-lg p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-2 hover:translate-y-2 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-300`}>
                <div className="text-2xl font-black text-black mb-4">{testimonial.rating}</div>
                <p className="text-black font-bold mb-6 text-lg leading-relaxed">"{testimonial.text}"</p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-white border-4 border-black rounded-full flex items-center justify-center mr-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <User className="w-6 h-6 text-black" />
                  </div>
                  <div>
                    <div className="font-black text-black">{testimonial.author}</div>
                    <div className="font-bold text-black text-sm">{testimonial.title}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section id="usecases" className="relative z-10 py-20 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-black mb-6 text-black">
              Use Cases
            </h2>
            <div className="bg-pink-300 border-4 border-black rounded-lg p-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] max-w-3xl mx-auto">
              <p className="text-lg font-bold text-black">
                Discover how GenesisNet powers diverse industries and applications
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {useCases.map((useCase, index) => (
              <div key={index} className={`${useCase.bgColor} border-4 border-black rounded-lg p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-2 hover:translate-y-2 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-300`}>
                <div className="bg-white border-4 border-black rounded-lg p-4 w-fit mb-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  {useCase.icon}
                </div>
                <h3 className="text-xl font-black mb-3 text-black">{useCase.title}</h3>
                <p className="text-black font-bold">{useCase.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-20 px-6 lg:px-12 bg-gradient-to-br from-purple-200 to-pink-200">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-12">
            <h2 className="text-3xl md:text-5xl font-black mb-6 text-black">
              Ready to Transform Your Data?
            </h2>
            
            <div className="bg-white border-4 border-black rounded-lg p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mb-8">
              <p className="text-lg font-bold text-black">
                Join thousands of data providers and consumers on the world's most advanced 
                decentralized data marketplace.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <button 
                onClick={onEnterDashboard}
                className="group inline-flex items-center px-12 py-5 bg-lime-300 border-4 border-black rounded-lg font-black text-xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-2 hover:translate-y-2 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
              >
                Get Started Now
                <ArrowRight className="w-6 h-6 ml-3 transform group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button className="flex items-center px-12 py-5 bg-yellow-300 border-4 border-black rounded-lg font-black text-xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-2 hover:translate-y-2 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all">
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="about" className="relative z-10 bg-black text-white py-6 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-sm text-gray-400 font-bold">
            © 2024 GenesisNet
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
