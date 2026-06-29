import vm from 'vm';

async function transformHandler(config, input) {
  // config shape: { code }
  const { code } = config;
  if (!code) {
    throw new Error('Transform node requires code in config.');
  }

  // Wrap the code in an IIFE to allow top-level returns to work inside the VM
  const script = new vm.Script(`(function() { ${code} })()`);
  
  const context = { input };
  vm.createContext(context);
  
  const result = script.runInContext(context, { timeout: 1000 });
  return result;
}

export default transformHandler;
