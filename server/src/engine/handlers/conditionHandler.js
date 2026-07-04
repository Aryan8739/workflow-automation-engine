import vm from 'vm';

async function conditionHandler(config, input) {
  const { expression } = config;
  if (!expression) {
    throw new Error('Condition node requires an expression in config.');
  }

  const script = new vm.Script(`(function() { return (${expression}); })()`);

  const context = { input };
  vm.createContext(context);

  const result = script.runInContext(context, { timeout: 1000 });
  return { branch: result ? 'true' : 'false', data: input };
}

export default conditionHandler;
