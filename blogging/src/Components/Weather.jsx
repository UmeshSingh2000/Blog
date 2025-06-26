'use client';
import { useEffect, useRef, useState } from "react";
import {
    Sun,
    Cloud,
    CloudRain,
    CloudSnow,
    Zap,
    Eye,
    CloudDrizzle,
    Cloudy
} from "lucide-react";

const Weather = () => {
    const [data, setData] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const scrollRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);
    
    const CARD_WIDTH = 200;
    const GAP = 16;
    const VISIBLE_CARDS = 3;
    const STEP = CARD_WIDTH + GAP;

    const fetchWeatherData = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/feature/weather`);
            if (response.status === 200) {
                const res = await response.json();
                setData(res);
            }
        } catch (error) {
            console.error("Error fetching weather data:", error);
        }
    };

    useEffect(() => {
        fetchWeatherData();
    }, []);

    // Auto-scroll only if enough cards to scroll
    useEffect(() => {
        if (data.length <= VISIBLE_CARDS || isDragging) return;

        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => 
                prevIndex + 1 >= data.length - VISIBLE_CARDS + 1 ? 0 : prevIndex + 1
            );
        }, 3000);

        return () => clearInterval(interval);
    }, [data.length, isDragging]);

    useEffect(() => {
        if (scrollRef.current && !isDragging) {
            scrollRef.current.scrollTo({
                left: currentIndex * STEP,
                behavior: 'smooth'
            });
        }
    }, [currentIndex, isDragging]);

    // Drag to scroll functionality
    const handleMouseDown = (e) => {
        setIsDragging(true);
        setStartX(e.pageX - scrollRef.current.offsetLeft);
        setScrollLeft(scrollRef.current.scrollLeft);
    };

    const handleMouseLeave = () => {
        setIsDragging(false);
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - scrollRef.current.offsetLeft;
        const walk = (x - startX) * 2;
        scrollRef.current.scrollLeft = scrollLeft - walk;
    };

    const getWeatherIcon = (condition) => {
        const iconProps = { size: 32 };
        switch (condition?.toLowerCase()) {
            case 'sunny':
            case 'clear':
                return <Sun {...iconProps} className="text-yellow-500" />;
            case 'cloudy':
            case 'partly cloudy':
                return <Cloud {...iconProps} className="text-gray-500" />;
            case 'rain':
            case 'light rain':
                return <CloudRain {...iconProps} className="text-blue-600" />;
            case 'drizzle':
                return <CloudDrizzle {...iconProps} className="text-blue-400" />;
            case 'snow':
                return <CloudSnow {...iconProps} className="text-blue-200" />;
            case 'thunderstorm':
                return <Zap {...iconProps} className="text-purple-600" />;
            case 'overcast':
                return <Cloudy {...iconProps} className="text-gray-600" />;
            default:
                return <Sun {...iconProps} className="text-yellow-500" />;
        }
    };

    const getBackgroundGradient = (condition) => {
        switch (condition?.toLowerCase()) {
            case 'sunny':
            case 'clear':
                return 'from-yellow-100 to-orange-100';
            case 'cloudy':
            case 'partly cloudy':
                return 'from-gray-100 to-blue-100';
            case 'rain':
            case 'light rain':
                return 'from-blue-100 to-indigo-100';
            case 'drizzle':
                return 'from-blue-50 to-blue-100';
            case 'overcast':
                return 'from-gray-100 to-gray-200';
            default:
                return 'from-blue-50 to-indigo-100';
        }
    };

    if (data.length === 0) {
        return (
            <div className="w-full max-w-4xl mx-auto p-6">
                <div className="flex justify-center items-center h-32">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    <span className="ml-3 text-gray-600">Loading weather data...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-4xl mx-auto p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800 mb-2">Weather Updates</h1>
                <p className="text-gray-600">Live weather information from major cities</p>
            </div>

            <div className="relative overflow-hidden">
                <div className="flex items-center h-[200px] relative">
                    {/* Left fade effect */}
                    <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
                    
                    {/* Right fade effect */}
                    <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>
                    
                    <div
                        ref={scrollRef}
                        className="flex gap-4 overflow-x-hidden w-full"
                        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
                        onMouseDown={handleMouseDown}
                        onMouseLeave={handleMouseLeave}
                        onMouseUp={handleMouseUp}
                        onMouseMove={handleMouseMove}
                    >
                        {data.map((item, index) => (
                            <div
                                key={`${item.city}-${index}`}
                                className={`min-w-[200px] max-w-[200px] flex-shrink-0
                                bg-gradient-to-br ${getBackgroundGradient(item.condition)}
                                shadow-lg rounded-xl p-4 border border-white/20
                                transition-shadow duration-300 ease-in-out
                                hover:shadow-xl`}
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="text-lg font-semibold text-gray-800 truncate">
                                        {item.city}
                                    </h3>
                                    {getWeatherIcon(item.condition)}
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-baseline">
                                        <span className="text-2xl font-bold text-gray-800">
                                            {item.temperature}
                                        </span>
                                        <span className="text-sm text-gray-600 ml-1">°C</span>
                                    </div>
                                    <p className="text-sm text-gray-700 leading-tight">
                                        {item.description}
                                    </p>
                                </div>
                                <div className="mt-3 pt-3 border-t border-white/30">
                                    <div className="flex items-center text-xs text-gray-600">
                                        <Eye size={12} className="mr-1" />
                                        <span>Updated now</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Progress dots */}
                {data.length > VISIBLE_CARDS && (
                    <div className="flex justify-center mt-4 space-x-2">
                        {Array.from({ length: data.length - VISIBLE_CARDS + 1 }).map((_, index) => (
                            <button
                                key={index}
                                onClick={() => {
                                    setCurrentIndex(index);
                                }}
                                className={`h-2 rounded-full transition-all duration-300 ${
                                    index === currentIndex ? 'bg-blue-500 w-6' : 'bg-gray-300 hover:bg-gray-400 w-2'
                                }`}
                            />
                        ))}
                    </div>
                )}
            </div>

            <div className="flex justify-center mt-4">
                <div className="flex items-center text-xs text-gray-500">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse mr-2"></div>
                    Auto-updating every 3 seconds (drag to scroll)
                </div>
            </div>
        </div>
    );
};

export default Weather;