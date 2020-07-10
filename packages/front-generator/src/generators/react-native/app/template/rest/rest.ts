import { initializeApp } from "@cuba-platform/rest";
import { REACT_NATIVE_APP_CUBA_URL, REACT_NATIVE_APP_REST_CLIENT_ID, REACT_NATIVE_APP_REST_CLIENT_SECRET } from "react-native-dotenv";

export const cubaREST = initializeApp({
  name: '<%=project.namespace%>',
  apiUrl: REACT_NATIVE_APP_CUBA_URL,
  restClientId: REACT_NATIVE_APP_REST_CLIENT_ID,
  restClientSecret: REACT_NATIVE_APP_REST_CLIENT_SECRET,
});

export const REST_TOKEN_STORAGE_KEY = "cubaAccessToken";
