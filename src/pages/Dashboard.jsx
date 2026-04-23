import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { LayoutDashboard, Brain, Map as MapIcon, Target, UserPlus, Radio, PlusCircle } from 'lucide-react';
import { SEED_NEEDS } from "../data/seedData";

const COLORS = { CRITICAL: "#EF4444", HIGH: "#F59E0B", MEDIUM: "#3B82F6", LOW: "#22C55E" };

export default function Dashboard() {
  const navigate = useNavigate();
  const [impactScore, setImpactScore] = useState(40); // Start at 40
  const [aiResult, setAiResult] = useState("");

  // AI Feature: Smart Match logic
  const runAiSmartMatch = () => {
    setAiResult("AI Analysis: Found 3 critical matches in Kurla East. Engineering skills required.");
    setImpactScore(prev => prev + 6); // Update score to 46
  };

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_KEY 
  });

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#f3f4f6' }}>
      {/* SIDEBAR */}
      <nav style={{ width: '260px', background: '#111827', color: 'white', padding: '24px' }}>
        <h2 style={{ marginBottom: '40px' }}>VolunteerConnect</h2>
        <div onClick={() => navigate("/")} style={{ cursor: 'pointer', display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <LayoutDashboard size={18}/> Dashboard
        </div>
        <div onClick={runAiSmartMatch} style={{ cursor: 'pointer', display: 'flex', gap: '10px', color: '#9ca3af' }}>
          <Brain size={18}/> AI Smart Match
        </div>
      </nav>

      <main style={{ flex: 1, padding: '32px', overflowY: 'auto' }}>
        {/* AI Result Box */}
        {aiResult && (
          <div style={{ background: '#dbeafe', padding: '16px', borderRadius: '12px', marginBottom: '24px', border: '1px solid #3b82f6' }}>
            <p style={{ margin: 0, color: '#1e3a8a' }}><strong>Smart Match Result:</strong> {aiResult}</p>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
          <div>
            {/* LIVE MAP */}
            <div style={{ background: '#111827', borderRadius: '24px', padding: '24px', color: 'white', marginBottom: '24px' }}>
              <h3>Impact Ripple — Live Waves</h3>
              <div style={{ height: '350px', background: '#1f2937', borderRadius: '16px', overflow: 'hidden' }}>
                {isLoaded ? (
                  <GoogleMap mapContainerStyle={{height: '100%', width: '100%'}} center={{lat: 19.076, lng: 72.877}} zoom={11}>
                    {SEED_NEEDS.map(n => <Marker key={n.id} position={{lat: n.lat, lng: n.lng}} />)}
                  </GoogleMap>
                ) : <div style={{padding: '20px'}}>Syncing Satellite Data...</div>}
              </div>
            </div>

            {/* NEEDS LIST */}
            <div style={{ background: 'white', padding: '24px', borderRadius: '24px' }}>
              <h3>Critical Needs Queue</h3>
              {SEED_NEEDS.map(n => (
                <div key={n.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #eee' }}>
                  <span>{n.title} - {n.location}</span>
                  <span style={{ color: COLORS[n.urgency], fontWeight: 'bold' }}>{n.urgency}</span>
                </div>
              ))}
            </div>
          </div>

          <aside>
            {/* SCORE DISPLAY */}
            <div style={{ background: '#111827', color: 'white', padding: '40px 20px', borderRadius: '24px', textAlign: 'center', marginBottom: '24px' }}>
              <div style={{ fontSize: '64px', fontWeight: '900', color: '#ef4444' }}>{impactScore}</div>
              <p style={{ opacity: 0.7 }}>Current Impact Score</p>
            </div>

            {/* BUTTONS */}
            <div style={{ background: 'white', padding: '24px', borderRadius: '24px' }}>
              <h3>Quick Actions</h3>
              <ActionButton icon={<PlusCircle size={18}/>} label="Add Need" onClick={() => navigate("/submit-need")} />
              <ActionButton icon={<UserPlus size={18}/>} label="Add Volunteer" onClick={() => navigate("/register")} />
              <ActionButton icon={<Brain size={18}/>} label="AI Smart Match" onClick={runAiSmartMatch} highlight />
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

// UI Components
function ActionButton({ icon, label, onClick, highlight }) {
  return (
    <button onClick={onClick} style={{ 
      width: '100%', padding: '14px', marginBottom: '12px', display: 'flex', gap: '10px', borderRadius: '12px', 
      border: highlight ? '2px solid #3b82f6' : '1px solid #ddd', background: 'white', cursor: 'pointer', fontWeight: '600'
    }}>
      {icon} {label}
    </button>
  );
}