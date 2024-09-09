import { api } from 'src/boot/axios';
import { Exam, ExamInstance, Question } from 'src/components/models';

export async function getExams(): Promise<{ data: Exam[] }> {
  const res = await api.get('/api/exams', {});
  return res.data;
}

export async function getExam(examId: string): Promise<{ data: Exam }> {
  const res = await api.get('/api/exams/' + examId, {});
  return res.data;
}

export async function postExam(
  exam: Omit<Exam, 'id'>
): Promise<{ data: Exam[] }> {
  const res = await api.post('/api/exams', exam, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return res.data;
}

export async function putExam(
  examId: string,
  exam: Exam
): Promise<{ data: Exam }> {
  const res = await api.put('/api/exams/' + examId, exam, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return res.data;
}

export async function patchExam(
  examId: string,
  exam: Partial<Exam>
): Promise<{ data: Exam }> {
  const res = await api.patch('/api/exams/' + examId, exam, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return res.data;
}

export async function deleteExam(examId: string): Promise<{ data: boolean }> {
  const res = await api.delete('/api/exams/' + examId, {});
  return res.data;
}

export async function getExamQuestions(
  examId: string
): Promise<{ data: Question[] }> {
  const res = await api.get('/api/exams/' + examId + '/questions', {});
  return res.data;
}

export async function putExamQuestions(
  examId: string,
  questionIds: string[]
): Promise<{ data: Question[] }> {
  const res = await api.put(
    '/api/exams/' + examId + '/questions',
    { questionIds },
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
  return res.data;
}

export async function postExamQuestion(
  examId: string,
  question: Omit<Question, 'id'>
): Promise<{ data: Question[] }> {
  const res = await api.post('/api/exams/' + examId + '/questions', question, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return res.data;
}

export async function deleteExamQuestion(
  examId: string,
  questionId: string
): Promise<{ data: boolean }> {
  const res = await api.delete(
    '/api/exams/' + examId + '/questions/' + questionId,
    {}
  );
  return res.data;
}

export async function getExamInstances(
  examId: string
): Promise<{ data: ExamInstance[] }> {
  const res = await api.get('/api/exams/' + examId + '/instances', {});
  return res.data;
}
