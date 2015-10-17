export const subscriptionNotify = {
  create: {
    success: response => ({
      title: 'Subscribed',
      message: `Subscription to ${response.subscription.subscription} was succesful.`,
      level: 'info'
    }),
    error: response => ({
      title: 'Could not subscribe',
      message: `Subscription to ${response.subscription.subscription} failed.`,
      level: 'error'
    })
  },
  update: {
    success: response => ({
      title: 'Resubscription',
      message: `Subscription to ${response.subscription.subscription} was succesful.`,
      level: 'info'
    }),
    error: err => ({
      title: 'Resubscription',
      message: `Could not resubscribe ${err.message}`,
      level: 'error'
    })
  },
  remove: {
    success: response => ({
      title: 'Deletion',
      message: `Deletion of was succesful.`,
      level: 'info'
    }),
    error: err => ({
      title: 'Deletion',
      message: `Could not delete ${err.subscription.subscription}`,
      level: 'error'
    })
  }
};

export const typeNotify = {
  create: {
    success: () => ({
      title: 'Type created',
      message: 'All entity types created.',
      level: 'info'
    }),
    error: () => ({
      title: 'Type not created',
      message: 'Could not save entity types.',
      level: 'error'
    })
  }
};

export const entityNotify = {
  create: {
    success: () => ({
      title: 'Entites created',
      message: 'All entities were created.',
      level: 'info'
    }),
    error: () => ({
      title: 'Entites not created',
      message: 'Could not save entities.',
      level: 'error'
    })
  }
};

export const cpsNotify = {
  create: {
    success: () => ({
      title: 'CPS created',
      message: 'Connections to all clients established.',
      level: 'info'
    }),
    error: err => ({
      title: 'CPS was not created',
      message: `Cannot connect to ${err.hostname}`,
      level: 'error'
    })
  }
};
