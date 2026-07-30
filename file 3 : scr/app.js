import React, { useState } from 'react';
import { Camera, MapPin, Award, ShieldAlert, CheckCircle, Trash2, Upload } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('scan');
  const [points, setPoints] = useState(120);
  const [selectedImage, setSelectedImage] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [scanResult, setScanResult] = useState(null);

  const [reports, setReports] = useState([
    { id: 1, location: 'Central Park, Gate 3', status: 'Pending', time: '10 mins ago', category: 'Overflowing Bin' },
    { id: 2, location: 'Market Street, Block B', status: 'Resolved', time: '2 hours ago', category: 'E-Waste Dump' },
  ]);

  const [newReport, setNewReport] = useState({ location: '', category: 'Overflowing Bin' });

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
      setAnalyzing(true);
      setScanResult(null);

      setTimeout(() => {
        setAnalyzing(false);
        setScanResult({
          type: 'Plastic Bottle (PET)',
          category: 'Recyclable Plastic',
          binColor: 'Blue Bin',
          confidence: '96%',
          instructions: 'Rinse the bottle, crush it to save space, and place it in the Blue Recyclable Bin.',
          earnedPoints: 15
        });
        setPoints(prev => prev + 15);
      }, 2000);
    }
  };

  const handleReportSubmit = (e) => {
    e.preventDefault();
    if (!newReport.location) return;
    const item = {
      id: Date.now(),
      location: newReport.location,
      status: 'Pending',
      time: 'Just now',
      category: newReport.category
    };
    setReports([item, ...reports]);
    setNewReport({ location: '', category: 'Overflowing Bin' });
    setPoints(prev => prev + 25);
    alert('Report submitted! You earned +25 Eco-Points.');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-emerald-600 text-white shadow-md">
        <div className="max-w-5xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Trash2 className="w-8 h-8 text-emerald-200" />
            <h1 className="text-2xl font-bold tracking-tight">EcoTrack AI</h1>
          </div>
          <div className="bg-emerald-700/80 px-4 py-1.5 rounded-full flex items-center gap-2 text-sm font-semibold border border-emerald-500">
            <Award className="w-5 h-5 text-amber-300" />
            <span>{points} Eco-Points</span>
          </div>
        </div>
      </header>

      <nav className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto flex divide-x divide-slate-100">
          <button
            onClick={() => setActiveTab('scan')}
            className={`flex-1 py-3 text-center font-medium text-sm flex justify-center items-center gap-2 transition ${
              activeTab === 'scan' ? 'text-emerald-600 border-b-2 border-emerald-600 bg-emerald-50/50' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Camera className="w-4 h-4" /> AI Waste Classifier
          </button>
          <button
            onClick={() => setActiveTab('report')}
            className={`flex-1 py-3 text-center font-medium text-sm flex justify-center items-center gap-2 transition ${
              activeTab === 'report' ? 'text-emerald-600 border-b-2 border-emerald-600 bg-emerald-50/50' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <ShieldAlert className="w-4 h-4" /> Report Overflow Bin
          </button>
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex-1 py-3 text-center font-medium text-sm flex justify-center items-center gap-2 transition ${
              activeTab === 'dashboard' ? 'text-emerald-600 border-b-2 border-emerald-600 bg-emerald-50/50' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <MapPin className="w-4 h-4" /> Authority Dashboard
          </button>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto w-full p-4 md:p-6 flex-grow">
        {activeTab === 'scan' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm text-center">
              <h2 className="text-xl font-bold text-slate-800 mb-2">AI-Powered Waste Classifier</h2>
              <p className="text-slate-600 text-sm mb-6">Upload an image of any waste item to instantly identify its material and disposal method.</p>

              <label className="border-2 border-dashed border-emerald-300 bg-emerald-50/30 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-emerald-50/60 transition">
                <Upload className="w-10 h-10 text-emerald-600 mb-2" />
                <span className="font-semibold text-emerald-800 text-sm">Click to upload or capture photo</span>
                <span className="text-xs text-slate-500 mt-1">PNG, JPG, or WEBP up to 5MB</span>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>

              {selectedImage && (
                <div className="mt-6 flex flex-col md:flex-row gap-6 items-center border-t border-slate-100 pt-6">
                  <img src={selectedImage} alt="Uploaded Waste" className="w-48 h-48 object-cover rounded-lg border border-slate-200" />

                  {analyzing ? (
                    <div className="flex-1 text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto mb-3"></div>
                      <p className="font-semibold text-slate-700">AI Model Classifying Waste...</p>
                    </div>
                  ) : scanResult ? (
                    <div className="flex-1 text-left space-y-3">
                      <div className="inline-block bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-xs font-bold">
                        Confidence: {scanResult.confidence}
                      </div>
                      <h3 className="text-2xl font-bold text-slate-900">{scanResult.type}</h3>
                      <p className="text-sm text-slate-600">Category: <span className="font-semibold text-slate-800">{scanResult.category}</span></p>
                      <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg text-sm text-blue-900">
                        <strong>Disposal Action:</strong> Dispose in <span className="font-bold underline">{scanResult.binColor}</span>.
                      </div>
                      <p className="text-sm text-slate-600">{scanResult.instructions}</p>
                      <div className="flex items-center gap-1.5 text-emerald-600 font-semibold text-sm">
                        <CheckCircle className="w-4 h-4" /> +{scanResult.earnedPoints} Eco-Points Credited!
                      </div>
                    </div>
                  ) : null}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'report' && (
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm max-w-xl mx-auto">
            <h2 className="text-xl font-bold text-slate-800 mb-2">Report Overflowing Dustbin</h2>
            <p className="text-slate-600 text-sm mb-6">Help sanitation teams act quickly. Send reports with location details.</p>

            <form onSubmit={handleReportSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Issue Category</label>
                <select
                  value={newReport.category}
                  onChange={(e) => setNewReport({ ...newReport, category: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  <option>Overflowing Bin</option>
                  <option>E-Waste Illegal Dumping</option>
                  <option>Hazardous Chemical Waste</option>
                  <option>Damaged Municipal Dustbin</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Location Description / Address</label>
                <input
                  type="text"
                  placeholder="e.g., Near City Bus Stop 4, Main Road"
                  value={newReport.location}
                  onChange={(e) => setNewReport({ ...newReport, location: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Upload Photo Proof</label>
                <input type="file" accept="image/*" className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100" />
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 rounded-lg transition text-sm"
              >
                Submit Civic Report (+25 Points)
              </button>
            </form>
          </div>
        )}

        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-slate-800">Municipal Sanitation Dashboard</h2>
                <span className="text-xs bg-slate-100 text-slate-600 px-3 py-1 rounded-full font-medium">Real-time Feed</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase text-xs">
                    <tr>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Location</th>
                      <th className="py-3 px-4">Reported</th>
                      <th className="py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {reports.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/80">
                        <td className="py-3 px-4 font-semibold text-slate-800">{item.category}</td>
                        <td className="py-3 px-4 text-slate-600">{item.location}</td>
                        <td className="py-3 px-4 text-slate-500">{item.time}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                              item.status === 'Resolved'
                                ? 'bg-emerald-100 text-emerald-700'
                                : 'bg-amber-100 text-amber-700'
                            }`}
                          >
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="bg-white border-t border-slate-200 py-4 text-center text-xs text-slate-500">
        EcoTrack AI – Built for NxtWave Hackathon (Sustainability & Social Impact)
      </footer>
    </div>
  );
}
