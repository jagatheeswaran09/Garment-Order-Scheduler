import React from 'react'
import { MY_ROUTES } from './my_router'
import { Route, Routes } from 'react-router-dom';

const CustomRoutes = () => {
  return (
    <Routes>
      {MY_ROUTES.map((routeGroup) => {
        const Layout = routeGroup.layout;

        return (
          <Route
            key={routeGroup.name}
            element={<Layout routes={routeGroup.children} />}
            path={routeGroup.path}
          >
            {routeGroup.children.map((childRoute) => {
              const Component = childRoute.component;

              return (
                <Route
                  key={childRoute.path}
                  path={childRoute.path}
                  element={<Component />}
                />
              );
            })}
          </Route>
        );
      })}
    </Routes>
  )
}

export default CustomRoutes
