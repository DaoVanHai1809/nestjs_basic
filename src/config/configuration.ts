import { ConfigFactory } from '@nestjs/config/dist/interfaces';
// const dotenvExpand = require('dotenv-expand');

// import dotenvExpand from 'dotenv-expand';
import moment from 'moment';
import { Configuration } from './configuration.interface';
// dotenvExpand.expand(config());

const int = (val: string | undefined, num: number): number =>
  val ? (isNaN(parseInt(val)) ? num : parseInt(val)) : num;
const bool = (val: string | undefined, bool: boolean): boolean =>
  val == null ? bool : val == 'true';

const configuration: Configuration = {
  frontendUrl: process.env.FRONTEND_URL ?? 'http://localhost:3000',
  kafka: {
    address: process.env.KAFKA_ADDRESS
      ? process.env.KAFKA_ADDRESS.split(',')
      : ['http://localhost:9092'],
  },
  pushNotification: {
    enable: bool(process.env.PUSH_NOTIFICATION_DEV, false),
  },
  meta: {
    appName: process.env.APP_NAME ?? 'Staart',
    appUrl: process.env.BASE_URL ?? 'http://localhost:8080',
    domainVerificationFile:
      process.env.DOMAIN_VERIFICATION_FILE ?? 'staart-verify.txt',
  },
  redis: {
    CACHE_TTL: int(process.env.REDIS_CACHE_TTL, 60),
    host: process.env.REDIS_HOST ?? 'localhost',
    port: int(process.env.REDIS_PORT, 6379),
  },
  logic: {
    maxLike: int(process.env.MAXIMUM_LIKE, 300),
    initLike: int(process.env.INIT_LIKE, 100),
    initMaleLike: int(process.env.INIT_MALE_LIKE, 30),
    default_male_like: int(process.env.DEFAULT_MALE_LIKE, 50),
    paid_male_like: int(process.env.PAID_MALE_LIKE, 30),
    day_add_likes: int(process.env.DAY_ADD_LIKES, 30),
    timeType_add_likes: (process.env.TIMETYPE_ADD_LIKES ??
      'day') as moment.unitOfTime.DurationConstructor,
    apple_pass_review: Boolean(process.env.APPLE_PASS_REVIEW) ?? false,
  },
  rateLimit: {
    public: {
      points: int(process.env.RATE_LIMIT_PUBLIC_POINTS, 250),
      duration: int(process.env.RATE_LIMIT_PUBLIC_DURATION, 3600),
    },
    authenticated: {
      points: int(process.env.RATE_LIMIT_AUTHENTICATED_POINTS, 5000),
      duration: int(process.env.RATE_LIMIT_AUTHENTICATED_DURATION, 3600),
    },
    apiKey: {
      points: int(process.env.RATE_LIMIT_API_KEY_POINTS, 10000),
      duration: int(process.env.RATE_LIMIT_API_KEY_DURATION, 3600),
    },
  },
  caching: {
    geolocationLruSize: int(process.env.GEOLOCATION_LRU_SIZE, 100),
    apiKeyLruSize: int(process.env.API_KEY_LRU_SIZE, 100),
  },

  security: {
    saltRounds: int(process.env.SALT_ROUNDS, 10),
    jwtSecret: process.env.JWT_SECRET ?? 'staart',
    totpWindowPast: int(process.env.TOTP_WINDOW_PAST, 1),
    totpWindowFuture: int(process.env.TOTP_WINDOW_FUTURE, 0),
    mfaTokenExpiry: process.env.MFA_TOKEN_EXPIRY ?? '10m',
    mergeUsersTokenExpiry: process.env.MERGE_USERS_TOKEN_EXPIRY ?? '30m',
    accessTokenExpiry: process.env.ACCESS_TOKEN_EXPIRY ?? '1h',
    passwordPwnedCheck: bool(process.env.PASSWORD_PWNED_CHECK, true),
    unusedRefreshTokenExpiryDays: int(process.env.DELETE_EXPIRED_SESSIONS, 30),
    inactiveUserDeleteDays: int(process.env.INACTIVE_USER_DELETE_DAYS, 30),
    removedUserDeleteDays: int(process.env.REMOVED_USER_DELETE_DAYS, 30),
  },
  email: {
    name: process.env.EMAIL_NAME ?? 'Staart',
    from: process.env.EMAIL_FROM ?? '',
    retries: int(process.env.EMAIL_FAIL_RETRIES, 3),
    ses: {
      accessKeyId: process.env.EMAIL_SES_ACCESS_KEY_ID ?? '',
      secretAccessKey: process.env.EMAIL_SES_SECRET_ACCESS_KEY ?? '',
      region: process.env.EMAIL_SES_REGION ?? '',
    },
    transport: {
      host: process.env.EMAIL_HOST ?? '',
      port: int(process.env.EMAIL_PORT, 587),
      secure: bool(process.env.EMAIL_SECURE, false),
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    },
  },
  default: {
    area: process.env.DEFAULT_AREA ?? '20km',
    lat: int(process.env.DEFAULT_LOCATION_LAT, 0),
    lon: int(process.env.DEFAULT_LOCATION_LON, 0),
  },
  webhooks: {
    retries: int(process.env.WEBHOOK_FAIL_RETRIES, 3),
  },
  sms: {
    retries: int(process.env.SMS_FAIL_RETRIES, 3),
    twilioAccountSid: process.env.TWILIO_ACCOUNT_SID ?? '',
    twilioAuthToken: process.env.TWILIO_AUTH_TOKEN ?? '',
  },

  tracking: {
    mode:
      (process.env.TRACKING_MODE as Configuration['tracking']['mode']) ??
      'api-key',
    index: process.env.TRACKING_INDEX ?? 'staart-logs',
    deleteOldLogs: bool(process.env.TRACKING_DELETE_OLD_LOGS, true),
    deleteOldLogsDays: int(process.env.TRACKING_DELETE_OLD_LOGS_DAYS, 90),
  },
  slack: {
    token: process.env.SLACK_TOKEN ?? '',
    slackApiUrl: process.env.SLACK_API_URL,
    rejectRateLimitedCalls: bool(
      process.env.SLACK_REJECT_RATE_LIMITED_CALLS,
      false,
    ),
    retries: int(process.env.SLACK_FAIL_RETRIES, 3),
  },
  s3: {
    accessKeyId: process.env.AWS_S3_ACCESS_KEY ?? '',
    secretAccessKey: process.env.AWS_S3_SECRET_KEY ?? '',
    region: process.env.AWS_S3_REGION ?? '',
    profilePictureBucket: process.env.AWS_S3_PROFILE_PICTURE_BUCKET ?? '',
    profilePictureCdnHostname:
      process.env.AWS_S3_PROFILE_PICTURE_CDN_HOST_NAME ?? '',
  },
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME ?? '',
    apiKey: process.env.CLOUDINARY_API_KEY ?? '',
    apiSecret: process.env.CLOUDINARY_API_SECRET ?? '',
  },
  github: {
    auth: process.env.GITHUB_AUTH,
    userAgent: process.env.GITHUB_USER_AGENT,
  },
  googleMaps: {
    apiKey: process.env.GOOGLE_MAPS_API_KEY,
  },
  gravatar: {
    enabled: bool(process.env.PASSWORD_PWNED_CHECK, true),
  },
};

const configFunction: ConfigFactory<Configuration> = () => configuration;
export default configFunction;
