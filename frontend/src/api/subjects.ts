import { api } from 'src/boot/axios';
import { Exam, Question, Subject } from 'src/components/models';

export async function getSubjects(): Promise<{ data: Subject[] }> {
  const res = await api.get('/api/subjects', {});
  return res.data;
}

export async function getSubject(
  subjectId: string
): Promise<{ data: Subject }> {
  const res = await api.get('/api/subjects/' + subjectId, {});
  return res.data;
}

export async function postSubject(
  subject: Omit<Subject, 'id'>
): Promise<{ data: Subject[] }> {
  const res = await api.post('/api/subjects', subject, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return res.data;
}

export async function putSubject(
  subjectId: string,
  subject: Subject
): Promise<{ data: Subject[] }> {
  const res = await api.put('/api/subjects/' + subjectId, subject, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return res.data;
}

export async function patchSubject(
  subjectId: string,
  subject: Partial<Subject>
): Promise<{ data: Subject[] }> {
  const res = await api.patch('/api/subjects/' + subjectId, subject, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return res.data;
}

export async function deleteSubject(
  subjectId: string
): Promise<{ data: boolean }> {
  const res = await api.delete('/api/subjects/' + subjectId, {});
  return res.data;
}

export async function getSubjectQuestions(
  subjectId: string
): Promise<{ data: Question[] }> {
  const res = await api.get('/api/subjects/' + subjectId + '/questions', {});
  return res.data;
}

export async function putSubjectQuestions(
  subjectId: string,
  questionIds: string[]
): Promise<{ data: Question[] }> {
  const res = await api.put(
    '/api/subjects/' + subjectId + '/questions',
    { questionIds },
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
  return res.data;
}

export async function postSubjectQuestion(
  subjectId: string,
  question: Omit<Question, 'id'>
): Promise<{ data: Question[] }> {
  const res = await api.post(
    '/api/subjects/' + subjectId + '/questions',
    question,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
  return res.data;
}

export async function deleteSubjectQuestion(
  subjectId: string,
  questionId: string
): Promise<{ data: boolean }> {
  const res = await api.delete(
    '/api/subjects/' + subjectId + '/questions/' + questionId,
    {}
  );
  return res.data;
}

export async function getSubjectExams(
  subjectId: string
): Promise<{ data: Exam[] }> {
  const res = await api.get('/api/subjects/' + subjectId + '/exams', {});
  return res.data;
}

export async function deleteSubjectExam(
  subjectId: string,
  examId: string
): Promise<{ data: boolean }> {
  const res = await api.delete(
    '/api/subjects/' + subjectId + '/exams/' + examId,
    {}
  );
  return res.data;
}
