import { GraphQLError } from "graphql";
import {parseISO} from "date-fns";
import { prisma } from "../../lib/prisma";


const verificationResolvers = {
  Query: {
    verifyNIN: async (_: any, { nin }: { nin: string }) => {
      if (nin.toUpperCase() === "CM000000000XXX") {
        throw new GraphQLError("Example placeholder NIN cannot be registered", {
          extensions: { code: "BAD_USER_INPUT" },
        });
      }

      // Safe creation using native engine wrapped safely via scalar handling
      return {
        nin: nin.toUpperCase(),
        fullName: "NAKIMULI SARAH",
        dateOfBirth: parseISO("1988-05-14T00:00:00.000Z"),
        gender: "Female",
        districtOfOrigin: "KAMPALA",
      };
    },
  },

  Mutation: {
    initializeTeacherProfile: async (
      _: any,
      { nin, fullName, dateOfBirth, gender, districtOfOrigin }: {
        nin: string;
        fullName: string;
        dateOfBirth: Date;
        gender: string;
        districtOfOrigin: string;
      }
    ) => {
      const existingTeacher = await prisma.teacher.findUnique({
        where: { nin: nin.toUpperCase() },
      });

      if (existingTeacher) {
        return existingTeacher;
      }

      const teacher = await prisma.teacher.create({
        data: {
          nin: nin.toUpperCase(),
          fullName,
          dateOfBirth, 
          gender,
          districtOfOrigin,
          currentStep: "PERSONAL_DETAILS",
        },
      });

      return teacher;
    },

    uploadRegistrationDocument: async (
      _: any,
      { teacherId, type, fileUrl, publicId }: {
        teacherId: string;
        type: "DEGREE_DIPLOMA" | "ACADEMIC_TRANSCRIPT" | "TEACHING_LICENSE";
        fileUrl: string;
        publicId: string;
      }
    ) => {
      const teacher = await prisma.teacher.findUnique({ where: { id: teacherId } });
      if (!teacher) {
        throw new GraphQLError("Teacher account footprint missing", {
          extensions: { code: "NOT_FOUND" },
        });
      }

      const document = await prisma.document.upsert({
        where: {
          teacherId_type: { teacherId, type },
        },
        update: {
          fileUrl,
          publicId,
          status: "PENDING",
        },
        create: {
          teacherId,
          type,
          fileUrl,
          publicId,
          status: "PENDING",
        },
      });

      await prisma.teacher.update({
        where: { id: teacherId },
        data: { currentStep: "DOCUMENT_UPLOAD" },
      });

      return document;
    },
  },
};

export default verificationResolvers;