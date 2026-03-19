'use client';

import { useExam } from '@/lib/exam-context';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export function SectionSidebar() {
  const { state, goToSection, getSectionQuestions, getAnswerForQuestion, getExamData } = useExam();
  const examData = getExamData();

  return (
    <Card className="p-6 h-full flex flex-col gap-4">
      <div>
        <h2 className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wide">
          Sections
        </h2>
        <div className="space-y-2">
          {examData.sections.map((section: any) => {
            const questions = getSectionQuestions(section.id);
            const answeredCount = questions.filter(
              (q: any) => getAnswerForQuestion(q.id)
            ).length;
            const isActive = state.currentSection === section.id;

            return (
              <Button
                key={section.id}
                onClick={() => goToSection(section.id)}
                variant={isActive ? 'default' : 'outline'}
                className={cn(
                  'w-full justify-between h-auto py-3',
                  isActive && 'bg-primary text-primary-foreground'
                )}
              >
                <div className="flex items-center gap-2 flex-1">
                  <span className="text-sm font-medium">{section.title}</span>
                </div>
                <div className="text-xs font-semibold">
                  {answeredCount}/{questions.length}
                </div>
              </Button>
            );
          })}
        </div>
      </div>

      <div className="mt-auto pt-4 border-t">
        <div className="space-y-2 text-xs text-muted-foreground">
          <p className="font-semibold text-foreground">Progress</p>
          {examData.sections.map((section: any) => {
            const questions = getSectionQuestions(section.id);
            const answeredCount = questions.filter(
              (q: any) => getAnswerForQuestion(q.id)
            ).length;
            const percentage = Math.round((answeredCount / questions.length) * 100);

            return (
              <div key={section.id}>
                <div className="flex justify-between mb-1">
                  <span>{section.title}</span>
                  <span>{percentage}%</span>
                </div>
                <div className="w-full bg-border rounded-full h-1.5">
                  <div
                    className="bg-accent h-1.5 rounded-full transition-all"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}
