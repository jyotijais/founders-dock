import React, { useState, useEffect } from 'react';
import { Upload, Users, Eye, TrendingUp, MessageSquare, Plus, Search, Mail, Star, MapPin } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getAllPitches, deletePitch } from '../../api/api.js';
import { useNavigate } from 'react-router-dom';
import { getMe } from '../../api/api.js';

const GlassPanel = ({ children, className = "" }) => (
    <div className={`bg-white/[0.1] backdrop-blur-xl border border-white/[0.2] rounded-2xl shadow-lg ${className}`}>
        {children}
    </div>
);

const FounderDashboard = () => {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('overview');
    const [pitches, setPitches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [showProjectModal, setShowProjectModal] = useState(false);
    const [pitchDeck, setPitchDeck] = useState(null);

    const collaborators = [
        {
            id: 1,
            name: "Sarah Chen",
            role: "Frontend Developer",
            skills: ["React", "TypeScript", "Tailwind"],
            experience: "3 years",
            rating: 4.8,
            location: "Remote",
            rate: "$50/hr",
            available: true
        },
        {
            id: 2,
            name: "Mike Rodriguez",
            role: "Backend Developer",
            skills: ["Node.js", "Firebase", "Python"],
            experience: "5 years",
            rating: 4.9,
            location: "New York",
            rate: "$75/hr",
            available: false
        },
        {
            id: 3,
            name: "Emma Wilson",
            role: "UI/UX Designer",
            skills: ["Figma", "Adobe XD", "Prototyping"],
            experience: "4 years",
            rating: 4.7,
            location: "London",
            rate: "$60/hr",
            available: true
        }
    ];

    const investors = [
        {
            id: 1,
            name: "TechVenture Capital",
            contact: "john.smith@techvc.com",
            focus: "Seed to Series A",
            checkSize: "$100k - $2M",
            viewCount: 3,
            status: "Interested",
            lastViewed: "2 hours ago"
        },
        {
            id: 2,
            name: "Innovation Partner",
            contact: "sarah.dev@innovp.com",
            focus: "Seed",
            checkSize: "$50k - $500k",
            viewCount: 1,
            status: "Reviewing",
            lastViewed: "1 day ago"
        },
        {
            id: 3,
            name: "Digital Growth Fund",
            contact: "mike.brown@dgfund.com",
            focus: "Pre-seed to Seed",
            checkSize: "$25k - $250k",
            viewCount: 5,
            status: "Very Interested",
            lastViewed: "3 hours ago"
        }
    ];

    useEffect(() => {
        const checkRole = async() => {
            try {
                const {user} = await getMe();
                if(!user || user.role !== 'founder'){
                    navigate('/investorDashboard');
                }
            } catch(error){
                console.error('Role check failed: ', error);
                navigate('/login');
            }
        }
        if(currentUser) checkRole();
    },[currentUser]);

    useEffect(() => {
        
        const fetchMyPitches = async () => {
            try {
                const data = await getAllPitches();
                const myPitches = data.pitches.filter(
                    pitch => pitch.firebase_uid === currentUser?.uid
                );
                setPitches(myPitches);
            } catch (error) {
                console.error('Error fetching pitches:', error);
            } finally {
                setLoading(false);
            }
        };
        if (currentUser) fetchMyPitches();
    }, [currentUser]);

    const handleDelete = async (id) => {
        try {
            await deletePitch(id);
            setPitches(pitches.filter(pitch => pitch.id !== id));
        } catch (error) {
            console.error('Error deleting pitch:', error);
        }
    };

    const handleFileUpload = () => {
        setPitchDeck({ name: 'Pitch_Deck.pdf', size: '2MB', uploadDate: new Date().toLocaleDateString() });
        setShowUploadModal(false);
    };

    const filteredCollaborators = collaborators.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.role.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen text-white"
            style={{ background: 'linear-gradient(to bottom, rgb(3, 7, 18), rgb(0, 0, 0))' }}>

            {/* Header */}
            <div className="border-b border-white/[0.1] px-6 py-4">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                            FoundersDock 🚀
                        </h1>
                        <p className="text-gray-400 text-sm">
                            Welcome back, {currentUser?.displayName || currentUser?.email?.split('@')[0]}!
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="p-2 text-gray-400 hover:text-white relative">
                            🔔
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">2</span>
                        </button>
                        <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center text-white font-medium">
                            {currentUser?.displayName?.[0] || currentUser?.email?.[0]?.toUpperCase()}
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="border-b border-white/[0.1] px-6">
                <div className="max-w-7xl mx-auto flex space-x-8">
                    {[
                        { id: 'overview', label: 'Overview' },
                        { id: 'pitches', label: 'My Pitches' },
                        { id: 'pitch', label: 'Pitch Deck' },
                        { id: 'collaboration', label: 'Find Techies' },
                        { id: 'investors', label: 'Investors' },
                        { id: 'messages', label: 'Messages' },
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                                activeTab === tab.id
                                    ? 'border-cyan-400 text-cyan-400'
                                    : 'border-transparent text-gray-400 hover:text-white'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto p-6">

                {/* Overview Tab */}
                {activeTab === 'overview' && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <GlassPanel className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-400">My Pitches</p>
                                        <p className="text-2xl font-bold text-white">{pitches.length}</p>
                                        <p className="text-sm text-cyan-400">Active pitches</p>
                                    </div>
                                    <Eye className="w-8 h-8 text-cyan-400" />
                                </div>
                            </GlassPanel>
                            <GlassPanel className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-400">Investor Interest</p>
                                        <p className="text-2xl font-bold text-white">0</p>
                                        <p className="text-sm text-cyan-400">Coming soon</p>
                                    </div>
                                    <TrendingUp className="w-8 h-8 text-green-400" />
                                </div>
                            </GlassPanel>
                            <GlassPanel className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-400">Collaborators</p>
                                        <p className="text-2xl font-bold text-white">0</p>
                                        <p className="text-sm text-cyan-400">Coming soon</p>
                                    </div>
                                    <Users className="w-8 h-8 text-purple-400" />
                                </div>
                            </GlassPanel>
                            <GlassPanel className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-400">Messages</p>
                                        <p className="text-2xl font-bold text-white">0</p>
                                        <p className="text-sm text-cyan-400">Coming soon</p>
                                    </div>
                                    <MessageSquare className="w-8 h-8 text-orange-400" />
                                </div>
                            </GlassPanel>
                        </div>

                        <GlassPanel className="p-6">
                            <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <button
                                    onClick={() => navigate('/post')}
                                    className="flex items-center justify-center p-6 border-2 border-dashed border-white/[0.2] rounded-xl hover:border-cyan-400 hover:bg-white/[0.05] transition-colors"
                                >
                                    <Plus className="w-6 h-6 mr-3 text-cyan-400" />
                                    <span className="text-white font-medium">Post New Pitch</span>
                                </button>
                                <button
                                    onClick={() => setShowUploadModal(true)}
                                    className="flex items-center justify-center p-6 border-2 border-dashed border-white/[0.2] rounded-xl hover:border-cyan-400 hover:bg-white/[0.05] transition-colors"
                                >
                                    <Upload className="w-6 h-6 mr-3 text-cyan-400" />
                                    <span className="text-white font-medium">Upload Pitch Deck</span>
                                </button>
                            </div>
                        </GlassPanel>
                    </div>
                )}

                {/* My Pitches Tab */}
                {activeTab === 'pitches' && (
                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-semibold text-white">My Pitches</h3>
                            <button
                                onClick={() => navigate('/post')}
                                className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:opacity-90"
                            >
                                <Plus className="w-4 h-4" />
                                New Pitch
                            </button>
                        </div>

                        {loading && <p className="text-gray-400">Loading pitches...</p>}

                        {!loading && pitches.length === 0 && (
                            <GlassPanel className="p-12 text-center">
                                <p className="text-gray-400 text-lg mb-4">You haven't posted any pitches yet</p>
                                <button
                                    onClick={() => navigate('/post')}
                                    className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-6 py-3 rounded-lg"
                                >
                                    Post Your First Pitch
                                </button>
                            </GlassPanel>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {pitches.map(pitch => (
                                <GlassPanel key={pitch.id} className="p-6">
                                    <h3 className="text-xl font-semibold text-white mb-2">{pitch.title}</h3>
                                    {pitch.industry && (
                                        <span className="px-2 py-1 bg-cyan-500/[0.2] text-cyan-300 rounded-full text-xs">
                                            {pitch.industry}
                                        </span>
                                    )}
                                    <p className="text-gray-400 text-sm mt-3 line-clamp-3">{pitch.description}</p>
                                    <div className="flex gap-2 mt-4">
                                        {pitch.tags && pitch.tags.map((tag, i) => (
                                            <span key={i} className="px-2 py-1 bg-white/[0.1] text-gray-300 rounded text-xs">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                    <div className="flex gap-2 mt-4">
                                        <button
                                            onClick={() => navigate(`/edit/${pitch.id}`)}
                                            className="flex-1 bg-white/[0.1] text-white py-2 rounded-lg hover:bg-white/[0.2] text-sm"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(pitch.id)}
                                            className="flex-1 bg-red-500/[0.2] text-red-400 py-2 rounded-lg hover:bg-red-500/[0.3] text-sm"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </GlassPanel>
                            ))}
                        </div>
                    </div>
                )}

                {/* Pitch Deck Tab */}
                {activeTab === 'pitch' && (
                    <GlassPanel className="p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-semibold text-white">Pitch Deck Management</h3>
                            <button
                                onClick={() => setShowUploadModal(true)}
                                className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                            >
                                <Upload className="w-4 h-4" />
                                {pitchDeck ? 'Replace Deck' : 'Upload Deck'}
                            </button>
                        </div>
                        {pitchDeck ? (
                            <div className="border border-white/[0.2] rounded-xl p-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-cyan-500/[0.2] rounded-lg flex items-center justify-center text-2xl">📄</div>
                                        <div>
                                            <h4 className="font-medium text-white">{pitchDeck.name}</h4>
                                            <p className="text-sm text-gray-400">{pitchDeck.size} • Uploaded {pitchDeck.uploadDate}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button className="px-3 py-1 text-cyan-400 hover:bg-white/[0.1] rounded">Download</button>
                                        <button className="px-3 py-1 text-red-400 hover:bg-red-500/[0.1] rounded">Delete</button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="border-2 border-dashed border-white/[0.2] rounded-xl p-12 text-center">
                                <div className="text-4xl mb-4">📊</div>
                                <h4 className="text-lg font-medium text-white mb-2">Upload Your Pitch Deck</h4>
                                <p className="text-gray-400 mb-4">Share your vision with potential investors</p>
                                <button
                                    onClick={() => setShowUploadModal(true)}
                                    className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-6 py-3 rounded-lg"
                                >
                                    Upload Pitch Deck
                                </button>
                            </div>
                        )}
                    </GlassPanel>
                )}

                {/* Find Techies Tab */}
                {activeTab === 'collaboration' && (
                    <div className="space-y-6">
                        <GlassPanel className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-semibold text-white">Find Techies for Collaboration</h3>
                                <button
                                    onClick={() => setShowProjectModal(true)}
                                    className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                                >
                                    <Plus className="w-4 h-4" />
                                    Post Project
                                </button>
                            </div>
                            <div className="mb-6 relative">
                                <Search className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search by name or role..."
                                    className="w-full pl-10 pr-4 py-2 bg-white/[0.1] border border-white/[0.2] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredCollaborators.map(collaborator => (
                                    <div key={collaborator.id} className="border border-white/[0.2] rounded-xl p-6 hover:bg-white/[0.05] transition">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center text-white font-medium">
                                                    {collaborator.name.split(' ').map(n => n[0]).join('')}
                                                </div>
                                                <div>
                                                    <h4 className="font-medium text-white">{collaborator.name}</h4>
                                                    <p className="text-sm text-gray-400">{collaborator.role}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Star className="w-4 h-4 text-yellow-400" />
                                                <span className="text-sm text-gray-400">{collaborator.rating}</span>
                                            </div>
                                        </div>
                                        <div className="flex flex-wrap gap-2 mb-3">
                                            {collaborator.skills.map(skill => (
                                                <span key={skill} className="px-2 py-1 bg-cyan-500/[0.2] text-cyan-300 text-xs rounded">
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                        <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                                            <div className="flex items-center gap-1">
                                                <MapPin className="w-4 h-4" />
                                                {collaborator.location}
                                            </div>
                                            <span className={`px-2 py-1 rounded text-xs ${collaborator.available ? 'bg-green-500/[0.2] text-green-400' : 'bg-gray-500/[0.2] text-gray-400'}`}>
                                                {collaborator.available ? 'Available' : 'Busy'}
                                            </span>
                                        </div>
                                        <div className="flex gap-2">
                                            <button className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-2 rounded-lg text-sm">Contact</button>
                                            <button className="px-4 py-2 border border-white/[0.2] text-white rounded-lg text-sm hover:bg-white/[0.05]">Profile</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </GlassPanel>
                    </div>
                )}

                {/* Investors Tab */}
                {activeTab === 'investors' && (
                    <GlassPanel className="p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-semibold text-white">Investor Tracking</h3>
                            <button className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-4 py-2 rounded-lg">
                                Find Investors
                            </button>
                        </div>
                        <div className="space-y-4">
                            {investors.map(investor => (
                                <div key={investor.id} className="border border-white/[0.2] rounded-xl p-6">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-3">
                                                <h4 className="font-semibold text-white text-lg">{investor.name}</h4>
                                                <span className={`px-3 py-1 text-sm rounded-full ${
                                                    investor.status === 'Very Interested' ? 'bg-green-500/[0.2] text-green-400' :
                                                    investor.status === 'Interested' ? 'bg-cyan-500/[0.2] text-cyan-400' :
                                                    'bg-yellow-500/[0.2] text-yellow-400'
                                                }`}>
                                                    {investor.status}
                                                </span>
                                            </div>
                                            <div className="grid grid-cols-3 gap-4 text-sm mb-3">
                                                <div>
                                                    <p className="text-gray-400">Focus</p>
                                                    <p className="text-white">{investor.focus}</p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-400">Check Size</p>
                                                    <p className="text-white">{investor.checkSize}</p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-400">Contact</p>
                                                    <p className="text-white">{investor.contact}</p>
                                                </div>
                                            </div>
                                            <p className="text-sm text-gray-400">👁 Viewed {investor.viewCount} times • Last viewed {investor.lastViewed}</p>
                                        </div>
                                        <div className="flex gap-2 ml-4">
                                            <button className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm">
                                                <Mail className="w-4 h-4" />
                                                Contact
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </GlassPanel>
                )}

                {/* Messages Tab */}
                {activeTab === 'messages' && (
                    <GlassPanel className="p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-semibold text-white">Messages</h3>
                            <button className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-4 py-2 rounded-lg">
                                Compose
                            </button>
                        </div>
                        <div className="space-y-3">
                            <div className="border-l-4 border-cyan-400 bg-white/[0.05] p-4 rounded-r-xl">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="font-medium text-white">john.smith@techvc.com</p>
                                        <p className="text-sm text-gray-400 mt-1">Follow-up on your pitch</p>
                                        <p className="text-gray-300 mt-2 text-sm">Hi, I reviewed your pitch deck and I'm impressed...</p>
                                    </div>
                                    <span className="text-sm text-gray-400">2h ago</span>
                                </div>
                            </div>
                        </div>
                    </GlassPanel>
                )}
            </div>

            {/* Upload Modal */}
            {showUploadModal && (
                <div className="fixed inset-0 bg-black/[0.7] flex items-center justify-center z-50">
                    <GlassPanel className="p-6 w-full max-w-md mx-4">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-white">Upload Pitch Deck</h3>
                            <button onClick={() => setShowUploadModal(false)} className="text-gray-400 hover:text-white">✕</button>
                        </div>
                        <div
                            className="border-2 border-dashed border-white/[0.2] rounded-xl p-8 text-center cursor-pointer hover:border-cyan-400 transition"
                            onClick={handleFileUpload}
                        >
                            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-400 mb-2">Click to upload your pitch deck</p>
                            <p className="text-sm text-gray-500">PDF, PowerPoint up to 50MB</p>
                        </div>
                        <button
                            onClick={handleFileUpload}
                            className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-3 rounded-lg mt-4"
                        >
                            Upload File
                        </button>
                    </GlassPanel>
                </div>
            )}

            {/* Project Modal */}
            {showProjectModal && (
                <div className="fixed inset-0 bg-black/[0.7] flex items-center justify-center z-50">
                    <GlassPanel className="p-6 w-full max-w-lg mx-4">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-white">Post New Project</h3>
                            <button onClick={() => setShowProjectModal(false)} className="text-gray-400 hover:text-white">✕</button>
                        </div>
                        <div className="space-y-4">
                            <input type="text" placeholder="Project Title" className="w-full p-3 bg-white/[0.1] border border-white/[0.2] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400" />
                            <textarea placeholder="Project Description" className="w-full p-3 bg-white/[0.1] border border-white/[0.2] rounded-lg text-white placeholder-gray-400 h-24 focus:outline-none focus:border-cyan-400" />
                            <input type="text" placeholder="Required Skills (e.g. React, Node.js)" className="w-full p-3 bg-white/[0.1] border border-white/[0.2] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400" />
                            <div className="grid grid-cols-2 gap-4">
                                <input type="text" placeholder="Budget Range" className="w-full p-3 bg-white/[0.1] border border-white/[0.2] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400" />
                                <input type="text" placeholder="Duration" className="w-full p-3 bg-white/[0.1] border border-white/[0.2] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400" />
                            </div>
                            <button
                                onClick={() => setShowProjectModal(false)}
                                className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-3 rounded-lg"
                            >
                                Post Project
                            </button>
                        </div>
                    </GlassPanel>
                </div>
            )}
        </div>
    );
};

export default FounderDashboard;