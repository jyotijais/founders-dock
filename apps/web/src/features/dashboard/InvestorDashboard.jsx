import React, {useState, useEffect } from 'react';
import {Search, MapPin, DollarSign, Users, Clock, Star, Eye, MessageCircle } from 'lucide-react';
import { getAllPitches } from '../../api/api.js';
import { useNavigate } from 'react-router-dom';

const GlassPanel = ({children, className = ""}) => (
    <div className={`bg-white/[0.1] backdrop-blur-xl border border-white/[0.2] rounded-2xl shadow-lg ${className}`}>
        {children}
    </div>
)

const InvestorDashboard = () => {
    const [pitches, setPitches] = useState([]);
    const [filteredPitches, setFilteredPitches] = useState([]);
    const [filters, setFilters] = useState({
        industry: '',
        stage: '',
        location: '',
        fundingRange: '',
        searchTerm: ''
    });
    const [savedPitches, setSavedPitches] = useState(new Set());
    const [loading , setLoading ] = useState(true);
    const navigate = useNavigate();

    //Fetch real pitches from postgreSQL database
    useEffect(() => {
        const fetchPitches = async () => {
            try {
                const data = await getAllPitches();
                setPitches(data.pitches);
                setFilteredPitches(data.pitches);
            }
            catch (error) {
                console.error('Error fetching pitches:', error);
            }
            finally {
                setLoading(false);
            }
        };
        fetchPitches();
    }, []);

    //Filter Logic
    useEffect(() => {
        let filtered = pitches.filter(pitch => {
            const matchesSearch = pitch.title?.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
                pitch.description?.toLowerCase().includes(filters.searchTerm.toLowerCase());
            const matchesIndustry = !filters.industry || pitch.industry === filters.industry;
            const matchesStage = !filters.stage || pitch.stage === filters.stage;
            const matchesLocation = !filters.location || pitch.location === filters.location;

            return matchesSearch && matchesIndustry && matchesStage && matchesLocation;
        });
        setFilteredPitches(filtered);

    }, [filters, pitches]);

    const handleSavePitch = (pitchId) => {
        const newSaved = new Set(savedPitches);
        if(newSaved.has(pitchId)) {
            newSaved.delete(pitchId);
        }
        else {
            newSaved.add(pitchId);
        }
        setSavedPitches(newSaved);

    };

    const PitchCard = ({pitch}) => (
        <GlassPanel className="p-6 hover:bg-white/[0.15] transition-all duration-300">
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                    <div className="text-2xl">🚀</div>
                    <div>
                        <h3 className="text-xl font-semibold text-white">{pitch.title}</h3>
                        <p className="text-gray-300">{pitch.industry}</p>
                    </div>
                </div>
                <button
                 onClick={() => handleSavePitch(pitch.id)}
                 className={`p-2 rounded-full transition-colors ${savedPitches.has(pitch.id) ? 'bg-yellow-500 text-white' : 'bg-white/[0.1] text-gray-300 hover:bg-white/[0.2]'}`}>
                    <Star size={16} />
                </button>
            </div>

            <p className="text-gray-300 mb-4 leading-relaxed">{pitch.description}</p>

            <div className="flex flex-wrap gap-2 mb-4">
                {pitch.tags && pitch.tags.map((tag, index) => (
                    <span key={index} className="px-3 py-1 bg-cyan-500/[0.2] text-cyan-300 rounded-full text-xs font-medium">
                        {tag}
                    </span>
                ))}
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                    <MapPin size={14} />
                    {pitch.location || 'Remote'}
                </div>
                <div className="flex items-center gap-2">
                    <DollarSign size={14} />
                    ${pitch.funding_goal || 'Undisclosed'}
                </div>
                <div className="flex items-center gap-2">
                    <Users size={14} />
                    {pitch.team_size ? `${pitch.team_size} members`: 'N/A'}
                </div>
                <div className="flex items-center gap-2">
                    <Clock size ={14} />
                    {pitch.stage || 'N/A'}
                </div>
            </div>

            <div className="flex gap-2">
                <button
                    onClick={() => navigate(`/pitch/${pitch.id}`)} 
                    className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-4 py-2 rounded-lg hover:scale-105 transition-transform flex items-center justify-center gap-2 font-medium">
                    <Eye size={16} />
                    View Details
                </button>
                <button className="flex-1 bg-white/[0.1] text-white px-4 py-2 rounded-lg hover:bg-white/[0.2] transition-colors flex items-center justify-center gap-2 font-medium">
                    <MessageCircle size={16} />
                    Contact
                </button>
            </div>
        </GlassPanel>
    );
    return (
        <div className="min-h-screen text-white"
            style={{background: 'linear-gradient(to bottom, rgb(3, 7, 18), rgb(0, 0, 0) )'}}>
            <div className="max-w-7xl mx-auto p-6">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Investment Opportunities</h1>
                    <p className="text-gray-400">Discover promising startups looking for funding</p>
                </div>
                {/* Filters Section */}
                <GlassPanel className="p-6 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        {/* Search */}
                        <div className="relative">
                            <Search className="absolute left-3 top-3 text-gray-400" size={16}/>
                            <input 
                                type="text"
                                placeholder="Search startups..."
                                className="w-full pl-10 pr-4 py-2 bg-white/[0.1] border border-white/[0.2] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400"
                                value={filters.searchTerm}
                                onChange={(e) => setFilters({...filters, searchTerm: e.target.value})}
                            />
                        </div>

                        {/* Industry Filter */}
                        <select
                            className="px-4 py-2 bg-white/[0.1] border border-white/[0.2] rounded-lg text-white focus:outline-none focus:border-cyan-400"
                            value={filters.industry}
                            onChange={(e) => setFilters({...filters, industry: e.target.value})}>
                            <option value="" className="bg-gray-800">All Industries</option>
                            <option value="FinTech" className="bg-gray-800">FinTech</option>
                            <option value="HealthTech" className="bg-gray-800">HealthTech</option>
                            <option value="EdTech" className="bg-gray-800">EdTech</option>
                            <option value="E-commerce" className="bg-gray-800">E-commerce</option>
                        </select>

                        {/* Stage Filter */}
                        <select
                            className="px-4 py-2 bg-white/[0.1] border border-white/[0.2] rounded-lg text-white focus:outline-none focus:border-cyan-400"
                            value={filters.stage}
                            onChange={(e) => setFilters({...filters, stage: e.target.value})}
                        >
                            <option value="" className="bg-gray-800">All Stages</option>
                            <option value="Pre-Seed" className="bg-gray-800">Pre-Seed</option>
                            <option value="Seed" className="bg-gray-800">Seed</option>
                            <option value="Series A" className="bg-gray-800">Series A</option>
                        </select>

                        {/* Location Filter */}
                        <input 
                            type="text"
                            placeholder="Location"
                            className="px-4 py-2 bg-white/[0.1] border border-white/[0.2] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400"
                            value={filters.location}
                            onChange={(e) => setFilters({...filters, location: e.target.value})}
                        />

                        {/* Funding Range */}
                        <select
                            className="px-4 py-2 bg-white/[0.1] border border-white/[0.2] rounded-lg text-white focus:outline-none focus:border-cyan-400"
                            value={filters.fundingRange}
                            onChange={(e) => setFilters({...filters, fundingRange: e.target.value})}
                        >
                            <option value="" className="bg-gray-800">Funding Range</option>
                            <option value="0-100K" className="bg-gray-800">$0 - $100K</option>
                            <option value="100K-500K" className="bg-gray-800">$100K - $500K</option>
                            <option value="500K-1M" className="bg-gray-800">$500K - 1M</option>
                            <option value="1M+" className="bg-gray-800">$1M+</option>
                        </select>
                    </div>
                </GlassPanel>
                {/* Result Count */}
                <div className="mb-6">
                    <p className="text-gray-400">
                        Showing {filteredPitches.length} of {pitches.length} startups
                    </p>
                </div>

                {/* Pitches Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredPitches.map(pitch => (
                        <PitchCard key={pitch.id} pitch={pitch}/>
                    ))}
                </div>

                {filteredPitches.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-400 text-lg mb-4">No startups match your current filters</p>
                        <button 
                        onClick={() => setFilters({industry: '', stage: '', location: '', fundingRange: '', searchTerm: ''})}
                        className="mt-4 text-cyan-400 hover:underline font-medium">
                            Clear all filters
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
export default InvestorDashboard;