import { useState, useEffect, useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import defaultImageBanner from '../../assets/images/banner-11.jpg'

const SlideShow = ({
    images = [],
    captions = [],
    autoPlay = true,
    interval = 3000,
    text,
    h = "h-[15rem]"
}) => {
    const [currentIndex, setCurrentIndex] = useState(0)
    const timerRef = useRef(null)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [selectedCaption, setSelectedCaption] = useState(null);

    const startAutoPlay = () => {
        if (autoPlay) {
            timerRef.current = setInterval(() => {
                setCurrentIndex(prev => (prev + 1) % images.length)
            }, interval)
        }
    }

    const resetAutoPlay = () => {
        clearInterval(timerRef.current)
        startAutoPlay()
    }

    useEffect(() => {
        startAutoPlay()
        return () => clearInterval(timerRef.current)
    }, [images.length, autoPlay, interval])

    const prevSlide = () => {
        setCurrentIndex(prev => (prev - 1 + images.length) % images.length)
        resetAutoPlay()
    }

    const nextSlide = () => {
        setCurrentIndex(prev => (prev + 1) % images.length)
        resetAutoPlay()
    }

    if (images.length === 0) return <div className="text-center">Không có ảnh</div>

    return (
        <div className={`relative w-full ${h} rounded overflow-hidden shadow-lg group`}>
            {/* Container có chiều rộng bằng số ảnh × 100% */}
            <div
                className="flex transition-transform duration-700 ease-in-out h-full"
                style={{
                    width: `${images.length * 100}%`,
                    transform: `translateX(-${currentIndex * (100 / images.length)}%)`
                }}
            >
                {images.map((img, idx) => (
                    <div
                        key={idx}
                        className="relative flex-shrink-0"
                        style={{ width: `${100 / images.length}%` }}
                    >
                        <img
                            src={img}
                            alt={`slide-${idx}`}
                            onClick={() => {
                                setSelectedImage(img);
                                setSelectedCaption(captions[idx]);
                                setIsModalOpen(true);
                            }}
                            className="w-full h-full object-cover cursor-pointer"
                        />
                        {captions && captions[idx] && (
                            <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white p-2 text-sm">
                                <p className="whitespace-pre-line">{captions[idx]}</p>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Text */}
            {text && (
                <div className="absolute bottom-4 left-4 bg-black/50 text-white text-3xl px-3 py-1 rounded-md">
                    {text}
                </div>
            )}

            {images.length > 1 && (
                <>
                    <button
                        onClick={prevSlide}
                        className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white/70 text-black rounded-full p-2 shadow opacity-0 group-hover:opacity-100 transition duration-200"
                    >
                        <ChevronLeft />
                    </button>
                    <button
                        onClick={nextSlide}
                        className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white/70 text-black rounded-full p-2 shadow opacity-0 group-hover:opacity-100 transition duration-200"
                    >
                        <ChevronRight />
                    </button>

                    {/* Dots */}

                    <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-2">
                        {images.map((_, index) => (
                            <div
                                key={index}
                                className={`w-2 h-2 rounded-full ${index === currentIndex ? 'bg-white' : 'bg-white/50'}`}
                            ></div>
                        ))}
                    </div>
                </>
            )}
            {/* Nút điều hướng */}

            {isModalOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-80 flex flex-col items-center p-20 justify-center z-50"
                    onClick={() => setIsModalOpen(false)}
                >
                    <img
                        src={selectedImage}
                        alt="Zoom"
                        className="max-w-full max-h-[80vh] object-contain"
                        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking on image
                    />
                    {selectedCaption && (
                        <div
                            className="mt-4 bg-black/60 text-white p-3 rounded max-w-2xl text-center"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <p className="whitespace-pre-line">{selectedCaption}</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export default SlideShow
