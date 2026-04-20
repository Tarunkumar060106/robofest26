import { NextResponse } from "next/server";

function buildEventPayload() {
  return {
    summary: "Robofest 2026",
    location: "SRM Institute of Science and Technology, Kattankulathur",
    description:
      "Robofest 2026 at SRMIST. Visit the official website for event details and registration.",
    start: {
      date: "2026-08-19",
    },
    end: {
      date: "2026-08-22",
    },
  };
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const error = url.searchParams.get("error");
  const redirectUri = process.env.GOOGLE_REDIRECT_URI;
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (error) {
    return NextResponse.json({ error: `Google consent failed: ${error}` }, { status: 400 });
  }

  if (!code) {
    return NextResponse.json({ error: "Missing OAuth code." }, { status: 400 });
  }

  if (!redirectUri || !clientId || !clientSecret) {
    return NextResponse.json(
      {
        error:
          "Google Calendar OAuth is not configured. Set GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, and GOOGLE_REDIRECT_URI.",
      },
      { status: 500 },
    );
  }

  const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    }),
  });

  const tokenPayload = await tokenResponse.json().catch(() => null);

  if (!tokenResponse.ok) {
    return NextResponse.json(
      {
        error:
          tokenPayload?.error_description || tokenPayload?.error || "Failed to exchange Google auth code.",
      },
      { status: 500 },
    );
  }

  const accessToken = tokenPayload?.access_token as string | undefined;

  if (!accessToken) {
    return NextResponse.json({ error: "Google access token missing." }, { status: 500 });
  }

  const calendarResponse = await fetch("https://www.googleapis.com/calendar/v3/calendars/primary/events", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(buildEventPayload()),
  });

  const calendarPayload = await calendarResponse.json().catch(() => null);

  if (!calendarResponse.ok) {
    return NextResponse.json(
      {
        error:
          calendarPayload?.error?.message || "Failed to create the Google Calendar event.",
      },
      { status: 500 },
    );
  }

  return NextResponse.redirect(new URL("/?calendar=added", url.origin));
}