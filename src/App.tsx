import './App.css'

import { Skeleton } from 'antd'
import React, { Suspense } from 'react'
import { Route, Switch } from 'react-router-dom'
import styled from 'styled-components'

import Toast from './components/toast/toast.component'
import UpdatePopup from './components/update-popup/update-popup.component'
import { authRoutes, routes } from './config/routes.config'
import { usePingChatOnline } from './hooks/api/chat/useChatOnline'
import { useAuthorization } from './hooks/authorization.hook'
import { useSeo } from './hooks/seo.hook'
import Layout from './layouts/layout/layout.component'
import { AuthFormProvider } from './modules/auth/auth.context'
import { useNotificationsChannel } from './modules/notifications/hooks/notifications.hook'
import PageNotFound from './pages/page-not-found/page-not-found.component'

const Styles = styled.div`
  font-family: 'Circular Std', sans-serif;
  .suspense {
    ${(p) => p.theme.extend.layout};
  }
  .desktop {
    @media all and (max-width: ${(p) => p.theme.vars.media.tablet}px) {
      display: none;
    }
  }
  .mobile {
    @media all and (min-width: ${(p) => p.theme.vars.media.tablet + 1}px) {
      display: none;
    }
  }
`

function App() {
  useSeo()
  useAuthorization()
  useNotificationsChannel()
  usePingChatOnline()
  return (
    <Styles>
      <Switch>
        <Route path={authRoutes.map((r) => r.url)}>
          <AuthFormProvider>
            <Suspense fallback={<Skeleton className={'suspense'} />}>
              <Switch>
                {authRoutes.map((R) => (
                  <Route exact path={R.url} key={R.url} {...R.props}>
                    <R.Component />
                  </Route>
                ))}
              </Switch>
            </Suspense>
          </AuthFormProvider>
        </Route>
        <Route exact path={routes.map((r) => r.url)}>
          <Layout>
            <Suspense fallback={<Skeleton className={'suspense'} />}>
              <Switch>
                {routes.map((R, index) => (
                  <Route exact path={R.url} key={R.url + index} {...R.props}>
                    <R.Component />
                  </Route>
                ))}
              </Switch>
            </Suspense>
          </Layout>
        </Route>
        <Route>
          <PageNotFound />
        </Route>
      </Switch>
      <Toast />
      <UpdatePopup />
    </Styles>
  )
}

export default App
