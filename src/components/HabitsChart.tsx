
import { useMemo } from 'react';
import { format, subDays, eachDayOfInterval } from 'date-fns';
import { Target, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { DiaryEntry } from '@/pages/Index';

interface HabitsChartProps {
  entries: { [key: string]: DiaryEntry };
  selectedDate: Date;
}

const HabitsChart = ({ entries, selectedDate }: HabitsChartProps) => {
  const chartData = useMemo(() => {
    const last7Days = eachDayOfInterval({
      start: subDays(selectedDate, 6),
      end: selectedDate
    });

    return last7Days.map(date => {
      const dateKey = format(date, 'yyyy-MM-dd');
      const entry = entries[dateKey];
      const habits = entry?.habits || {};
      const completed = Object.values(habits).filter(Boolean).length;
      const total = Object.keys(habits).length;
      const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

      return {
        day: format(date, 'EEE'),
        percentage,
        completed,
        total
      };
    });
  }, [entries, selectedDate]);

  const weeklyAverage = useMemo(() => {
    const validEntries = chartData.filter(item => item.total > 0);
    if (validEntries.length === 0) return 0;
    return Math.round(validEntries.reduce((sum, item) => sum + item.percentage, 0) / validEntries.length);
  }, [chartData]);

  return (
    <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm">
          <Target className="h-4 w-4 text-purple-600" />
          Habits (7 days)
        </CardTitle>
      </CardHeader>
      
      <CardContent className="pt-0">
        {chartData.some(item => item.total > 0) ? (
          <>
            <div className="h-20 mb-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <XAxis 
                    dataKey="day" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10 }}
                  />
                  <YAxis 
                    domain={[0, 100]} 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10 }}
                  />
                  <Bar 
                    dataKey="percentage" 
                    fill="#8b5cf6" 
                    radius={[2, 2, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-between text-xs text-gray-600">
              <span>Last 7 days</span>
              <span className="flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                Avg: {weeklyAverage}%
              </span>
            </div>
          </>
        ) : (
          <div className="text-center py-4 text-gray-500">
            <Target className="h-6 w-6 mx-auto mb-1 text-gray-300" />
            <p className="text-xs">No habits tracked yet</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default HabitsChart;
