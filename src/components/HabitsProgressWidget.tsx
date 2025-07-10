
import { useMemo } from 'react';
import { format, subDays, eachDayOfInterval } from 'date-fns';
import { Target, TrendingUp, Award, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { DiaryEntry } from '@/pages/Index';

interface HabitsProgressWidgetProps {
  entries: { [key: string]: DiaryEntry };
  selectedDate: Date;
}

const HabitsProgressWidget = ({ entries, selectedDate }: HabitsProgressWidgetProps) => {
  const stats = useMemo(() => {
    // Get last 7 days including selected date
    const last7Days = eachDayOfInterval({
      start: subDays(selectedDate, 6),
      end: selectedDate
    });

    // Get last 30 days including selected date  
    const last30Days = eachDayOfInterval({
      start: subDays(selectedDate, 29),
      end: selectedDate
    });

    // Calculate today's habits
    const todayEntry = entries[format(selectedDate, 'yyyy-MM-dd')];
    const todayHabits = todayEntry?.habits || {};
    const todayCompleted = Object.values(todayHabits).filter(Boolean).length;
    const todayTotal = Object.keys(todayHabits).length;
    const todayPercentage = todayTotal > 0 ? Math.round((todayCompleted / todayTotal) * 100) : 0;

    // Calculate 7-day streak
    let currentStreak = 0;
    for (let i = last7Days.length - 1; i >= 0; i--) {
      const dayEntry = entries[format(last7Days[i], 'yyyy-MM-dd')];
      if (dayEntry?.habits) {
        const habits = Object.values(dayEntry.habits);
        const completedCount = habits.filter(Boolean).length;
        const totalCount = habits.length;
        
        if (totalCount > 0 && (completedCount / totalCount) >= 0.5) { // 50% completion threshold
          currentStreak++;
        } else {
          break;
        }
      } else {
        break;
      }
    }

    // Calculate weekly average
    const weeklyEntries = last7Days
      .map(date => entries[format(date, 'yyyy-MM-dd')])
      .filter(entry => entry?.habits && Object.keys(entry.habits).length > 0);
    
    const weeklyAverage = weeklyEntries.length > 0 
      ? Math.round(weeklyEntries.reduce((sum, entry) => {
          const habits = Object.values(entry.habits);
          const percentage = habits.length > 0 ? (habits.filter(Boolean).length / habits.length) * 100 : 0;
          return sum + percentage;
        }, 0) / weeklyEntries.length)
      : 0;

    // Calculate monthly average
    const monthlyEntries = last30Days
      .map(date => entries[format(date, 'yyyy-MM-dd')])
      .filter(entry => entry?.habits && Object.keys(entry.habits).length > 0);
    
    const monthlyAverage = monthlyEntries.length > 0 
      ? Math.round(monthlyEntries.reduce((sum, entry) => {
          const habits = Object.values(entry.habits);
          const percentage = habits.length > 0 ? (habits.filter(Boolean).length / habits.length) * 100 : 0;
          return sum + percentage;
        }, 0) / monthlyEntries.length)
      : 0;

    // Get most consistent habit
    const allHabits: Record<string, number> = {};
    last30Days.forEach(date => {
      const entry = entries[format(date, 'yyyy-MM-dd')];
      if (entry?.habits) {
        Object.entries(entry.habits).forEach(([habit, completed]) => {
          if (!allHabits[habit]) allHabits[habit] = 0;
          if (completed) allHabits[habit]++;
        });
      }
    });

    const mostConsistent = Object.entries(allHabits)
      .sort(([,a], [,b]) => b - a)[0];

    return {
      todayCompleted,
      todayTotal,
      todayPercentage,
      currentStreak,
      weeklyAverage,
      monthlyAverage,
      mostConsistent: mostConsistent ? {
        name: mostConsistent[0],
        count: mostConsistent[1],
        percentage: Math.round((mostConsistent[1] / last30Days.length) * 100)
      } : null
    };
  }, [entries, selectedDate]);

  return (
    <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5 text-purple-600" />
          Habits Progress
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Today's Progress */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Today's Progress</span>
            <Badge variant="secondary" className={cn(
              stats.todayPercentage >= 80 ? "bg-green-100 text-green-700" :
              stats.todayPercentage >= 50 ? "bg-yellow-100 text-yellow-700" :
              "bg-gray-100 text-gray-700"
            )}>
              {stats.todayCompleted}/{stats.todayTotal}
            </Badge>
          </div>
          <Progress value={stats.todayPercentage} className="h-2" />
          <p className="text-xs text-gray-500">
            {stats.todayPercentage}% of habits completed today
          </p>
        </div>

        {/* Streak */}
        <div className="flex items-center justify-between p-3 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-4 w-4 text-orange-600" />
            <span className="text-sm font-medium text-orange-800">Current Streak</span>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-orange-600">{stats.currentStreak}</div>
            <div className="text-xs text-orange-700">day{stats.currentStreak !== 1 ? 's' : ''}</div>
          </div>
        </div>

        {/* Averages */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center space-x-1 mb-1">
              <Calendar className="h-3 w-3 text-blue-600" />
              <span className="text-xs font-medium text-blue-800">7-Day Avg</span>
            </div>
            <div className="text-lg font-bold text-blue-600">{stats.weeklyAverage}%</div>
          </div>
          
          <div className="p-3 bg-purple-50 rounded-lg">
            <div className="flex items-center space-x-1 mb-1">
              <Calendar className="h-3 w-3 text-purple-600" />
              <span className="text-xs font-medium text-purple-800">30-Day Avg</span>
            </div>
            <div className="text-lg font-bold text-purple-600">{stats.monthlyAverage}%</div>
          </div>
        </div>

        {/* Most Consistent Habit */}
        {stats.mostConsistent && (
          <div className="p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Award className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium text-green-800">Most Consistent</span>
            </div>
            <div className="text-sm text-green-700 font-medium mb-1">
              {stats.mostConsistent.name}
            </div>
            <div className="text-xs text-green-600">
              {stats.mostConsistent.count} times in 30 days ({stats.mostConsistent.percentage}%)
            </div>
          </div>
        )}

        {/* Empty state */}
        {stats.todayTotal === 0 && (
          <div className="text-center py-4 text-gray-500">
            <Target className="h-8 w-8 mx-auto mb-2 text-gray-300" />
            <p className="text-sm">No habits tracked yet</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default HabitsProgressWidget;
