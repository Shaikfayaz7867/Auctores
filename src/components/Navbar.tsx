import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Bell, User, LogOut, ChevronDown, 
  Menu, X, Sparkles, Shield, UserCheck
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useDBStore } from '../store/dbStore';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { AppNotification } from '../types';

export const Navbar = () => {
  const { user, isAuthenticated, activeRole, logout, switchRole } = useAuthStore();
  const { getNotifications, markNotificationRead } = useDBStore();
  const navigate = useNavigate();
  const location = useLocation();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isRoleSwitcherOpen, setIsRoleSwitcherOpen] = useState(false);

  const notifications = user ? getNotifications(user.id) : [];
  const unreadNotifs = notifications.filter((n: AppNotification) => !n.read);

  const handleRoleSwitch = (role: 'author' | 'reviewer' | 'editor' | 'admin') => {
    switchRole(role);
    setIsRoleSwitcherOpen(false);
    setIsUserMenuOpen(false);
    
    // Redirect to the appropriate dashboard
    if (role === 'author') navigate('/dashboard/author');
    else if (role === 'reviewer') navigate('/dashboard/reviewer');
    else if (role === 'editor') navigate('/dashboard/editor');
    else if (role === 'admin') navigate('/dashboard/admin');
  };

  const navLinks = [
    { label: 'Journals', path: '/journals' },
    { label: 'Articles', path: '/articles' },
    { label: 'Editorial Board', path: '/editorial-board' },
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' }
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/85 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-950/85">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img
            src="/auct.png"
            alt="Auctores Logo"
            className="h-22 w-20 object-contain"
          />
          
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => {
            const isActive = location.pathname.startsWith(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors hover:text-primary dark:hover:text-white ${
                  isActive 
                    ? 'text-primary dark:text-white font-semibold border-b-2 border-[#8B0000] pb-1 mt-0.5' 
                    : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Session Utilities */}
        <div className="flex items-center gap-4">
          
          {isAuthenticated && user ? (
            <>
              {/* Active Role Quick Indicator */}
              <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full border border-slate-200 dark:border-slate-700">
                <Shield className="h-3.5 w-3.5 text-primary" />
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                  {activeRole} Mode
                </span>
              </div>

              {/* Notification Center */}
              <div className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative h-9 w-9 text-slate-600 hover:text-slate-900 dark:text-slate-300"
                  onClick={() => {
                    setIsNotifOpen(!isNotifOpen);
                    setIsUserMenuOpen(false);
                  }}
                >
                  <Bell className="h-5 w-5" />
                  {unreadNotifs.length > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#8B0000] text-[9px] font-bold text-white ring-2 ring-white">
                      {unreadNotifs.length}
                    </span>
                  )}
                </Button>

                {/* Notifications Dropdown */}
                {isNotifOpen && (
                  <div className="absolute right-0 mt-3 w-80 rounded-xl bg-white dark:bg-slate-950 p-2 shadow-xl ring-1 ring-black/5 dark:ring-white/10 z-50 border border-slate-100 dark:border-slate-800">
                    <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                      <span className="font-serif font-bold text-slate-800 dark:text-white">Notifications</span>
                      {unreadNotifs.length > 0 && <Badge variant="warning">{unreadNotifs.length} New</Badge>}
                    </div>
                    <div className="max-h-64 overflow-y-auto py-1">
                      {notifications.length === 0 ? (
                        <div className="p-4 text-center text-xs text-slate-400">
                          No notifications yet
                        </div>
                      ) : (
                        notifications.map((n: AppNotification) => (
                          <div 
                            key={n.id} 
                            onClick={() => {
                              markNotificationRead(n.id);
                              if (n.link) navigate(n.link);
                              setIsNotifOpen(false);
                            }}
                            className={`p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900 cursor-pointer text-xs border-b border-slate-50 last:border-0 dark:border-slate-900 ${
                              !n.read ? 'bg-blue-50/50 dark:bg-blue-950/20 font-medium' : ''
                            }`}
                          >
                            <div className="flex justify-between items-start gap-1">
                              <span className="font-bold text-slate-800 dark:text-white">{n.title}</span>
                              <span className="text-[9px] text-slate-400">Just now</span>
                            </div>
                            <p className="text-slate-500 mt-1">{n.message}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* User Dropdown Button */}
              <div className="relative">
                <button
                  onClick={() => {
                    setIsUserMenuOpen(!isUserMenuOpen);
                    setIsNotifOpen(false);
                  }}
                  className="flex items-center gap-1.5 focus:outline-none"
                >
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="h-8 w-8 rounded-full border border-slate-200 shadow-sm"
                  />
                  <ChevronDown className="h-4 w-4 text-slate-500" />
                </button>

                {/* User Menu Panel */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-3 w-64 rounded-xl bg-white dark:bg-slate-950 p-2 shadow-xl border border-slate-100 dark:border-slate-800 z-50">
                    <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800">
                      <p className="text-xs font-semibold text-slate-400">Logged in as</p>
                      <p className="text-sm font-bold text-slate-800 dark:text-white truncate mt-0.5">{user.name}</p>
                      <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                    </div>

                    <div className="py-1">
                      {/* Navigate to Dashboard based on current selected role */}
                      <Link
                        to={`/dashboard/${activeRole}`}
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex w-full items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-900 rounded-lg"
                      >
                        <UserCheck className="mr-2 h-4 w-4 text-primary" />
                        My {activeRole?.toUpperCase()} Dashboard
                      </Link>

                      {/* Role Switch Trigger */}
                      <div className="relative">
                        <button
                          onClick={() => setIsRoleSwitcherOpen(!isRoleSwitcherOpen)}
                          className="flex w-full items-center justify-between px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-900 rounded-lg text-left"
                        >
                          <span className="flex items-center">
                            <Sparkles className="mr-2 h-4 w-4 text-amber-500" />
                            Switch User Role
                          </span>
                          <ChevronDown className="h-3 w-3" />
                        </button>

                        {/* Internal Role Switch Options */}
                        {isRoleSwitcherOpen && (
                          <div className="mt-1 bg-slate-50 dark:bg-slate-900 rounded-lg p-1 border border-slate-100 dark:border-slate-800">
                            {['author', 'reviewer', 'editor', 'admin'].map((role) => (
                              <button
                                key={role}
                                onClick={() => handleRoleSwitch(role as any)}
                                className={`flex w-full items-center px-4 py-1.5 text-xs rounded-md ${
                                  activeRole === role 
                                    ? 'bg-primary text-white font-bold' 
                                    : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
                                }`}
                              >
                                {role.toUpperCase()}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="border-t border-slate-100 dark:border-slate-800 pt-1 mt-1">
                      <button
                        onClick={() => {
                          logout();
                          navigate('/');
                          setIsUserMenuOpen(false);
                        }}
                        className="flex w-full items-center px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-lg text-left"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="primary" size="sm" className="bg-[#002F6C]">
                  Join Auctores
                </Button>
              </Link>
            </div>
          )}

          {/* Mobile Menu Icon */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="rounded-md p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 md:hidden dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {isMobileMenuOpen && (
        <div className="border-t border-slate-100 bg-white p-4 shadow-lg md:hidden dark:border-slate-800 dark:bg-slate-950">
          <nav className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-base font-semibold text-slate-700 hover:text-primary dark:text-slate-300"
              >
                {link.label}
              </Link>
            ))}
            {isAuthenticated && user && (
              <div className="border-t border-slate-100 dark:border-slate-800 pt-4 mt-2 flex flex-col gap-3">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">User Dashboard Mode</p>
                <div className="grid grid-cols-2 gap-2">
                  {['author', 'reviewer', 'editor', 'admin'].map((role) => (
                    <button
                      key={role}
                      onClick={() => {
                        handleRoleSwitch(role as any);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`py-2 px-3 rounded-lg text-xs font-bold text-center border capitalize ${
                        activeRole === role 
                          ? 'bg-primary text-white border-primary' 
                          : 'bg-slate-50 border-slate-200 text-slate-600'
                      }`}
                    >
                      {role}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => {
                    logout();
                    navigate('/');
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex w-full items-center justify-center py-2 text-sm font-semibold text-rose-600 bg-rose-50 rounded-lg"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </button>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};
