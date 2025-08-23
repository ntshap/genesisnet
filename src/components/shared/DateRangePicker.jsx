import React, { useState, useEffect, useCallback } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

const DateRangePicker = ({ value, onChange, disabled, className, label }) => {
  // Parse the initial date range string "YYYY-MM-DD to YYYY-MM-DD"
  const parseRangeString = (rangeStr) => {
    if (!rangeStr) return [new Date(), new Date()];
    
    const parts = rangeStr.split(' to ');
    if (parts.length !== 2) return [new Date(), new Date()];
    
    const startDate = new Date(parts[0]);
    const endDate = new Date(parts[1]);
    
    return [startDate, endDate];
  };
  
  // Format dates to string in format "YYYY-MM-DD to YYYY-MM-DD"
  const formatDateRange = (startDate, endDate) => {
    if (!startDate || !endDate) return '';
    
    const formatDate = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };
    
    return `${formatDate(startDate)} to ${formatDate(endDate)}`;
  };
  
  const formatDate = (date) => {
    if (!date) return '';
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric',
      year: 'numeric'
    });
  };
  
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [selecting, setSelecting] = useState('start'); // 'start' or 'end'
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  
  // Initialize from props
  useEffect(() => {
    const [parsedStartDate, parsedEndDate] = parseRangeString(value);
    setStartDate(parsedStartDate);
    setEndDate(parsedEndDate);
    if (parsedStartDate) {
      setCurrentMonth(parsedStartDate.getMonth());
      setCurrentYear(parsedStartDate.getFullYear());
    }
  }, [value]);
  
  // Handle date selection
  const handleDateClick = (date) => {
    if (selecting === 'start') {
      setStartDate(date);
      if (endDate && date > endDate) {
        setEndDate(date);
      }
      setSelecting('end');
    } else {
      if (date < startDate) {
        setStartDate(date);
        setEndDate(date);
        setSelecting('end');
      } else {
        setEndDate(date);
        setSelecting('start'); // Reset to start selection after both dates are selected
      }
    }
  };
  
  // Notify parent component when dates change
  useEffect(() => {
    if (startDate && endDate) {
      const rangeString = formatDateRange(startDate, endDate);
      onChange({ target: { name: 'timeRange', value: rangeString } });
    }
  }, [startDate, endDate, onChange]);
  
  // Handle input click to open/close the picker
  const handleInputClick = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
      if (!isOpen) {
        setSelecting('start');
      }
    }
  };
  
  // Navigate to previous month
  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };
  
  // Navigate to next month
  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };
  
  // Generate days for the current month view
  const generateCalendarDays = useCallback(() => {
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startOffset = firstDay.getDay(); // 0 for Sunday
    
    const days = [];
    
    // Add previous month days for alignment
    const prevMonthLastDay = new Date(currentYear, currentMonth, 0).getDate();
    for (let i = 0; i < startOffset; i++) {
      const date = new Date(currentYear, currentMonth - 1, prevMonthLastDay - startOffset + i + 1);
      days.push({ date, isCurrentMonth: false });
    }
    
    // Add current month days
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(currentYear, currentMonth, i);
      days.push({ date, isCurrentMonth: true });
    }
    
    // Add next month days to fill out the grid (always show 6 weeks)
    const remainingCells = 42 - days.length;
    for (let i = 1; i <= remainingCells; i++) {
      const date = new Date(currentYear, currentMonth + 1, i);
      days.push({ date, isCurrentMonth: false });
    }
    
    return days;
  }, [currentMonth, currentYear]);
  
  const days = generateCalendarDays();
  
  // Check if a date is selected (either start or end)
  const isDateSelected = (date) => {
    if (!startDate && !endDate) return false;
    
    if (startDate && date.getFullYear() === startDate.getFullYear() && 
        date.getMonth() === startDate.getMonth() && 
        date.getDate() === startDate.getDate()) {
      return true;
    }
    
    if (endDate && date.getFullYear() === endDate.getFullYear() && 
        date.getMonth() === endDate.getMonth() && 
        date.getDate() === endDate.getDate()) {
      return true;
    }
    
    return false;
  };
  
  // Check if a date is in the selected range
  const isInRange = (date) => {
    if (!startDate || !endDate) return false;
    return date > startDate && date < endDate;
  };
  
  // Get the CSS class for the day based on selection state
  const getDayClass = (day) => {
    let classes = "w-6 h-6 flex items-center justify-center text-xs rounded-full transition-all ";
    
    if (!day.isCurrentMonth) {
      classes += "text-gray-400 hover:bg-purple-50 ";
    } else {
      classes += "text-black ";
    }
    
    if (isDateSelected(day.date)) {
      classes += "bg-purple-600 text-white font-bold ";
    } else if (isInRange(day.date)) {
      classes += "bg-purple-100 text-purple-800 ";
    } else if (day.isCurrentMonth) {
      classes += "hover:bg-purple-100 ";
    }
    
    return classes + "cursor-pointer";
  };
  
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                      'July', 'August', 'September', 'October', 'November', 'December'];
  const weekdayNames = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  
  return (
    <div className="relative space-y-2">
      <label className="flex items-center space-x-1 text-[10px] font-black text-black">
        <Calendar size={12} className="text-purple-600" />
        <span>{label || 'Time Range'}</span>
      </label>
      
      <div className="relative">
        <input
          type="text"
          value={value}
          onClick={handleInputClick}
          placeholder="e.g., 2024-01-01 to 2024-12-31"
          disabled={disabled}
          className={`w-full px-2 py-1 text-xs bg-white border-1 border-black rounded-md shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] text-black font-medium placeholder-gray-500 focus:outline-none hover:bg-gray-50 cursor-pointer ${className || ''}`}
          readOnly
        />
        <div className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-purple-500 border-1 border-black rounded-full w-5 h-5 flex items-center justify-center pointer-events-none shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
          <Calendar 
            size={12} 
            className="text-white" 
          />
        </div>
      </div>
      
      {isOpen && !disabled && (
        <div className="absolute z-50 mt-1 bg-white border-1 border-black rounded-md shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] p-2 w-full max-w-[240px] sm:max-w-[260px]">
          <div className="mb-1 text-center">
            <div className="flex justify-between items-center mb-1">
              <button 
                onClick={prevMonth}
                className="p-0.5 border-1 border-black rounded-full hover:bg-purple-100"
              >
                <ChevronLeft size={14} />
              </button>
              
              <h3 className="font-bold text-sm">
                {monthNames[currentMonth]} {currentYear}
              </h3>
              
              <button 
                onClick={nextMonth}
                className="p-0.5 border-1 border-black rounded-full hover:bg-purple-100"
              >
                <ChevronRight size={14} />
              </button>
            </div>
            
            <div className="grid grid-cols-7 mb-0.5">
              {weekdayNames.map((day) => (
                <div key={day} className="text-center font-bold text-[10px] py-0.5 text-purple-800">
                  {day}
                </div>
              ))}
            </div>
            
            <div className="grid grid-cols-7 gap-0.5">
              {days.map((day, index) => (
                <div 
                  key={index}
                  className={getDayClass(day)}
                  onClick={() => handleDateClick(day.date)}
                >
                  <span className="text-[10px]">{day.date.getDate()}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-1 space-y-1">
            <div className="flex flex-col">
              <div className="font-bold text-[10px]">Selected Range:</div>
              <div className="text-[10px] text-purple-900 font-medium bg-purple-50 p-1 rounded-md border border-purple-200">
                {startDate && endDate ? (
                  <span>
                    {formatDate(startDate)} - {formatDate(endDate)}
                  </span>
                ) : (
                  <span>No date range selected</span>
                )}
              </div>
            </div>
            
            <div className="inline-block bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full font-medium text-[10px]">
              {selecting === 'start' ? 'Select start date' : 'Select end date'}
            </div>
          </div>
          
          <div className="mt-2 flex justify-between">
            <button
              onClick={() => {
                const today = new Date();
                const endOfYear = new Date(today.getFullYear(), 11, 31);
                setStartDate(today);
                setEndDate(endOfYear);
                setIsOpen(false);
              }}
              className="px-2 py-0.5 text-xs bg-white text-black font-bold rounded-md border-1 border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:bg-gray-100"
            >
              This Year
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="px-3 py-0.5 text-xs bg-purple-600 text-white font-bold rounded-md border-1 border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:bg-purple-700"
            >
              Done
            </button>
          </div>
        </div>
      )}
      
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-transparent" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default DateRangePicker;
