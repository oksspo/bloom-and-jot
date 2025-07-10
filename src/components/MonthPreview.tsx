
import { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday } from 'date-fns';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { DiaryEntry } from '@/pages/Index';

interface MonthPreviewProps {
  entries: { [key: string]: DiaryEntry };
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
}

const MonthPreview = ({ entries, selectedDate, onDateSelect }: MonthPreviewProps) => {
  const [viewDate, setViewDate] = useState(selectedDate);

  const monthStart = startOfMonth(viewDate);
  const monthEnd = endOfMonth(viewDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(viewDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setViewDate(newDate);
  };

  const getDayIndicators = (date: Date) => {
    const dateKey = format(date, 'yyyy-MM-dd');
    const entry = entries[dateKey];
    
    if (!entry) return null;

    const indicators = [];
    
    // Habits indicator
    const completedHabits = Object.values(entry.habits || {}).filter(Boolean).length;
    const totalHabits = Object.keys(entry.habits || {}).length;
    
    if (totalHabits > 0) {
      indicators.push(
        <div
          key="habits"
          className={cn(
            "w-1.5 h-1.5 rounded-full",
            completedHabits === totalHabits ? "bg-green-500" : 
            completedHabits > 0 ? "bg-yellow-500" : "bg-gray-300"
          )}
        />
      );
    }
    
    // Mood indicator
    if (entry.mood > 0) {
      indicators.push(
        <div
          key="mood"
          className={cn(
            "w-1.5 h-1.5 rounded-full",
            entry.mood >= 4 ? "bg-green-500" :
            entry.mood >= 3 ? "bg-yellow-500" : "bg-red-500"
          )}
        />
      );
    }
    
    // Notes indicator
    if (entry.notes && entry.notes.trim().length > 0) {
      indicators.push(
        <div
          key="notes"
          className="w-1.5 h-1.5 rounded-full bg-purple-500"
        />
      );
    }

    return indicators.length > 0 ? (
      <div className="flex gap-0.5 mt-1 justify-center">
        {indicators}
      </div>
    ) : null;
  };

  const getCompletionStats = () => {
    const monthEntries = daysInMonth
      .map(date => entries[format(date, 'yyyy-MM-dd')])
      .filter(Boolean);

    const daysWithEntries = monthEntries.length;
    const totalDays = daysInMonth.filter(date => date <= new Date()).length;
    
    return {
      daysWithEntries,
      totalDays,
      percentage: totalDays > 0 ? Math.round((daysWithEntries / totalDays) * 100) : 0
    };
  };

  const stats = getCompletionStats();

  return (
    <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-purple-600" />
            <CardTitle className="text-lg">
              {format(viewDate, 'MMMM yyyy')}
            </CardTitle>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigateMonth('prev')}
              className="hover:bg-purple-100"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigateMonth('next')}
              className="hover:bg-purple-100"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary" className="bg-purple-100 text-purple-700">
            {stats.daysWithEntries}/{stats.totalDays} days
          </Badge>
          <Badge variant="secondary" className="bg-green-100 text-green-700">
            {stats.percentage}% complete
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="text-center text-xs font-medium text-gray-500 p-1">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-1">
          {/* Empty cells for days before the month starts */}
          {Array.from({ length: monthStart.getDay() }).map((_, index) => (
            <div key={`empty-${index}`} className="h-8" />
          ))}
          
          {/* Days of the month */}
          {daysInMonth.map((date) => {
            const isSelected = isSameDay(date, selectedDate);
            const isTodayDate = isToday(date);
            const hasEntry = entries[format(date, 'yyyy-MM-dd')];
            const isFutureDate = date > new Date();
            
            return (
              <button
                key={format(date, 'yyyy-MM-dd')}
                onClick={() => onDateSelect(date)}
                disabled={isFutureDate}
                className={cn(
                  "h-8 text-xs rounded-md transition-colors relative flex flex-col items-center justify-center",
                  isSelected && "bg-purple-600 text-white font-medium",
                  !isSelected && isTodayDate && "bg-purple-100 text-purple-600 font-medium",
                  !isSelected && !isTodayDate && hasEntry && "bg-gray-100 hover:bg-gray-200",
                  !isSelected && !isTodayDate && !hasEntry && !isFutureDate && "hover:bg-gray-50",
                  isFutureDate && "text-gray-300 cursor-not-allowed"
                )}
              >
                <span className="text-xs">{format(date, 'd')}</span>
                {!isSelected && getDayIndicators(date)}
              </button>
            );
          })}
        </div>
        
        <div className="mt-4 pt-3 border-t border-gray-200">
          <div className="flex items-center justify-between text-xs text-gray-600">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                <span>Habits</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
                <span>Mood</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                <span>Notes</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MonthPreview;
