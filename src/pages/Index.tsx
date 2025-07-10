import { useState, useEffect } from 'react';
import { format, subDays, addDays } from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar, TrendingUp, Heart, BookOpen, LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import HabitTracker from '@/components/HabitTracker';
import MoodTracker from '@/components/MoodTracker';
import DailyNotes from '@/components/DailyNotes';
import MonthPreview from '@/components/MonthPreview';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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
  
  const { user, signOut } = useAuth();
  const { toast } = useToast();

  const dateKey = format(selectedDate, 'yyyy-MM-dd');

  // Helper function to safely parse habits from JSON
  const parseHabits = (habits: any): { [key: string]: boolean } => {
    if (!habits || typeof habits !== 'object' || Array.isArray(habits)) {
      return {};
    }
    
    // Ensure all values are boolean
    const parsedHabits: { [key: string]: boolean } = {};
    Object.keys(habits).forEach(key => {
      parsedHabits[key] = Boolean(habits[key]);
    });
    
    return parsedHabits;
  };

  // Load data from Supabase
  useEffect(() => {
    const loadEntries = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('diary_entries')
          .select('*')
          .eq('user_id', user.id);
        
        if (error) {
          console.error('Error loading entries:', error);
          return;
        }
        
        const entriesMap: { [key: string]: DiaryEntry } = {};
        data?.forEach(entry => {
          entriesMap[entry.date] = {
            date: entry.date,
            habits: parseHabits(entry.habits),
            mood: entry.mood || 0,
            moodNote: entry.mood_note || '',
            notes: entry.notes || ''
          };
        });
        
        setEntries(entriesMap);
      } catch (error) {
        console.error('Error loading entries:', error);
      }
    };

    loadEntries();
  }, [user]);

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

  // Save entry to Supabase
  const saveEntry = async (updatedEntry: DiaryEntry) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('diary_entries')
        .upsert({
          user_id: user.id,
          date: updatedEntry.date,
          habits: updatedEntry.habits,
          mood: updatedEntry.mood,
          mood_note: updatedEntry.moodNote,
          notes: updatedEntry.notes,
          updated_at: new Date().toISOString()
        });
      
      if (error) {
        console.error('Error saving entry:', error);
        toast({
          title: "Error",
          description: "Failed to save your entry. Please try again.",
          variant: "destructive"
        });
        return;
      }
      
      const updatedEntries = { ...entries, [dateKey]: updatedEntry };
      setEntries(updatedEntries);
      setCurrentEntry(updatedEntry);
      
      toast({
        title: "Saved!",
        description: "Your diary entry has been saved.",
      });
    } catch (error) {
      console.error('Error saving entry:', error);
      toast({
        title: "Error",
        description: "Failed to save your entry. Please try again.",
        variant: "destructive"
      });
    }
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      setSelectedDate(subDays(selectedDate, 1));
    } else {
      setSelectedDate(addDays(selectedDate, 1));
    }
  };

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: "Signed out",
      description: "You've been successfully signed out.",
    });
  };

  const isToday = format(selectedDate, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header with User Info */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <User className="h-6 w-6 text-purple-600 mr-2" />
              <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                {user?.email}
              </Badge>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSignOut}
              className="hover:bg-red-100 hover:text-red-600"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            My Daily Diary
          </h1>
          <p className="text-gray-600">Track your habits, mood, and thoughts</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Month Preview - Left Side */}
          <div className="lg:col-span-1">
            <MonthPreview 
              entries={entries}
              selectedDate={selectedDate}
              onDateSelect={setSelectedDate}
            />
          </div>

          {/* Main Content - Right Side */}
          <div className="lg:col-span-2">
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

            {/* Main Content Tabs */}
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
      </div>
    </div>
  );
};

export default Index;
