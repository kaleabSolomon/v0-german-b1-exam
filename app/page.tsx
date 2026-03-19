'use client';

import { useExam } from '@/lib/exam-context';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Volume2, PenTool, Mic, Clock, Target } from 'lucide-react';

export default function Home() {
  const { startExam, state, getExamData } = useExam();
  const router = useRouter();
  const examData = getExamData();

  const handleStartExam = () => {
    startExam();
    router.push('/exam/lesen');
  };

  if (state.isExamStarted && !state.isExamFinished) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/5 p-6">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader className="text-center space-y-2">
              <CardTitle className="text-2xl">
                Exam in Progress
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                You are currently taking the exam
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {examData.sections.map((section: any) => (
                  <Button
                    key={section.id}
                    onClick={() => router.push(`/exam/${section.id}`)}
                    variant="outline"
                    className="h-auto flex flex-col items-center gap-2 py-4"
                  >
                    {section.id === 'lesen' && <BookOpen className="w-5 h-5" />}
                    {section.id === 'hoeren' && <Volume2 className="w-5 h-5" />}
                    {section.id === 'schreiben' && <PenTool className="w-5 h-5" />}
                    {section.id === 'sprechen' && <Mic className="w-5 h-5" />}
                    <span className="text-sm font-medium">{section.title}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/5">
      {/* Header */}
      <div className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold">
              B1
            </div>
            <div>
              <h1 className="font-bold text-lg">{examData.meta.title}</h1>
              <p className="text-xs text-muted-foreground">German Language Proficiency Test</p>
            </div>
          </div>
        </div>
      </div>

      {/* Hero section */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <div className="space-y-6">
            <div className="space-y-3">
              <h2 className="text-5xl font-bold text-foreground leading-tight">
                Test Your German Skills
              </h2>
              <p className="text-xl text-muted-foreground">
                Complete a comprehensive B1 level exam covering reading, listening, writing, and speaking skills.
              </p>
            </div>

            <div className="space-y-3 py-4">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-primary flex-shrink-0" />
                <span className="text-sm">
                  <strong>90 minutes</strong> to complete all sections
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Target className="w-5 h-5 text-primary flex-shrink-0" />
                <span className="text-sm">
                  <strong>4 sections</strong> with multiple question types
                </span>
              </div>
            </div>

            <Button
              onClick={handleStartExam}
              size="lg"
              className="w-full sm:w-auto text-base font-semibold gap-2"
            >
              Start Exam
            </Button>
          </div>

          {/* Sections preview */}
          <div className="grid grid-cols-2 gap-4">
            {examData.sections.map((section: any) => {
              const icons: Record<string, any> = {
                lesen: BookOpen,
                hoeren: Volume2,
                schreiben: PenTool,
                sprechen: Mic,
              };
              const Icon = icons[section.id] || BookOpen;

              return (
                <Card key={section.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <Icon className="w-5 h-5 text-primary" />
                      <CardTitle className="text-base">{section.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground">
                      {section.questions.length} questions
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {section.questions.reduce((sum: number, q: any) => sum + q.points, 0)} points
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Information cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <BookOpen className="w-5 h-5 text-primary" />
                <CardTitle className="text-base">Reading</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Comprehend German texts and answer multiple-choice questions about the content and context.
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <Volume2 className="w-5 h-5 text-primary" />
                <CardTitle className="text-base">Listening</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Understand spoken German and provide short answers based on audio transcripts.
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <PenTool className="w-5 h-5 text-primary" />
                <CardTitle className="text-base">Writing</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Compose formal and informal written responses following specific constraints and requirements.
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 p-6 rounded-lg bg-accent/10 border border-accent/20 text-center">
          <p className="text-sm">
            Ready to test your German proficiency? Make sure you have{' '}
            <strong>90 minutes</strong> available before starting.
          </p>
        </div>
      </div>
    </div>
  );
}
