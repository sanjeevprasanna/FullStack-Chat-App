import React from "react";
import { MessageSquare } from "lucide-react";
import ParticleBackground from "./ParticleBackground"; // Adjust the path as needed

const NoChatSelected = () => {
  return (
    <div className="relative w-full flex flex-1 items-center justify-center p-16 bg-base-100/50 overflow-hidden">
      {/* Particle background positioned behind the content */}
      <ParticleBackground n={120} />
      <div className="relative z-10 max-w-md text-center space-y-6">
        <div className="flex justify-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center animate-bounce">
            <MessageSquare className="w-8 h-8 text-primary" />
          </div>
        </div>
        <h2 className="text-2xl font-bold">Welcome to Pingup!</h2>
        <p className="text-base-content/60">
          Select a conversation from the sidebar to start chatting..
        </p>
      </div>
    </div>
  );
};

export default NoChatSelected;
