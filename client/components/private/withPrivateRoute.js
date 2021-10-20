import React from "react";
import Router from "next/router";
import { isAuthenticated } from "../../api/auth";

const login = "/login?redirected=true"; // Define your login route address.

const checkUserAuthentication = async () => {
  //1. Check Local/Session Storage for Access OR Refresh Token
  //2. Try to get Current User ID

  var auth = false;
  const results = await isAuthenticated();

  if (results.email) {
    auth = true;
  }

  return { auth: auth, user: results };
};

export default (WrappedComponent) => {
  const hocComponent = ({ ...props }) => <WrappedComponent {...props} />;

  hocComponent.getInitialProps = async (context) => {
    const userAuth = await checkUserAuthentication();

    // Are you an authorized user or not?
    if (!userAuth?.auth) {
      // Handle server-side and client-side rendering.
      if (context.res) {
        context.res?.writeHead(302, {
          Location: login,
        });
        context.res?.end();
      } else {
        Router.replace(login);
      }
    } else if (WrappedComponent.getInitialProps) {
      const wrappedProps = await WrappedComponent.getInitialProps({
        ...context,
        auth: userAuth,
      });
      return { ...wrappedProps, userAuth };
    }

    return { userAuth };
  };

  return hocComponent;
};
