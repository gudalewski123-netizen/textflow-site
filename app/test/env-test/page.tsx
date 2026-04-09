"use client";

export default function EnvTestPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Environment Variable Test</h1>
      <div className="space-y-2">
        <div>
          <strong>GOOGLE_CLIENT_ID:</strong> {process.env.GOOGLE_CLIENT_ID || 'NOT FOUND'}
        </div>
        <div>
          <strong>Is same as registered:</strong> {
            process.env.GOOGLE_CLIENT_ID === '173400692933-8ko8jv2m428ghkc11ec73s1pd2k2m8me.apps.googleusercontent.com' 
            ? 'YES ✅' 
            : 'NO ❌'
          }
        </div>
        <div>
          <strong>Wrong client ID from error:</strong> 748784789793-l93pihp6b1ll5io4mo4hffe10331gqa8.apps.googleusercontent.com
        </div>
      </div>
    </div>
  );
}