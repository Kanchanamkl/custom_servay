import { NextResponse, type NextRequest } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-session";
import { listResponses } from "@/lib/data/responses";
import { generateResponsesCsv } from "@/lib/csv";
import { getDashboardSlug } from "@/config/admin";

export async function GET(request: NextRequest) {
  const isAuth = await isAdminAuthenticated();
  const searchParams = request.nextUrl.searchParams;
  const token = searchParams.get("token");
  const dashboardSlug = getDashboardSlug();

  // Allow access if logged in as admin or matching secret token
  const hasSecretToken = dashboardSlug && token === dashboardSlug;

  if (!isAuth && !hasSecretToken) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const responses = await listResponses();
  const csv = generateResponsesCsv(responses);

  const dateStr = new Date().toISOString().slice(0, 10);
  const filename = `elara-survey-responses-${dateStr}.csv`;

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store, max-age=0",
    },
  });
}

