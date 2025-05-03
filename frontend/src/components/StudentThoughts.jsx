import React from 'react';
import { motion } from 'framer-motion';

const StudentThoughts = ({ thoughts }) => {
    return (
        <div className="flex flex-col gap-4 h-full justify-center">
            {thoughts.map((thought, index) => (
                <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.8 }}
                    className="bg-white p-4 rounded-lg shadow-md"
                >
                    <p className="text-gray-700 italic mb-2">{thought.content}</p>
                    <div className="flex justify-end">
                        <p className="text-sm font-semibold text-blue-600">{thought.student}</p>
                    </div>
                </motion.div>
            ))}
        </div>
    );
};

export default StudentThoughts;
