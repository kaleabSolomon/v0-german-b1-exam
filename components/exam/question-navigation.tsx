'use client';

import { useExam } from '@/lib/exam-context';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Flag } from 'lucide-react';
import { cn } from '@/lib/utils';

export function QuestionNavigation() {
  const { state, goToQuestion, getSectionQuestions, getAnswerForQuestion, finishExam } = useExam();
  const questions = getSectionQuestions(state.currentSection);

  const currentQuestion = state.currentQuestionIndex;
  const totalQuestions = questions.length;
  const isAnswered = getAnswerForQuestion(questions[currentQuestion]?.id);

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      goToQuestion(currentQuestion - 1);
    }
  };

  const handleNext = () => {
    if (currentQuestion < totalQuestions - 1) {
      goToQuestion(currentQuestion + 1);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Quick navigation grid */}
      <div className="border rounded-lg p-4 bg-card">
        <p className="text-xs font-semibold text-muted-foreground mb-3 uppercase">Questions</p>
        <div className="grid grid-cols-5 gap-2">
          {questions.map((q: any, idx: number) => {
            const answered = getAnswerForQuestion(q.id);
            const isCurrentQ = idx === currentQuestion;
            
            return (
              <button
                key={q.id}
                onClick={() => goToQuestion(idx)}
                className={cn(
                  'w-full aspect-square rounded-lg font-semibold text-sm transition-all',
                  isCurrentQ
                    ? 'bg-primary text-primary-foreground ring-2 ring-primary'
                    : answered
                    ? 'bg-accent text-accent-foreground hover:opacity-90'
                    : 'bg-border text-foreground hover:bg-muted'
                )}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>
      </div>

      {/* Navigation buttons */}
      <div className="flex gap-3">
        <Button
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
          variant="outline"
          className="flex-1 gap-2"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </Button>
        <Button
          onClick={handleNext}
          disabled={currentQuestion === totalQuestions - 1}
          className="flex-1 gap-2"
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      {/* Finish exam button */}
      <Button
        onClick={finishExam}
        variant="default"
        className="w-full gap-2"
      >
        <Flag className="w-4 h-4" />
        Finish Exam
      </Button>
    </div>
  );
}
