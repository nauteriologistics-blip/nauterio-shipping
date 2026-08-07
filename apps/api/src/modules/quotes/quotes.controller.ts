import { Body, Controller, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { QuotesService } from "./quotes.service";
import { CreateQuoteDto } from "./dto/create-quote.dto";

@ApiTags("quotes")
@Controller("quotes")
export class QuotesController {
  constructor(private readonly quotesService: QuotesService) {}

  /** Public - anonymous quoting is explicitly required (spec 32.2: "Do not
   * ask for full account registration before an anonymous quote"). */
  @Post()
  async create(@Body() dto: CreateQuoteDto) {
    return this.quotesService.calculate(dto);
  }
}
