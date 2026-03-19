'use client';

import { useExam } from '@/lib/exam-context';
import { calculateExamScore } from '@/lib/scoring';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Volume2, PenTool, Mic, RotateCcw, Home, Trophy, Target } from 'lucide-react';
import { useEffect, useState } from 'react';

interface ExamResults {
  totalPointsEarned: number;
  totalPointsPossible: number;
  overallPercentage: number;
  sectionScores: Array<{
    sectionId: string;
    sectionTitle: string;
    pointsEarned: number;
    pointsPossible: number;
    percentage: number;
    answeredCount: number;
    totalQuestions: number;
  }>;
  level: string;
  timestamp: Date;
}

export default function ResultsPage() {
  const { state, goToSection, goToQuestion } = useExam();
  const router = useRouter();
  const [results, setResults] = useState<ExamResults | null>(null);

  useEffect(() => {
    if (!state.isExamFinished) {
      router.push('/');
    }
  }, [state.isExamFinished, router]);

  useEffect(() => {
    const calculatedResults = calculateExamScore(state.answers);
    setResults(calculatedResults);
  }, [state.answers]);

  const handleRetakeExam = () => {
    // Reset and go back to home
    router.push('/');
    window.location.reload();
  };

  const handleReviewSection = (sectionId: string) => {
    goToSection(sectionId);
    goToQuestion(0);
    router.push(`/exam/${sectionId}`);
  };

  if (!results) {
    return <div>Loading results...</div>;
  }

  const levelColors: Record<string, string> = {
    'Excellent': 'text-green-600 bg-green-50 border-green-200',
    'Very Good': 'text-blue-600 bg-blue-50 border-blue-200',
    'Good': 'text-cyan-600 bg-cyan-50 border-cyan-200',
    'Satisfactory': 'text-yellow-600 bg-yellow-50 border-yellow-200',
    'Acceptable': 'text-orange-600 bg-orange-50 border-orange-200',
    'Needs Improvement': 'text-red-600 bg-red-50 border-red-200',
  };

  const sectionIcons: Record<string, any> = {
    lesen: BookOpen,
    hoeren: Volume2,
    schreiben: PenTool,
    sprechen: Mic,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/5 p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Results Header */}
        <Card className="border-2 border-accent/30 bg-gradient-to-br from-card to-card/80">
          <CardHeader className="text-center space-y-4">
            <div className="flex justify-center">
              <Trophy className="w-12 h-12 text-accent" />
            </div>
            <div>
              <CardTitle className="text-3xl mb-2">Exam Complete!</CardTitle>
              <p className="text-muted-foreground">
                Here are your detailed results
              </p>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Overall score */}
            <div className="text-center space-y-4">
              <div className="inline-block">
                <div className={`p-8 rounded-2xl border-2 ${levelColors[results.level]}`}>
                  <div className="text-5xl font-bold">{results.overallPercentage}%</div>
                  <div className="text-lg font-semibold mt-2">{results.level}</div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                {results.totalPointsEarned} of {results.totalPointsPossible} points earned
              </p>
            </div>

            {/* Section breakdown */}
            <div className="space-y-3">
              <h3 className="font-semibold text-foreground">Results by Section</h3>
              <div className="grid gap-3">
                {results.sectionScores.map((section) => {
                  const Icon = sectionIcons[section.sectionId] || BookOpen;
                  const barWidth = `${section.percentage}%`;

                  return (
                    <div
                      key={section.sectionId}
                      className="space-y-2 p-4 rounded-lg border bg-card/50"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Icon className="w-4 h-4 text-primary" />
                          <span className="font-medium">{section.sectionTitle}</span>
                        </div>
                        <span className="text-sm font-semibold text-primary">
                          {section.percentage}%
                        </span>
                      </div>
                      <div className="w-full bg-border rounded-full h-2">
                        <div
                          className="bg-accent h-2 rounded-full transition-all duration-500"
                          style={{ width: barWidth }}
                        ></div>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {section.pointsEarned}/{section.pointsPossible} points • {section.answeredCount}/{section.totalQuestions} questions answered
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Performance analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Performance Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {results.overallPercentage >= 80 && (
                <div className="p-4 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm">
                  <p className="font-semibold mb-1">Excellent Performance!</p>
                  <p>You have demonstrated strong proficiency in German. Keep practicing to maintain and improve your skills.</p>
                </div>
              )}
              {results.overallPercentage >= 60 && results.overallPercentage < 80 && (
                <div className="p-4 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 text-sm">
                  <p className="font-semibold mb-1">Good Progress</p>
                  <p>You are making solid progress. Focus on areas with lower scores to improve overall performance.</p>
                </div>
              )}
              {results.overallPercentage < 60 && (
                <div className="p-4 rounded-lg bg-yellow-50 border border-yellow-200 text-yellow-700 text-sm">
                  <p className="font-semibold mb-1">Keep Practicing</p>
                  <p>There is room for improvement. Review the sections with lower scores and practice more regularly.</p>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                {results.sectionScores
                  .sort((a, b) => a.percentage - b.percentage)
                  .slice(0, 2)
                  .map((section) => (
                    <div
                      key={section.sectionId}
                      className="p-4 rounded-lg border bg-muted/30"
                    >
                      <p className="text-xs text-muted-foreground font-semibold mb-1">
                        Focus Area
                      </p>
                      <p className="font-semibold text-foreground">
                        {section.sectionTitle}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {section.percentage}% - Consider reviewing this section
                      </p>
                    </div>
                  ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Button
            onClick={handleRetakeExam}
            size="lg"
            className="gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Retake Exam
          </Button>
          <Button
            onClick={() => router.push('/')}
            variant="outline"
            size="lg"
            className="gap-2"
          >
            <Home className="w-4 h-4" />
            Back to Home
          </Button>
        </div>

        {/* Review sections */}
        <Card>
          <CardHeader>
            <CardTitle>Review Your Answers</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Click on any section to review your answers
            </p>
            <div className="grid grid-cols-2 gap-3">
              {results.sectionScores.map((section) => {
                const Icon = sectionIcons[section.sectionId] || BookOpen;

                return (
                  <Button
                    key={section.sectionId}
                    onClick={() => handleReviewSection(section.sectionId)}
                    variant="outline"
                    className="h-auto flex flex-col items-center gap-2 py-4"
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-xs font-medium text-center">
                      {section.sectionTitle}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {section.percentage}%
                    </span>
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
