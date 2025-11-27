import React from 'react';
import { useLocation } from 'react-router-dom';
import { Construction } from 'lucide-react';

const PlaceholderPage = () => {
    const location = useLocation();

    // Extract section name from path
    const sectionName = location.pathname.split('/').pop().replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

    return (
        <div className="placeholder-container" style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '60vh',
            textAlign: 'center',
            color: '#6e6e6e'
        }}>
            <Construction size={64} color="#d27f20" style={{ marginBottom: '20px' }} />
            <h2 style={{ fontFamily: 'Merriweather, serif', color: '#184a55', marginBottom: '10px' }}>
                {sectionName} Management
            </h2>
            <p>This section is currently under development.</p>
        </div>
    );
};

export default PlaceholderPage;
