import { Controller, Get, Injectable, Module, NotFoundException, Param, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { getPrismaClient } from "@nauterio/database";
import { AuthGuard } from "../../common/guards/auth.guard";

/** Documents module (spec section 24 and 28.1): upload, malware result,
 * version, review, generation, access, retention. Metadata read path only -
 * the real pre-signed-S3 upload flow (spec 28.1) needs a real S3 bucket/KMS
 * key, which is AWS infrastructure not yet provisioned (ADR 0001 section
 * 10). Do not fake a "successful upload" without real quarantine/malware
 * scanning behind it - that would violate the exact security control this
 * module exists to enforce. */
@Injectable()
class DocumentsService {
  async getById(id: string) {
    const prisma = getPrismaClient();
    const doc = await prisma.document.findUnique({ where: { id }, include: { versions: true } });
    if (!doc) throw new NotFoundException(`Document ${id} not found`);
    return doc;
  }
}

@ApiTags("documents")
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller("documents")
class DocumentsController {
  constructor(private readonly service: DocumentsService) {}

  @Get(":id")
  async getById(@Param("id") id: string) {
    return this.service.getById(id);
  }
}

@Module({
  controllers: [DocumentsController],
  providers: [DocumentsService],
  exports: [DocumentsService],
})
export class DocumentsModule {}
