
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Save, FileText } from 'lucide-react';
import { DiaryEntry } from '@/pages/Index';

interface DailyNotesProps {
  entry: DiaryEntry;
  onSave: (entry: DiaryEntry) => void;
}

const DailyNotes = ({ entry, onSave }: DailyNotesProps) => {
  const [notes, setNotes] = useState(entry.notes || '');
  const [wordCount, setWordCount] = useState(0);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    setNotes(entry.notes || '');
    setHasUnsavedChanges(false);
  }, [entry.notes]);

  useEffect(() => {
    const words = notes.trim().split(/\s+/).filter(word => word.length > 0);
    setWordCount(words.length);
    setHasUnsavedChanges(notes !== entry.notes);
  }, [notes, entry.notes]);

  const saveNotes = () => {
    const updatedEntry = { ...entry, notes };
    onSave(updatedEntry);
    setHasUnsavedChanges(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.ctrlKey && e.key === 's') {
      e.preventDefault();
      saveNotes();
    }
  };

  return (
    <div className="space-y-6">
      {/* Notes Editor */}
      <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-blue-600" />
              Daily Notes
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                <FileText className="h-3 w-3 mr-1" />
                {wordCount} words
              </Badge>
              {hasUnsavedChanges && (
                <Badge variant="outline" className="border-orange-300 text-orange-700">
                  Unsaved changes
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Textarea
              placeholder="What happened today? Write about your thoughts, experiences, goals, or anything else on your mind..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              onKeyDown={handleKeyDown}
              className="min-h-[300px] resize-none border-2 focus:border-blue-300 focus:ring-blue-200 text-gray-700 leading-relaxed"
            />
            
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-500">
                💡 Tip: Use Ctrl+S to save quickly
              </p>
              <Button
                onClick={saveNotes}
                disabled={!hasUnsavedChanges}
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Notes
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Writing Prompts */}
      {!notes && (
        <Card className="border-0 shadow-lg bg-gradient-to-br from-yellow-50 to-orange-50">
          <CardHeader>
            <CardTitle className="text-orange-800">Writing Prompts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-semibold text-orange-700">Reflection</h4>
                <ul className="text-sm text-orange-600 space-y-1">
                  <li>• What am I grateful for today?</li>
                  <li>• What did I learn today?</li>
                  <li>• What challenged me today?</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-orange-700">Planning</h4>
                <ul className="text-sm text-orange-600 space-y-1">
                  <li>• What are my goals for tomorrow?</li>
                  <li>• What can I improve on?</li>
                  <li>• How can I be better tomorrow?</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Notes Stats */}
      {notes && (
        <Card className="border-0 shadow-lg bg-gradient-to-r from-green-50 to-blue-50">
          <CardContent className="p-6">
            <div className="grid grid-cols-3 text-center">
              <div>
                <div className="text-2xl font-bold text-green-600">{wordCount}</div>
                <div className="text-sm text-gray-600">Words</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">{notes.length}</div>
                <div className="text-sm text-gray-600">Characters</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">
                  {Math.ceil(notes.length / 5)}
                </div>
                <div className="text-sm text-gray-600">Avg. Reading Time (s)</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DailyNotes;
