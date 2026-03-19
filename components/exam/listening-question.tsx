'use client';

import { useState } from 'react';
import { useExam } from '@/lib/exam-context';
import { useTextToSpeech } from '@/hooks/use-text-to-speech';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Volume2, Loader2, AlertCircle } from 'lucide-react';

interface ListeningQuestionProps {
  question: any;
}

export function ListeningQuestion({ question }: ListeningQuestionProps) {
  const { saveAnswer, getAnswerForQuestion } = useExam();
  const { isLoading, isPlaying, error, generateAndPlay, stop, pause, resume } =
    useTextToSpeech();
  const [hasPlayedAudio, setHasPlayedAudio] = useState(false);
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

  const handlePlayAudio = async () => {
    if (question.content?.transcript) {
      try {
        await generateAndPlay(question.content.transcript);
        setHasPlayedAudio(true);
      } catch (err) {
        console.error('[v0] Failed to play audio:', err);
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{question.question}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Audio player section */}
        <div className="rounded-lg bg-secondary/50 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-foreground text-sm">
                Audio Content
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Click the button below to listen to the audio transcript
              </p>
            </div>
            <Volume2 className="w-5 h-5 text-accent" />
          </div>

          <div className="flex gap-2">
            {isPlaying ? (
              <>
                <Button
                  onClick={pause}
                  disabled={isLoading}
                  variant="outline"
                  size="sm"
                  className="flex-1"
                >
                  Pause Audio
                </Button>
                <Button
                  onClick={stop}
                  disabled={isLoading}
                  variant="outline"
                  size="sm"
                  className="flex-1"
                >
                  Stop
                </Button>
              </>
            ) : (
              <Button
                onClick={handlePlayAudio}
                disabled={isLoading}
                size="sm"
                className="w-full gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Generating Audio...
                  </>
                ) : (
                  <>
                    <Volume2 className="w-4 h-4" />
                    Play Audio
                  </>
                )}
              </Button>
            )}
          </div>

          {error && (
            <div className="rounded-lg bg-destructive/10 p-3 flex gap-2 items-start">
              <AlertCircle className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
              <p className="text-xs text-destructive">{error}</p>
            </div>
          )}

          {hasPlayedAudio && (
            <p className="text-xs text-accent font-medium">
              ✓ Audio played
            </p>
          )}
        </div>

        {/* Answer input section */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Your answer:</label>
          <Input
            placeholder="Type your answer here..."
            value={value}
            onChange={(e) => saveAnswer(question.id, e.target.value)}
            className="min-h-24 p-3"
          />
          <p className="text-xs text-muted-foreground">
            Listen to the audio and provide your answer based on what you heard.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
