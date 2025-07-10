
import { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday } from 'date-fns';
import { Calendar, ChevronLeft, ChevronRight, Heart } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { DiaryEntry } from '@/pages/Index';

interface MoodMonthPreviewProps {
  entries: { [key: string]: DiaryEntry };
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
}

const MOOD_COLORS = {
  1: 'bg-red-500',
  2: 'bg-orange-500', 
  3: 'bg-yellow-500',
  4: 'bg-green-400',
  5: 'bg-green-500'
};

const MOOD_LABELS = {
  1: 'Very Sad',
  2: 'Sad',
  3: 'Neutral', 
  4: 'Happy',
  5: 'Very Happy'
};

const MoodMonthPreview = ({ entries, selectedDate, onDateSelect }: MoodMonthPreviewProps) => {
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

  const getMoodStats = () => {
    const monthEntries = daysInMonth
      .map(date => entries[format(date, 'yyyy-MM-dd')])
      .filter(entry => entry && entry.mood > 0);

    const totalMoodDays = monthEntries.length;
    const averageMood = totalMoodDays > 0 
      ? Math.round((monthEntries.reduce((sum, entry) => sum + entry.mood, 0) / totalMoodDays) * 10) / 10
      : 0;

    const moodCounts = monthEntries.reduce((acc, entry) => {
      acc[entry.mood] = (acc[entry.mood] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);

    const mostFrequentMood = Object.entries(moodCounts)
      .sort(([,a], [,b]) => b - a)[0]?.[0];

    return {
      totalMoodDays,
      averageMood,
      mostFrequentMood: mostFrequentMood ? parseInt(mostFrequentMood) : null
    };
  };

  const stats = getMoodStats();

  return (
    <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Heart className="h-5 w-5 text-pink-600" />
            <CardTitle className="text-lg">
              Mood - {format(viewDate, 'MMMM yyyy')}
            </CardTitle>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigateMonth('prev')}
              className="hover:bg-pink-100"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigateMonth('next')}
              className="hover:bg-pink-100"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary" className="bg-pink-100 text-pink-700">
            {stats.totalMoodDays} mood entries
          </Badge>
          {stats.averageMood > 0 && (
            <Badge variant="secondary" className="bg-green-100 text-green-700">
              Avg: {stats.averageMood}/5
            </Badge>
          )}
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
            <div key={`empty-${index}`} className="h-10" />
          ))}
          
          {/* Days of the month */}
          {daysInMonth.map((date) => {
            const isSelected = isSameDay(date, selectedDate);
            const isTodayDate = isToday(date);
            const entry = entries[format(date, 'yyyy-MM-dd')];
            const hasMood = entry && entry.mood > 0;
            const isFutureDate = date > new Date();
            
            return (
              <button
                key={format(date, 'yyyy-MM-dd')}
                onClick={() => onDateSelect(date)}
                disabled={isFutureDate}
                className={cn(
                  "h-10 text-xs rounded-md transition-colors relative flex flex-col items-center justify-center",
                  isSelected && "ring-2 ring-pink-600 ring-offset-1",
                  !isSelected && isTodayDate && "bg-pink-100 text-pink-600 font-medium",
                  !isSelected && !isTodayDate && hasMood && "hover:bg-gray-100",
                  !isSelected && !isTodayDate && !hasMood && !isFutureDate && "hover:bg-gray-50",
                  isFutureDate && "text-gray-300 cursor-not-allowed",
                  hasMood && MOOD_COLORS[entry.mood as keyof typeof MOOD_COLORS]
                )}
              >
                <span className={cn(
                  "text-xs font-medium",
                  hasMood && (entry.mood >= 3 ? "text-white" : "text-gray-800")
                )}>
                  {format(date, 'd')}
                </span>
              </button>
            );
          })}
        </div>
        
        {/* Mood Legend */}
        <div className="mt-4 pt-3 border-t border-gray-200">
          <div className="grid grid-cols-5 gap-2 text-xs">
            {Object.entries(MOOD_LABELS).map(([value, label]) => (
              <div key={value} className="flex items-center space-x-1">
                <div className={cn("w-3 h-3 rounded", MOOD_COLORS[parseInt(value) as keyof typeof MOOD_COLORS])} />
                <span className="text-gray-600">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Most frequent mood */}
        {stats.mostFrequentMood && (
          <div className="mt-3 p-3 bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg">
            <div className="text-center text-sm">
              <span className="text-gray-600">Most frequent mood: </span>
              <span className="font-semibold text-pink-700">
                {MOOD_LABELS[stats.mostFrequentMood as keyof typeof MOOD_LABELS]}
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MoodMonthPreview;
