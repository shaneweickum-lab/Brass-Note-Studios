import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { appendFileSync, existsSync, readFileSync, writeFileSync } from "fs";
import path from "path";
import { chatbotConfig } from "../../../../chatbot/config";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

interface LeadPayload {
  name: string;
  email: string;
  interest?: string;
  message?: string;
}

function saveToDisk(lead: LeadPayload & { timestamp: string }) {
  try {
    const leadsPath = path.join(process.cwd(), chatbotConfig.LEAD_FALLBACK_FILE);
    let leads: typeof lead[] = [];
    if (existsSync(leadsPath)) {
      try {
        leads = JSON.parse(readFileSync(leadsPath, "utf-8")) as typeof lead[];
      } catch {
        leads = [];
      }
    }
    leads.push(lead);
    writeFileSync(leadsPath, JSON.stringify(leads, null, 2), "utf-8");
  } catch (err) {
    console.error("[leads] disk save failed", err);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as LeadPayload;
    const { name, email, interest, message } = body;

    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400 }
      );
    }

    const timestamp = new Date().toISOString();
    const lead = { name, email, interest, message, timestamp };

    // Always save to disk as fallback
    saveToDisk(lead);

    // Send email notification via Resend if configured
    if (resend) {
      try {
        await resend.emails.send({
          from: "Atelier Concierge <concierge@brassnotestudios.com>",
          to: chatbotConfig.LEAD_EMAIL,
          subject: `New Commission Inquiry — ${name}`,
          html: `
            <div style="font-family: Georgia, serif; color: #1a1a1a; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #C9921A; border-bottom: 1px solid #C9921A; padding-bottom: 8px;">
                New Commission Inquiry
              </h2>
              <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; width: 120px;">Name</td>
                  <td style="padding: 8px 0;">${name}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold;">Email</td>
                  <td style="padding: 8px 0;"><a href="mailto:${email}" style="color: #C9921A;">${email}</a></td>
                </tr>
                ${interest ? `
                <tr>
                  <td style="padding: 8px 0; font-weight: bold;">Interest</td>
                  <td style="padding: 8px 0;">${interest}</td>
                </tr>` : ""}
                ${message ? `
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; vertical-align: top;">Message</td>
                  <td style="padding: 8px 0;">${message}</td>
                </tr>` : ""}
                <tr>
                  <td style="padding: 8px 0; font-weight: bold;">Time</td>
                  <td style="padding: 8px 0; color: #666;">${new Date(timestamp).toLocaleString()}</td>
                </tr>
              </table>
              <p style="margin-top: 24px; color: #666; font-size: 12px;">
                Sent by the Brass Note Studios Atelier Concierge
              </p>
            </div>
          `,
        });
      } catch (emailErr) {
        console.error("[leads] email send failed", emailErr);
        // Don't fail the request — lead is already saved to disk
      }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[leads/route]", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
