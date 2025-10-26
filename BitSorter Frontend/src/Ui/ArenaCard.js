import { useState } from 'react';
import { Link } from 'react-router';

const ArenaCard = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="sm:max-w-sm w-[90%] mx-auto transform transition-all duration-300 hover:scale-105">
      {/* Badge Container */}
      <div className="flex justify-between items-start mb-2">
        <div className="flex gap-2">
          <span className="bg-gradient-to-r from-red-600 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold tracking-wide shadow-lg animate-pulse">
            HOT
          </span>
          <span className="bg-gradient-to-r from-orange-400 to-red-500 text-white px-3 py-1 rounded-full text-xs font-bold tracking-wide shadow-md">
            NEW
          </span>
        </div>
      </div>

      {/* Main Card */}
      <div 
        className="relative overflow-hidden rounded-2xl border border-red-900/30 bg-gradient-to-br from-red-950 via-red-900 to-orange-900 shadow-2xl"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Animated Background Effect */}
        <div className={`absolute inset-0 bg-gradient-to-r from-red-600/10 to-orange-600/10 transition-all duration-500 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}></div>
        
        {/* Blood Splatter Effect */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-red-700/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-4 left-4 w-16 h-16 bg-orange-600/10 rounded-full blur-lg"></div>
        
        {/* Card Content */}
        <div className="relative z-10 p-6">
          {/* Header */}
          <div className="mb-4">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-red-200 via-orange-200 to-red-200 bg-clip-text text-transparent">
              1v1 Arena
            </h2>
            <p className="text-red-200/80 text-sm mt-1 font-medium">
              Code. Compete. Conquer.
            </p>
          </div>

          {/* Description */}
          <p className="text-red-100/90 text-sm leading-relaxed mb-6 font-light">
            Challenge opponents in real-time coding duels. Sharpen your skills, climb the ranks, and prove you're the best!
          </p>

          {/* Features List */}
          <div className="space-y-2 mb-6">
            {['Real-time matching', 'Live performance stats', 'Rankings'].map((feature, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-red-400 rounded-full animate-pulse"></div>
                <span className="text-red-200/80 text-xs font-medium">{feature}</span>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <Link 
            to="/Arena"
            className="group relative block w-full"
          >
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-red-700 via-red-600 to-orange-600 hover:from-red-600 hover:via-red-500 hover:to-orange-500 transition-all duration-300 shadow-lg hover:shadow-red-500/25">
              {/* Shine effect */}
              <div className="absolute inset-0 -left-full group-hover:left-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-all duration-700"></div>
              
              <div className="relative px-6 py-3 text-center">
                <span className="text-white font-bold text-sm tracking-wide">
                  ENTER ARENA
                </span>
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <svg 
                    className={`w-4 h-4 text-white transform transition-transform duration-300 ${
                      isHovered ? 'translate-x-1' : ''
                    }`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              </div>
            </div>
          </Link>

          {/* Online Indicator */}
          <div className="flex items-center justify-center gap-2 mt-4">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-red-200/70 text-xs font-medium">online contest</span>
            </div>
          </div>
        </div>

        {/* Corner Accents */}
        <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-red-500/50 rounded-tl-2xl"></div>
        <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-orange-500/50 rounded-br-2xl"></div>
      </div>
    </div>
  );
};

export default ArenaCard;