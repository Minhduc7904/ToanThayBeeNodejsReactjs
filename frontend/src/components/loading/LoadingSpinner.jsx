import React from 'react';

/**
 * Enhanced LoadingSpinner component with multiple style options
 * @param {Object} props - Component props
 * @param {string} props.size - Size of the spinner (default: "2rem")
 * @param {string} props.color - Primary color of the spinner (default: "border-blue-600")
 * @param {string} props.secondaryColor - Secondary color for gradient or transparent parts (default: "border-blue-200")
 * @param {string} props.type - Type of spinner: "border", "dots", "pulse", "bounce" (default: "border")
 * @param {string} props.thickness - Border thickness for border type (default: "border-4")
 * @param {boolean} props.showText - Whether to show loading text (default: false)
 * @param {string} props.text - Text to display (default: "Loading...")
 * @returns {JSX.Element} - The spinner component
 */
const LoadingSpinner = ({
    size = "2rem",
    color = "border-blue-600",
    secondaryColor = "border-blue-200",
    type = "border",
    thickness = "border-4",
    showText = false,
    text = "Loading..."
}) => {
    // Border spinner (improved version of the original)
    if (type === "border") {
        return (
            <div className="flex flex-col items-center justify-center">
                <div
                    className={`animate-spin rounded-full ${thickness} ${color} border-t-transparent shadow-md`}
                    style={{ width: size, height: size }}
                />
                {showText && (
                    <div className="mt-2 text-gray-700 font-medium">{text}</div>
                )}
            </div>
        );
    }

    // Dots spinner (three bouncing dots)
    if (type === "dots") {
        const dotSize = `calc(${size} / 4)`;
        return (
            <div className="flex flex-col items-center justify-center">
                <div className="flex space-x-2">
                    <div
                        className={`bg-${color.replace('border-', '')} rounded-full animate-bounce`}
                        style={{
                            width: dotSize,
                            height: dotSize,
                            animationDelay: '0ms'
                        }}
                    />
                    <div
                        className={`bg-${color.replace('border-', '')} rounded-full animate-bounce`}
                        style={{
                            width: dotSize,
                            height: dotSize,
                            animationDelay: '150ms'
                        }}
                    />
                    <div
                        className={`bg-${color.replace('border-', '')} rounded-full animate-bounce`}
                        style={{
                            width: dotSize,
                            height: dotSize,
                            animationDelay: '300ms'
                        }}
                    />
                </div>
                {showText && (
                    <div className="mt-2 text-gray-700 font-medium">{text}</div>
                )}
            </div>
        );
    }

    // Pulse spinner (growing and shrinking circle)
    if (type === "pulse") {
        return (
            <div className="flex flex-col items-center justify-center">
                <div
                    className={`bg-${color.replace('border-', '')} rounded-full animate-pulse opacity-75`}
                    style={{ width: size, height: size }}
                />
                {showText && (
                    <div className="mt-2 text-gray-700 font-medium">{text}</div>
                )}
            </div>
        );
    }

    // Bounce spinner (single bouncing ball)
    if (type === "bounce") {
        return (
            <div className="flex flex-col items-center justify-center">
                <div className="relative" style={{ width: size, height: size }}>
                    <div
                        className={`absolute bottom-0 bg-${color.replace('border-', '')} rounded-full animate-bounce shadow-lg`}
                        style={{ width: size, height: size }}
                    />
                </div>
                {showText && (
                    <div className="mt-6 text-gray-700 font-medium">{text}</div>
                )}
            </div>
        );
    }

    // Gradient spinner (fancy border with gradient)
    return (
        <div className="flex flex-col items-center justify-center">
            <div className="relative">
                <div
                    className={`absolute inset-0 rounded-full ${secondaryColor} ${thickness}`}
                    style={{ width: size, height: size }}
                />
                <div
                    className={`animate-spin rounded-full ${thickness} ${color} border-t-transparent border-b-transparent`}
                    style={{ width: size, height: size }}
                />
            </div>
            {showText && (
                <div className="mt-2 text-gray-700 font-medium">{text}</div>
            )}
        </div>
    );
};

export default LoadingSpinner;
