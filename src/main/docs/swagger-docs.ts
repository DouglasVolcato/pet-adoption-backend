export const swaggerDocs = {
  openapi: "3.0.0",
  info: {
    title: "Pet Adoption Backend",
    description: "API documentation",
    version: "1.0.0",
  },
  components: {
    securitySchemes: {
      BearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
  paths: {
    "/login": {
      post: {
        summary: "User login",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  email: { type: "string", format: "email" },
                  password: { type: "string", minLength: 6 },
                },
                example: {
                  email: "user@example.com",
                  password: "password123",
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Successful login",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    user: {
                      type: "object",
                      properties: {
                        id: { type: "string" },
                        name: { type: "string" },
                        email: { type: "string" },
                        admin: { type: "boolean" },
                      },
                    },
                    token: { type: "string" },
                  },
                },
              },
            },
          },
          "400": {
            description: "Bad request",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    error: { type: "string" },
                  },
                },
              },
            },
          },
          "500": {
            description: "Internal server error",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    error: { type: "string" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/user": {
      post: {
        summary: "Create user",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  email: { type: "string", format: "email" },
                  password: { type: "string", minLength: 6 },
                },
                example: {
                  name: "John Doe",
                  email: "john.doe@example.com",
                  password: "password123",
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Successful creation",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    id: { type: "string" },
                    name: { type: "string" },
                    email: { type: "string" },
                    admin: { type: "boolean" },
                  },
                },
              },
            },
          },
          "400": {
            description: "Bad request",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    error: { type: "string" },
                  },
                },
              },
            },
          },
          "500": {
            description: "Internal server error",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    error: { type: "string" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/pet": {
      post: {
        summary: "Index pets into database",
        security: [{ BearerAuth: [] }],
        responses: {
          "200": {
            description: "Successful request",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {},
                },
              },
            },
          },
          "401": {
            description: "Unauthorized",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    error: { type: "string" },
                  },
                },
              },
            },
          },
          "500": {
            description: "Internal server error",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    error: { type: "string" },
                  },
                },
              },
            },
          },
        },
      },
      put: {
        summary: "Update pet status",
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  petId: { type: "string" },
                  newStatus: { type: "string" },
                },
                example: {
                  petId: "12345",
                  newStatus: "free",
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Successful update",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    id: { type: "string" },
                    name: { type: "string" },
                    description: { type: "string" },
                    image: { type: "string" },
                    createdAt: { type: "string" },
                    category: { type: "string" },
                    status: { type: "string" },
                  },
                },
              },
            },
          },
          "400": {
            description: "Bad request",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    error: { type: "string" },
                  },
                },
              },
            },
          },
          "401": {
            description: "Unauthorized",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    error: { type: "string" },
                  },
                },
              },
            },
          },
          "500": {
            description: "Internal server error",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    error: { type: "string" },
                  },
                },
              },
            },
          },
        },
      },
      get: {
        summary: "Get pets",
        parameters: [
          {
            in: "query",
            name: "limit",
            schema: { type: "number" },
            example: 10,
          },
          {
            in: "query",
            name: "offset",
            schema: { type: "number" },
            example: 0,
          },
          {
            in: "query",
            name: "term",
            schema: { type: "string" },
            example: "friendly",
          },
          {
            in: "query",
            name: "name",
            schema: { type: "string" },
            example: "Buddy",
          },
          {
            in: "query",
            name: "description",
            schema: { type: "string" },
            example: "A playful dog",
          },
          {
            in: "query",
            name: "category",
            schema: { type: "string", enum: ["cats", "dogs"] },
            example: "dogs",
          },
          {
            in: "query",
            name: "status",
            schema: { type: "string", enum: ["free", "adopted"] },
            example: "free",
          },
          {
            in: "query",
            name: "createdAt",
            schema: { type: "string" },
            example: "2023-01-01",
          },
        ],
        responses: {
          "200": {
            description: "Successful request",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      id: { type: "string" },
                      name: { type: "string" },
                      description: { type: "string" },
                      image: { type: "string" },
                      createdAt: { type: "string" },
                      category: { type: "string" },
                      status: { type: "string" },
                    },
                  },
                },
              },
            },
          },
          "400": {
            description: "Bad request",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    error: { type: "string" },
                  },
                },
              },
            },
          },
          "500": {
            description: "Internal server error",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    error: { type: "string" },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};
