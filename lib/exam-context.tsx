'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import examData from './exam-data.json';

export interface Answer {
  questionId: string;
  value: string | number | null;
  points?: number;
}

export interface ExamState {
  currentSection: string;
  currentQuestionIndex: number;
  answers: Answer[];
  timeRemaining: number;
  isExamStarted: boolean;
  isExamFinished: boolean;
}

interface ExamContextType {
  state: ExamState;
  startExam: () => void;
  finishExam: () => void;
  goToSection: (sectionId: string) => void;
  goToQuestion: (index: number) => void;
  saveAnswer: (questionId: string, value: any) => void;
  updateTimer: (seconds: number) => void;
  getAnswerForQuestion: (questionId: string) => Answer | undefined;
  getSectionQuestions: (sectionId: string) => any[];
  getCurrentQuestion: () => any;
  getExamData: () => typeof examData;
}

const ExamContext = createContext<ExamContextType | undefined>(undefined);

export const ExamProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<ExamState>({
    currentSection: 'lesen',
    currentQuestionIndex: 0,
    answers: [],
    timeRemaining: 90 * 60, // 90 minutes in seconds
    isExamStarted: false,
    isExamFinished: false,
  });

  const startExam = () => {
    setState((prev) => ({ ...prev, isExamStarted: true }));
  };

  const finishExam = () => {
    setState((prev) => ({ ...prev, isExamFinished: true }));
  };

  const goToSection = (sectionId: string) => {
    setState((prev) => ({
      ...prev,
      currentSection: sectionId,
      currentQuestionIndex: 0,
    }));
  };

  const goToQuestion = (index: number) => {
    setState((prev) => ({
      ...prev,
      currentQuestionIndex: index,
    }));
  };

  const saveAnswer = (questionId: string, value: any) => {
    setState((prev) => {
      const existingIndex = prev.answers.findIndex(
        (a) => a.questionId === questionId
      );
      const newAnswers = [...prev.answers];
      if (existingIndex >= 0) {
        newAnswers[existingIndex] = { questionId, value };
      } else {
        newAnswers.push({ questionId, value });
      }
      return { ...prev, answers: newAnswers };
    });
  };

  const updateTimer = (seconds: number) => {
    setState((prev) => ({ ...prev, timeRemaining: Math.max(0, seconds) }));
  };

  const getAnswerForQuestion = (questionId: string) => {
    return state.answers.find((a) => a.questionId === questionId);
  };

  const getSectionQuestions = (sectionId: string) => {
    const section = examData.sections.find((s) => s.id === sectionId);
    return section?.questions || [];
  };

  const getCurrentQuestion = () => {
    const questions = getSectionQuestions(state.currentSection);
    return questions[state.currentQuestionIndex];
  };

  const getExamData = () => examData;

  const value: ExamContextType = {
    state,
    startExam,
    finishExam,
    goToSection,
    goToQuestion,
    saveAnswer,
    updateTimer,
    getAnswerForQuestion,
    getSectionQuestions,
    getCurrentQuestion,
    getExamData,
  };

  return (
    <ExamContext.Provider value={value}>{children}</ExamContext.Provider>
  );
};

export const useExam = () => {
  const context = useContext(ExamContext);
  if (!context) {
    throw new Error('useExam must be used within ExamProvider');
  }
  return context;
};
