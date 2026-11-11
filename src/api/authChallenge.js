const pendingTwoFactorKey = "pending_two_factor_login";
const pendingTwoFactorLifetimeMs = 15 * 60 * 1000;

export const savePendingTwoFactorChallenge = (challenge) => {
  if (!challenge?.email) {
    sessionStorage.removeItem(pendingTwoFactorKey);
    return;
  }

  sessionStorage.setItem(
    pendingTwoFactorKey,
    JSON.stringify({
      email: challenge.email,
      client: challenge.client || "buyer",
      redirectTo: challenge.redirectTo || "/dashboard",
      createdAt: Date.now(),
    }),
  );
};

export const readPendingTwoFactorChallenge = () => {
  const rawValue = sessionStorage.getItem(pendingTwoFactorKey);

  if (!rawValue) {
    return null;
  }

  try {
    const parsed = JSON.parse(rawValue);

    if (!parsed?.email || Date.now() - Number(parsed.createdAt || 0) > pendingTwoFactorLifetimeMs) {
      sessionStorage.removeItem(pendingTwoFactorKey);
      return null;
    }

    return {
      email: parsed.email,
      client: parsed.client || "buyer",
      redirectTo: parsed.redirectTo || "/dashboard",
      createdAt: parsed.createdAt,
    };
  } catch {
    sessionStorage.removeItem(pendingTwoFactorKey);
    return null;
  }
};

export const clearPendingTwoFactorChallenge = () => {
  sessionStorage.removeItem(pendingTwoFactorKey);
};
