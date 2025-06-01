export type CloudFunctionKey = 'registerCustomer' | 'registerVendor' | 'registerOrganizer' | 'login' | 'syncUser' | 'getRole';

export const CLOUD_FUNCTIONS: Record<CloudFunctionKey, string> = {
  registerCustomer: 'https://registercustomer-numtsv52wa-as.a.run.app',
  registerVendor: 'https://registervendor-numtsv52wa-as.a.run.app',
  registerOrganizer: 'https://registerorganizer-numtsv52wa-as.a.run.app',
  login: 'https://login-numtsv52wa-as.a.run.app',
  syncUser: 'https://syncuser-numtsv52wa-as.a.run.app',
  getRole: 'https://getrole-numtsv52wa-as.a.run.app'
}; 