import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Dropdown = ({ options, defaultSelected, onOptionSelect, label }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null);
    const dropdownRef = useRef(null);

    // Close Dropdown when clicked outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isOpen && dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        const handleWindowClick = (event) => {
            handleClickOutside(event);
        };

        window.addEventListener('click', handleWindowClick);

        return () => {
            window.removeEventListener('click', handleWindowClick);
        };
    }, [isOpen]);

    // Choose defaultSelected if it exists in the options array
    useEffect(() => {
        if (defaultSelected && options.find((option) => option.label === defaultSelected)) {
            setSelectedOption(defaultSelected);
        }
    }, [defaultSelected, options]);

    const toggleDropdown = (event) => {
        event.stopPropagation();
        setIsOpen(!isOpen);
    };

    const selectOption = (option) => {
        setSelectedOption(option.label);
        onOptionSelect(label, [option.label]);
        setIsOpen(false);
    };

    const truncateLabel = (label) => {
        return label.length > 15 ? `${label.substring(0, 15)}...` : label;
    };

    return (
        <div ref={dropdownRef} className="relative inline-block text-left font-normal text-gray-700">
            <div className="relative">
                <input
                    type="text"
                    className="w-full border border-gray-300 rounded py-2 px-4 focus:outline-none focus:border-blue-500"
                    value={selectedOption ? selectedOption : ''}
                    placeholder="Select an option"
                    readOnly
                    onClick={toggleDropdown}
                />
                <button
                    className="absolute top-0 right-0 mt-2 mr-2 rounded-full h-6 w-6 flex items-center justify-center focus:outline-none"
                    onClick={(event) => toggleDropdown(event)}
                    disabled={!options || options.length === 0}
                >
                    <FontAwesomeIcon icon="fa-solid fa-sort" className="text-gray-600" />
                </button>
                {isOpen && (
                    <div className="absolute z-50 mt-1 w-full bg-white rounded shadow-lg overflow-auto">
                        <ul className='max-h-[60vh]'>
                            {options.map((option) => (
                                <li
                                    key={option.label}
                                    className={`py-2 px-4 hover:bg-gray-100 cursor-pointer ${selectedOption === option.label ? 'bg-gray-100' : ''
                                        }`}
                                    onClick={() => selectOption(option)}
                                >
                                    <span className="truncate">{truncateLabel(option.label)}</span>
                                    {option.subtext && <span className="text-gray-500 text-sm ml-2">({option.subtext})</span>}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dropdown;
