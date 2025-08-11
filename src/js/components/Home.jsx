import React, { useState, useRef, useEffect } from 'react';

const Home = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [musicTracks, setMusicTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const audioRef = useRef(null);

  // 🎯 FETCH THE REAL SONGS FROM API
  useEffect(() => {
    const fetchSongs = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://playground.4geeks.com/sound/songs');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // 🔧 THE MAGIC FIX: Add the full URL to each song
        const songsWithFullUrls = data.songs.map(song => ({
          title: song.name,
          url: `https://playground.4geeks.com${song.url}` // 🌟 This is the key fix!
        }));
        
        setMusicTracks(songsWithFullUrls);
        setError(null);
      } catch (err) {
        console.error('Error fetching songs:', err);
        setError('Failed to load songs. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchSongs();
  }, []);

  // Audio event handlers
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || musicTracks.length === 0) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => {
      setIsPlaying(false);
      nextTrack();
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentTrack, musicTracks]);

  const playPause = () => {
    const audio = audioRef.current;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(err => {
        console.error('Error playing audio:', err);
        setIsPlaying(false);
      });
    }
    setIsPlaying(!isPlaying);
  };

  const nextTrack = () => {
    setCurrentTrack((prev) => (prev + 1) % musicTracks.length);
    setIsPlaying(false);
  };

  const prevTrack = () => {
    setCurrentTrack((prev) => (prev - 1 + musicTracks.length) % musicTracks.length);
    setIsPlaying(false);
  };

  const selectTrack = (index) => {
    setCurrentTrack(index);
    setIsPlaying(false);
  };

  const formatTime = (time) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Loading state
  if (loading) {
    return (
      <div style={{
        backgroundColor: '#1a1a1a',
        color: 'white',
        minHeight: '100vh',
        padding: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '24px', marginBottom: '10px' }}>🎵</div>
          <div>Loading awesome music...</div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div style={{
        backgroundColor: '#1a1a1a',
        color: 'white',
        minHeight: '100vh',
        padding: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '24px', marginBottom: '10px', color: 'red' }}>❌</div>
          <div>{error}</div>
        </div>
      </div>
    );
  }

  const currentSong = musicTracks[currentTrack];

  return (
    <div style={{
      backgroundColor: '#1a1a1a',
      color: 'white',
      minHeight: '100vh',
      padding: '20px'
    }}>
      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        src={currentSong?.url}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />
      
      <h1 style={{ fontSize: '24px', marginBottom: '20px' }}>
        🎮 Real Video Game Music Player
      </h1>
      
      {/* Now Playing Display */}
      <div style={{
        backgroundColor: '#2d3748',
        padding: '15px',
        borderRadius: '8px',
        marginBottom: '20px',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '10px' }}>
          Now Playing: {currentSong?.title || 'Loading...'}
        </div>
        <div style={{ fontSize: '14px', color: '#a0aec0' }}>
          {formatTime(currentTime)} / {formatTime(duration)}
        </div>
        <div style={{
          width: '100%',
          height: '4px',
          backgroundColor: '#4a5568',
          borderRadius: '2px',
          marginTop: '10px',
          overflow: 'hidden'
        }}>
          <div style={{
            width: `${duration ? (currentTime / duration) * 100 : 0}%`,
            height: '100%',
            backgroundColor: '#3b82f6',
            transition: 'width 0.1s'
          }} />
        </div>
      </div>
      
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {musicTracks.map((track, index) => (
          <li
            key={index}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            onClick={() => selectTrack(index)}
            style={{
              padding: '15px',
              marginBottom: '5px',
              backgroundColor: index === currentTrack 
                ? '#3b82f6' 
                : hoveredIndex === index 
                ? '#4a5568' 
                : '#374151',
              cursor: 'pointer',
              borderRadius: '5px',
              display: 'flex',
              alignItems: 'center',
              border: index === currentTrack ? '2px solid #60a5fa' : '2px solid transparent'
            }}
          >
            <span style={{ marginRight: '15px', color: '#9ca3af' }}>
              {(index + 1).toString().padStart(2, '0')}
            </span>
            <span style={{ flex: 1 }}>{track.title}</span>
            {index === currentTrack && (
              <span style={{ marginRight: '15px', color: '#60a5fa' }}>
                {isPlaying ? '🎵' : '⏸️'}
              </span>
            )}
            {hoveredIndex === index && (
              <div>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    selectTrack(index);
                    setTimeout(playPause, 100);
                  }}
                  style={{ marginRight: '10px', background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}
                >
                  ▶
                </button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    selectTrack(index);
                  }}
                  style={{ marginRight: '10px', background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}
                >
                  ⏸
                </button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    nextTrack();
                  }}
                  style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}
                >
                  ⏭
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
      
      {/* Music Player Controls */}
      <div style={{
        marginTop: '30px',
        display: 'flex',
        justifyContent: 'center',
        gap: '15px'
      }}>
        <button 
          onClick={prevTrack}
          style={{
            backgroundColor: '#374151',
            color: 'white',
            border: 'none',
            padding: '12px 16px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '18px'
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#4b5563'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#374151'}
        >
          ⏮
        </button>
        <button 
          onClick={playPause}
          style={{
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            padding: '12px 16px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '18px'
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#2563eb'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#3b82f6'}
        >
          {isPlaying ? '⏸️' : '▶'}
        </button>
        <button 
          onClick={nextTrack}
          style={{
            backgroundColor: '#374151',
            color: 'white',
            border: 'none',
            padding: '12px 16px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '18px'
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#4b5563'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#374151'}
        >
          ⏭
        </button>
      </div>

      {/* Success Message */}
      <div style={{
        marginTop: '30px',
        padding: '15px',
        backgroundColor: '#065f46',
        borderRadius: '8px',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '18px', marginBottom: '5px' }}>🎉 SUCCESS!</div>
        <div style={{ fontSize: '14px' }}>
          Now playing REAL Mario, Zelda, and Sonic music from 4Geeks API!
        </div>
      </div>
    </div>
  );
};

export default Home;