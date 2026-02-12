import { serve } from "inngest/next";
import { inngest } from "@/lib/inngest";
import { runCampaign } from "@/lib/services/inngest-functions";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [runCampaign],
});
