import React, {
  createContext,
  PropsWithChildren,
  useCallback,
  useEffect,
  useState,
} from "react";
import { useAuthStore } from "../hooks/stores/auth-store";
import { generateCodeVerifier, OAuth2Client } from "@badgateway/oauth2-client";
import { useNavigate } from "react-router";

type AuthContext = {
  connect: () => void;
  handleOAuthRedirect: () => void;
  isConnected: boolean;
};

export const AuthContext = createContext<AuthContext>({} as AuthContext);
AuthContext.displayName = "AuthContext";

const oAuth2Client = new OAuth2Client({
  // The base URI of your OAuth2 server
  server: "https://secure.soundcloud.com/",

  // OAuth2 client id
  clientId: import.meta.env.VITE_SOUNDCLOUD_CLIENT_ID,

  // The following URIs are all optional. If they are not specified, we will
  // attempt to discover them using the oauth2 discovery document.
  // If your server doesn't have support this, you may need to specify these.
  // you may use relative URIs for any of these.

  // Token endpoint. Most flows need this.
  // If not specified we'll use the information for the discovery document
  // first, and otherwise default to /token
  tokenEndpoint: "/oauth/token",

  // Authorization endpoint.
  //
  // You only need this to generate URLs for authorization_code flows.
  // If not specified we'll use the information for the discovery document
  // first, and otherwise default to /authorize
  authorizationEndpoint: "/authorize",
});

export const AuthProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const {
    accessToken,
    accessTokenExpiresAt,
    refreshToken,
    codeVerifier,
    state,
    setAccessToken,
    setAccessTokenExpiresAt,
    setRefreshToken,
    setCodeVerifier,
    setState,
  } = useAuthStore();
  const [isConnected, setIsConnected] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    void (async () => {
      if (!codeVerifier) setCodeVerifier(await generateCodeVerifier());
      if (!state) setState(await generateCodeVerifier());
    })();
  }, [codeVerifier, state]);

  useEffect(() => {
    if (accessToken) {
      window.SC.initialize({
        client_id: import.meta.env.VITE_SOUNDCLOUD_CLIENT_ID,
        redirect_uri: import.meta.env.VITE_SOUNDCLOUD_REDIRECT_URI,
        oauth_token: accessToken,
      });
    }
    setIsConnected(Boolean(accessToken));
  }, [accessToken]);

  const connect = useCallback(async () => {
    // In a browser this might work as follows:
    document.location = await oAuth2Client.authorizationCode.getAuthorizeUri({
      // URL in the app that the user should get redirected to after authenticating
      redirectUri: import.meta.env.VITE_SOUNDCLOUD_REDIRECT_URI,
      codeVerifier,
      state,
      scope: ["non-expiring"],
    });
  }, [codeVerifier, state]);

  const handleOAuthRedirect = useCallback(async () => {
    const oauth2Token =
      await oAuth2Client.authorizationCode.getTokenFromCodeRedirect(
        document.location.href,
        {
          /**
           * The redirect URI is not actually used for any redirects, but MUST be the
           * same as what you passed earlier to "authorizationCode"
           */
          redirectUri: import.meta.env.VITE_SOUNDCLOUD_REDIRECT_URI,
          codeVerifier,
          state,
        }
      );
    setAccessToken(oauth2Token.accessToken);
    setAccessTokenExpiresAt(oauth2Token.expiresAt?.toString() || "");
    setRefreshToken(oauth2Token.refreshToken || "");
    navigate("/");
  }, [codeVerifier, state, setAccessToken, navigate]);

  const contextValue = { connect, handleOAuthRedirect, isConnected };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
