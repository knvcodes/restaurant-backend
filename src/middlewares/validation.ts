// middleware/validate.ts
import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";
import logger from "../utils/logger";

export const validate = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const details = error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        }));

        logger.error(
          {
            path: req.path,
            method: req.method,
            body: req.body,
            errors: details,
          },
          `Validation failed: ${details.map((d) => `${d.field} - ${d.message}`).join(", ")}`,
        );

        res.status(400).json({
          success: false,
          error: "Validation failed",
          details,
        });
        return;
      }
      next(error);
    }
  };
};
