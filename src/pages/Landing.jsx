import React from 'react';
import {motion} from 'framer-motion';
import {Button } from  '../components/ui/button.jsx';
import {Lightbulb, Users, ShieldCheck} from 'lucide-react';
import {useNavigate} from 'react-router-dom';

const glassPanel = "bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-lg p-8";

const HeroSection = () => (
    <section className="w-full h-screen bg-[#0a0f1c] flex items-center justify-center px-8">
        <div className={`${glassPanel} max-w-5xl text-center space-y-6`}>
            <motion.h1
                className="text-4xl md:text-6xl font-bold text-white"
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                Where startups <span className="text-blue-400">meet capital</span>
            </motion.h1>
            <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8}}
                className="text-lg md:text-xl text-gray-200">
                A modern platform connecting ambitious founders with visionary investors. <span className="font-bold">Pitch.Connect.Accelerate.</span>
            </motion.p>
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6, duration: 0.6 }}>
            <Button className="px-6 py-3 text-white bg-blue-600 hover:bg-blue-700 text-lg rounded-xl">Pitch Your Startup</Button>
            <Button variant="outline" className="ml-4 px-6 py-3 text-blue-400 border-blue-400 hover:bg-blue-400/10 text-lg rounded-xl">Browse Investments</Button>
        </motion.div>
        </div>  
    </section>
);

const AboutSection = () => (
    <section className="bg-[#0a0f1c] py-20" id="about">
        <div className={`${glassPanel} max-w-6xl mx-auto px-6 text-center`}>
            <motion.h2
                className="text-4xl font-bold text-white mb-6"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                What is FoundersDock?
            </motion.h2>
            <motion.p 
                className="text-lg text-gray-200 leading-relaxed max-w-3xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 , duration: 0.6 }}
            >
                FoundersDock is the go-to platform for early-stage founders to pitch, showcase, and validate ideas.
                From EdTech to SaaS and AI, we connect you with investors ready to back your vision.
            </motion.p>
        </div>
    </section>
);

const HowItWorks = () => (
    <section className="bg-[#0a0f1c] py-20" id="how">
        <div className={`${glassPanel} max-w-6xl mx-auto px-6 text-center`}>
            <motion.h3
                className="text-3xl font-semibold text-white mb-12"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                How FoundersDock Works
            </motion.h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                    { icon: Users, title: "Create Profile", desc: "Set up your founder or investor profile in minutes."},
                    { icon: Lightbulb, title: "Discover & Connect", desc: "Match with opportunities or talented founders."},
                    { icon: ShieldCheck, title: "Secure Investments", desc: "Negotiate deals and close funding directly."}
                ].map((step, i) => (
                    <motion.div
                        key={i}
                        className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-lg p-6"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.2 + 0.3, duration: 0.6}}
                    >
                        <step.icon className="w-10 h-10 text-blue-400 mb-4 mx-auto" />
                        <h4 className="text-xl font-semibold mb-2 text-white">{step.title}</h4>
                        <p className="text-gray-300 text-sm">{step.desc}</p>
                    </motion.div>
                ))}
            </div>
        </div>
    </section>
);

const CTASection = () => {
    const navigate = useNavigate();

    return (
        <section className="bg-[#0a0f1c] py-20" id="cta">
        <div className={`${glassPanel} max-w-4xl mx-auto px-6 text-center space-y-6`}>
            <motion.h2
                className="text-3xl md:text-4xl font-bold text-white"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                Ready to take your startup to the next level?
            </motion.h2>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button className="px-6 py-3 text-white bg-blue-600 hover:bg-blue-700 text-lg rounded-xl">
                    Get Started
                </Button>
                <Button onClick={() => navigate('/login')} className="px-6 py-3 text-blue-400 border-blue-400 hover:bg-blue-400/10 text-lg rounded-xl">
                    Continue with Google
                </Button>
            </div>
            <p>Already have an account?{" "}
                <a href="/login" className="text-blue-400 hover:underline">Log in</a>{" "}or{" "}
                <a href="/signup" className="text-blue-400 hover:underline">Sign up</a>
            </p>
        </div>
    </section>
    )
    
}

const LandingPage = () => (
    <div className="bg-[#0a0f1c] text-white">
        <HeroSection />
        <AboutSection />
        <HowItWorks />
        <CTASection />
    </div>
)
export default LandingPage;

