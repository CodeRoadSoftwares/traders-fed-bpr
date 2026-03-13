import { getUser } from "@/lib/auth/getUser";
import { connectDb } from "@/lib/db/db";
import Fund from "@/models/fund.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await connectDb();
    const user = await getUser();
    const isAdmin = user?.role === "ADMIN" || user?.role === "SUPER_ADMIN";
    if (!isAdmin) {
      return NextResponse.json({ message: "unauthorized" }, { status: 403 });
    }
    const period = req.nextUrl.searchParams.get("period") || "monthly";
    const year =
      Number(req.nextUrl.searchParams.get("year")) || new Date().getFullYear();
    const month = req.nextUrl.searchParams.get("month");

    const match: Record<string, unknown> = {};
    if (period === "monthly" && month) {
      const startDate = new Date(year, Number(month) - 1, 1);
      const endDate = new Date(year, Number(month), 0, 23, 59, 59);
      match.date = { $gte: startDate, $lte: endDate };
    } else if (period === "quarterly") {
      const quarter = Number(req.nextUrl.searchParams.get("quarter")) || 1;
      const startMonth = (quarter - 1) * 3;
      const startDate = new Date(year, startMonth, 1);
      const endDate = new Date(year, startMonth + 3, 0, 23, 59, 59);
      match.date = { $gte: startDate, $lte: endDate };
    } else {
      const startDate = new Date(year, 0, 1);
      const endDate = new Date(year, 11, 31, 23, 59, 59);
      match.date = { $gte: startDate, $lte: endDate };
    }

    const report = await Fund.aggregate([
      { $match: match },
      {
        $group: {
          _id: { type: "$type", category: "$category" },
          total: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.type": 1, "_id.category": 1 } },
    ]);

    const income = report
      .filter((r) => r._id.type === "INCOME")
      .reduce((sum, r) => sum + r.total, 0);
    const expense = report
      .filter((r) => r._id.type === "EXPENSE")
      .reduce((sum, r) => sum + r.total, 0);

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          h1 { color: #333; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
          th { background-color: #f4f4f4; }
          .summary { background-color: #f9f9f9; padding: 15px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <h1>Traders Federation - Financial Report</h1>
        <p><strong>Period:</strong> ${period} | <strong>Year:</strong> ${year} ${month ? `| <strong>Month:</strong> ${month}` : ""}</p>
        <div class="summary">
          <h2>Summary</h2>
          <p><strong>Total Income:</strong> ₹${income.toLocaleString()}</p>
          <p><strong>Total Expense:</strong> ₹${expense.toLocaleString()}</p>
          <p><strong>Balance:</strong> ₹${(income - expense).toLocaleString()}</p>
        </div>
        <h2>Breakdown by Category</h2>
        <table>
          <thead>
            <tr>
              <th>Type</th>
              <th>Category</th>
              <th>Amount</th>
              <th>Count</th>
            </tr>
          </thead>
          <tbody>
            ${report
              .map(
                (r) => `
              <tr>
                <td>${r._id.type}</td>
                <td>${r._id.category}</td>
                <td>₹${r.total.toLocaleString()}</td>
                <td>${r.count}</td>
              </tr>
            `,
              )
              .join("")}
          </tbody>
        </table>
        <p style="margin-top: 40px; color: #666;">Generated on ${new Date().toLocaleString()}</p>
      </body>
      </html>
    `;

    return new NextResponse(html, {
      headers: {
        "Content-Type": "text/html",
        "Content-Disposition": `attachment; filename="fund-report-${period}-${year}.html"`,
      },
    });
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 500 });
  }
}
