export default {
    Error: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'error' },
        message: { type: 'string' },
        requestId: { type: 'string' }
      }
    }
  };