import request from "supertest";
import AppInitializer from "../src/AppInitializer";
import { Contact } from "../src/entities/Contact";
import { User } from "../src/entities/User";
import fs from "fs";
import UserService from "../src/services/UserService";

const appInitializer = new AppInitializer();
let app: Express.Application;
const dbPath = `${__dirname}/data`;
let userId: number;

beforeAll(async (done) => {
  await appInitializer.init({
    type: "sqlite",
    database: dbPath + "/db.sqlite",
    entities: [User, Contact],
    synchronize: true,
  });
  app = appInitializer.app;
  const userService = new UserService();
  const user = await userService.createOne({});
  userId = user.id!;
  done();
});

afterAll(async (done) => {
  await appInitializer.connection?.close();
  fs.rmdirSync(dbPath, { recursive: true });
  appInitializer.server?.close(() => {
    done();
  });
});

describe("POST /v1/contact/:userId", () => {
  test("Should throw 422 when firstName is empty", async (done) => {
    const res = await request(app)
      .post("/v1/contacts/" + userId)
      .send({
        lastName: "Doe",
        company: "Microsoft",
        profileImage:
          "https://upload.wikimedia.org/wikipedia/commons/b/b6/Image_created_with_a_mobile_phone.png",
        email: "john@doe.com",
        birthdate: "11/24/1990",
        workPhone: "414383242",
        personalPhone: "3930225544",
        address: "Elmer St 342",
        state: "CA",
        city: "San Francisco",
      });
    expect(res.status).toEqual(422);
    done();
  });
});
