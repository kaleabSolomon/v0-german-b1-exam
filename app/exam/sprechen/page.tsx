'use client';

import { useExam } from '@/lib/exam-context';
import { SpeakingQuestion } from '@/components/exam/speaking-question';
import { SectionSidebar } from '@/components/exam/section-sidebar';
import { ExamTimer } from '@/components/exam/exam-timer';
import { QuestionNavigation } from '@/components/exam/question-navigation';

export default function SprechenPage() {
  const { state, getSectionQuestions } = useExam();
  const questions = getSectionQuestions('sprechen');
  
  // Reset to first question if index is out of bounds
  const questionIndex = Math.min(state.currentQuestionIndex, questions.length - 1);
  const currentQuestion = questions[Math.max(0, questionIndex)];

  if (!currentQuestion || !questions.length) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">No questions available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1 h-fit lg:sticky lg:top-6">
          <SectionSidebar />
        </div>

        {/* Main content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Header */}
          <div className="space-y-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Sprechen (Speaking)
              </h1>
              <p className="text-muted-foreground">
                Prepare and deliver spoken responses following the evaluation criteria
              </p>
            </div>
            <ExamTimer />
          </div>

          {/* Question */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-muted-foreground mb-1">
                  Question {state.currentQuestionIndex + 1} of {questions.length}
                </p>
                <div className="flex gap-2 items-center">
                  <span className="text-xs font-medium bg-accent/20 text-accent px-2 py-1 rounded">
                    {currentQuestion.type?.replace(/_/g, ' ').split(' ').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {currentQuestion.points} points
                  </span>
                </div>
              </div>
            </div>

            <SpeakingQuestion question={currentQuestion} />
          </div>

          {/* Navigation */}
          <QuestionNavigation />
        </div>
      </div>
    </div>
  );
}
