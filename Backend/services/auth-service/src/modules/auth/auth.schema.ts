export const registerSchema = {
  body: {
    type: "object",
    required: ["email", "password"],
    properties: {
      email: {
        type: "string",
        format: "email",
        maxLength: 255,
      },
      password: {
        type: "string",
        minLength: 8,
        maxLength: 72, // bcrypt limit
      },
    },
    additionalProperties: false,
  },
};


export const loginSchema = {
  body: {
    type: "object",
    required: ["email", "password"],
    properties: {
      email: {
        type: "string",
        format: "email",
        maxLength: 255,
      },
      password: {
        type: "string",
        minLength: 8,
        maxLength: 72,
      },
    },
    additionalProperties: false,
  },
};


export const refreshTokenSchema = {
  body: {
    type: "object",
    required: ["refresh_token"],
    properties: {
      refresh_token: {
        type: "string",
        minLength: 128,
        maxLength: 128,
      },
    },
    additionalProperties: false,
  },
};

export const requestVerificationSchema = {
  body: {
    type: "object",
    required: ["email"],
    properties: {
      email: {
        type: "string",
        format: "email",
        maxLength: 255,
      },
    },
    additionalProperties: false,
  },
};

export const verifyEmailSchema = {
  querystring: {
    type: "object",
    required: ["token"],
    properties: {
      token: {
        type: "string",
        minLength: 1,
        maxLength: 255,
      },
    },
    additionalProperties: false,
  },
};
