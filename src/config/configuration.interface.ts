import moment from 'moment';
export interface Configuration {
  frontendUrl: string;
  kafka: {
    address: string[];
  };
  meta: {
    appName: string;
    appUrl: string;
    domainVerificationFile: string;
  };
  redis: {
    CACHE_TTL: number;
    host: string;
    port: number;
  };

  caching: {
    geolocationLruSize: number;
    apiKeyLruSize: number;
  };
  logic: {
    maxLike: number;
    initLike: number;
    initMaleLike: number;
    day_add_likes: number;
    default_male_like: number;
    timeType_add_likes: moment.unitOfTime.DurationConstructor;
    apple_pass_review: boolean;
    paid_male_like: number;
  };
  rateLimit: {
    public: { points: number; duration: number };
    authenticated: { points: number; duration: number };
    apiKey: { points: number; duration: number };
  };
  default: {
    lat: number;
    lon: number;
    area: string;
  };
  security: {
    saltRounds: number;
    jwtSecret: string;
    totpWindowPast: number;
    totpWindowFuture: number;
    mfaTokenExpiry: string;
    mergeUsersTokenExpiry: string;
    accessTokenExpiry: string;
    passwordPwnedCheck: boolean;
    unusedRefreshTokenExpiryDays: number;
    inactiveUserDeleteDays: number;
    removedUserDeleteDays: number;
  };

  email: {
    name: string;
    from: string;
    retries: number;
    ses: {
      accessKeyId: string;
      secretAccessKey: string;
      region: string;
    };
    transport: {
      host: string;
      port: number;
      secure: boolean;
      auth: {
        user: string;
        pass: string;
      };
    };
  };

  pushNotification: {
    enable: boolean;
  };
  webhooks: {
    retries: number;
  };

  sms: {
    retries: number;
    twilioAccountSid: string;
    twilioAuthToken: string;
  };

  tracking: {
    mode: 'all' | 'api-key' | 'user' | 'api-key-or-user';
    index: string;
    deleteOldLogs: boolean;
    deleteOldLogsDays: number;
  };

  slack: {
    token: string;
    slackApiUrl?: string;
    rejectRateLimitedCalls?: boolean;
    retries: number;
  };

  s3: {
    accessKeyId: string;
    secretAccessKey: string;
    region: string;
    profilePictureBucket?: string;
    profilePictureCdnHostname?: string;
  };

  cloudinary: {
    cloudName: string;
    apiKey: string;
    apiSecret: string;
  };

  github: {
    auth: string;
    userAgent?: string;
  };

  googleMaps: {
    apiKey: string;
  };

  gravatar: {
    enabled: boolean;
  };
}
