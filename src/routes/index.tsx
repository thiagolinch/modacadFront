import { useEffect } from 'react';
import { Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom';

import { ProtectedRoute } from './ProtectedRoute';

import { Home } from '../pages/home/Home';
import { PlansPage } from '../pages/plans/PlansPage';
import { AdminLogin } from '../pages/admin/AdminLogin';
import { ResetPassword } from '../pages/resetPassword/resetPasswordpage';
import { BlankPage } from '../pages/blank';
import { Dashboard } from '../pages/dashboard/Dashboard';
import { PopularPosts } from '../pages/posts/textos/PopularPosts';
import { PublishedPills } from '../pages/posts/pilula/PublishedPills';
import { PageTags } from '../pages/admin/tags/PageTags';
import { PageMembers } from '../pages/admin/members/PageMembers';
import { PageSubjects } from '../pages/admin/subjects/PageSubjects';
import { PostEditor } from '../pages/dashboard/post-editor/PostEditor';
import { PagePlans } from '../pages/admin/plans/PagePlans';
import { PageTeam } from '../pages/admin/team/PageTeam';
import { PageCategoryPost } from '../pages/posts/page-category-post/PageCategoryPost';
import { PublishedPosts } from '../pages/posts/textos/PublishedPosts';
import { PostDetails } from '../pages/posts/post-details/PostDetails';
import { PrivacyPolicyPage, TermsAndConditionsPage } from '../pages/legal';
import { MyProfilePage } from '../pages/admin';

export const AppRoutes = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <Routes>
      {/* Rotas Públicas */}
      <Route path="/" element={<Home />} />
      <Route path="/planos" element={<PlansPage />} />

      <Route path="/categorias/:categoryId" element={<PageCategoryPost />} />

      <Route path="/pilulas" element={<PublishedPills />} />
      <Route path="/pilulas/:postId" element={<PostDetails />} />

      {/* Rotas para postagens */}
      <Route path="/posts" element={<PublishedPosts />} />
      <Route path="/posts/popular" element={<PopularPosts />} />
      <Route path="/posts/:postId" element={<PostDetails />} />

      {/* Rotas Protegidas (Privadas) */}
      <Route
        path="/dashboard/:type"
        element={
          <ProtectedRoute restrictToTeamRoles>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/posts/novo"
        element={
          <ProtectedRoute restrictToTeamRoles>
            <PostEditor />
          </ProtectedRoute>
        }
      />
      <Route
        path="/posts/:postId/editar"
        element={
          <ProtectedRoute restrictToTeamRoles>
            <PostEditor />
          </ProtectedRoute>
        }
      />

      {/* Login Admin */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute restrictToTeamRoles>
            <Outlet />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="membros" />} />
        <Route path="membros" element={<PageMembers />} />
        <Route path="tags" element={<PageTags />} />
        <Route path="assuntos" element={<PageSubjects />} />
        <Route path="planos" element={<PagePlans />} />
        <Route path="equipe" element={<PageTeam />} />
        <Route path="meu-perfil" element={<MyProfilePage />} />
      </Route>

      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/resetar-senha/:token" element={<ResetPassword />} />

      {/* Rotas de Política de Privacidade e Termos e Condições */}

      <Route path="/politica-de-privacidade" element={<PrivacyPolicyPage />} />
      <Route path="/termos-e-condicoes" element={<TermsAndConditionsPage />} />

      {/* Página em Branco (Para teste ou outro propósito) */}
      <Route path="/blank" element={<BlankPage />} />
    </Routes>
  );
};
