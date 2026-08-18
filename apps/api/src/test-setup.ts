import { disconnectPrisma } from "@nauterio/database";

afterAll(async () => {
  await disconnectPrisma();
});
