/* eslint-disable react/prop-types */
// components/ProtectedRoute.jsx
import { Spin } from 'antd';
import { useContext, useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { MainContext } from '../Context/MainContext';
import {
  getDefaultAdminPath,
  getUser,
  hasAdminAccess,
  hasAnyAdminPermission,
  hasAllAdminPermissions,
} from '../api/getUser';
import { cookieSessionToken, readStoredToken } from '../api/config';

const ProtectedRoute = ({
  children,
  requiredPermissions = [],
  requireAllPermissions = false,
  unauthorizedRedirectTo,
}) => {
  const { baseUrl, token, user, setUser, setToken, clearToken } =
    useContext(MainContext);
  const location = useLocation();
  const effectiveToken = token || readStoredToken();
  const hasHydratedUser = Boolean(user && Object.keys(user).length);
  const [isCheckingAuth, setIsCheckingAuth] = useState(!hasHydratedUser);
  const hasRequiredPermissions = hasHydratedUser
    ? (
        requireAllPermissions
          ? hasAllAdminPermissions(user, requiredPermissions)
          : hasAnyAdminPermission(user, requiredPermissions)
      )
    : false;

  useEffect(() => {
    if (hasHydratedUser) {
      setIsCheckingAuth(false);
      return;
    }

    let cancelled = false;

    const syncUser = async () => {
      try {
        const response = await getUser(baseUrl, effectiveToken);
        if (!cancelled) {
          if (!hasAdminAccess(response)) {
            setUser({});
            clearToken();
            return;
          }

          setUser(response);
          setToken(effectiveToken || cookieSessionToken);
        }
      } catch {
        if (!cancelled) {
          setUser({});
          clearToken();
        }
      } finally {
        if (!cancelled) {
          setIsCheckingAuth(false);
        }
      }
    };

    syncUser();

    return () => {
      cancelled = true;
    };
  }, [baseUrl, clearToken, effectiveToken, hasHydratedUser, setToken, setUser]);

  if (hasHydratedUser) {
    if (!hasAdminAccess(user)) {
      return <Navigate to="/" replace />;
    }

    if (requiredPermissions?.length && !hasRequiredPermissions) {
      const fallbackPath = unauthorizedRedirectTo || getDefaultAdminPath(user);

      if (fallbackPath && fallbackPath !== location.pathname) {
        return <Navigate to={fallbackPath} replace />;
      }

      return <Navigate to="/" replace />;
    }

    return children;
  }

  if (isCheckingAuth) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'grid',
          placeItems: 'center',
          background: '#f5f7fb',
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  if (!effectiveToken) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  return <Navigate to="/" replace state={{ from: location }} />;
};

export const RequireAdminPermissions = ({
  children,
  permissions,
  redirectTo,
  requireAllPermissions = false,
}) => {
  const { user } = useContext(MainContext);
  const fallbackPath = redirectTo || getDefaultAdminPath(user);
  const isAllowed = requireAllPermissions
    ? hasAllAdminPermissions(user, permissions, { fallbackToAdmin: false })
    : hasAnyAdminPermission(user, permissions, { fallbackToAdmin: false });

  if (!isAllowed) {
    if (fallbackPath) {
      return <Navigate to={fallbackPath} replace />;
    }

    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
