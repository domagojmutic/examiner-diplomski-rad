import { api } from 'src/boot/axios';
import {
  ExamInstance,
  ExamInstanceAnswer,
  Student,
} from 'src/components/models';

export async function getExamInstance(
  examId: string,
  examInstanceId: string
): Promise<{ data: ExamInstance }> {
  const res = await api.get(
    '/api/exams/' + examId + '/instances/' + examInstanceId,
    {}
  );
  return res.data;
}

export async function postExamInstance(
  examId: string,
  examInstance: Omit<ExamInstance, 'id' | 'seed'>
): Promise<{ data: ExamInstance[] }> {
  const res = await api.post(
    '/api/exams/' + examId + '/instances',
    examInstance,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
  return res.data;
}

export async function deleteExamInstance(
  examId: string,
  examInstanceId: string
): Promise<{ data: boolean }> {
  const res = await api.delete(
    '/api/exams/' + examId + '/instances/' + examInstanceId,
    {}
  );
  return res.data;
}

export async function getExamInstanceStudents(
  examId: string,
  examInstanceId: string
): Promise<{ data: Student[] }> {
  const res = await api.get(
    '/api/exams/' + examId + '/instances/' + examInstanceId + '/students',
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
  return res.data;
}

export async function postExamInstanceStudents(
  examId: string,
  examInstanceId: string,
  student: Omit<Student, 'id'>
): Promise<{ data: Student[] }> {
  const res = await api.post(
    '/api/exams/' + examId + '/instances/' + examInstanceId + '/students',
    student,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
  return res.data;
}

export async function putExamInstanceStudents(
  examId: string,
  examInstanceId: string,
  studentIds: string[]
): Promise<{ data: Student[] }> {
  const res = await api.put(
    '/api/exams/' + examId + '/instances/' + examInstanceId + '/students',
    { studentIds },
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
  return res.data;
}

export async function postExamInstanceResponse(file: File) {
  const res = await api.postForm('/upload/exams/response', { file: file });
  return res.data;
}

export async function getExamInstancePDF(
  examId: string,
  examInstanceId: string,
  group: string
) {
  const res = await api.get(
    '/api/exams/' +
      examId +
      '/instances/' +
      examInstanceId +
      '-' +
      group +
      '.pdf',
    {
      responseType: 'blob',
    }
  );

  const url = window.URL.createObjectURL(res.data);

  const tempLink = document.createElement('a');
  tempLink.href = url;
  tempLink.setAttribute('download', `exam-${examInstanceId}-${group}.pdf`);

  document.body.appendChild(tempLink);
  tempLink.click();

  document.body.removeChild(tempLink);
  window.URL.revokeObjectURL(url);
}

export async function getExamInstanceStudentPDF(
  examId: string,
  examInstanceId: string,
  studentId: string
) {
  const res = await api.get(
    '/api/exams/' +
      examId +
      '/instances/' +
      examInstanceId +
      '/students/' +
      studentId +
      '.pdf',
    {
      responseType: 'blob',
    }
  );

  const url = window.URL.createObjectURL(res.data);

  const tempLink = document.createElement('a');
  tempLink.href = url;
  tempLink.setAttribute('download', `sheet-${studentId}.pdf`);

  document.body.appendChild(tempLink);
  tempLink.click();

  document.body.removeChild(tempLink);
  window.URL.revokeObjectURL(url);
}

export async function getExamInstanceStudentsPDF(
  examId: string,
  examInstanceId: string
) {
  const res = await api.get(
    '/api/exams/' + examId + '/instances/' + examInstanceId + '/students.pdf',
    {
      responseType: 'blob',
    }
  );

  const url = window.URL.createObjectURL(res.data);

  const tempLink = document.createElement('a');
  tempLink.href = url;
  tempLink.setAttribute('download', `sheets-${examInstanceId}.pdf`);

  document.body.appendChild(tempLink);
  tempLink.click();

  document.body.removeChild(tempLink);
  window.URL.revokeObjectURL(url);
}

export async function getExamInstanceStudentAnswers(
  examId: string,
  examInstanceId: string,
  studentId: string
): Promise<{ data: ExamInstanceAnswer[] }> {
  const res = await api.get(
    '/api/exams/' +
      examId +
      '/instances/' +
      examInstanceId +
      '/students/' +
      studentId +
      '/answers',
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
  return res.data;
}

export async function updateExamInstanceStudentAnswer(
  examId: string,
  examInstanceId: string,
  studentId: string,
  scanNumber: number,
  answerObject: { [key: string]: unknown }
): Promise<{ data: boolean }> {
  const res = await api.put(
    '/api/exams/' +
      examId +
      '/instances/' +
      examInstanceId +
      '/students/' +
      studentId +
      '/answers/' +
      scanNumber,
    {
      examInstanceId,
      studentId,
      scanNumber,
      answerObject,
    }
  );
  return res.data;
}

export async function deleteExamInstanceStudentAnswers(
  examId: string,
  examInstanceId: string,
  studentId: string
): Promise<{ data: boolean }> {
  const res = await api.delete(
    '/api/exams/' +
      examId +
      '/instances/' +
      examInstanceId +
      '/students/' +
      studentId +
      '/answers',
    {}
  );
  return res.data;
}

export async function deleteExamInstanceStudentAnswer(
  examId: string,
  examInstanceId: string,
  studentId: string,
  scanNumber: number
): Promise<{ data: boolean }> {
  const res = await api.delete(
    '/api/exams/' +
      examId +
      '/instances/' +
      examInstanceId +
      '/students/' +
      studentId +
      '/answers/' +
      scanNumber,
    {}
  );
  return res.data;
}
