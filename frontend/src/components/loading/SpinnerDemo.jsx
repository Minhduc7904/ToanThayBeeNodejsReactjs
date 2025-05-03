import React, { useState } from 'react';
import LoadingSpinner from './LoadingSpinner';

const SpinnerDemo = () => {
    const [selectedType, setSelectedType] = useState('border');
    const [selectedColor, setSelectedColor] = useState('border-blue-600');
    const [selectedSize, setSelectedSize] = useState('3rem');
    const [showText, setShowText] = useState(true);
    const [customText, setCustomText] = useState('Loading...');
    
    const spinnerTypes = [
        { value: 'border', label: 'Border' },
        { value: 'dots', label: 'Dots' },
        { value: 'pulse', label: 'Pulse' },
        { value: 'bounce', label: 'Bounce' },
        { value: 'gradient', label: 'Gradient' }
    ];
    
    const colorOptions = [
        { value: 'border-blue-600', label: 'Blue', bg: 'bg-blue-600' },
        { value: 'border-red-600', label: 'Red', bg: 'bg-red-600' },
        { value: 'border-green-600', label: 'Green', bg: 'bg-green-600' },
        { value: 'border-yellow-500', label: 'Yellow', bg: 'bg-yellow-500' },
        { value: 'border-purple-600', label: 'Purple', bg: 'bg-purple-600' },
        { value: 'border-pink-500', label: 'Pink', bg: 'bg-pink-500' },
        { value: 'border-gray-700', label: 'Gray', bg: 'bg-gray-700' },
    ];
    
    const sizeOptions = [
        { value: '2rem', label: 'Small' },
        { value: '3rem', label: 'Medium' },
        { value: '4rem', label: 'Large' },
        { value: '6rem', label: 'Extra Large' },
    ];
    
    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Loading Spinner Demo</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-lg font-semibold mb-4">Customize Spinner</h2>
                    
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                        <div className="flex flex-wrap gap-2">
                            {spinnerTypes.map(type => (
                                <button
                                    key={type.value}
                                    className={`px-3 py-1 rounded-full text-sm ${
                                        selectedType === type.value 
                                            ? 'bg-blue-600 text-white' 
                                            : 'bg-gray-100 hover:bg-gray-200'
                                    }`}
                                    onClick={() => setSelectedType(type.value)}
                                >
                                    {type.label}
                                </button>
                            ))}
                        </div>
                    </div>
                    
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                        <div className="flex flex-wrap gap-2">
                            {colorOptions.map(color => (
                                <button
                                    key={color.value}
                                    className={`w-8 h-8 rounded-full ${color.bg} border ${
                                        selectedColor === color.value 
                                            ? 'border-2 border-black' 
                                            : 'border-gray-300'
                                    }`}
                                    title={color.label}
                                    onClick={() => setSelectedColor(color.value)}
                                />
                            ))}
                        </div>
                    </div>
                    
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Size</label>
                        <div className="flex flex-wrap gap-2">
                            {sizeOptions.map(size => (
                                <button
                                    key={size.value}
                                    className={`px-3 py-1 rounded-full text-sm ${
                                        selectedSize === size.value 
                                            ? 'bg-blue-600 text-white' 
                                            : 'bg-gray-100 hover:bg-gray-200'
                                    }`}
                                    onClick={() => setSelectedSize(size.value)}
                                >
                                    {size.label}
                                </button>
                            ))}
                        </div>
                    </div>
                    
                    <div className="mb-4">
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                checked={showText}
                                onChange={() => setShowText(!showText)}
                                className="mr-2"
                            />
                            <span className="text-sm font-medium text-gray-700">Show Text</span>
                        </label>
                    </div>
                    
                    {showText && (
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Custom Text</label>
                            <input
                                type="text"
                                value={customText}
                                onChange={(e) => setCustomText(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            />
                        </div>
                    )}
                    
                    <div className="mt-6 p-2 bg-gray-50 rounded border border-gray-200">
                        <pre className="text-xs overflow-x-auto">
                            {`<LoadingSpinner
  type="${selectedType}"
  color="${selectedColor}"
  size="${selectedSize}"
  showText={${showText}}
  ${showText ? `text="${customText}"` : ''}
/>`}
                        </pre>
                    </div>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-center min-h-[300px]">
                    <LoadingSpinner
                        type={selectedType}
                        color={selectedColor}
                        size={selectedSize}
                        showText={showText}
                        text={customText}
                    />
                </div>
            </div>
        </div>
    );
};

export default SpinnerDemo;
