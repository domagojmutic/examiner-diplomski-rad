import { api } from 'src/boot/axios';

export async function getSubjectTags(): Promise<{ data: string[] }> {
  const res = await api.get('/api/subjects/tags', {});
  return res.data;
}

export async function putSubjectTags(
  id: string,
  tags: string[]
): Promise<{ data: string[] }> {
  const res = await api.put(
    '/api/subjects/' + id + '/tags',
    { tags },
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
  return res.data;
}

export async function getQuestionTags(): Promise<{ data: string[] }> {
  const res = await api.get('/api/questions/tags', {});
  return res.data;
}

export async function putQuestionTags(
  id: string,
  tags: string[]
): Promise<{ data: string[] }> {
  const res = await api.put(
    '/api/questions/' + id + '/tags',
    { tags },
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
  return res.data;
}

export async function getExamTags(): Promise<{ data: string[] }> {
  const res = await api.get('/api/exams/tags', {});
  return res.data;
}

export async function putExamTags(
  id: string,
  tags: string[]
): Promise<{ data: string[] }> {
  const res = await api.put(
    '/api/exams/' + id + '/tags',
    { tags },
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
  return res.data;
}

export async function getStudentTags(): Promise<{ data: string[] }> {
  const res = await api.get('/api/students/tags', {});
  return res.data;
}

export async function putStudentTags(
  id: string,
  tags: string[]
): Promise<{ data: string[] }> {
  const res = await api.put(
    '/api/students/' + id + '/tags',
    { tags },
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
  return res.data;
}
