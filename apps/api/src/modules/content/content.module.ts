import { Controller, Get, Injectable, Module, NotFoundException, Param } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { getPrismaClient } from "@nauterio/database";

/** Versioned public content read API. The current legal/help pages are the
 * product owner's accepted static release copy (ADR 0004); this endpoint
 * remains available for future approved policy versions. */
@Injectable()
class ContentService {
  async getPageBySlug(slug: string) {
    const prisma = getPrismaClient();
    const page = await prisma.contentPage.findUnique({
      where: { slug },
      include: { policyVersions: { where: { approved: true }, orderBy: { versionNumber: "desc" }, take: 1 } },
    });
    if (!page) throw new NotFoundException(`Content page '${slug}' not found`);
    return page;
  }
}

@ApiTags("content")
@Controller("content/pages")
class ContentController {
  constructor(private readonly service: ContentService) {}

  @Get(":slug")
  async getBySlug(@Param("slug") slug: string) {
    return this.service.getPageBySlug(slug);
  }
}

@Module({
  controllers: [ContentController],
  providers: [ContentService],
  exports: [ContentService],
})
export class ContentModule {}
