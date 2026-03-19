'use client';

import { useExam } from '@/lib/exam-context';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface MultipleChoiceQuestionProps {
  question: any;
}

export function MultipleChoiceQuestion({
  question,
}: MultipleChoiceQuestionProps) {
  const { saveAnswer, getAnswerForQuestion } = useExam();
  const answer = getAnswerForQuestion(question?.id);
  const selectedValue = answer?.value?.toString() || '';

  if (!question) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-muted-foreground">Question not available</p>
        </CardContent>
      </Card>
    );
  }

  const options = question.options || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{question.question}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {question.content?.text && (
          <div className="rounded-lg bg-secondary p-4 text-sm">
            {question.content.text}
          </div>
        )}
        <RadioGroup
          value={selectedValue}
          onValueChange={(value) =>
            saveAnswer(question.id, parseInt(value))
          }
        >
          <div className="space-y-3">
            {options.map((option: string, index: number) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                <Label
                  htmlFor={`option-${index}`}
                  className="flex-1 cursor-pointer font-normal"
                >
                  {option}
                </Label>
              </div>
            ))}
          </div>
        </RadioGroup>
      </CardContent>
    </Card>
  );
}
