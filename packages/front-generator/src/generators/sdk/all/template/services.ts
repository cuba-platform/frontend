import {CubaApp} from "@cuba-platform/rest";

export const restServices = {
  <% restServices.forEach((service) => {%>
    <%- service.name %>: {<% service.methods.forEach((method => { %>
        <%-method.name%>: (cubaApp: CubaApp) => (params: any) => {
          return cubaApp.invokeService('<%-service.name%>', '<%-method.name%>', params);
        },<% })) %>
    },
  <%}) %>
};