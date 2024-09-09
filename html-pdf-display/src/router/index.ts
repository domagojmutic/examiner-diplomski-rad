import { createRouter, createWebHashHistory } from 'vue-router';

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/exams/:examId/instances/:instanceId/groups/:groupName',
      name: 'exam instance',
      component: () => import('../views/ExamInstanceDisplay.vue')
    },
    {
      path: '/exams/:examId/instances/:instanceId/sheets',
      name: 'exam sheets',
      component: () => import('../views/ExamInstanceSheetsDisplay.vue')
    },
    {
      path: '/exams/:examId/instances/:instanceId/sheets/:studentId',
      name: 'exam sheet',
      component: () => import('../views/ExamInstanceSheetDisplay.vue')
    }
  ]
});

export default router;
