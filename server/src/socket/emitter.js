let ioInstance;

export default {
  setIO: (io) => {
    ioInstance = io;
  },
  emit: (runId, event, data) => {
    if (ioInstance) {
      ioInstance.to(runId.toString()).emit(event, data);
    }
  }
};
