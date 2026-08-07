import { Controller, Get, Injectable, Module, NotFoundException, Param } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { getPrismaClient } from "@nauterio/database";

/** Content module (spec section 24): public pages, guides, FAQ, service
 * alerts, policy versions. Public read path only - the legal/help pages
 * currently on apps/web are static copy pending legal review (see
 * apps/web's terms/privacy/cookies pages); this exists so they can migrate
 * to database-backed, versioned content once that review happens. */
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
