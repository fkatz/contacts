import express from "express";
import expressAsyncHandler from "express-async-handler";
import { ContactDTO } from "../entities/dto/ContactDTO";
import rateLimiter from "../middleware/rateLimiter";
import ContactService from "../services/ContactService";

export class ContactController {
  public router = express.Router();

  private contactService = new ContactService();

  constructor() {
    this.router.get(
      "/:userId/:contactId",
      rateLimiter({ max: 5000 }),
      expressAsyncHandler(async (req, res, next) => {
        const contact = await this.contactService.findOne({
          id: parseInt(req.params.contactId),
          userId: parseInt(req.params.userId),
        });
        res.send(contact);
      })
    );
    this.router.put(
      "/:userId/:contactId",
      rateLimiter({ max: 2500 }),
      expressAsyncHandler(async (req, res, next) => {
        const contact = await this.contactService.updateOne({
          ...req.body,
          id: parseInt(req.params.contactId),
          userId: parseInt(req.params.userId),
        });
        res.send(contact);
      })
    );
    this.router.delete(
      "/:userId/:contactId",
      rateLimiter({ max: 2500 }),
      expressAsyncHandler(async (req, res, next) => {
        const result = await this.contactService.deleteOne(
          parseInt(req.params.userId),
          parseInt(req.params.contactId)
        );
        res.send(result);
      })
    );
    this.router.post(
      "/:userId",
      rateLimiter({ max: 2500 }),
      expressAsyncHandler(async (req, res, next) => {
        const contact = await this.contactService.createOne({
          ...req.body,
          userId: parseInt(req.params.userId),
        });
        res.send(contact);
      })
    );

    this.router.post(
      "/:userId/batch",
      rateLimiter({ max: 100 }),
      expressAsyncHandler(async (req, res, next) => {
        const contacts = await this.contactService.createMany(
          req.body.map((item: ContactDTO) => ({
            ...item,
            userId: parseInt(req.params.userId),
          }))
        );
        res.send(contacts);
      })
    );

    this.router.get(
      "/:userId",
      rateLimiter({ max: 1000 }),
      expressAsyncHandler(async (req, res, next) => {
        const result = await this.contactService.search(
          req.query as any,
          parseInt(req.params.userId)
        );
        res.send(result);
      })
    );
  }
}
