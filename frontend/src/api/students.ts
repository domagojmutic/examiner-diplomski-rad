import { api } from 'src/boot/axios';
import { Student } from 'src/components/models';

export async function getStudents(): Promise<{ data: Student[] }> {
  const res = await api.get('/api/students', {});
  return res.data;
}

export async function getStudent(
  studentId: string
): Promise<{ data: Student }> {
  const res = await api.get('/api/students/' + studentId, {});
  return res.data;
}

export async function postStudent(
  student: Omit<Student, 'id'>
): Promise<{ data: Student[] }> {
  const res = await api.post('/api/students', student, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return res.data;
}

export async function putStudent(
  studentId: string,
  student: Student
): Promise<{ data: Student[] }> {
  const res = await api.put('/api/students/' + studentId, student, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return res.data;
}

export async function deleteStudent(
  studentId: string
): Promise<{ data: boolean }> {
  const res = await api.delete('/api/students/' + studentId, {});
  return res.data;
}
