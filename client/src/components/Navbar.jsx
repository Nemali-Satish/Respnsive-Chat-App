import React from "react";
import { useAuthStore } from "../store/useAuthStore.js";
import { Link } from "react-router-dom";
import {
  LogOut,
  MessageCircleCodeIcon,
  Settings,
  User,
  UserPlus,
} from "lucide-react";

const Navbar = () => {
  const { authUser, logout } = useAuthStore();

  return (
    <header className="border-b border-base-300 fixed w-full top-0 z-40 backdrop-blur-lg bg-base-100/80">
      <div className="container mx-auto px-4 h-16">
        <div className="flex items center justify-between h-full">
          <div className="flex items-center gap-8">
            <Link
              to="/"
              className="flex items-center gap-2.5 hover:opacity-80 transistion-all"
            >
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <MessageCircleCodeIcon className="w-5 h-5 text-primary" />
              </div>
              <h1 className="text-lg font-bold">Chatty</h1>
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/settings" className="btn btn-sm gap-2 transition-colors">
              <Settings className="w-4 h-4" />
              <span className="hidden md:inline">Settings</span>
            </Link>

            {authUser ? (
              <>
                <Link
                  to="/profile"
                  className="btn btn-sm gap-2 transition-colors"
                >
                  <User className="size-4" />
                  <span className="hidden md:inline">Profile</span>
                </Link>
                <button
                  className="btn btn-sm gap-2 transition-colors"
                  onClick={logout}
                >
                  <LogOut className="size-4" />
                  <span className="hidden md::inline">Logout</span>
                </button>
              </>
            ) : (
              <Link to="/signUp" className="btn btn-sm gap-2 transition-colors">
                <UserPlus className="size-4" />
                <span className="hidden md:inline">Sign Up</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
