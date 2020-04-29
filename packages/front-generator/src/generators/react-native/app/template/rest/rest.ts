import { initializeApp } from "@cuba-platform/rest";
import { REACT_NATIVE_APP_CUBA_URL } from "react-native-dotenv";

export const cubaREST = initializeApp({
  name: '<%=project.namespace%>',
  apiUrl: REACT_NATIVE_APP_CUBA_URL,
});

export const REST_TOKEN_STORAGE_KEY = "cubaAccessToken";
