import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Landing = () => {
  return (
    <>
    <section className="bg-gradient-to-b from-white to-blue-50 min-h-screen flex items-center justify-center px-6">
      <div className="max-w-4xl text-center">
        <motion.h1
          className="text-4xl sm:text-5xl font-extrabold text-blue-900 leading-tight mb-6"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          FoundersDock 🚀 <br />
          <span className="text-blue-600">Pitch. Connect. Launch.</span>
        </motion.h1>

        <motion.p
          className="text-lg text-gray-600 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Showcase your startup ideas, attract clients and investors, and connect with the future of innovation.
        </motion.p>

        <motion.div
          className="flex gap-4 justify-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7 }}
        >
          <Link
            to="/explore"
            className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition"
          >
            Explore Startups
          </Link>
          <Link
            to="/post"
            className="border border-blue-600 text-blue-600 px-6 py-3 rounded hover:bg-blue-100 transition"
          >
            Post Your Idea
          </Link>
        </motion.div>
      </div>
    </section>

    <motion.section
        className="py-16 bg-white"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        >
        <div className="max-w-5xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold text-blue-900 mb-10">How FoundersDock Works</h2>
        <div className="grid md:grid-cols-3 gap-8 text-left">
            <div className="p-6 bg-blue-50 rounded shadow hover:shadow-md transition">
            <h3 className="text-xl font-semibold mb-2 text-blue-700">1. Post Your Pitch</h3>
            <p className="text-gray-600">
                Share your startup idea with a short pitch, problem statement, and market value.
            </p>
            </div>
            <div className="p-6 bg-blue-50 rounded shadow hover:shadow-md transition">
            <h3 className="text-xl font-semibold mb-2 text-blue-700">2. Gain Visibility</h3>
            <p className="text-gray-600">
                Investors and clients can browse, search, and save your startup profile.
            </p>
            </div>
            <div className="p-6 bg-blue-50 rounded shadow hover:shadow-md transition">
            <h3 className="text-xl font-semibold mb-2 text-blue-700">3. Connect & Grow</h3>
            <p className="text-gray-600">
                Build partnerships, close deals, or get funding directly through our platform.
            </p>
            </div>
        </div>
        </div>
        </motion.section>
    </>
  );
};

export default Landing;
