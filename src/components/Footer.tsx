import React from "react";

const Footer = () => {
  return (
    <footer className="w-full py-12 px-6 md:px-12 border-t border-border bg-card">
      <div className="max-w-4xl mx-auto text-center space-y-6">
        <div className="space-y-4">
          <h3 className="text-2xl font-e-ukraine-Medium tracking-tighter">
            PayBridge Inc.
          </h3>
          <p className="text-muted-foreground font-e-ukraine-Light">
            Registration number: 10165448
          </p>
          <p className="text-muted-foreground font-e-ukraine-Light">
            Built with ❤️ from Toronto
          </p>
        </div>

        <div className="pt-6 border-t border-border">
          <p className="text-sm text-muted-foreground font-e-ukraine-Light">
            © 2025 PayBridge Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;