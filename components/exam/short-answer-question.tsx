'use client';

import { useExam } from '@/lib/exam-context';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ShortAnswerQuestionProps {
  question: any;
}

export function ShortAnswerQuestion({
  question,
}: ShortAnswerQuestionProps) {
  const { saveAnswer, getAnswerForQuestion } = useExam();
  const answer = getAnswerForQuestion(question.id);
  const value = answer?.value || '';

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{question.question}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {question.content?.transcript && (
          <div className="rounded-lg bg-accent/10 p-4 text-sm italic">
            <p className="font-semibold text-accent mb-2">Transcription:</p>
            {question.content.transcript}
          </div>
        )}
        <div className="space-y-2">
          <label className="text-sm font-medium">Your answer:</label>
          <Input
            placeholder="Type your answer here..."
            value={value}
            onChange={(e) => saveAnswer(question.id, e.target.value)}
            className="min-h-24 p-3 resize-none"
          />
        </div>
      </CardContent>
    </Card>
  );
}
