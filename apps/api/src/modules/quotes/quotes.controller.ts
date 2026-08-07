import { Body, Controller, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { Throttle } from "@nestjs/throttler";
import { QuotesService } from "./quotes.service";
import { CreateQuoteDto } from "./dto/create-quote.dto";

@ApiTags("quotes")
@Controller("quotes")
export class QuotesController {
  constructor(private readonly quotesService: QuotesService) {}

  /** Public - anonymous quoting is explicitly required (spec 32.2: "Do not
   * ask for full account registration before an anonymous quote"). Tighter
   * limit than the app default since it's unauthenticated and writes a row
   * per call. */
  @Post()
  @Throttle({ default: { limit: 30, ttl: 60_000 } })
  async create(@Body() dto: CreateQuoteDto) {
    return this.quotesService.calculate(dto);
  }
}
