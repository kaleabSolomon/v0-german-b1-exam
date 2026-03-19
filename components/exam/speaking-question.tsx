'use client';

import { useState } from 'react';
import { useExam } from '@/lib/exam-context';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mic, Square } from 'lucide-react';

interface SpeakingQuestionProps {
  question: any;
}

export function SpeakingQuestion({
  question,
}: SpeakingQuestionProps) {
  const { saveAnswer, getAnswerForQuestion } = useExam();
  const answer = getAnswerForQuestion(question.id);
  const [isRecording, setIsRecording] = useState(false);
  const [notes, setNotes] = useState(answer?.value || '');

  const handleStartRecording = () => {
    // Note: This is a placeholder. Real implementation would use Web Audio API
    setIsRecording(true);
  };

  const handleStopRecording = () => {
    setIsRecording(false);
  };

  const handleSaveNotes = () => {
    saveAnswer(question.id, notes);
  };

  const evaluationCriteria = question.evaluationCriteria || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{question.question}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="rounded-lg bg-accent/10 border border-accent/20 p-6">
          <p className="text-sm text-muted-foreground mb-4">
            In a real exam environment, you would record your answer here using your microphone.
          </p>
          <div className="flex gap-3">
            {!isRecording ? (
              <Button
                onClick={handleStartRecording}
                className="gap-2"
                size="lg"
              >
                <Mic className="w-4 h-4" />
                Start Recording
              </Button>
            ) : (
              <Button
                onClick={handleStopRecording}
                variant="destructive"
                className="gap-2"
                size="lg"
              >
                <Square className="w-4 h-4" />
                Stop Recording
              </Button>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-sm font-medium">Notes & Preparation:</label>
          <Textarea
            placeholder="Use this space to prepare or take notes for your spoken response..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="min-h-32 resize-none"
          />
          <Button onClick={handleSaveNotes} variant="outline" className="w-full">
            Save Notes
          </Button>
        </div>

        {evaluationCriteria.length > 0 && (
          <div className="rounded-lg bg-secondary/50 p-4 space-y-2">
            <p className="text-sm font-semibold">Evaluation Criteria:</p>
            <ul className="space-y-1">
              {evaluationCriteria.map((criterion: string) => (
                <li key={criterion} className="text-sm text-muted-foreground flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                  {criterion}
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
