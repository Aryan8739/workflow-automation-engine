import runQueue from './src/queues/runQueue.js';

async function clear() {
  console.log('Obliterating the BullMQ runs queue...');
  try {
    // `obliterate` removes all jobs from the queue, including active, delayed, and completed ones.
    // We use { force: true } to force removal even if there are active jobs.
    await runQueue.obliterate({ force: true });
    console.log('Queue completely cleared!');
  } catch (error) {
    console.error('Error clearing queue:', error);
  } finally {
    // Exit the process so the script finishes executing
    process.exit(0);
  }
}

clear();
