import * as Sentry from '@sentry/browser';
import * as Integrations from '@sentry/integrations';
export default async ({ Vue }) => {

if(!process.env.DEV){
  Sentry.init({
    dsn: 'https://cd9d9f9d90ba4b8cb6a6a8714a2f3ecc@sentry.io/1872748',
    integrations: [new Integrations.Vue({Vue, attachProps: true, logErrors: true})],
  });
}

}
