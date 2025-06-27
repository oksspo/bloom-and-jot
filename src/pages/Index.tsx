
import { useState, useEffect } from 'react';
import { format, subDays, addDays } from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar, TrendingUp, Heart, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import HabitTracker from '@/components/HabitTracker';
import MoodTracker from '@/components/MoodTracker';
import DailyNotes from '@/components/DailyNotes';
import { cn } from '@/lib/utils';

export interface DiaryEntry {
  date: string;
  habits: { [key: string]: boolean };
  mood: number;
  moodNote: string;
  notes: string;
}

const Index = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [entries, setEntries] = useState<{ [key: string]: DiaryEntry }>({});
  const [currentEntry, setCurrentEntry] = useState<DiaryEntry>({
    date: format(new Date(), 'yyyy-MM-dd'),
    habits: {},
    mood: 0,
    moodNote: '',
    notes: ''
  });

  const dateKey = format(selectedDate, 'yyyy-MM-dd');

  // Load data from localStorage on mount
  useEffect(() => {
    const savedEntries = localStorage.getItem('diary-entries');
    if (savedEntries) {
      setEntries(JSON.parse(savedEntries));
    }
  }, []);

  // Update current entry when date changes
  useEffect(() => {
    const entry = entries[dateKey] || {
      date: dateKey,
      habits: {},
      mood: 0,
      moodNote: '',
      notes: ''
    };
    setCurrentEntry(entry);
  }, [selectedDate, entries, dateKey]);

  // Save entry to localStorage
  const saveEntry = (updatedEntry: DiaryEntry) => {
    const updatedEntries = { ...entries, [dateKey]: updatedEntry };
    setEntries(updatedEntries);
    localStorage.setItem('diary-entries', JSON.stringify(updatedEntries));
    setCurrentEntry(updatedEntry);
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      setSelectedDate(subDays(selectedDate, 1));
    } else {
      setSelectedDate(addDays(selectedDate, 1));
    }
  };

  const isToday = format(selectedDate, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            My Daily Diary
          </h1>
          <p className="text-gray-600">Track your habits, mood, and thoughts</p>
        </div>

        {/* Date Navigation */}
        <Card className="mb-6 border-0 shadow-lg bg-white/70 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigateDate('prev')}
                className="hover:bg-purple-100 transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-purple-600" />
                <span className="text-xl font-semibold">
                  {format(selectedDate, 'EEEE, MMMM d, yyyy')}
                </span>
                {isToday && (
                  <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                    Today
                  </span>
                )}
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigateDate('next')}
                disabled={isToday}
                className="hover:bg-purple-100 transition-colors disabled:opacity-50"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <Tabs defaultValue="habits" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6 bg-white/70 backdrop-blur-sm">
            <TabsTrigger value="habits" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Habits
            </TabsTrigger>
            <TabsTrigger value="mood" className="flex items-center gap-2">
              <Heart className="h-4 w-4" />
              Mood
            </TabsTrigger>
            <TabsTrigger value="notes" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Notes
            </TabsTrigger>
          </TabsList>

          <TabsContent value="habits" className="animate-fade-in">
            <HabitTracker 
              entry={currentEntry} 
              onSave={saveEntry}
              entries={entries}
            />
          </TabsContent>

          <TabsContent value="mood" className="animate-fade-in">
            <MoodTracker 
              entry={currentEntry} 
              onSave={saveEntry}
            />
          </TabsContent>

          <TabsContent value="notes" className="animate-fade-in">
            <DailyNotes 
              entry={currentEntry} 
              onSave={saveEntry}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
