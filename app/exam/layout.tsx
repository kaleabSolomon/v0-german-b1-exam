'use client';

import { useExam } from '@/lib/exam-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

export default function ExamLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { state, finishExam } = useExam();
  const router = useRouter();

  useEffect(() => {
    if (!state.isExamStarted) {
      router.push('/');
    }
  }, [state.isExamStarted, router]);

  const handleEndExam = () => {
    finishExam();
    router.push('/exam/results');
  };

  if (!state.isExamStarted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Exam header with end button */}
      <div className="sticky top-0 z-40 border-b bg-card/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
              B1
            </div>
            <span className="text-sm font-semibold text-foreground">
              German B1 Exam
            </span>
          </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm">
                End Exam
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>End Exam</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to end the exam? You will not be able to continue after this.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <div className="flex gap-3 justify-end">
                <AlertDialogCancel>Continue Exam</AlertDialogCancel>
                <AlertDialogAction onClick={handleEndExam} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                  End Exam
                </AlertDialogAction>
              </div>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {/* Main content */}
      {children}
    </div>
  );
}
