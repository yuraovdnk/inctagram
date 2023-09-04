
window.onload = function() {
  // Build a system
  let url = window.location.search.match(/url=([^&]+)/);
  if (url && url.length > 1) {
    url = decodeURIComponent(url[1]);
  } else {
    url = window.location.origin;
  }
  let options = {
  "swaggerDoc": {
    "openapi": "3.0.0",
    "paths": {
      "/auth/signup": {
        "post": {
          "operationId": "AuthController_signUp",
          "summary": "signup",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/SignUpDto"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/NotificationResult"
                  }
                }
              }
            }
          },
          "tags": [
            "AUTH"
          ]
        }
      },
      "/auth/registration-confirmation": {
        "post": {
          "operationId": "AuthController_confirmationEmail",
          "summary": "confirm registration",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ConfirmEmailDto"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": ""
            },
            "204": {
              "description": "Congratulations! Your email has been confirmed"
            },
            "400": {
              "description": "If the confirmation code is incorrect, expired or already been applied"
            }
          },
          "tags": [
            "AUTH"
          ]
        }
      },
      "/auth/login": {
        "post": {
          "operationId": "AuthController_login",
          "summary": "login",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/LoginDto"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Returns JWT accessToken in body and JWT refreshToken in cookie (http-only, secure)",
              "content": {
                "application/json": {
                  "schema": {
                    "properties": {
                      "accessToken": {
                        "type": "string"
                      }
                    }
                  }
                }
              }
            },
            "201": {
              "description": ""
            },
            "400": {
              "description": "If the inputModel has incorrect values"
            },
            "401": {
              "description": "If the password or login is wrong"
            }
          },
          "tags": [
            "AUTH"
          ]
        }
      },
      "/auth/password-recovery": {
        "post": {
          "operationId": "AuthController_passwordRecovery",
          "summary": "Password recovery",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/PasswordRecoveryDto"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "allOf": [
                      {
                        "$ref": "#/components/schemas/NotificationResult"
                      },
                      {
                        "properties": {
                          "data": {
                            "type": "object",
                            "nullable": true,
                            "default": null
                          }
                        }
                      }
                    ]
                  }
                }
              }
            },
            "429": {
              "description": "More than 5 attempts from one IP-address during 10 seconds"
            }
          },
          "tags": [
            "AUTH"
          ]
        }
      },
      "/auth/new-password": {
        "post": {
          "operationId": "AuthController_newPassword",
          "summary": "Confirm Password recovery",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/NewPasswordDto"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "allOf": [
                      {
                        "$ref": "#/components/schemas/NotificationResult"
                      },
                      {
                        "properties": {
                          "data": {
                            "type": "object",
                            "nullable": true,
                            "default": null
                          }
                        }
                      }
                    ]
                  }
                }
              }
            },
            "429": {
              "description": "More than 5 attempts from one IP-address during 10 seconds"
            }
          },
          "tags": [
            "AUTH"
          ]
        }
      },
      "/auth/logout": {
        "post": {
          "operationId": "AuthController_logout",
          "summary": "In cookie client must send correct refreshToken that will be revoked",
          "parameters": [],
          "responses": {
            "200": {
              "description": ""
            },
            "204": {
              "description": ""
            },
            "401": {
              "description": "If the JWT refreshToken inside cookie is missing, expired or incorrect"
            }
          },
          "tags": [
            "AUTH"
          ]
        }
      },
      "/auth/refresh-token": {
        "post": {
          "operationId": "AuthController_refreshToken",
          "summary": "Generate new pair of access and refresh tokens (in cookie client must send correct refreshToken that will be revoked after refreshing)",
          "parameters": [],
          "responses": {
            "200": {
              "description": "Returns JWT accessToken in body and JWT refreshToken in cookie (http-only, secure)",
              "content": {
                "application/json": {
                  "schema": {
                    "properties": {
                      "accessToken": {
                        "type": "string"
                      }
                    }
                  }
                }
              }
            },
            "401": {
              "description": "If the JWT refreshToken inside cookie is missing, expired or incorrect"
            }
          },
          "tags": [
            "AUTH"
          ]
        }
      },
      "/auth/registration-email-resending": {
        "post": {
          "operationId": "AuthController_resendEmailConfirmation",
          "summary": "registration email resending",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ResendConfirmationEmailDto"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/NotificationResult"
                  }
                }
              }
            }
          },
          "tags": [
            "AUTH"
          ]
        }
      },
      "/auth/me": {
        "get": {
          "operationId": "AuthController_getAuthInfo",
          "summary": "get user information",
          "parameters": [],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "allOf": [
                      {
                        "$ref": "#/components/schemas/NotificationResult"
                      },
                      {
                        "properties": {
                          "data": {
                            "$ref": "#/components/schemas/UserInfoViewDto",
                            "nullable": true
                          }
                        }
                      }
                    ]
                  }
                }
              }
            }
          },
          "tags": [
            "AUTH"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/oauth/github": {
        "get": {
          "operationId": "OauthController_githubSignup",
          "parameters": [],
          "responses": {
            "200": {
              "description": ""
            }
          },
          "tags": [
            "AUTH"
          ]
        }
      },
      "/oauth/github/callback": {
        "get": {
          "operationId": "OauthController_githubAuthCallback",
          "summary": "auth via oauth",
          "parameters": [],
          "responses": {
            "200": {
              "description": "Returns JWT accessToken in body and JWT refreshToken in cookie (http-only, secure)",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/NotificationResult"
                  }
                }
              }
            }
          },
          "tags": [
            "AUTH"
          ]
        }
      },
      "/oauth/google": {
        "get": {
          "operationId": "OauthController_googleSignup",
          "parameters": [],
          "responses": {
            "200": {
              "description": ""
            }
          },
          "tags": [
            "AUTH"
          ]
        }
      },
      "/oauth/google/callback": {
        "get": {
          "operationId": "OauthController_googleSignupRedirect",
          "summary": "auth via oauth",
          "parameters": [],
          "responses": {
            "200": {
              "description": "Returns JWT accessToken in body and JWT refreshToken in cookie (http-only, secure)",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/NotificationResult"
                  }
                }
              }
            }
          },
          "tags": [
            "AUTH"
          ]
        }
      },
      "/users/profile/{id}": {
        "post": {
          "operationId": "UserController_createProfile",
          "summary": "Create user profile",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UserProfileDto"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "allOf": [
                      {
                        "$ref": "#/components/schemas/NotificationResult"
                      },
                      {
                        "properties": {
                          "data": {
                            "type": "object",
                            "nullable": true,
                            "default": null
                          }
                        }
                      }
                    ]
                  }
                }
              }
            }
          },
          "tags": [
            "Users"
          ]
        },
        "put": {
          "operationId": "UserController_updateProfile",
          "summary": "Update user profile",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UserProfileDto"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "allOf": [
                      {
                        "$ref": "#/components/schemas/NotificationResult"
                      },
                      {
                        "properties": {
                          "data": {
                            "type": "object",
                            "nullable": true,
                            "default": null
                          }
                        }
                      }
                    ]
                  }
                }
              }
            }
          },
          "tags": [
            "Users"
          ]
        },
        "get": {
          "operationId": "UserController_getProfile",
          "summary": "Get user profile",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UserProfileDto"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "allOf": [
                      {
                        "$ref": "#/components/schemas/NotificationResult"
                      },
                      {
                        "properties": {
                          "data": {
                            "$ref": "#/components/schemas/UserProfileViewDto",
                            "nullable": true
                          }
                        }
                      }
                    ]
                  }
                }
              }
            }
          },
          "tags": [
            "Users"
          ]
        }
      }
    },
    "info": {
      "title": "Inctagram",
      "description": "The Inctagram API description",
      "version": "1.0",
      "contact": {}
    },
    "tags": [
      {
        "name": "cats",
        "description": ""
      }
    ],
    "servers": [],
    "components": {
      "schemas": {
        "SignUpDto": {
          "type": "object",
          "properties": {
            "username": {
              "type": "string",
              "description": "username",
              "minLength": 6,
              "maxLength": 30
            },
            "email": {
              "type": "string",
              "description": "email. It must comply with RFC 5322"
            },
            "password": {
              "type": "string",
              "description": "password"
            },
            "passwordConfirm": {
              "type": "string",
              "description": "password confirmation",
              "minLength": 6,
              "maxLength": 30
            }
          },
          "required": [
            "username",
            "email",
            "password",
            "passwordConfirm"
          ]
        },
        "NotificationExtension": {
          "type": "object",
          "properties": {
            "key": {
              "type": "string"
            },
            "message": {
              "type": "string"
            }
          },
          "required": [
            "message"
          ]
        },
        "NotificationResult": {
          "type": "object",
          "properties": {
            "resultCode": {
              "type": "number",
              "description": "{\"OK\":0,\"ERROR\":1,\"BAD_REQUEST\":2,\"UNAUTHORIZED\":3,\"FORBIDDEN\":4,\"NOT_FOUND\":5,\"NOT_CONFIRMED\":6,\"NOT_EXIST\":7,\"CREATED\":8}"
            },
            "extensions": {
              "default": [],
              "type": "array",
              "items": {
                "$ref": "#/components/schemas/NotificationExtension"
              }
            },
            "data": {
              "type": "object",
              "properties": {}
            }
          },
          "required": [
            "resultCode",
            "extensions",
            "data"
          ]
        },
        "ConfirmEmailDto": {
          "type": "object",
          "properties": {
            "code": {
              "type": "string",
              "description": "Code that be sent via Email inside link"
            }
          },
          "required": [
            "code"
          ]
        },
        "LoginDto": {
          "type": "object",
          "properties": {
            "email": {
              "type": "string",
              "description": "email must comply with RFC 5322"
            },
            "password": {
              "type": "string",
              "description": "password",
              "minLength": 6,
              "maxLength": 30
            }
          },
          "required": [
            "email",
            "password"
          ]
        },
        "PasswordRecoveryDto": {
          "type": "object",
          "properties": {
            "email": {
              "type": "string",
              "description": "email",
              "pattern": "^[w-.]+@([w-]+.)+[w-]{2,4}$",
              "example": "test@email.com"
            }
          },
          "required": [
            "email"
          ]
        },
        "NewPasswordDto": {
          "type": "object",
          "properties": {
            "newPassword": {
              "type": "string",
              "description": "new password. ",
              "minLength": 6,
              "maxLength": 20,
              "example": "Testpass1_"
            },
            "recoveryCode": {
              "type": "string",
              "description": "password recovery code",
              "format": "uuid"
            }
          },
          "required": [
            "newPassword",
            "recoveryCode"
          ]
        },
        "ResendConfirmationEmailDto": {
          "type": "object",
          "properties": {
            "email": {
              "type": "string",
              "description": "email",
              "pattern": "^[w-.]+@([w-]+.)+[w-]{2,4}$"
            }
          },
          "required": [
            "email"
          ]
        },
        "UserInfoViewDto": {
          "type": "object",
          "properties": {
            "userId": {
              "type": "string",
              "format": "uuid"
            },
            "username": {
              "type": "string",
              "example": "Username"
            },
            "email": {
              "type": "string",
              "format": "email"
            }
          },
          "required": [
            "userId",
            "username",
            "email"
          ]
        },
        "UserProfileDto": {
          "type": "object",
          "properties": {
            "username": {
              "type": "string",
              "description": "username",
              "minLength": 6,
              "maxLength": 30,
              "example": "Username"
            },
            "firstName": {
              "type": "string",
              "description": "firstName",
              "minLength": 1,
              "maxLength": 50,
              "example": "John"
            },
            "lastName": {
              "type": "string",
              "description": "lastName",
              "minLength": 1,
              "maxLength": 50,
              "example": "Smith"
            },
            "city": {
              "type": "string",
              "description": "city",
              "nullable": true,
              "example": "London"
            },
            "dateOfBirth": {
              "type": "string",
              "description": "dateOfBirth",
              "example": "2003-09-01T20:22:39.762Z"
            },
            "aboutMe": {
              "type": "string",
              "maxLength": 200,
              "description": "aboutMe",
              "nullable": true,
              "example": "Some text..."
            },
            "avatar": {
              "type": "string",
              "description": "avatar",
              "nullable": true,
              "format": "url",
              "example": "https://s3.eu-central-1.amazonaws.com/example-bucket/avatar.png"
            }
          },
          "required": [
            "username",
            "firstName",
            "lastName",
            "dateOfBirth"
          ]
        },
        "UserProfileViewDto": {
          "type": "object",
          "properties": {
            "userId": {
              "type": "uuid",
              "example": "ad813e6f-90be-46ed-a0ce-2f094885f253"
            },
            "username": {
              "type": "string",
              "example": "Username"
            },
            "firstName": {
              "type": "string",
              "example": "John"
            },
            "lastName": {
              "type": "string",
              "example": "Smith"
            },
            "city": {
              "type": "string",
              "example": "London"
            },
            "dateOfBirth": {
              "type": "string",
              "description": "dateOfBirth",
              "example": "2003-09-01T20:22:39.762Z"
            },
            "aboutMe": {
              "type": "string",
              "description": "aboutMe",
              "example": "Some text..."
            },
            "avatar": {
              "type": "string",
              "description": "avatar",
              "format": "url",
              "example": "https://s3.eu-central-1.amazonaws.com/example-bucket/avatar.png"
            }
          },
          "required": [
            "userId",
            "username",
            "firstName",
            "lastName",
            "city",
            "dateOfBirth",
            "aboutMe",
            "avatar"
          ]
        }
      }
    }
  },
  "customOptions": {}
};
  url = options.swaggerUrl || url
  let urls = options.swaggerUrls
  let customOptions = options.customOptions
  let spec1 = options.swaggerDoc
  let swaggerOptions = {
    spec: spec1,
    url: url,
    urls: urls,
    dom_id: '#swagger-ui',
    deepLinking: true,
    presets: [
      SwaggerUIBundle.presets.apis,
      SwaggerUIStandalonePreset
    ],
    plugins: [
      SwaggerUIBundle.plugins.DownloadUrl
    ],
    layout: "StandaloneLayout"
  }
  for (let attrname in customOptions) {
    swaggerOptions[attrname] = customOptions[attrname];
  }
  let ui = SwaggerUIBundle(swaggerOptions)

  if (customOptions.initOAuth) {
    ui.initOAuth(customOptions.initOAuth)
  }

  if (customOptions.authAction) {
    ui.authActions.authorize(customOptions.authAction)
  }
  
  window.ui = ui
}
