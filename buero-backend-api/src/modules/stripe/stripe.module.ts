import { Module, Global } from "@nestjs/common";
import { StripeService } from "./stripe.service";

@Global()
@Module({
  providers: [StripeService],
  exports: [StripeService],
})
export class StripeModule {}
