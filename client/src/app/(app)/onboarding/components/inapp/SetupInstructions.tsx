"use client";

import "prismjs/themes/prism.css";
import { useState } from "react";
import { IoLogoHtml5, IoLogoNpm } from "react-icons/io5";
import { cn } from "@/app/lib/cn";
import { Button } from "@/app/ui/Button";

const tabs = [
  { id: "html", label: "HTML", icon: <IoLogoHtml5 /> },
  { id: "npm", label: "NPM", icon: <IoLogoNpm /> },
];

interface SetupInstructionsOnboardingProps {
  environmentId: string;
  webAppUrl: string;
  jsPackageVersion: string;
}

export default function SetupInstructionsOnboarding({
  environmentId,
  webAppUrl,
}: SetupInstructionsOnboardingProps) {
  const [activeTab, setActiveId] = useState(tabs[0].id);
  const htmlSnippet = `<!-- START Formbricks Surveys -->
<script type="text/javascript">
!function(){var t=document.createElement("script");t.type="text/javascript",t.async=!0,t.src="https://unpkg.com/@formbricks/js@^1.6.5/dist/index.umd.js";var e=document.getElementsByTagName("script")[0];e.parentNode.insertBefore(t,e),setTimeout(function(){window.formbricks.init({environmentId: "${environmentId}", apiHost: "${window.location.protocol}//${window.location.host}"})},500)}();
</script>
<!-- END Formbricks Surveys -->`;

  return (
    <div>
      <div className="flex h-14 w-full items-center justify-center rounded-md border border-slate-200 bg-white">
        <nav
          className="flex h-full w-full items-center space-x-4 p-1.5"
          aria-label="Tabs"
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveId(tab.id)}
              className={cn(
                tab.id === activeTab
                  ? " bg-slate-100 font-semibold text-slate-900"
                  : "text-slate-500  transition-all duration-300 hover:bg-slate-50 hover:text-slate-700",
                "flex h-full w-full items-center justify-center rounded-md px-3 py-2 text-center text-sm font-medium"
              )}
              aria-current={tab.id === activeTab ? "page" : undefined}
            >
              {tab.icon && (
                <div className="flex h-5 w-5 items-center">{tab.icon}</div>
              )}
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
      <div>
        {activeTab === "npm" ? (
          <div className="prose prose-slate">
            <p>or</p>

            <p className="text-sm text-slate-700">
              Import Formbricks and initialize the widget in your Component
              (e.g. App.tsx):
            </p>

            <Button
              id="onboarding-inapp-connect-read-npm-docs"
              className="mt-3"
              variant="secondary"
              href="https://formbricks.com/docs/getting-started/framework-guides"
              target="_blank"
            >
              Read docs
            </Button>
          </div>
        ) : activeTab === "html" ? (
          <div className="prose prose-slate">
            <p className="-mb-1 mt-6 text-sm text-slate-700">
              Insert this code into the &lt;head&gt; tag of your website:
            </p>

            <div className="mt-4 space-x-2">
              <Button
                id="onboarding-inapp-connect-copy-code"
                variant="darkCTA"
                onClick={() => {
                  navigator.clipboard.writeText(htmlSnippet);
                }}
              >
                Copy code
              </Button>
              <Button
                id="onboarding-inapp-connect-step-by-step-manual"
                variant="secondary"
                href="https://formbricks.com/docs/getting-started/framework-guides#html"
                target="_blank"
              >
                Step by step manual
              </Button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
