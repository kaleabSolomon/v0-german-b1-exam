import examData from './exam-data.json';
import { Answer } from './exam-context';

interface ScoredAnswer {
  questionId: string;
  isCorrect: boolean;
  pointsEarned: number;
  pointsPossible: number;
  feedback?: string;
}

interface SectionScore {
  sectionId: string;
  sectionTitle: string;
  pointsEarned: number;
  pointsPossible: number;
  percentage: number;
  answeredCount: number;
  totalQuestions: number;
}

interface ExamResults {
  totalPointsEarned: number;
  totalPointsPossible: number;
  overallPercentage: number;
  sectionScores: SectionScore[];
  level: string;
  timestamp: Date;
}

function stringSimilarity(a: string, b: string): number {
  const aLower = a.toLowerCase().trim();
  const bLower = b.toLowerCase().trim();

  if (aLower === bLower) return 1;

  const aWords = aLower.split(/\s+/);
  const bWords = bLower.split(/\s+/);

  const commonWords = aWords.filter((word) =>
    bWords.some((w) => w.includes(word) || word.includes(w))
  ).length;

  return commonWords / Math.max(aWords.length, bWords.length);
}

function scoreMultipleChoice(
  answer: Answer,
  question: any
): ScoredAnswer {
  const isCorrect = answer.value === question.correctAnswer;
  const pointsEarned = isCorrect ? question.points : 0;

  return {
    questionId: question.id,
    isCorrect,
    pointsEarned,
    pointsPossible: question.points,
    feedback: isCorrect
      ? `Correct! The answer is: ${question.options[question.correctAnswer]}`
      : `Incorrect. The correct answer is: ${question.options[question.correctAnswer]}`,
  };
}

function scoreShortAnswer(
  answer: Answer,
  question: any
): ScoredAnswer {
  if (!answer.value || answer.value.trim() === '') {
    return {
      questionId: question.id,
      isCorrect: false,
      pointsEarned: 0,
      pointsPossible: question.points,
      feedback: 'No answer provided',
    };
  }

  const userAnswer = answer.value.toLowerCase().trim();
  const similarities = question.acceptableAnswers.map((acceptedAnswer: string) =>
    stringSimilarity(userAnswer, acceptedAnswer)
  );

  const maxSimilarity = Math.max(...similarities);
  const threshold = 0.6; // 60% similarity required

  const isCorrect = maxSimilarity >= threshold;
  const pointsEarned = isCorrect ? question.points : Math.max(0, Math.floor(question.points * maxSimilarity * 0.5));

  return {
    questionId: question.id,
    isCorrect,
    pointsEarned,
    pointsPossible: question.points,
    feedback: isCorrect
      ? `Correct! Accepted answers include: ${question.acceptableAnswers.join(', ')}`
      : `Your answer: "${answer.value}". Accepted answers: ${question.acceptableAnswers.join(', ')}`,
  };
}

function scoreLongText(
  answer: Answer,
  question: any
): ScoredAnswer {
  const text = answer.value || '';
  const wordCount = text.trim().split(/\s+/).filter((w) => w.length > 0).length;
  const minWords = question.constraints?.minWords || 0;

  if (wordCount < minWords) {
    const percentage = Math.min(wordCount / minWords, 1);
    const pointsEarned = Math.floor(question.points * percentage * 0.7);
    return {
      questionId: question.id,
      isCorrect: false,
      pointsEarned,
      pointsPossible: question.points,
      feedback: `Word count: ${wordCount}/${minWords}. Response needs more content for full points.`,
    };
  }

  let pointsEarned = Math.floor(question.points * 0.8);

  if (question.constraints?.mustInclude) {
    const requiredTerms = question.constraints.mustInclude;
    const textLower = text.toLowerCase();
    const allIncluded = requiredTerms.every((term: string) =>
      textLower.includes(term.toLowerCase())
    );

    if (allIncluded) {
      pointsEarned = question.points;
    }
  }

  return {
    questionId: question.id,
    isCorrect: wordCount >= minWords,
    pointsEarned,
    pointsPossible: question.points,
    feedback: `Your response (${wordCount} words) meets the minimum requirements. Excellent work!`,
  };
}

function scoreSpeaking(
  answer: Answer,
  question: any
): ScoredAnswer {
  const hasNotes = answer.value && answer.value.trim().length > 0;
  const pointsEarned = hasNotes ? Math.floor(question.points * 0.5) : 0;

  return {
    questionId: question.id,
    isCorrect: hasNotes,
    pointsEarned,
    pointsPossible: question.points,
    feedback: hasNotes
      ? 'Notes recorded. In a real exam, this would be evaluated by an examiner.'
      : 'No preparation notes recorded. Consider preparing before speaking.',
  };
}

export function calculateExamScore(answers: Answer[]): ExamResults {
  const sectionScores: SectionScore[] = [];
  let totalPointsEarned = 0;
  let totalPointsPossible = 0;

  examData.sections.forEach((section) => {
    let sectionPointsEarned = 0;
    let sectionPointsPossible = 0;
    let answeredCount = 0;

    section.questions.forEach((question: any) => {
      const answer = answers.find((a) => a.questionId === question.id);
      sectionPointsPossible += question.points;

      if (answer) {
        answeredCount++;
        let scoredAnswer: ScoredAnswer;

        if (question.type === 'multiple_choice') {
          scoredAnswer = scoreMultipleChoice(answer, question);
        } else if (question.type === 'short_answer') {
          scoredAnswer = scoreShortAnswer(answer, question);
        } else if (question.type === 'long_text') {
          scoredAnswer = scoreLongText(answer, question);
        } else if (
          question.type === 'spoken_response' ||
          question.type === 'discussion' ||
          question.type === 'image_description' ||
          question.type === 'role_play' ||
          question.type === 'pair_task'
        ) {
          scoredAnswer = scoreSpeaking(answer, question);
        } else {
          scoredAnswer = {
            questionId: question.id,
            isCorrect: false,
            pointsEarned: 0,
            pointsPossible: question.points,
          };
        }

        sectionPointsEarned += scoredAnswer.pointsEarned;
      }
    });

    totalPointsEarned += sectionPointsEarned;
    totalPointsPossible += sectionPointsPossible;

    const percentage = Math.round((sectionPointsEarned / sectionPointsPossible) * 100);

    sectionScores.push({
      sectionId: section.id,
      sectionTitle: section.title,
      pointsEarned: sectionPointsEarned,
      pointsPossible: sectionPointsPossible,
      percentage,
      answeredCount,
      totalQuestions: section.questions.length,
    });
  });

  const overallPercentage = Math.round((totalPointsEarned / totalPointsPossible) * 100);

  // Determine level based on percentage
  let level = 'Needs Improvement';
  if (overallPercentage >= 90) level = 'Excellent';
  else if (overallPercentage >= 80) level = 'Very Good';
  else if (overallPercentage >= 70) level = 'Good';
  else if (overallPercentage >= 60) level = 'Satisfactory';
  else if (overallPercentage >= 50) level = 'Acceptable';

  return {
    totalPointsEarned,
    totalPointsPossible,
    overallPercentage,
    sectionScores,
    level,
    timestamp: new Date(),
  };
}
