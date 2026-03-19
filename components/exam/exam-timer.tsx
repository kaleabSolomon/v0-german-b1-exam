'use client';

import { useEffect } from 'react';
import { useExam } from '@/lib/exam-context';
import { Card } from '@/components/ui/card';
import { Clock, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ExamTimer() {
  const { state, updateTimer, finishExam } = useExam();
  const { timeRemaining, isExamFinished } = state;

  useEffect(() => {
    if (isExamFinished) return;

    const timer = setInterval(() => {
      if (timeRemaining <= 0) {
        finishExam();
        return;
      }
      updateTimer(timeRemaining - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining, isExamFinished, updateTimer, finishExam]);

  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  const isLowTime = timeRemaining < 300; // Less than 5 minutes

  const formatTime = (m: number, s: number) => {
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <Card className={cn(
      'px-6 py-4 flex items-center gap-4',
      isLowTime && 'bg-destructive/10 border-destructive/20'
    )}>
      <Clock className={cn(
        'w-5 h-5',
        isLowTime ? 'text-destructive' : 'text-primary'
      )} />
      <div>
        <p className="text-xs font-semibold text-muted-foreground uppercase">Time Remaining</p>
        <p className={cn(
          'text-2xl font-bold font-mono',
          isLowTime ? 'text-destructive' : 'text-foreground'
        )}>
          {formatTime(minutes, seconds)}
        </p>
      </div>
      {isLowTime && (
        <div className="ml-auto flex items-center gap-2 text-destructive text-xs font-medium">
          <AlertCircle className="w-4 h-4" />
          Time running low!
        </div>
      )}
    </Card>
  );
}
