/** @type {import('jest').Config} */
module.exports = {
  moduleFileExtensions: ["js", "json", "ts"],
  rootDir: "src",
  testRegex: ".*\\.spec\\.ts$",
  transform: {
    "^.+\\.(t|j)s$": "ts-jest",
  },
  collectCoverageFrom: ["**/*.(t|j)s"],
  testEnvironment: "node",
  // Several spec files (billing/bookings/claims-returns/customers) exercise
  // a real Prisma client against local Postgres rather than mocking
  // @nauterio/database - main.ts loads dotenv/config as its first import,
  // this is the test-runner equivalent so DATABASE_URL is set the same way.
  setupFiles: ["dotenv/config"],
};
