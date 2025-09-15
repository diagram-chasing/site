export async function handle({ event, resolve }) {
  if (import.meta.env.PROD) {
    event.locals.analyticsID = 'diagramchasing.fun';
  }

  return resolve(event, {
    transformPageChunk: ({ html }) => {
      return html.replace('%analyticsID%', event.locals.analyticsID || '');
    }
  });
}