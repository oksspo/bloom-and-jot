
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Heart, Smile } from 'lucide-react';
import { DiaryEntry } from '@/pages/Index';
import { cn } from '@/lib/utils';

interface MoodTrackerProps {
  entry: DiaryEntry;
  onSave: (entry: DiaryEntry) => void;
}

const MOODS = [
  { value: 1, emoji: '😢', label: 'Very Sad', color: 'from-blue-500 to-blue-600' },
  { value: 2, emoji: '😟', label: 'Sad', color: 'from-blue-400 to-blue-500' },
  { value: 3, emoji: '😐', label: 'Neutral', color: 'from-gray-400 to-gray-500' },
  { value: 4, emoji: '😊', label: 'Happy', color: 'from-yellow-400 to-yellow-500' },
  { value: 5, emoji: '😁', label: 'Very Happy', color: 'from-green-400 to-green-500' }
];

const MoodTracker = ({ entry, onSave }: MoodTrackerProps) => {
  const [moodNote, setMoodNote] = useState(entry.moodNote || '');

  const selectMood = (mood: number) => {
    const updatedEntry = { ...entry, mood };
    onSave(updatedEntry);
  };

  const saveMoodNote = () => {
    const updatedEntry = { ...entry, moodNote };
    onSave(updatedEntry);
  };

  const selectedMood = MOODS.find(mood => mood.value === entry.mood);

  return (
    <div className="space-y-6">
      {/* Mood Selection */}
      <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-pink-600" />
            How are you feeling today?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 gap-4 mb-6">
            {MOODS.map((mood) => (
              <button
                key={mood.value}
                onClick={() => selectMood(mood.value)}
                className={cn(
                  "p-4 rounded-xl border-2 transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-pink-300",
                  entry.mood === mood.value
                    ? "border-pink-400 bg-pink-50 shadow-lg"
                    : "border-gray-200 hover:border-pink-200 hover:bg-pink-25"
                )}
              >
                <div className="text-3xl mb-2">{mood.emoji}</div>
                <div className="text-sm font-medium text-gray-700">{mood.label}</div>
              </button>
            ))}
          </div>

          {/* Selected Mood Display */}
          {selectedMood && (
            <div className={cn(
              "p-6 rounded-xl bg-gradient-to-r text-white text-center",
              selectedMood.color
            )}>
              <div className="text-4xl mb-2">{selectedMood.emoji}</div>
              <div className="text-lg font-semibold">You're feeling {selectedMood.label.toLowerCase()}</div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Mood Notes */}
      <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smile className="h-5 w-5 text-orange-600" />
            What's on your mind?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Tell me more about how you're feeling today..."
            value={moodNote}
            onChange={(e) => setMoodNote(e.target.value)}
            className="min-h-[120px] resize-none border-2 focus:border-orange-300 focus:ring-orange-200"
          />
          <div className="flex justify-end mt-4">
            <Button
              onClick={saveMoodNote}
              className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white"
              disabled={moodNote === entry.moodNote}
            >
              Save Note
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Mood Insights */}
      {entry.mood > 0 && (
        <Card className="border-0 shadow-lg bg-gradient-to-r from-purple-100 to-pink-100">
          <CardContent className="p-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-purple-800 mb-2">
                Mood Insight
              </h3>
              <p className="text-purple-700">
                {entry.mood >= 4 
                  ? "Great to see you're feeling positive! Keep up the good vibes! 🌟"
                  : entry.mood === 3
                  ? "It's okay to have neutral days. Be kind to yourself. 💙"
                  : "Remember that it's okay to have difficult days. You're not alone. 🤗"
                }
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MoodTracker;
