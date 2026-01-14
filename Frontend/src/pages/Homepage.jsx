import {
  ArrowRight,
  PlayCircle,
  CheckCircle,
  BookOpen,
  Award,
  Mic,
  ChevronRight,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useState } from "react";
import TestimonialsSection from "../components/Testimonial";
import Feature from "../components/Features";
import Footer from "../components/Footers";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-grow">
        {/* Hero Section */}
        <section id="home">
          {" "}
          <HeroSection />{" "}
        </section>

        {/* Features Section */}
        <section id="features">
          <FeaturesSection />{" "}
        </section>

        {/* FAQs */}
        <section id="faqs">
          {" "}
          <FAQSection />{" "}
        </section>

        {/* Testimonials */}
        <section id="testimonials">
          {" "}
          <TestimonialsSection />{" "}
        </section>

        {/* CTA Section */}
        <section id="ctasection">
          {" "}
          <CTASection />{" "}
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

// Hero Section Component
const HeroSection = () => {
  const navigate = useNavigate();
  return (
    <section className="bg-gradient-to-br from-blue-900 via-indigo-600 to-blue-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="py-12 md:py-20 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 md:pr-8 mb-10 md:mb-0">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Ace Your Next Interview
            </h1>
            <p className="text-lg md:text-xl text-blue-100 mb-8">
              Practice with AI-powered mock interviews tailored to your industry
              and role. Get immediate feedback and improve your skills.
            </p>
            <div className="flex flex-wrap gap-4">
              <button
                className="bg-white text-blue-800 hover:bg-blue-50 px-6 py-3 rounded-full font-bold shadow-lg transition flex items-center hover:cursor-pointer"
                onClick={() => navigate("/get-started")}
              >
                Start Practicing <ArrowRight className="ml-2 h-5 w-5" />
              </button>
              
              <a href="https://www.youtube.com/watch?v=DCXWA5oSea0" target="_blank" className="bg-transparent border-2 border-white text-white hover:bg-white/10 px-6 py-3 rounded-full font-bold transition flex items-center hover:cursor-pointer">
                Watch Demo <PlayCircle className="ml-2 h-5 w-5" />
              </a>
            </div>
          </div>
          <div className="md:w-1/2">
            <div className="relative">
              <div className="bg-white p-6 rounded-xl shadow-xl">
                <div className="flex items-center mb-4">
                  <div className="h-3 w-3 rounded-full bg-red-500 mr-2"></div>
                  <div className="h-3 w-3 rounded-full bg-yellow-500 mr-2"></div>
                  <div className="h-3 w-3 rounded-full bg-green-500 mr-2"></div>
                  <div className="ml-2 text-gray-400 text-sm">
                    Mock Interview Session
                  </div>
                </div>
                <div className="bg-gray-100 rounded-lg p-4 mb-4">
                  <p className="text-gray-800 font-medium">Interviewer AI:</p>
                  <p className="text-gray-600">
                    Can you describe a challenging project you've worked on and
                    how you overcame obstacles?
                  </p>
                </div>
                <div className="bg-blue-100 rounded-lg p-4 mb-4">
                  <p className="text-blue-800 font-medium">Your Response:</p>
                  <p className="text-blue-700">
                    I led a team that had to deliver a key feature under tight
                    deadlines...
                  </p>
                </div>
                <div className="bg-green-100 rounded-lg p-4">
                  <p className="text-green-800 font-medium">Feedback:</p>
                  <div className="flex items-start mb-2">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
                    <p className="text-green-700">
                      Good real-world example with context
                    </p>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
                    <p className="text-green-700">
                      Try including specific metrics of success
                    </p>
                  </div>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 -bottom-4 -left-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl -z-10"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Banner */}
      <div className="bg-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-3xl font-bold text-blue-700">10,000+</p>
              <p className="text-gray-600">Interview Questions</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-blue-700">250+</p>
              <p className="text-gray-600">Job Roles</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-blue-700">98%</p>
              <p className="text-gray-600">Success Rate</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-blue-700">24/7</p>
              <p className="text-gray-600">Availability</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Features Section Component
const FeaturesSection = () => {
  const features = [
    {
      icon: <Mic className="h-8 w-8 text-blue-600" />,
      title: "Realistic Interviews",
      description:
        "Experience industry-specific interviews that mimic real-world scenarios with challenging questions.",
    },
    {
      icon: <BookOpen className="h-8 w-8 text-blue-600" />,
      title: "Comprehensive Feedback",
      description:
        "Receive detailed feedback on your answers, communication skills, and areas for improvement.",
    },
    {
      icon: <Award className="h-8 w-8 text-blue-600" />,
      title: "Skill Development",
      description:
        "Track your progress over time and focus on developing the specific skills employers are looking for.",
    },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            How InterviewWhiz Works
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Our platform uses advanced AI to help you practice and improve your
            interview skills
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Feature key={index} feature={feature} />
          ))}
        </div>

      </div>
    </section>
  );
};
// FAQ's Section Component
const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqs = [
    {
      question: "How does AI-powered mock interviewing work?",
      answer:
        "Our AI asks industry-specific questions, analyzes your responses, and provides real-time feedback to help you improve.",
    },
    {
      question: "Is this platform free to use?",
      answer:
        "We offer both free and premium plans. The free plan includes basic mock interviews, while the premium plan unlocks advanced features and analytics.",
    },
    {
      question: "Can I practice for different industries?",
      answer:
        "Yes! Our AI adapts to multiple industries and roles, including software development, finance, marketing, and more.",
    },
    {
      question: "How can I track my progress?",
      answer:
        "Your progress is saved in your dashboard, where you can review past interviews, feedback, and improvement suggestions.",
    },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Here are some common questions about our platform and how it works.
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white shadow-md rounded-lg overflow-hidden"
            >
              <button
                className="w-full text-left flex justify-between items-center p-5 font-medium text-gray-800 bg-white hover:bg-gray-100"
                onClick={() => toggleFAQ(index)}
              >
                {faq.question}
                {openIndex === index ? (
                  <ChevronUp className="h-5 w-5 text-gray-600" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-600" />
                )}
              </button>
              {openIndex === index && (
                <div className="p-5 text-gray-700 bg-gray-50 border-t">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// CTA Section Component
const CTASection = () => {
  const navigate=useNavigate();
  return (
    <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="mb-8 md:mb-0 md:mr-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to ace your next interview?
            </h2>
            <p className="text-lg text-blue-100">
              Start practicing today and get personalized feedback to improve
              your skills.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={()=>{navigate('/get-started')}}
              className="bg-white text-blue-700 hover:cursor-pointer hover:bg-blue-50 px-8 py-3 rounded-full font-bold shadow-lg transition flex items-center justify-center">
              Get Started Now <ArrowRight className="ml-2 h-5 w-5" />
            </button>
            <a href="https://www.youtube.com/watch?v=DCXWA5oSea0" target="_blank" className="bg-transparent border-2 border-white text-white hover:bg-white/10 px-6 py-3 rounded-full font-bold transition flex items-center hover:cursor-pointer">
              Watch Demo <PlayCircle className="ml-2 h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

// Footer Component

export default HomePage;
