/** Next.js start-up hook. The work happens in the Node.js runtime only (instrumentation-node.ts). */
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { start } = await import('./instrumentation-node');
    await start();
  }
}
