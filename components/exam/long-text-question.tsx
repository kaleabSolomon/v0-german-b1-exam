'use client';

import { useExam } from '@/lib/exam-context';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface LongTextQuestionProps {
  question: any;
}

export function LongTextQuestion({
  question,
}: LongTextQuestionProps) {
  const { saveAnswer, getAnswerForQuestion } = useExam();
  const answer = getAnswerForQuestion(question?.id);
  const value = answer?.value || '';

  if (!question) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-muted-foreground">Question not available</p>
        </CardContent>
      </Card>
    );
  }

  const wordCount = value.trim().split(/\s+/).filter(w => w.length > 0).length;
  const minWords = question.constraints?.minWords || 0;
  const isMinMet = wordCount >= minWords;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{question.question}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium">Your answer:</label>
            <span className={`text-xs font-medium ${isMinMet ? 'text-accent' : 'text-muted-foreground'}`}>
              {wordCount} / {minWords} words
            </span>
          </div>
          <Textarea
            placeholder="Write your response here..."
            value={value}
            onChange={(e) => saveAnswer(question.id, e.target.value)}
            className="min-h-48 resize-none"
          />
        </div>
        {question.constraints?.mustInclude && (
          <div className="rounded-lg bg-secondary/50 p-3 text-xs space-y-1">
            <p className="font-semibold text-foreground">Requirements:</p>
            <ul className="space-y-1 text-muted-foreground">
              {question.constraints.mustInclude.map((item: string) => (
                <li key={item}>• Must include: "{item}"</li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
