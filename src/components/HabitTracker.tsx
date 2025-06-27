
import { useState, useEffect } from 'react';
import { Plus, Trash2, Target, Flame } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { DiaryEntry } from '@/pages/Index';
import { cn } from '@/lib/utils';

interface HabitTrackerProps {
  entry: DiaryEntry;
  onSave: (entry: DiaryEntry) => void;
  entries: { [key: string]: DiaryEntry };
}

const DEFAULT_HABITS = [
  'Drink 8 glasses of water',
  'Exercise for 30 minutes',
  'Read for 20 minutes',
  'Meditate',
  'Take vitamins',
  'Get 8 hours of sleep'
];

const HabitTracker = ({ entry, onSave, entries }: HabitTrackerProps) => {
  const [habits, setHabits] = useState<string[]>([]);
  const [newHabit, setNewHabit] = useState('');
  const [showAddHabit, setShowAddHabit] = useState(false);

  // Load habits from localStorage or use defaults
  useEffect(() => {
    const savedHabits = localStorage.getItem('diary-habits');
    if (savedHabits) {
      setHabits(JSON.parse(savedHabits));
    } else {
      setHabits(DEFAULT_HABITS);
      localStorage.setItem('diary-habits', JSON.stringify(DEFAULT_HABITS));
    }
  }, []);

  const addHabit = () => {
    if (newHabit.trim()) {
      const updatedHabits = [...habits, newHabit.trim()];
      setHabits(updatedHabits);
      localStorage.setItem('diary-habits', JSON.stringify(updatedHabits));
      setNewHabit('');
      setShowAddHabit(false);
    }
  };

  const removeHabit = (habitToRemove: string) => {
    const updatedHabits = habits.filter(habit => habit !== habitToRemove);
    setHabits(updatedHabits);
    localStorage.setItem('diary-habits', JSON.stringify(updatedHabits));
    
    // Also remove from all entries
    const updatedEntries = Object.keys(entries).reduce((acc, date) => {
      const entryData = entries[date];
      const updatedHabits = { ...entryData.habits };
      delete updatedHabits[habitToRemove];
      acc[date] = { ...entryData, habits: updatedHabits };
      return acc;
    }, {} as { [key: string]: DiaryEntry });
    
    localStorage.setItem('diary-entries', JSON.stringify(updatedEntries));
  };

  const toggleHabit = (habit: string) => {
    const updatedEntry = {
      ...entry,
      habits: {
        ...entry.habits,
        [habit]: !entry.habits[habit]
      }
    };
    onSave(updatedEntry);
  };

  const getHabitStreak = (habit: string): number => {
    let streak = 0;
    let currentDate = new Date(entry.date);
    
    while (true) {
      const dateKey = currentDate.toISOString().split('T')[0];
      const dayEntry = entries[dateKey];
      
      if (dayEntry && dayEntry.habits[habit]) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }
    
    return streak;
  };

  const completedHabits = habits.filter(habit => entry.habits[habit]).length;
  const completionPercentage = habits.length > 0 ? Math.round((completedHabits / habits.length) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Progress Overview */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-2">Today's Progress</h3>
              <p className="text-purple-100">
                {completedHabits} of {habits.length} habits completed
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">{completionPercentage}%</div>
              <div className="w-16 h-2 bg-white/20 rounded-full mt-2">
                <div 
                  className="h-full bg-white rounded-full transition-all duration-500"
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Habits List */}
      <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-purple-600" />
              Habits
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAddHabit(true)}
              className="hover:bg-purple-100"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Habit
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {habits.map((habit, index) => {
            const isCompleted = entry.habits[habit];
            const streak = getHabitStreak(habit);
            
            return (
              <div
                key={habit}
                className={cn(
                  "flex items-center justify-between p-4 rounded-lg border-2 transition-all duration-200",
                  isCompleted 
                    ? "bg-green-50 border-green-200" 
                    : "bg-gray-50 border-gray-200 hover:border-purple-200"
                )}
              >
                <div className="flex items-center space-x-3 flex-1">
                  <Checkbox
                    checked={isCompleted}
                    onCheckedChange={() => toggleHabit(habit)}
                    className="data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
                  />
                  <span className={cn(
                    "font-medium transition-all",
                    isCompleted ? "text-green-700 line-through" : "text-gray-700"
                  )}>
                    {habit}
                  </span>
                  {streak > 0 && (
                    <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                      <Flame className="h-3 w-3 mr-1" />
                      {streak} day{streak > 1 ? 's' : ''}
                    </Badge>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeHabit(habit)}
                  className="hover:bg-red-100 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            );
          })}

          {/* Add new habit form */}
          {showAddHabit && (
            <div className="flex gap-2 p-4 bg-purple-50 rounded-lg border-2 border-purple-200">
              <Input
                placeholder="Enter new habit..."
                value={newHabit}
                onChange={(e) => setNewHabit(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addHabit()}
                className="flex-1"
              />
              <Button onClick={addHabit} size="sm" className="bg-purple-600 hover:bg-purple-700">
                Add
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setShowAddHabit(false);
                  setNewHabit('');
                }}
              >
                Cancel
              </Button>
            </div>
          )}

          {habits.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Target className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No habits added yet. Click "Add Habit" to get started!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default HabitTracker;
