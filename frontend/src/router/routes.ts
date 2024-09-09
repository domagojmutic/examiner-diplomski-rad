import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      {
        name: 'subject',
        path: '/subjects/:subjectId',
        component: () => import('pages/SubjectPage.vue'),
      },
      {
        name: 'exam',
        path: '/exams/:examId',
        component: () => import('pages/ExamPage.vue'),
      },
      {
        name: 'exam_instance',
        path: '/exams/:examId/examInstances/:instanceId',
        component: () => import('pages/ExamInstancePage.vue'),
      },
      {
        name: 'student_answers',
        path: '/exams/:examId/examInstances/:instanceId/students/:studentId',
        component: () => import('pages/AnswersStudentPage.vue'),
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
