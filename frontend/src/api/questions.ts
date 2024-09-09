import { api } from 'src/boot/axios';
import { Question } from 'src/components/models';

export async function getQuestions(): Promise<{ data: Question[] }> {
  const res = await api.get('/api/questions', {});
  return res.data;
}

export async function postQuestion(
  question: Omit<Question, 'id'>
): Promise<{ data: Question[] }> {
  const res = await api.post('/api/questions', question, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return res.data;
}

export async function putQuestion(
  questionId: string,
  question: Question
): Promise<{ data: Question[] }> {
  const res = await api.put('/api/questions/' + questionId, question, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return res.data;
}

export async function deleteQuestion(
  questionId: string
): Promise<{ data: boolean }> {
  const res = await api.delete('/api/questions/' + questionId, {});
  return res.data;
}
