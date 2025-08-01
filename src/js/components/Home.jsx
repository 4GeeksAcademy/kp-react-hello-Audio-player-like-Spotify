import { useState, useRef, useEffect } from 'react';

const Home = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);
  
  const musicTracks = [
    { title: "Mario Castle", url: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav" },
    { title: "Mario Star", url: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav" },
    { title: "Mario Overworld", url: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav" },
    { title: "Mario Stage 1", url: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav" },
    { title: "Mario Stage 2", url: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav" },
    { title: "Mario Star", url: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav" },
    { title: "Mario Underworld", url: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav" },
    { title: "Mario Underwater", url: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav" },
    { title: "Zelda Castle", url: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav" },
    { title: "Zelda Outworld", url: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav" },
    { title: "Zelda Titles", url: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav" },
    { title: "Sonic Brain Zone", url: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav" }
  ];

  // Audio event handlers
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

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
  }, [currentTrack]);

  const playPause = () => {
    const audio = audioRef.current;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
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
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

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
        src={musicTracks[currentTrack].url}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />
      
      <h1 style={{ fontSize: '24px', marginBottom: '20px' }}>
        Music Playlist
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
          Now Playing: {musicTracks[currentTrack].title}
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
    </div>
  );
};

export default Home;