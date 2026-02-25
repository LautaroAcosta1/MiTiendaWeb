import { Navigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, user } = useAuth();
  const { slug } = useParams();

  if (!isAuthenticated) {
    return <Navigate to={`/${slug}`} replace />;
  }

  if (user?.store?.slug !== slug) {
    return (
      <Navigate
        to={`/${user.store.slug}/admin/panel`}
        replace
      />
    );
  }

  return children;
}