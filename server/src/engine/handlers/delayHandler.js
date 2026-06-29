async function delayHandler(config, input) {
  // config shape: { ms }
  const ms = parseInt(config.ms, 10);
  
  if (isNaN(ms) || ms < 0) {
    throw new Error('Delay node requires a valid positive number of ms in config.');
  }

  await new Promise((resolve) => setTimeout(resolve, ms));
  
  return { waited: ms };
}

export default delayHandler;
