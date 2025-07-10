
import { useMemo } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { TrendingUp, Heart } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { DiaryEntry } from '@/pages/Index';

interface MoodChartProps {
  entries: { [key: string]: DiaryEntry };
  selectedDate: Date;
}

const MoodChart = ({ entries, selectedDate }: MoodChartProps) => {
  const chartData = useMemo(() => {
    const monthStart = startOfMonth(selectedDate);
    const monthEnd = endOfMonth(selectedDate);
    const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

    return daysInMonth.map(date => {
      const dateKey = format(date, 'yyyy-MM-dd');
      const entry = entries[dateKey];
      return {
        day: format(date, 'd'),
        mood: entry?.mood || 0
      };
    }).filter(item => item.mood > 0);
  }, [entries, selectedDate]);

  const averageMood = useMemo(() => {
    if (chartData.length === 0) return 0;
    return Math.round((chartData.reduce((sum, item) => sum + item.mood, 0) / chartData.length) * 10) / 10;
  }, [chartData]);

  return (
    <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm">
          <Heart className="h-4 w-4 text-pink-600" />
          Mood Trend
        </CardTitle>
      </CardHeader>
      
      <CardContent className="pt-0">
        {chartData.length > 0 ? (
          <>
            <div className="h-20 mb-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <XAxis 
                    dataKey="day" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10 }}
                  />
                  <YAxis 
                    domain={[1, 5]} 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="mood" 
                    stroke="#ec4899" 
                    strokeWidth={2}
                    dot={{ fill: '#ec4899', r: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-between text-xs text-gray-600">
              <span>{chartData.length} entries</span>
              <span className="flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                Avg: {averageMood}/5
              </span>
            </div>
          </>
        ) : (
          <div className="text-center py-4 text-gray-500">
            <Heart className="h-6 w-6 mx-auto mb-1 text-gray-300" />
            <p className="text-xs">No mood data yet</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MoodChart;
