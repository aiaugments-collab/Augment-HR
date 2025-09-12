import { z } from "zod";
import { getSignedUrlForUpload } from "../services/r2.service";
import { CloudinaryService } from "../services/cloudinary.service";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import cuid2 from "@paralleldrive/cuid2";
import { attachments } from "@/server/db/attachments";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { AttachmentService } from "../services/attachment.service";

export const getFileExtension = (name: string) => {
  return name.split(".").at(-1) ?? "N/A";
};

export const attachmentsRouter = createTRPCRouter({
  getPresignedUrl: protectedProcedure
    .input(
      z.object({
        fileName: z.string(),
        mimeType: z.string(),
        type: z.enum(["image", "video", "audio", "document"]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const extension = getFileExtension(input.fileName);

      const id = cuid2.createId();
      const attachmentKey = `${id}${extension ? `.${extension}` : ""}`;

      const { uploadUrl, path, publicUrl } = await getSignedUrlForUpload({
        key: attachmentKey,
        contentType: input.mimeType,
      });

      const [attachment] = await ctx.db
        .insert(attachments)
        .values({
          fullPath: publicUrl, // TODO: currently using public URL as full path since there is some issue with presigned url
          mimeType: input.mimeType,
          userId: ctx.session.user.id,
          extension,
          fileName: input.fileName,
          type: input.type,
        })
        .returning()
        .execute();

      if (!attachment) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create attachment record",
        });
      }

      return { uploadUrl, path, publicUrl, attachmentId: attachment.id };
    }),

  getAttachment: protectedProcedure
    .input(z.object({ attachmentId: z.string() }))
    .query(async ({ ctx, input }) => {
      return AttachmentService.getAttachmentById(input.attachmentId);
    }),

  // Public endpoint for job application resume uploads using Cloudinary
  getPublicPresignedUrl: publicProcedure
    .input(
      z.object({
        fileName: z.string(),
        mimeType: z.string(),
        type: z.enum(["document"]), // Only allow documents for public uploads
      }),
    )
    .mutation(async ({ input }) => {
      // Validate file type for resumes
      const allowedMimeTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      
      if (!allowedMimeTypes.includes(input.mimeType)) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Only PDF and Word documents are allowed for resume uploads",
        });
      }

      // Generate Cloudinary signed upload parameters
      const uploadData = await CloudinaryService.generateSignedUploadUrl({
        folder: 'resumes',
        resourceType: 'raw',
        allowedFormats: ['pdf', 'doc', 'docx'],
      });

      // Generate a unique filename for tracking
      const extension = getFileExtension(input.fileName);
      const id = cuid2.createId();
      const uniqueFileName = `${id}${extension ? `.${extension}` : ""}`;

      return {
        uploadUrl: uploadData.upload_url,
        uploadParams: {
          timestamp: uploadData.timestamp,
          signature: uploadData.signature,
          api_key: uploadData.api_key,
          folder: uploadData.folder,
        },
        publicUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/files/${uploadData.folder}/${uniqueFileName}`,
        path: `${uploadData.folder}/${uniqueFileName}`,
      };
    }),
});
